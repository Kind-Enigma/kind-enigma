var db = require('../dataAccess/dbConnector');
var dbUser = require('../dataAccess/userRepository');
var http = require('http');


var toTitleCase = function(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var addDemoUsers = function(number) {
  loadPage({ host: 'api.randomuser.me'}, function(data){
    var user = parseUser(JSON.parse(data).results[0].user);
    console.log(user);
  });
};

var parseUser = function(user) {
  //console.log(user);
  newUser = new db.User({
    First: toTitleCase(user.name.first),
    Last: toTitleCase(user.name.last),
    CellNumber: user.cell,
    Address: toTitleCase(user.location.street),
    City: toTitleCase(user.location.city),
    State: toTitleCase(user.location.state),
    ZipCode: user.location.zip,
    Email: user.email,
    Password: user.password
  });
  return newUser;
};

var loadPage = function(host, callback) {
  http.request(host, function(response){
    var str = "";
    response.on('data', function(chunk){
      str += chunk;
    });
    response.on('end', function(){
      callback(str);
    })
  }).end();
};

addDemoUsers(1);