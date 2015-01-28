var express = require('express');
var router = express.Router();
var dbUser = require('../dataAccess/userRepository');
var dbItem = require('../dataAccess/itemRepository');
var http = require('http');

var fs = require('fs');
var db = require('../dataAccess/dbConnector');

var jsonDataFileName = __dirname + '/../development/item.json';

var shuffle = function(items) {
  for (var i = 0; i < items.length; i++) {
    var z = Math.floor(Math.random()*(items.length-i))+i;
    var tmp = items[i];
    items[i] = items[z];
    items[z] = tmp;

  }
  return items;
};
var toTitleCase = function(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
var savePhotoFromUrl = function(url) {
  var randomFileName = Math.random().toString(36).slice(2) + ".jpg";
  var file = fs.createWriteStream(__dirname + '/../public/images/' + randomFileName);
  var request = http.get(url, function(response){
    response.pipe(file);
  });
  return randomFileName;
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
    CellNumber: user.cell,
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
var getUser = function(callback) {
  loadUrl({ host: 'api.randomuser.me'}, function(data){
    var user = parseUser(JSON.parse(data).results[0].user);
    //console.log(user);

    callback(user);
  });
};

router.get('/users', function(request, response){
  //console.log("Routing to get with params:", request.query);

  for (var i = 0; i < 10; i++) {
    getUser(function(user){
      user.save(function(error, user){
        if (error) {
          console.log("Error creating user:", error)
        } else {
          console.log("User: ", user._id, " created");
        }
      });
    });
  }

  response.end("10 users added");

  })
  .get('/experts', function(request, response){
    //console.log("Routing to get with params:", request.query);

    for (var i = 0; i < 5; i++) {
      getUser(function(user){
        user.IsExpert = true;
        user.save(function(error, user){
          if (error) {
            console.log("Error creating user:", error)
          } else {
            console.log("User: ", user._id, " created");
          }
        });
      });
    }

    response.end("5 expert users added");

  })
  .get('/items', function(request, response){
    console.log("Reading: ", jsonDataFileName);
    fs.readFile(jsonDataFileName, 'utf8', function(error, stringData) {

      var data = JSON.parse(stringData);
      console.log("Items:", data.length);
      //data = shuffle(data);

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
    response.end("Items saved");
  })
  .get('/test', function(request, response){
    response.end("OK");
  });



module.exports = router;




