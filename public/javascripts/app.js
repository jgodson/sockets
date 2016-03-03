var socket = io();
var params = getQueryParams() || {name : "Anonymous",
								  room: "General"};
if (params.name === '') {
	params.name = "Anonymous";
}
if (params.room === '') {
	params.room = "General";
}

$('#room-details').append("<h3>Welcome to the " + params.room + " chat room</h3>");

var $messages = $('#messages')
socket.on('connect', function () {
	socket.emit('joinRoom', {
		name: params.name,
		room: params.room 
	});
});

socket.on('message', function(message) {
	message.timestamp = moment(message.timestamp);
	$messages.append("<p class='message received'><strong>" + message.name + " @ " 
	+ message.timestamp.local().format('h:mm a') + "</strong>:<br>"+ message.text + "</p>");
	$messages.animate({scrollTop: $messages.prop("scrollHeight")}, 500);
});

// Handles submitting of messages
var $form = jQuery('#message-form');
var $messageBox = $form.find('input[name=message]');
$form.on('submit', function(event) {
	event.preventDefault();
	var timestamp = moment();
	var sentMessage = $messageBox.val();
	if (sentMessage !== "") {
		socket.emit('message', {
			name: params.name,
			text: sentMessage
		});
		$messages.append("<p class='message sent'><strong>You @ " + timestamp.format('h:mm a') + "</strong>:<br>"
			+ sentMessage + "</p>");
		$messageBox.val("");
		$messages.animate({scrollTop: $messages.prop("scrollHeight")}, 500);
	}
});