import React, { Component } from 'react';
import books from './data/dataset.json';
import countries from './data/countries.geo.json';
import Data from './Data';
import Dropdown from './Dropdown';
import Selection from './Selection';
import { Map, TileLayer, Marker, Popup, Polygon, GeoJSON, CircleMarker} from 'react-leaflet';
import { uniqueValues, sliceByFilter, download, getCountryId } from './util';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      filter: [{key:"year", value:"Todos"}, 
              {key:"genre", value:"Todos"}, 
              {key:"language", value:"Todos"}, 
              {key:"country", value:"Todos"}, 
              {key:"city", value:"Todos"}],
      slice: books,
      lat: 0.0,
      lng: 0.0,
      zoom: 1,
    }
  }
  handleChange(parent, event) {
    //console.log("Hello change from " + parent + "!");
    //console.log(event.target.value);
    this.setValueFromType(parent, event.target.value);
  }

  handleClick(parent) {
    //console.log("Hello change from " + parent + "!");
    this.setValueFromType(parent, "Todos");
  }

  handleDownload(parent) {
    //console.log("Download " + parent + "!");
    download(JSON.stringify(this.state.slice, null, 4), "datos.json", "application/json");
  }

  getValueFromType(type) {
    let value = "Todos";
    this.state.filter.forEach(function(option){
      if(option.key === type) {
        value = option.value;
      }
    });
    return value;
  }

  filterCountries() {
    
    let tokens = uniqueValues(this.state.slice, "country").map(country => getCountryId(country));
    console.log(tokens);

    let copy = JSON.parse(JSON.stringify(countries))
    copy.features = [];

    for(let i = 0; i < countries.features.length; i++) {
      if(tokens.indexOf(countries.features[i].id) > -1) {

            copy.features.push(JSON.parse(JSON.stringify(countries.features[i])));
      }
    }
    console.log(copy);

    return copy;
  }
  renderGeoJsonLayers() {
    let layers = [];

    this.filterCountries().features.forEach(feature => {

        layers.push(<GeoJSON key={ feature.id } data={ feature } style={this.getStyle}/>);
    });

    return layers;
  }

  setValueFromType(type, value) {
    let helper = this.state.filter.slice()



    helper.forEach(function(option){
      if(option.key === type) {
        option.value = value;
      }
    });
    this.setState({filter:helper});
    this.setState({slice:sliceByFilter(books, this.state.filter)});
    
  }

  renderDropdown(type) {
    return <div>
               <label>{type}</label>
               <Dropdown options={uniqueValues(this.state.slice, type)} selectedOption={this.getValueFromType(type)} onChange={(event)=>this.handleChange(type,event)}/>
           </div>;
  }

  renderSelection(type) {

    return <div className={"selection-option " + (this.getValueFromType(type)==="Todos"?"Hid":"Vis")}>
              <Selection value={this.getValueFromType(type)} onClick={()=>this.handleClick(type)}/>
           </div>;
  }

  renderCities() {
    let layers = [];

    this.state.slice.forEach((feature, index) => {

        layers.push(<CircleMarker key={ index } center={ [feature.lat, feature.lng]} radius={1} />);
    });

    return layers;
  }

  getStyle(feature, layer) {
    return {
      color: '#006400',
      weight: 1,
      opacity: 0.65
    }
  }

  render() {
    const position = [this.state.lat, this.state.lng];

    return (
      <div>
        <header className="App-header">
          <h1>Traducciones literarias</h1>
        </header>
        <div className="App-content">
          <div className="controls">
            <div>
              <Map center={position} zoom={this.state.zoom}>
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  />
                {this.renderGeoJsonLayers()}
                {this.renderCities()}
              </Map>
            </div>
            <div className="App-dropdown">
              {this.renderDropdown("year")}
              {this.renderDropdown("genre")}
              {this.renderDropdown("language")}
              {this.renderDropdown("country")}
              {this.renderDropdown("city")}
            </div>
            <div className="App-selection">
              {this.renderSelection("year")}
              {this.renderSelection("genre")}
              {this.renderSelection("language")}
              {this.renderSelection("country")}
              {this.renderSelection("city")}
            </div>
          </div>
          <div className="data">
            <button onClick={()=>this.handleDownload("json")}>Descargar json</button>
            <Data data={this.state.slice}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
