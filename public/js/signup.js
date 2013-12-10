function createUser(){
	$.post('/register', { user:'timsucks', pubkey:'wait this isnt a pubkey'}, function() {
		console.log("submitted request");
	});
}

$( "#signup").click(function(){
		createUser();
	});
}