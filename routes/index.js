var fs = require('fs');
var http = require('http');
var request =require('request');


module.exports = function(app){

	app.get('/', function(req,res){
		fs.readFile('./html/index.html', function(error,data){ //load index.html
			request("http://52.78.67.177")
			if(error){
				console.log(error);
			}else{
				res.writeHead(200, {'Content-Type': 'text/html'}); //set Head Type
				res.end(data); //load html response
			}
		});
	});

	app.get('/ticketing', function(req,res){
		fs.readFile('./html/ticketing.html', function(error,data){
			request("http://52.78.67.177").pipe(fs.createWriteStream("timetable.json"));

			if(error){
				console.log(error);
			}else{
				res.writeHead(200,{'Content-Type': 'text/html'});
				res.end(data);
			}
		});
	});
	app.get('/movie', function(req,res){
		fs.readFile('./html/ticketing.html', function(error,data){
			request("http://52.78.67.177").pipe(fs.createWriteStream("timetable.json"));

			if(error){
				console.log(error);
			}else{
				res.writeHead(200,{'Content-Type': 'text/html'});
				res.end(data);
			}
		});
	});
};
