var env = process.env.NODE_ENV || 'dev';

var PORT = process.env.PORT || 3000;
var express = require('express');
var server = express();
var http = require('http').Server(server);
var io = require('socket.io')(http);
var moment = require('moment');

var now = moment();

var clientInfo = {};

io.on('connection', function(socket) {
	console.log("User connected via socket.io");
	
	socket.emit('message', {
		name: "System",
		text: "Welcome to the chat application!",
		timestamp: moment()
	});
	
	socket.on('disconnect', function() {
		if (typeof clientInfo[socket.id] !== 'undefined') {
			var userData = clientInfo[socket.id];
			socket.leave(userData.room);
			socket.broadcast.to(userData.room).emit('message', {
				name: "System",
				text: userData.name + " has left the room",
				timestamp: moment()
			});
			delete clientInfo[socket.id];
		}
	});
	
	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		socket.broadcast.to(req.room).emit('message', {
			name: "System",
			text: req.name + " has joined the room",
			timestamp: moment()
		});
	});
	
	socket.on('message', function(message) {
		message.timestamp = moment();
		socket.broadcast.to(clientInfo[socket.id].room).emit('message', message);
	});
	
	
});

server.use(express.static(__dirname + "/public"));

http.listen(PORT, function() {
	console.log("Socket server started");
});