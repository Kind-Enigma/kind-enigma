var db = require('./dbConnector');

var createUser = function(data, callback) {
  db.User.findOne(data, function(error, user){
    //console.log(">>", error, user);
    if (error || !user) {
      var user = new db.User(data).save(function(error, user){
          if (error) {
            callback('Cannot create user', null);
          } else {
            callback(null, user);
          }
        });
    } else {
      callback('User already exists', null);
    }
  });
};

var getUser = function(data, callback) {
  console.log("Get user with - Data: ", data);
  db.User.find(data, function(error, user){
    if (error || !user) {
      callback('Cannot find user', null);
    } else {
      //console.log("User Found:", user);
      callback(null, user);
    }
  });
};


module.exports.createUser = createUser;
module.exports.getUser = getUser;