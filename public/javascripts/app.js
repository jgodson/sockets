var socket = io();

socket.on('connect', function () {
	socket.on('message', function(message) {
		console.log("Message : " + message.text);
	});
});

// Handles submitting of messages
var $form = jQuery('#message-form');
var messageBox = $form.find('input[name=message]');
$form.on('submit', function(event) {
	event.preventDefault();
	if (messageBox.val() !== "") {
		socket.emit('message', {
			text: messageBox.val()
		});
	}
	messageBox.val("");
});