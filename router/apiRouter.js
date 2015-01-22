var express = require('express');
var router = express.Router();
var dbUser = require('../dataAccess/userRepository');
var dbItem = require('../dataAccess/itemRepository');

router.get('/', function(request, response){
  console.log("Routing to get with params:", request.query);
  dbUser.getUser(request.query, function(error, user){
    if (error) {
      response.status(404).end(error);
    } else {
      response.json(user);
    }
  });
})
  .post('/', function(request, response){
    dbUser.createUser(request.body, function(error, user){
      if (error) {
        response.status(403).send(error);
      } else {
        response.json(user);
      }
    });
  })
  .post('/item', function(request, response){
    dbItem.createItem(request.body, function(error, item){
      if (error) {
        response.status(403).send(error);
      } else {
        response.json(item);
      }
    });
  })
  .get('/item', function(request, response){
    dbItem.getItems(request.query, function(error, item){
      if (error) {
        response.status(404).send(error);
      } else {
        response.json(item);
      }
    });
  })
  .get('/item/byuser', function(request, response){
    dbItem.getItemsByUser(request.query, function(error, item){
      if (error) {
        response.status(404).send(error);
      } else {
        response.json(item);
      }
    });
  });












module.exports = router;