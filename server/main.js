var http = require('http');


//const hostname = '127.0.0.1';
const port = 8080;

var server = http.createServer(function (req,res){
	//response.end('It Works!! Path Hit: ' + request.url);
	res.statusCode=200;
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World\n');
});

server.listen(port,function(){
	console.log("Server listening on: http://${hostname}:${port}/");
});

