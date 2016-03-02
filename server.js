var env = process.env.NODE_ENV || 'dev';

var PORT = process.env.PORT || 3000;
var express = require('express');
var server = express();
var http = require('http').Server(server);

server.use(express.static(__dirname + "/public"));

http.listen(PORT, function() {
	console.log("Socket server started");
});