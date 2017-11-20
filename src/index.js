import _ from 'lodash';
import L from 'leaflet';

import util from './util.js';

const books = require('./data/dataset.json');
const countries = require('./data/countries.geo.json')

function component() {
    var element = document.createElement('div');

    // Lodash, currently included via a script, is required for this line to work
    element.innerHTML = _.join(['This', 'is', 'cool'], ' ');

  return element;
}

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

function getSlice() {
    var countryList = document.getElementById("select-country")
    var genreList = document.getElementById("select-genre")
    var yearList = document.getElementById("select-year")
    var languageList = document.getElementById("select-language")
    var cityList = document.getElementById("select-city")
    

    var selectedCountry = countryList[countryList.selectedIndex].value;
    var selectedGenre = genreList[genreList.selectedIndex].value;
    var selectedLanguage = languageList[languageList.selectedIndex].value;
    var selectedYear = yearList[yearList.selectedIndex].value;
    var selectedCity = cityList[cityList.selectedIndex].value;

    console.log(selectedCountry + ", " + selectedGenre + ", " + selectedLanguage + ", " +selectedYear+ ", " + selectedCity);
    var currentSlice = util.sliceByFilter(books, [{"country":selectedCountry}, {"genre":selectedGenre}, {"language":selectedLanguage}, {"year":selectedYear}, {"city":selectedCity}]);
    var elem = document.getElementById("json");
    if (elem) {
        elem.parentNode.removeChild(elem);
    }
    console.log(currentSlice);
    document.body.appendChild(pretyBooksComponent(currentSlice));
}


document.body.appendChild(component());

var accessToken = 'pk.eyJ1IjoiYW1hdSIsImEiOiIxTmxLVWlVIn0.JJuKgBjkpUtOs0VZjtmJRw';

var map = L.map('mapid').setView([0, 0], 1);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + accessToken, {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
    id: 'mapbox.streets'
}).addTo(map);


countries.features.forEach(function(geojsonFeature){
    L.geoJSON(geojsonFeature).addTo(map);
});


document.body.appendChild(comboBox(util.uniqueValues(books, "country"), "select-country"));
document.body.appendChild(comboBox(util.uniqueValues(books, "genre"), "select-genre"));
document.body.appendChild(comboBox(util.uniqueValues(books, "city"), "select-city"));
document.body.appendChild(comboBox(util.uniqueValues(books, "year"), "select-year"));
document.body.appendChild(comboBox(util.uniqueValues(books, "language"), "select-language"));




