var fs = require('fs');
var one = new Array();
var response;
fs.readFile('../resources/example.json', function(error,data){
	if(error||data==null||data ==""){
		console.log(error);
		console.log(data);
	}else{
		response = JSON.parse(data);
	//	response = data;
		window.alert(response[0].title);
		console.log(response[0].title);
		console.log(data);
		var len = response.length;
		for(var i =0; i < len; i++){
			var x = document.createElement('input');
			x.setAttribute("type", "checkbox");
			x.setAttribute("id",response[i].title);
			x.setAttribute("name",response[i].title);
			x.setAttribute("label",response[i].title);

			document.body.appendChild(x);
		}
	}
});

