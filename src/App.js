import React, { Component } from 'react';
import books from './data/dataset.json';
import countries from './data/countries.geo.json';
import Data from './Data';
import Dropdown from './Dropdown';
import Selection from './Selection';
import { Map, TileLayer, Marker, Popup, Polygon, GeoJSON} from 'react-leaflet';
import { uniqueValues, sliceByFilter, download } from './util';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    console.log(countries);
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
          <h1>Traducciónes literarias</h1>
        </header>
        <div className="App-content">
          <div className="controls">
            <div>
              <Map center={position} zoom={this.state.zoom}>
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                  />
                <GeoJSON data={countries} style={this.getStyle} />
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
