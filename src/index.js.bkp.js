import _ from 'lodash';
import L from 'leaflet';
import Styles from './style/main.css';
import util from './util.js';

const books = require('./data/dataset.json');
const countries = require('./data/countries.geo.json')


function comboBox(options, name) {
    var selectList = document.createElement("select");
    selectList.id = name;
    selectList.addEventListener("change", getSlice);
    options.forEach(function(element){
        var option = document.createElement("option");
        option.value = element;
        option.text = element;
        selectList.appendChild(option);
    });
    return selectList;
}

function pretyBooksComponent(information) {
    var pre = document.createElement("pre");
    pre.id = "json";
    pre.innerHTML = "<code>" + JSON.stringify(information, null, 4) +" </code>";
    return pre;
}

function yearComponent(legend) {
    var yearContainer = document.createElement("div");
    yearContainer.id = "year-card";
    yearContainer.innerHTML = "<div>Años</div><div>"+legend+"</div>";
    return yearContainer;
}

function rangeComponent(options, name) {
    console.log(options);

    var yearRange = document.createElement("input");
    yearRange.type = "range";
    yearRange.min = parseInt(options[1]);
    yearRange.max = parseInt(options[options.length - 1]);
    yearRange.value = 50;
    yearRange.id = name;
    yearRange.addEventListener("change", getSlice);

    return yearRange;
}



function getSlice() {
    //var countryList = document.getElementById("select-country")

    var genreList = document.getElementById("select-genre");
    var yearRange = document.getElementById("select-year")
    var languageList = document.getElementById("select-language");
    //var cityList = document.getElementById("select-city")
    

    //var selectedCountry = countryList[countryList.selectedIndex].value;
    var selectedGenre = genreList[genreList.selectedIndex].value;
    var selectedLanguage = languageList[languageList.selectedIndex].value;
    var selectedYear = yearRange.value;
    //var selectedCity = cityList[cityList.selectedIndex].value;

    //console.log(selectedCountry + ", " + selectedGenre + ", " + selectedLanguage + ", " +selectedYear+ ", " + selectedCity);
    var currentSlice = util.sliceByFilter(books, [
                                                  //{"country":selectedCountry}, 
                                                  {"genre":selectedGenre}, 
                                                  {"language":selectedLanguage}, 
                                                  //{"year":selectedYear}, 
                                                  //{"city":selectedCity}
                                                  ], 
                                                  selectedYear);
    console.log();

    var elem = document.getElementById("json");
    if (elem) {
        elem.parentNode.removeChild(elem);
    }
    var yearElement = document.getElementById("year-card");
    if (yearElement) {
        yearElement.parentNode.removeChild(yearElement);
    }
    //console.log(currentSlice);
    document.getElementById("controls").appendChild(yearComponent(selectedYear+"-"+yearRange.max));
    document.getElementById("slice").appendChild(pretyBooksComponent(currentSlice));

    paintCountries(currentSlice);
}

var paintedFeatures = [];

function paintCountries(slice) {

    var countriesToPaint = util.uniqueValues(slice, "country");
    var countryCodes = [];
    countriesToPaint.forEach(function(country){
        countryCodes.push(util.getCountryId(country));
    });

    paintedFeatures.forEach(function (layer) {
        map.removeLayer(layer);
    });

    countries.features.forEach(function(geojsonFeature){
        if(countryCodes.indexOf(geojsonFeature.id) > -1) {

            var country = L.geoJSON(geojsonFeature);
            paintedFeatures.push(country);
            map.addLayer(country);
        }

        //console.log("\"" + geojsonFeature.properties.name+"\":\""++"\",");
        
        //
        //
    });

}

var accessToken = 'pk.eyJ1IjoiYW1hdSIsImEiOiIxTmxLVWlVIn0.JJuKgBjkpUtOs0VZjtmJRw';

var map = L.map('map', { zoomControl:false }).setView([0, 0], 1);

//map.touchZoom.disable();
//map.doubleClickZoom.disable();
//map.scrollWheelZoom.disable();
//map.boxZoom.disable();
//map.keyboard.disable();
//map.dragging.disable();

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + accessToken, {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);

/**

countries.features.forEach(function(geojsonFeature){
    var country = L.geoJSON(geojsonFeature);

    map.addLayer(country);
});
console.log(util.uniqueValues(books, "country"));

**/
//document.body.appendChild(comboBox(util.uniqueValues(books, "country"), "select-country"));
document.getElementById("controls").appendChild(rangeComponent(util.uniqueValues(books, "year"), "select-year"));

document.getElementById("controls").appendChild(comboBox(util.uniqueValues(books, "genre"), "select-genre"));
//document.body.appendChild(comboBox(util.uniqueValues(books, "city"), "select-city"));
document.getElementById("controls").appendChild(comboBox(util.uniqueValues(books, "language"), "select-language"));




