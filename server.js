var env = process.env.NODE_ENV || 'dev';

var PORT = process.env.PORT || 3000;
var express = require('express');
var server = express();
var http = require('http').Server(server);
var io = require('socket.io')(http);

io.on('connection', function() {
	console.log("User connected via socket.io");
});

server.use(express.static(__dirname + "/public"));

http.listen(PORT, function() {
	console.log("Socket server started");
});