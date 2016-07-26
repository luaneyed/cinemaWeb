var xhr = new XMLHttpRequest();
xhr.open('GET', "http://52.78.67.177", true);
xhr.send();

var one = new Array();

xhr.addEventListener("readystatechange", processRequest, false);

function processRequest(e){
	if(xhr.readyState == 4){
		var response = JSON.parse(xhr.responseText);
		for(var i =0; i<response.length; i++){
			one.push(response[i].title);
		}
	}
}
