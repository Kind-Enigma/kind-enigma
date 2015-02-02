var mongoose = require('mongoose');

mongoose.connect('mongodb://ds030607.mongolab.com:30607/fleabay', {
  user: 'admin',
  pass: 'fleabay'
});

mongoose.connection.on('error', function(error){
  console.log('Mongoose connection: Your mongo connection is no good!');
  console.log(error);
});


// ======================================
// User schema
var userSchema = mongoose.Schema({
  First: String,
  Last: String,
  CellNumber: String,
  Address: String,
  City: String,
  State: String,
  ZipCode: String,
  Email: String,
  Password: String,
  EBayUsername: String,
  EBayRating: Number,
  Image: String,
  IsExpert: {
    type: Boolean,
    default: false
  }
});
// User Model
var User = mongoose.model('User', userSchema);
// ======================================


// ======================================
// Item schema
var itemSchema = mongoose.Schema({
  Owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  Title: String,
  Description: String,
  Address: String,
  City: String,
  State: String,
  ZipCode: String,
  Images: [String],
  ListPrice: Number,
  ListPercent: Number,
  Expert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  ListDate: {
    type: Date,
    default: Date.now
  },
  AcceptedDate: Date
});
// Item Model
var Item = mongoose.model('Item', itemSchema);
// ======================================
module.exports.User = User;
module.exports.Item = Item;