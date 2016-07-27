var xhr = new XMLHttpRequest();
xhr.open('GET', "http://52.78.67.177/plays", true);
xhr.send();
var movie;
var theater;
var date;
var response;
var a=0, b=0;
var result= new Array();
var movieList = new Array();
var theaterList = new Array();
var timetableList = new Array();
xhr.addEventListener("readystatechange", processRequest, false);
var currentDate;

function processRequest(e) {
	if (xhr.readyState == 4) {
		response = JSON.parse(xhr.responseText);
	}

	for (var i =0, len = response.length; i<len; i++){
		if(response[i]["month"] == month && response[i]["day"] == day){
			if(a==0 && b==0){
				if(response[i]["movie"]==movie && response[i]["theater"]==theater){
					result.push(response[i]);
				}
			}else if(a==1 && b==0){
				if(response[i]["theater"]==theater){
					result.push(response[i]);
				}
			}else if(a==0 && b==1){
				if(response[i]["movie"] == movie){
					result.push(response[i]);
				}
			}else{
				result.push(response[i]);
			}
		}
	}

	for (var i=0, len=result.length; i<len; i++){
		movieList.push(result[i]["title"]+" : " + result[i]["option"] +" : " + result[i]["age"]);
	}
	movieList = array_unique(movieList);

	for(var i=0, len=movieList.size(); i<len; i++){
		var Child = new Array();
		for(var j=0; j<response.length; j++){
			if((response[j]["title"]+" : "+response[j]["option"]+" : "+response[j]["age"])==movieList[i]){
				Child.push(response[i]["theater"]+" : "+response[i]["screen"])
			}
		}
		Child = array_unique(Child);
		theaterList.push(Child);
	}
	theaterList = array_unique(theaterList);

	for(var i=0; i<movieList.size(); i++){
		var Child1 = new Array();
		for(var j=0; j<theaterList.length; j++){
			var Child2 = new Array();
			for(var k=0;k<response.length; k++){
				if((response[k]["title"]+" : "+response[k]["option"]+" - "+response[k]["age"])==movieList[i]
				&& (response[k]["theater"]+" _ "+response[k]["screen"])==theaterList[j]){
					Child2.push(response[k]["startTime"]+" ~ "+response[k]["endTime"]+" ( 잔여석"+response[k]["leftSeat"]+")");
				}
			}
			Child2 = array_unique(Child2);
			Child1.push(Child2);
		}
		Child1 = array_unique(Child1);
		timetableList.push(Child1);
	}
	timetableList = array_unique(timetableList);
}
window.onload = function(){
	var url = document.location.href,
		params = url.split('?')[1].split('&'),
		data = {}, tmp;
	for (var i =0, l = params.length; i <l; i++){
		tmp = params[i].split('=');
		tmp[1] = decodeURIComponent(tmp[1]);
		data[tmp[0]] = tmp[1];
	}
	movie = data["movie"];
	theater = data["theater"];

	currentDate=new Date(data["date"]);

	month=data["date"].split("-")[1];
	day = data["date"].split('-')[2];
	if(movie=="") a = 1;
	if(theater=="") b = 1;
}
function yesterday(){
	var url = 'http://52.26.85.179/cinemaWeb/html/timetable.html?'

	url = url + "movie="+encodeURIComponent(movie)+'&';

	url = url + "theater="+encodeURIComponent(theater)+'&';

	var yesterdayDate = currentDate-1;
	var d = yesterdayDate.toISOString().substring(0,10);

	url = url + "date="+encodeURIComponent(d);

	document.location.href = url;
}

function tomorrow(){
	var url = 'http://52.26.85.179/cinemaWeb/html/timetable.html?'

	url = url + "movie="+encodeURIComponent(movie)+'&';

	url = url + "theater="+encodeURIComponent(theater)+'&';

	var tomorrowDate = currentDate+1;
	var d = tomorrowDate.toISOString().substring(0,10);
	url = url + "date="+encodeURIComponent(d);

	document.location.href = url;
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