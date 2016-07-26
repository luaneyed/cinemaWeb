var xhr = new XMLHttpRequest();
xhr.open('GET', "http://52.78.67.177:8080/plays", true);
xhr.send();

xhr.addEventListener("readystatechange", processRequest, false);
var one = new Array();
function processRequest(e){
	if(xhr.readyState == 4){
		var response = JSON.parse(xhr.responseText);
		var movielist = document.createElement("SELECT");
		movielist.setAttribute("id","movieSelect");
		document.body.appendChild(movielist);
		
		for(var i = 0, len = response.length; i < 10; i++){
			var title = response[i].title;
			one.push(response[i].title);
			var z = document.createElement("option");
			z.setAttribute("value", title);
			var t = document.createTextNode(title);
			z.appendChild(t);
			document.getElementById("movieSelect").appendChild(z);
		}
	}
}
