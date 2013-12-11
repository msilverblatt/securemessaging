function sendMessage(){
	var senduser = $("#sender").val();
	var myrecipient = $("#recipient").val();
	var mykey = $("#passphrase").val();
	var message= $("#message").val();
	console.log(message);
	var mymessage = encrypt(mykey,message).toString();
	console.log(mymessage);
	var mysubject= $("#subject").val();
	$.post('/send', { sender:senduser, recipient:myrecipient, text:mymessage, subject:mysubject}, function(data, status, res) {
		console.log("submitted request");
		console.log(status, res, data);
	});
}

function clearForms(){
	$(".form").each(function(index, element){
		element.value = "";
		val = "";
console.log(element);
	});
}