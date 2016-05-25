var socket = io();
var params = getQueryParams() || {name : "",
								  room: "General"};
								  
if (params.name === '') {
	params.name = "User" + Math.floor(Math.random() * 10000);
}
if (params.room === '') {
	params.room = "General";
}

params.name = params.name.replace(/[&{}\[\]=+()%`<>"\/]/g, "*");
params.room = params.room.replace(/[&{}\[\]=+()%`<>"\/]/g, "*");

$('#room-details').append("<p>Welcome to the " + params.room + " chat room</p>");

var $messages = $('#messages');
socket.on('connect', function () {
	socket.emit('joinRoom', {
		name: params.name,
		room: params.room 
	});
});

socket.on('message', function(message) {
	message.timestamp = moment(message.timestamp);
	$messages.append("<p class='col-sm-8 col-sm-offset-2 message received'><strong>" + message.name + " @ " 
	+ message.timestamp.local().format('h:mm a') + "</strong>:<br>"+ message.text + "</p>");
	$messages.animate({scrollTop: $messages.prop("scrollHeight")}, 500);
});

// Handles submitting of messages
var $form = jQuery('#message-form');
var $messageBox = $form.find('input[name=message]');
$form.on('submit', function(event) {
	event.preventDefault();
	var timestamp = moment();
	var sentMessage = $messageBox.val().replace(/[&{}\[\]=+()%`<>"\/]/g, "*");
	if (sentMessage !== "") {
		socket.emit('message', {
			name: params.name,
			text: sentMessage
		});
		$messages.append("<p class='col-sm-8 col-sm-offset-2 message sent'><strong>You @ " + timestamp.format('h:mm a') + "</strong>:<br>"
			+ sentMessage + "</p>");
		$messageBox.val("");
		$messages.animate({scrollTop: $messages.prop("scrollHeight")}, 500);
	}
});