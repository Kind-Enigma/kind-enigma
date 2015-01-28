var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./router/apiRouter');
var setupRouter = require('./router/setupRouter');

var app = express();
var port = process.env.PORT || 1337;


//CORS middleware
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://karmatest1.azurewebsites.net/');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  next();
};



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public" ));
app.use(allowCrossDomain);

app.use('/api', apiRouter);
app.use('/api/setup', setupRouter);






var server = app.listen(port, function(){
  console.log("Listening on " + server.address().address + " port " + server.address().port);
});