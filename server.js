var env = process.env.NODE_ENV || "development";

var PORT = process.env.PORT || 3000;
var express = require("express");
var server = express();
var http = require("http").Server(server);
var io = require("socket.io")(http);
var moment = require("moment");
var totalUsers = 0;
var clientInfo = {};

// Gets the curent users in the room and sends them to the user that requested it
function sendCurrentUsers(socket) {
  var info = clientInfo[socket.id];
  var users = [];
  if (typeof info === "undefined") {
    return;
  }
  Object.keys(clientInfo).forEach(function (socketID) {
    var userInfo = clientInfo[socketID];
    if (info.room === userInfo.room) {
      users.push(userInfo.name);
    }
  });
  systemMessage(
    socket,
    users.length + " users in current room: " + users.join(", "),
    "System"
  );
}

// Sends a message from the Server to the users
function systemMessage(socket, msg, name, room) {
  // If room not given emit message instead of broadcast to specific room
  // @msg - message to send @name name of receiver @room room the receiver is in
  if (typeof room !== "undefined") {
    socket.broadcast.to(room).emit("message", {
      name: "System",
      text: name + " " + msg,
      timestamp: moment(),
    });
  } else {
    socket.emit("message", {
      name: "System",
      text: msg,
      timestamp: moment(),
    });
  }
}

// Here's where users connect
io.on("connection", function (socket) {
  console.log("User connected via socket.io");
  totalUsers++;
  systemMessage(
    socket,
    "Welcome to the chat application. To see users currently in the room" +
      " type @currentusers. To see total connected users in all rooms type @totalusers"
  );
  socket.on("disconnect", function () {
    if (typeof clientInfo[socket.id] !== "undefined") {
      var userData = clientInfo[socket.id];
      socket.leave(userData.room);
      systemMessage(socket, "has left the room", userData.name, userData.room);
      delete clientInfo[socket.id];
      totalUsers--;
    }
  });

  // This happens when a user joins a room
  socket.on("joinRoom", function (req) {
    clientInfo[socket.id] = req;
    socket.join(req.room);
    systemMessage(socket, "has joined the room", req.name, req.room);
  });

  // This happens when users send a message
  socket.on("message", function (message) {
    // Special commands
    if (message.text.toLowerCase() === "@currentusers") {
      sendCurrentUsers(socket);
    } else if (message.text.toLowerCase() === "@totalusers") {
      systemMessage(
        socket,
        "Total users in all rooms: " + totalUsers,
        "System"
      );
    } else {
      message.timestamp = moment();
      socket.broadcast.to(clientInfo[socket.id].room).emit("message", message);
    }
  });
});

server.use(express.static(__dirname + "/public"));

http.listen(PORT, function () {
  console.log("Socket server started");
});
