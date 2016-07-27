var xhr = new XMLHttpRequest();
xhr.open('GET', "http://52.78.67.177:8080/movies", true);
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

        for(var i =0; i< response.length; i++){
            var posterSrc = response[i]["imageURL"];
            // var posterSrc = "http://image2.megabox.co.kr/mop/poster/2016/64/728162-7786-4E25-8B7E-CE8A678F4FCA.medium.jpg";
            document.getElementById("s_poster"+(i+1).toString()).setAttribute("src", posterSrc);
        }
        var a = makeRandom(0,response.length-1);
        document.getElementById("b_poster").setAttribute("src", response[a]["imageURL"]);
    }
// document.getElementById("b_poster").setAttribute("src","http://image2.megabox.co.kr/mop/poster/2016/93/B66B0E-C1CD-436B-B5C7-C17631A4D08C.medium.jpg")
    // document.getElementById("s_poster1").onclick = bigPoster(document.getElementById("s_poster1").src);
}

// function bigPoster(src){
//     document.getElementById("b_poster").setAttribute("src", src);
// }
function makeRandom(min, max){
    var RandVal = Math.random() * (max- min) + min;
    return Math.floor(RandVal);
}