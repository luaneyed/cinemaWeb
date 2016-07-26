var express = require('express');
var app = express();
var fs = require('fs');

var port = process.env.PORT || 8080;
var routes = require('../routes')(app);

app.listen(8080, function(){
	console.log('Server Start');
});
