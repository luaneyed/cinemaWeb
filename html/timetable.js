var xhr = new XMLHttpRequest();
xhr.open('GET', "http://52.78.67.177", true);
xhr.send();
var title = new Array();
var cinema = new Array();

xhr.addEventListener("readystatechange", processRequest, false);

function processRequest(e){
	if(xhr.readyState == 4){
		var response = JSON.parse(xhr.responseText);

