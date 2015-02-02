var express = require('express');
var router = express.Router();
var dbUser = require('../dataAccess/userController');
var dbItem = require('../dataAccess/itemController');

router.get('/user', function(request, response){
  console.log("Routing to get with params:", request.query);
    dbUser.getUser(request.query, function(error, user){
      if (error) {
        response.status(404).end(error);
      } else {
        response.json(user);
      }
    });
  })
  .get('/user/getUserItems', function(request, response){
    dbUser.getUserItems(request.query, function(error, items){
      if (error) {
        response.status(404);
        response.end("User items not found");
      } else {
        response.json(items);
      }
    })
  })
  .post('/user', function(request, response){
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
  .get('/item/byUser', function(request, response){
    dbItem.getItemsByUser(request.query, function(error, item){
      if (error) {
        response.status(404).send(error);
      } else {
        response.json(item);
      }
    });
  });
  //.post('/item/byUser', function(request, response){
  //  dbItem.createItemByUser(request.body, function(error, item){
  //    console.log(">>HERE<<");
  //    if (error) {
  //      response.status(404);
  //      response.end('User not found or item counld not be created');
  //    } else {
  //      response.json(item);
  //    }
  //  });
  //});












module.exports = router;