var db = require('../dataAccess/dbModels');
//var dbItem = require('../dataAccess/itemRepository');
//var dbUser = require('../dataAccess/userRepository');
var UserMaker = require('./populateUsers');

var http = require('http');
var fs = require('fs');

'use strict';

var loadItems = function(itemsToLoad) {
  var allItems = [];
  var items = JSON.parse(fs.readFileSync(__dirname + '/item.json', 'utf8'));

    for (var i = 0; i < items.length; i++) {
      allItems.push(parseItem(items[i]));
      if (i+1 === itemsToLoad) break;
    }


  return allItems;
};

var parseItem = function(data) {

  //console.log(data.objects[0].images[0].url);

  // get photo
  var fileName = Math.random().toString(36).slice(2) + ".jpg";
  var file = fs.createWriteStream(__dirname + '/../public/images/' + fileName);
  var request = http.get(data.objects[0].images[0].url, function(response){
    response.pipe(file);
  });

  var newItem = new db.Item({
    Title: data.objects[0].title,
    Description: data.objects[0].text,
    ListPrice: Number(data.objects[0].offerPrice.replace(/[^0-9\.]+/g,"")),
    Images: [fileName]
  });

  return newItem;
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



var allItems = loadItems(2);
allItems = shuffle(allItems);

while (allItems.length > 0) {

  UserMaker.getUser(function(newUser){
    newUser.save(function(err, newUserData){
      if(err) {
        throw err;
      } else {
        console.log("Saved User\n==============\n", user, "\n=================\n");
        var random = Math.ceil(Math.random()*3);
        if (random > allItems.length) {
          random = allItems.length;
        }
        for (var i = 0; i < random; i++) {
          var newItem = allItems.pop();
          newItem.Owner = newUser._id;
        }
      }
    });

  });


}
