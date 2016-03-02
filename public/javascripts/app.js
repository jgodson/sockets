var socket = io();

socket.on('connect', function () {
	socket.on('message', function(message) {
		$('#received').append("<p class='message received'>" + message.text + "</p>");
		console.log(message.text);
	});
});

// Handles submitting of messages
var $form = jQuery('#message-form');
var messageBox = $form.find('input[name=message]');
$form.on('submit', function(event) {
	event.preventDefault();
	var sentMessage = messageBox.val();
	if (sentMessage !== "") {
		socket.emit('message', {
			text: sentMessage
		});
	}
	$('#sent').append("<p class='message sent'>" + sentMessage + "</p>");
	messageBox.val("");
});