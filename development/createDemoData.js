'use strict';

var fs = require('fs');
var http = require('http');
var db = require('../dataAccess/dbModels');
var dbUser = require('../dataAccess/userController');

var jsonDataFileName = __dirname + '/item.json';


var cleanCellNumber = function(object) {
  if (object.CellNumber != null) {
    // remove non number from cell numbers
    object.CellNumber = object.CellNumber.replace(/[^\d]/g,'');
  }
};



var shuffle = function(items) {
  for (var i = 0; i < items.length; i++) {
    var z = Math.floor(Math.random()*(items.length-i))+i;
    var tmp = items[i];
    items[i] = items[z];
    items[z] = tmp;

  }
  return items;
};




var parseItem = function(data) {

  var fileName = savePhotoFromUrl(data.objects[0].images[0].url);

  var newItem = new db.Item({
    Title: data.objects[0].title,
    Description: data.objects[0].text,
    ListPrice: Number(data.objects[0].offerPrice.replace(/[^0-9\.]+/g,"")),
    Images: [fileName]
  });

  return newItem;
};

var savePhotoFromUrl = function(url) {
  var randomFileName = Math.random().toString(36).slice(2) + ".jpg";
  var file = fs.createWriteStream(__dirname + '/../public/images/' + randomFileName);
  var request = http.get(url, function(response){
    response.pipe(file);
  });
  return randomFileName;
};

var toTitleCase = function(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var parseUser = function(user) {
  //console.log(user);

  // get photo
  var fileName = Math.random().toString(36).slice(2) + ".jpg";
  var file = fs.createWriteStream(__dirname + '/../public/images/' + fileName);
  var request = http.get(user.picture.large, function(response){
    response.pipe(file);
  });

  var newUser = new db.User({
    First: toTitleCase(user.name.first),
    Last: toTitleCase(user.name.last),
    CellNumber: cleanCellNumber(user.cell),
    Address: toTitleCase(user.location.street),
    City: toTitleCase(user.location.city),
    State: toTitleCase(user.location.state),
    ZipCode: user.location.zip,
    Email: user.email,
    Password: user.password,
    Image: fileName
  });
  return newUser;
};

var loadUrl = function(host, callback) {
  console.log("loadUrl called");
  http.request(host, function(response){
    var str = "";
    response.on('data', function(chunk){
      str += chunk;
    });
    response.on('end', function(){
      console.log("Host returned data");
      callback(str);
    });
    response.on('error', function(e){
      console.log("Error ", e);
    });
    response.on('timeout', function(){
      console.log('Call timed out');
    });
  }).end();
};

var getUser = function(callback) {
  loadUrl({ host: 'api.randomuser.me'}, function(data){
    var user = parseUser(JSON.parse(data).results[0].user);
    //console.log(user);

    callback(user);
  });
};





////========================
//getUser(function(user){
//  console.log("getUser:", user);
//  user.save(function(err, savedUser){
//    if (err) {
//      console.log(err);
//    } else {
//      console.log(user);
//    }
//  });
//
//});








fs.readFile(jsonDataFileName, 'utf8', function(error, stringData) {

  var data = JSON.parse(stringData);
  console.log("Items:", data.length);
  data = shuffle(data);

  var items = data.map(function (item) {
    return parseItem(item);
  });

  dbUser.getUser({}, function(error, AllUsers) {
    for (var i = 0; i < items.length; i++) {
      AllUsers = shuffle(AllUsers);
      items[i].Owner = AllUsers[0]._id;
      items[i].save(function(error, user){
        if (error) {
          console.log('Error saving item', error);
        } else {
          console.log('Item saved!');
        }
      });
    }
  });
  console.log(items);
});






//// =====================================
//// gets and inserts 10 random users at
//// a time ...
//// =====================================
//
//  for (var i = 0; i < 10; i++) {
//    getUser(function(user){
//      user.save(function(error, user){
//        if (error) {
//          console.log("Error creating user:", error)
//        } else {
//          console.log("User: ", user._id, " created");
//        }
//      });
//    });
//  }




  //while(items.length > 0) {
  //  var numItems = Math.ceil(Math.random()*3);
  //numItems = 3;
  //  numItems = (numItems > items.length) ? items.length : numItems;
  //
  //  getUser(function(user){
  //    user.save(function(error, savedUser){
  //      if (error) {
  //        console.log('Error saving user');
  //      } else {
  //        for (var i = 0; i < numItems; i++) {
  //          var currentItem = items.pop();
  //          currentItem.Owner = savedUser._id;
  //          currentItem.save(function(error, savedItem){
  //            if (error) {
  //              console.log('Error saving item');
  //            } else {
  //              console.log('Item + User saved');
  //            }
  //          });
  //        }
  //      }
  //    });
  //
  //  });



  //}


  //item.save(function(err, savedItem){
  //  if (err) {
  //    console.log(err);
  //  } else {
  //    console.log("Saved item:", savedItem);
  //  }
  //});
