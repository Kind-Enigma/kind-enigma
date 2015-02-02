var db = require('../dataAccess/dbModels');

var http = require('http');


var toTitleCase = function(str) {
  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var getUser = function(callback) {
  loadPage({ host: 'api.randomuser.me'}, function(data){
    var user = parseUser(JSON.parse(data).results[0].user);
    console.log(user);
    callback(user);
  });
};

var parseUser = function(user) {
  //console.log(user);

  // get photo
  var fileName = Math.random().toString(36).slice(2) + ".jpg";
  var file = fs.createWriteStream(__dirname + '/../public/images/' + fileName);
  var request = http.get(user.picture.large, function(response){
    response.pipe(file);
  });

  newUser = new db.User({
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

var u = getUser();

module.exports.getUser = getUser;