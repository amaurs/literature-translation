import React, { Component } from 'react';
import books from './data/dataset.json';
import countries from './data/countries.geo.json';
import Data from './Data';
import Dropdown from './Dropdown';
import Selection from './Selection';
import { Map, TileLayer, Popup, GeoJSON, CircleMarker} from 'react-leaflet';
import { uniqueValues, sliceByFilter, download, getCountryId } from './util';
import './App.css';
import assets from './assets.js';

function EasterEgg(props){
    let easterStyle = {
      WebkitTransform: 'translateX(' + props.pos + 'px)',
      MozTransform: 'translateX(' +props.pos + 'px)'
    };
    return (
        <div className="EasterEgg" style={easterStyle}><img alt="" src={assets[props.image]}/></div>
    );
}

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
      zoom: 4,
      index: 0,
      isLoggedIn: false,
      pos: 0,
    }
  }

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.on('zoomend', () => {
      this.setState({zoom:leafletMap.getZoom()});
      //console.log('Current zoom level -> ', this.state.zoom);
    });
    
  }
  /**
   * Gets called when the selection is changed.
   */
  handleChange(parent, event) {
    //console.log("Hello change from " + parent + "!");
    //console.log(event.target.value);
    this.setValueFromType(parent, event.target.value);
    //console.log('Current zoom level -> ', this.state.zoom);
  }

  handleClick(parent) {
    //console.log("Hello change from " + parent + "!");
    this.setValueFromType(parent, "Todos");
  }

  handleDownload(parent) {
    //console.log("Download " + parent + "!");
    download(JSON.stringify(this.state.slice, null, 4), "datos.json", "application/json");
  }

  handleOnZoomLevelsChange(event) {
    //console.log("Zoom level was changed.");
    //console.log(event);
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
    //console.log(tokens);
    let copy = JSON.parse(JSON.stringify(countries))
    copy.features = [];
    for(let i = 0; i < countries.features.length; i++) {
      if(tokens.indexOf(countries.features[i].id) > -1) {

            copy.features.push(JSON.parse(JSON.stringify(countries.features[i])));
      }
    }
    //console.log(copy);
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
               <Dropdown options={uniqueValues(this.state.slice, type)} 
                         selectedOption={this.getValueFromType(type)} 
                         onChange={(event)=>this.handleChange(type,event)}/>
           </div>;
  }

  renderSelection(type) {

    return <div className={"selection-option " + (this.getValueFromType(type)==="Todos"?"Hid":"Vis")}>
              <Selection value={this.getValueFromType(type)} 
                         onClick={()=>this.handleClick(type)}/>
           </div>;
  }

  renderCities() {
    let markers = [];
    let zoomLevel = this.state.zoom;
    let type = null;
    if(zoomLevel < 5) {
      console.log("Display by country.");
      type = "country";
      let countries = {};
      this.state.slice.forEach((feature, index) => {
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
      console.log(countries);
      markers = countries;
    }
    else {
      console.log("Display by city");
      let cities = {};
      type = "city";
      this.state.slice.forEach((feature, index) => {
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
    console.log(values);

    return values.map((value, index) => 
        <CircleMarker key={ index } 
                      center={ value.position } 
                      radius={ Math.log(value.count) * 3 + 3 }
                      onClick={(e) => this.setValueFromType(type, value.name)} >
          <Popup>
            <span>{value.name} <br/> {value.count}</span>
          </Popup>
        </CircleMarker>
    );
    //return <MarkerClusterGroup markers={markers} />;
  }

  getStyle(feature, layer) {
    return {
      color: '#006400',
      weight: 1,
      opacity: 0.65
    }
  }

  tick(){
    let pos = this.state.pos;
    let container = document.body;
    console.log(container.offsetHeight);
    let width = container.offsetWidth;

    pos = pos + 3;
    this.setState({pos:pos});

    if(pos > width) {
      clearInterval(this.timerID);
      this.setState({isLoggedIn: false});
      this.setState({pos:0});
    }
    console.log(pos);
  }

  add(event){
    let codes = [38,38,40,40,37,39,37,39,65,66];
    let index = this.state.index;
    console.log(index);
    //console.log(event.keyCode);
    if(codes[index] === event.keyCode){
      index = index + 1;
      this.setState({index:index});
      if(!(index < codes.length)){
        console.log("Unlocked!");
        this.setState({index:0});
        this.setState({isLoggedIn: true});
        clearInterval(this.timerID);
        this.setState({pos:0});
        this.timerID = setInterval(
            () => this.tick(), 
            17
        );
      }
    }
    else {
      this.setState({index:0});
    }

  }

  render() {
    const position = [this.state.lat, this.state.lng];
    const isLoggedIn = this.state.isLoggedIn;
    let easterEgg = null;

    if (isLoggedIn) {
      let pos = this.state.pos;
      easterEgg =  <EasterEgg image={"easterImage"} pos={pos}/>
    }
    return (
      <div tabIndex="0" onKeyDown={(d) => this.add(d)}>
        <header className="App-header">
          <h1>Traducciones literarias</h1>
        </header>
        <Map className="App-map" 
             ref={map => { this.leafletMap = map; }} 
             center={position} 
             zoom={this.state.zoom} 
             maxZoom={15} >
            <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  />
                {
                //this.renderGeoJsonLayers()
                }
                {this.renderCities()}
        </Map>
        <div className="App-dropdown container">
          {this.renderDropdown("year")}
          {this.renderDropdown("genre")}
          {this.renderDropdown("language")}
          {this.renderDropdown("country")}
          {this.renderDropdown("city")}
        </div>
        <div className="App-selection container">
          {this.renderSelection("year")}
          {this.renderSelection("genre")}
          {this.renderSelection("language")}
          {this.renderSelection("country")}
          {this.renderSelection("city")}
        </div>
        <div className="App-data container">
          <button onClick={()=>this.handleDownload("json")}>Descargar json</button>
          <Data data={this.state.slice}/>
        </div>
        {easterEgg}
      </div>
    );
  }
}

export default App;
