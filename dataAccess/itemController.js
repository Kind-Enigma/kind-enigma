var db = require('./dbModels');

var createItem = function(data, callback){
  db.Item.findOne(data, function(error, item){
    if (error || !item) {     // item does not exist
      var item = new db.Item(data).save(function(error, item){
        if (error) {
          callback(error, null);
        } else {
          callback(null, item);
        }

      });
    } else {
      //callback('Item exists', null);
      for (var key in data) {
        item[key] = data[key];
      }
      item.save(function(error, data){
        if (error) {
          callback(error, null);
        } else {
          callback(null, item);
        }
      });
    }
  });
};

var getItems = function(data, callback){
  //console.log('Find item where:', data);
  // this regex matchng allows for partial matches to be found
  for (var key in data) {
    data[key] = new RegExp(data[key], 'i');
  }
  db.Item.find(data)
    .populate('Owner')
    //.populate('Owner', 'First Last CellNumber')     // load user item with these fields only
    .exec(function(error, items){
      if (error || items.length === 0) {
        callback('Item not found');
      } else {
        callback(null, items);
      }
  });
};

var getItemByUser = function(data, callback){
  //console.log('Find item by this user:', data);
  db.User.findOne(data, function(error, user) {
    if (error || !user) {
      callback('Cannot find user');
    } else {
      console.log('Finding items for user:', user);
      db.Item.find({ Owner: user._id }, function (error, items) {
        if (error || items.length === 0) {
          callback('No items found');
        } else {
          callback(null, items);
        }
      });
    }
  });
};

var createItemByUser = function(data, callback) {
  console.log("Create item by user ...");
  db.User.findOne({ CellNumber: data.CellNumber }, function(error, user){
    if (error || !user) {
      callback('User not found');
    } else {
      data.Owner = user._id;
      var item = db.Item(data).save(function(error, item){
        if (error) {
          callback(error);
        } else {
          callback(null, item);
        }
      });
    }
  });
};

module.exports.createItem = createItem;
module.exports.getItems = getItems;
module.exports.getItemsByUser = getItemByUser;
module.exports.createItemByUser = createItemByUser;