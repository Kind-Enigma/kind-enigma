var db = require('../dataAccess/dbConnector');
var dbItem = require('../dataAccess/itemRepository');
var http = require('http');

var fs = require('fs');

fs.readFile(__dirname + '/items.json', function(error, data){
  var items = JSON.parse(data.toString());
  var allItems = [];
  //console.log(items[1].objects[0]);

  for (var i = 0; i < items.length; i++) {
    allItems.push(parseItem(items[i]));
  }
  //allItems.push(parseItem(items[1]));
  console.log(allItems);
});

//var file = fs.createWriteStream("file.jpg");
//var request = http.get("http://i3.ytimg.com/vi/J---aiyznGQ/mqdefault.jpg", function(response) {
//  response.pipe(file);
//});


var parseItem = function(data) {

  console.log(data.objects[0].images[0].url);

  // get photo
  var fileName = Math.random().toString(36).slice(2) + ".jpg";
  var file = fs.createWriteStream(__dirname + '/../public/images/' + fileName);
  var request = http.get(data.objects[0].images[0].url, function(response){
    response.pipe(file);
  });

  newItem = new db.Item({
    Title: data.objects[0].title,
    Description: data.objects[0].text,
    ListPrice: data.objects[0].offerPrice,
    Images: [fileName]
  });

  return newItem;
};