var xhr = new XMLHttpRequest();
xhr.open('GET', "http://52.78.67.177", true);
xhr.send();

xhr.addEventListener("readystatechange", processRequest, false);
var one = new Array();
function processRequest(e){
	if(xhr.readyState == 4){
		var response = JSON.parse(xhr.responseText);
//		var one = new Array();
		for(var i = 0; i < response.length; i++){
			one.push(response[i].title);
			var x = document.createElement('input');
			x.setAttribute("type", "checkbox");
			x.setAttribute("id", response[i].title);
			x.setAttribute("name", response[i].title);
			x.setAttribute("label", response[i].title);

			document.body.appendChild(x);
		}
	}
}
