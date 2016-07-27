var xhr = new XMLHttpRequest();
xhr.open('GET', "http://52.78.67.177:8080/plays", true);
xhr.send();

xhr.addEventListener("readystatechange", processRequest, false);
var one = new Array();
function processRequest(e){
	if(xhr.readyState == 4){
		var response = JSON.parse(xhr.responseText);
		// var movieList = new HashSet();
		var movieList = new Array();
		for (var i=0, len=response.length; i<len; i++){
			movieList.push(response[i]["title"]);
		}
		movieList = array_unique(movieList);
		console.log(movieList);
		for(var i = 0, len = movieList.length; i < len; i++){
			var title = movieList[i];
			console.log(title);
			// one.push(movieList[i].title);
			var z = document.createElement("option");
			z.setAttribute("value", title);
			var t = document.createTextNode(title);
			z.appendChild(t);
			document.getElementById("movie").appendChild(z);
		}
	}
}

function array_unique (inputArr) {
	// Removes duplicate values from array
	var key = '',
		tmp_arr2 = new Array(),
		val = '';

	var __array_search = function (needle, haystack) {
		var fkey = '';
		for (fkey in haystack) {
			if (haystack.hasOwnProperty(fkey)) {
				if ((haystack[fkey] + '') === (needle + '')) {
					return fkey;
				}
			}
		}
		return false;
	};

	for (key in inputArr) {
		if (inputArr.hasOwnProperty(key)) {
			val = inputArr[key];
			if (false === __array_search(val, tmp_arr2)) {
				// tmp_arr2[a] = val;
				tmp_arr2.push(val);
			}
		}
	}

	return tmp_arr2;
}
