function getMessages(){
	console.log("clicked get messages");
	var mysender = $("#sender").val();
	var getting = $.post('/getmessages', { user:mysender });
	getting.done(function(data, res){
			console.log("inside get req");
			console.log(data,res);
			console.log(data.length);
			$("#tbody").empty();
			for (var m in data){
				console.log(data[m].sender);
				$("#tbody").append("<tr><td>"+data[m].sender+"</td><td>"+data[m].file+"</td></tr>");
			}
		});
//		data.map(function(item){
//			$("#tbody").append("<tr><td>"+item.sender+"</td><td>"+item.file+"</td></tr>");
//		});
//		for (var m in data){
//			console.log(data[m].sender);
//			$("#tbody").append("<tr><td>"+data[m].sender+"</td><td>"+data[m].file+"</td></tr>");
//		}


}