var env = process.env.NODE_ENV || 'dev';

var PORT = process.env.PORT || 3000;
var express = require('express');
var server = express();
var http = require('http').Server(server);
var io = require('socket.io')(http);
var moment = require('moment');

var now = moment();

io.on('connection', function(socket) {
	console.log("User connected via socket.io");
	
	socket.on('message', function(message) {
		socket.broadcast.emit('message', message);
	});
	
	
});

server.use(express.static(__dirname + "/public"));

http.listen(PORT, function() {
	console.log("Socket server started");
});