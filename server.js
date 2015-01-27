var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./router/apiRouter');

var app = express();



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public" ));

app.use('/api', apiRouter);






var server = app.listen(8080, function(){
  console.log("Listening on " + server.address().address + " port " + server.address().port);
});