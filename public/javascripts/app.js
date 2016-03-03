var socket = io();

socket.on('connect', function () {
	socket.on('message', function(message) {
		message.timestamp = moment(message.timestamp);
		$('#received').append("<p class='message received'><strong>" + message.timestamp.local().format('h:mm a')
			+ "</strong>: "+ message.text + "</p>");
		$('#sent').append("<p class='message empty'>" + message.text + "</p>");
	});
});

// Handles submitting of messages
var $form = jQuery('#message-form');
var messageBox = $form.find('input[name=message]');
$form.on('submit', function(event) {
	event.preventDefault();
	var timestamp = moment();
	var sentMessage = messageBox.val();
	if (sentMessage !== "") {
		socket.emit('message', {
			text: sentMessage,
			timestamp: timestamp
		});
		$('#received').append("<p class='message empty'>" + sentMessage + "</p>");
		$('#sent').append("<p class='message sent'><strong>" + timestamp.local().format('h:mm a') + "</strong>: "
			+ sentMessage + "</p>");
		messageBox.val("");
	}
});