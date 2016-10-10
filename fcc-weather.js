//Optional -- 
//  Display a different picture depending on the weather returned


var lat, lng; //global variable to gather weather information
var tempToggle = true; //create click event to toggle this Boolean to update JSON request and highlighting

navigator.geolocation.getCurrentPosition(function(position) { //concact latlng into query URL
    console.log("Geolocation Access Granted");
    lat = position.coords.latitude;
    lng = position.coords.longitude; //init location
    getWeather(position.coords.latitude, position.coords.longitude);

}, function(positionError) { //second callback for Geolocation Error Handling
    console.log("position error: " + positionError.message);
    $("#banner").html("<h5>For more acurate geolocation information, see your browsers location sharing policy</h5>");
    ipLocation();
}); //close navigator.geolocation.getCurrentPosition

function ipLocation() {
    console.log("inside ipLocation()");
    $.getJSON("http://ipinfo.io", function(data) {
        var arrayOfStrings = data.loc.split(",");
        lat = arrayOfStrings[0];
        lng = arrayOfStrings[1]; //init location
        getWeather(arrayOfStrings[0], arrayOfStrings[1]);

    }); //close $.getJSON(ip address)
}

function getWeather(lat, lng) {
    if (tempToggle) {
        cnvrtLocJSON = lat + "%2C" + lng + ")')%20and%20u%3D'F'";
    } else {
        cnvrtLocJSON = lat + "%2C" + lng + ")')%20and%20u%3D'C'";
    }
    weatherUrl = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.places%20WHERE%20text%3D'(" + cnvrtLocJSON + "&format=json&callback=";

    console.log("weather JSON:  " + weatherUrl);
    $.getJSON(weatherUrl, function(data) {
        $(".loading").css("display", "none");
        if (data.query.count > 0) { //check to see if results came back with any data
            $(".weather-info").css("display", "block"); //unhide weather info div
            //LOCATION INFO
            $("#location").text(data.query.results.channel.location.city + ", " + data.query.results.channel.location.country);
            //TEMP INFO
            $("#temp").html('<h2>' + data.query.results.channel.item.condition.temp + "&deg</h2>"); //check out .append('<h2>'+) for cleaner alternataive
            $("#cf").html("<span id = 'c'>C</span> | <span id = 'f'>F</span>");
            if (tempToggle) { //add styling after element has been created
                $("span#f").addClass("chosen");
            } else {
                $("span#c").addClass("chosen");
            }
            //CURRENT CODITIONS
            console.log(data.query.results.channel.item.condition.text);
            $("h3.condition").html(data.query.results.channel.item.condition.text);
            weatherIcon = "wi-yahoo-" + data.query.results.channel.item.condition.code;
            $("i.condition").addClass(weatherIcon);

            //yahoo affliation
            $("a.yahoo").attr("href",data.query.results.channel.image.link);
            $("img.yahoo").attr("src",data.query.results.channel.image.url);
            $("img.yahoo").attr("width",data.query.results.channel.image.width);
            $("img.yahoo").attr("height",data.query.results.channel.image.height);


        } else {
            $("#banner").html("<h3> Bummer... error in retreiving weather data.</h3><h4>Please try again later</h4>");
            console.log("problem fetching weather data from yahoo");
        }
    }); //close $.getJSON(yahoo weather)
}

$(document).ready(function() {

    //currently, both click events are always active. 
    //Alternatively, they could be flickered on and off, added within the getWeather function

    $('div#cf').on('click', "span#c", function(e) {
        tempToggle = false;
        getWeather(lat, lng);
    });

    $('div#cf').on('click', "span#f", function(e) {
        tempToggle = true;
        getWeather(lat, lng);
    });

});
