var db = require('./dbModels');

var createUser = function(data, callback) {
  // coercive check tests for null and undefined!!!
  if (data.CellNumber != null) {
    data.CellNumber = cleanCellNumber(data.CellNumber);
  }
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
      //callback('User already exists', null);
      // update that user!!
      for (var key in data) {
        user[key] = data[key];
      }
      user.save(function(error, data){
        if (error) {
          callback(error, null);
        } else {
          callback(null, user);
        }
      });
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

var getUserItems = function(data, callback){
  console.log('Get all items for a user', data);

  db.User.find(data, function(error, user){
    if (error || user.length === 0) {
      console.log('No such user');
      callback('No such user');
    } else {
      console.log("User id: ", user[0]);
      db.Item.find({ Owner: user[0]._id }, function(error, items){
        if (error) {
          console.log('Error getting users items');
          console.log('Error getting users items', null);
        } else {
          if (items.length === 0) {
            console.log('User has no items');
            callback('User has no items', null);
          } else {
            console.log("User:", user);
            console.log("Items:", items);
            callback(null, items);
          }
        }
      });
    }
  });
};


var cleanCellNumber = function(object) {
  if (object.CellNumber != null) {
    // remove non number from cell numbers
    object.CellNumber = object.CellNumber.replace(/[^\d]/g,'');
  }
};

module.exports.createUser = createUser;
module.exports.getUser = getUser;
module.exports.getUserItems = getUserItems;