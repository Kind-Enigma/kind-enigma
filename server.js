var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var apiRouter = require('./router/apiRouter');
var setupRouter = require('./router/setupRouter');

var app = express();
var port = process.env.PORT || 1337;






app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public" ));
app.use(cors());

app.use('/api', apiRouter);
app.use('/api/setup', setupRouter);






var server = app.listen(port, function(){
  console.log("Listening on " + server.address().address + " port " + server.address().port);
});