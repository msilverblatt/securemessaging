function sendMessage(){
	var senduser = $("#sender").val();
	var myrecipient = $("#recipient").val();
	var mysymkey = $("#pkey").val();
	var mymessage= $("#message").val();
	$.post('/send', { sender:senduser, symkey:mysymkey, recipient:myrecipient, text:mymessage}, function(data, status, res) {
		console.log("submitted request");
		console.log(status, res, data);
	});
}