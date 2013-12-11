function createUser(){
	var myuser = $("#uname").val();
	var mybio = $("#bio").val();
	$.post('/register', { user:myuser, bio:mybio}, function(data, status, res) {
		console.log("submitted request");
		console.log(status, res, data);
		if (data == "registerSuccess") window.location = "/send";
		else {
			alert("Error registering!");
			$('#uname').val("");
			$('#bio').val("");
		}
	});
}

$("#signup").click(function(){
		createUser();
});