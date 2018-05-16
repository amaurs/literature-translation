import React from 'react';
import { CircleMarker, Popup} from 'react-leaflet';

export default class CitiesLayer extends React.Component {
    render() {
        
        let zoomLevel = this.props.zoom;
        let markers = {};
        let type = null;
        if(zoomLevel < this.props.zoom_threshold) {
          type = "country";
        }
        else {
          type = "city";
        }
        this.props.slice.forEach((feature, index) => {
          if(markers.hasOwnProperty(feature[type])) {
            let aux = {
                   name: feature[type],
                   position: [feature.lat, feature.lng], 
                   count: markers[feature[type]].count + 1};
            markers[feature[type]] = aux;
          }
          else {
            let aux = {
                   name: feature[type],
                   position: [feature.lat, feature.lng], 
                   count: 1};
            markers[feature[type]] = aux;
          }
        });

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