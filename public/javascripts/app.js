var socket = io();
var params = getQueryParams() || {name : "Anonymous"};
$sent = $('#sent');
$received = $('#received');

socket.on('connect', function () {
	socket.on('message', function(message) {
		message.timestamp = moment(message.timestamp);
		$received.append("<p class='message received'><strong>" + message.name +"</strong> @ <strong>" 
		+ message.timestamp.local().format('h:mm a') + "</strong>:<br>"+ message.text + "</p>");
		$sent.append("<p class='message empty'>\n" + message.text + "</p>");
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
			name: params.name,
			text: sentMessage,
			timestamp: timestamp
		});
		$received.append("<p class='message empty'>" + sentMessage + "</p>");
		$sent.append("<p class='message sent'><strong>" + timestamp.local().format('h:mm a') + "</strong>: "
			+ sentMessage + "</p>");
		messageBox.val("");
	}
});