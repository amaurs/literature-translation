import React from 'react';
import { CircleMarker, Popup} from 'react-leaflet';

export default class CitiesLayer extends React.Component {
    render() {
        let markers = [];
        let zoomLevel = this.props.zoom;
        let type = null;
        if(zoomLevel < this.props.zoom_threshold) {
          //console.log("Display by country.");
          type = "country";
          let countries = {};
          this.props.slice.forEach((feature, index) => {
            if(countries.hasOwnProperty(feature.country)) {
              let aux = { 
                     name: feature.country,
                     position: [feature.lat_country, feature.lng_country], 
                     count: countries[feature.country].count + 1};
              countries[feature.country] = aux;
            }
            else {
              let aux = { 
                     name: feature.country,
                     position: [feature.lat_country, feature.lng_country], 
                     count: 1};
              countries[feature.country] = aux;
            }
          });
          markers = countries;
        }
        else {
          let cities = {};
          type = "city";
          this.props.slice.forEach((feature, index) => {
            if(cities.hasOwnProperty(feature.city)) {
              let aux = {
                     name: feature.city,
                     position: [feature.lat, feature.lng], 
                     count: cities[feature.city].count + 1};
              cities[feature.city] = aux;
            }
            else {
              let aux = {
                     name: feature.city,
                     position: [feature.lat, feature.lng], 
                     count: 1};
              cities[feature.city] = aux;
            }
          });
          markers = cities;
        }
        let keys = Object.keys(markers);
        let values = keys.map(function(v) { return markers[v]; });

        return values.map((value, index) => 
            <CircleMarker key={ index } 
                          center={ value.position } 
                          radius={ Math.log(value.count) * 3 + 3 }
                          onClick={(e) => this.props.handleMarkerClick(type, value)} >
              <Popup>
                <span>{value.name} <br/> {value.count}</span>
              </Popup>
            </CircleMarker>
        );
    }
}