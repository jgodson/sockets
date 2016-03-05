var env = process.env.NODE_ENV || 'dev';

var PORT = process.env.PORT || 3000;
var express = require('express');
var server = express();
var http = require('http').Server(server);
var io = require('socket.io')(http);
var moment = require('moment');

var now = moment();

var clientInfo = {};

function sendCurrentUsers (socket) {
	var info = clientInfo[socket.id];
	var users = [];
	if (typeof info === 'undefined') {
		return;
	}
	
	Object.keys(clientInfo).forEach(function(socketID) {
		var userInfo = clientInfo[socketID];
		if (info.room === userInfo.room) {
			users.push(userInfo.name);
		}
	});
	
	socket.emit('message', {
		name: 'System',
		text: "Current users: " + users.join(', '),
		timestamp: moment()
	})
	
}

function systemMessage (socket, msg, name, room) {
	// If room not given emit message instead of broadcast to specific room
	// @msg - message to send @name name of receiver @room room the receiver is in
	if (typeof room !== 'undefined') {
		socket.broadcast.to(room).emit('message', {
			name: "System",
			text: name + " " + msg,
			timestamp: moment()
		});
	}
	else {
		socket.emit('message', {
		name: "System",
		text: msg,
		timestamp: moment()
		});
	}
}

io.on('connection', function(socket) {
	console.log("User connected via socket.io");
	systemMessage(socket, "Welcome to the chat application. To see users currently in the room" + 
	" type @currentusers");
	socket.on('disconnect', function() {
		if (typeof clientInfo[socket.id] !== 'undefined') {
			var userData = clientInfo[socket.id];
			socket.leave(userData.room);
			systemMessage(socket, "has left the room", userData.name, userData.room);
			delete clientInfo[socket.id];
		}
	});
	
	socket.on('joinRoom', function(req) {
		clientInfo[socket.id] = req;
		socket.join(req.room);
		systemMessage(socket, "has joined the room", req.name, req.room);
	});
	
	socket.on('message', function(message) {
		if (message.text.toLowerCase() === "@currentusers") {
			sendCurrentUsers(socket);
		}
		else {
			message.timestamp = moment();
			socket.broadcast.to(clientInfo[socket.id].room).emit('message', message);
		}
	});
	
	
});

server.use(express.static(__dirname + "/public"));

http.listen(PORT, function() {
	console.log("Socket server started");
});