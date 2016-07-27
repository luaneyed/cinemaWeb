var xhr = new XMLHttpRequest();
xhr.open('GET', "http://52.78.67.177:8080/posters", true);
xhr.send();
var response;

xhr.addEventListener("readystatechange", processRequest, false);
var one = new Array();
function processRequest(e){
    if(xhr.readyState == 4){
        response = JSON.parse(xhr.responseText);

        // for(var i = 0, len = response.length; i < 10; i++){
        //     var title = response[i].title;
        //     one.push(response[i].title);
        //     var z = document.createElement("option");
        //     z.setAttribute("value", title);
        //     var t = document.createTextNode(title);
        //     z.appendChild(t);
        //     document.getElementById("movie").appendChild(z);
        // }

        for(var i =0; i< 7; i++){
            var posterSrc = response[i]["poster"];
            document.getElementById("s_poster{0}".format(i)).setAttribute("src", posterSrc);
        }
        document.getElementById("b_poster").setAttribute("src", response[7]);
    }
    document.getElementById("s_poster{0}")
}
//
// function bigPoster(){
//     document.getElementById("b_poster").setAttribute("src", )
// }