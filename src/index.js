import _ from 'lodash';
import L from 'leaflet';

import Util from './util.js';

const books = require('./data/dataset.json');
const countries = require('./data/countries.geo.json')

function component() {
  var element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['This', 'is', 'cool'], ' ');

  return element;
}

document.body.appendChild(component());

var accessToken = 'pk.eyJ1IjoiYW1hdSIsImEiOiIxTmxLVWlVIn0.JJuKgBjkpUtOs0VZjtmJRw';

var map = L.map('mapid').setView([51.505, -0.09], 13);

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


console.log(Util.uniqueValues(books, "country"));
console.log(Util.uniqueValues(books, "country"));



