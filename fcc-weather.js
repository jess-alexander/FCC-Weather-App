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
            $("#temp-wrapper").html("<h2>" + data.query.results.channel.item.condition.temp + "&deg<span id = 'cF'>"+data.query.results.channel.units.temperature+"</span></h2>");
            //CURRENT CODITIONS
            console.log(data.query.results.channel.item.condition.text);
            $("h3.condition").html(data.query.results.channel.item.condition.text);
            weatherIcon = "wi-yahoo-" + data.query.results.channel.item.condition.code;
            $("i.condition").addClass(weatherIcon);
            //FORCAST INFOMATION
            loadForecast(data);
        } else {
            $(".loading").html("<h3> Bummer... error in retreiving weather data.</h3><h4>Please try again later</h4>");
            console.log("problem fetching weather data from yahoo");
        }
    }); //close $.getJSON(yahoo weather)
}

function loadForecast(data){
    $("div.fc-inner").html("");
    for(var i=0; i<5; i++){
        weatherIcon = "wi-yahoo-" + data.query.results.channel.item.forecast[i].code;
        $("div.fc-inner").append("<div class = 'forecast'><h3>"
            + data.query.results.channel.item.forecast[i].day + "</h3><h3>" + data.query.results.channel.item.forecast[i].high 
            + "&deg<span id = 'cF'>" + data.query.results.channel.units.temperature + "</span>     "
            + data.query.results.channel.item.forecast[i].low + "&deg<span id = 'cF'>" 
            + data.query.results.channel.units.temperature + "</span></h3><i class='wi " + weatherIcon + "'></i></div>");
    }
}

$(document).ready(function() {

    $('div#temp-wrapper').on('click', "#cF", function() {
        tempToggle = !tempToggle;
        getWeather(lat, lng);
    });

});
