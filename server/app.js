var express = require('express');
var app = express();

var port = process.env.PORT || 8080;

var router = require('./routes')(app);

var server = app.listen(port, function(){
	console.log("Express server has started on port " +port)
});
