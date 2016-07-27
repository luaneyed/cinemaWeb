var main = function(){
    
    $('.theaterList').toggle();

    // ------(s)click_events-------------------
    $('.dropdown-toggle').click(function(){
        $('.theaterList').toggle();
    });


    $('.theaterList').click(function() {
        $(this).addClass('selected');
        
    });

    $('#cgv').click(function(){
        var currentDate = $('#datepicker').datepicker("getDate");
    });

    $('.btn').click(function() {
        var url = 'timetable_v2.html?';
        var movieTarget = document.getElementById("movie");
        var b =	movieTarget.options[movieTarget.selectedIndex].value;
        url = url + "movie="+encodeURIComponent(b)+'&';

        var theaterTarget = document.getElementById("theater");
        var c = theaterTarget.options[theaterTarget.selectedIndex].value;
        url = url + "theater="+encodeURIComponent(c)+'&';

        var currentDate = $('#datepicker').datepicker("getDate");
        var d = currentDate.toISOString().substring(0,10);
        url = url + "date="+encodeURIComponent(d);

        document.location.href = url;

    });

    $('.slide').click(function(){
        $('.current').src = $(this).src;
        console.log("click");
    });

    // ------(e)click_events-------------------

    //calendar
    $( function() {
        $( '#datepicker').datepicker();
    });
    
    
    //movie poster
    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.slider-nav',
        dots: false,
        centerMode: true,
        focusOnSelect: true,
        arrows: false,
        fade: true
    });

    $('.slider-nav').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        asNavFor: '.slider-for',
        dots: true,
        centerMode: true,
        focusOnSelect: true,
        infinite : true
    });
};


$(document).ready(main);

