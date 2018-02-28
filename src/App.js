import React, { Component } from 'react';
import books from './data/dataset.json';
import countries from './data/countries.geo.json';
import Data from './Data';
import Dropdown from './Dropdown';
import Selection from './Selection';
import InputRange from 'react-input-range';
import { Map, TileLayer, Popup, GeoJSON, CircleMarker} from 'react-leaflet';
import { mapValuesYear, mapValues, uniqueValues, sliceByFilter, download, getCountryId } from './util';
import './App.css';
import json2csv from 'json2csv';
import assets from './assets.js';
import Chart from './Chart'
import 'react-input-range/lib/css/index.css';

const zoom_threshold = 5;
const pageSize = 10;

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

    let yearsObj = mapValuesYear(books, "year");
    delete yearsObj[0];
    let years = Object.keys(yearsObj);
    console.log(years);
    let data = [];
    


    this.minYear = Math.min.apply(Math, years);
    this.maxYear = Math.max.apply(Math, years);


    for(let year = this.minYear; year < this.maxYear + 1; year++) {
        data.push({name:year, value:(yearsObj[year]?yearsObj[year]:0)});
    }

    this.state = {
      filter: [{key:"genre", value:"Todos"}, 
               {key:"language", value:"Todos"}, 
               {key:"country", value:"Todos"}, 
               {key:"city", value:"Todos"}],
      slice: books,
      chartData: data,
      lat: 0.0,
      lng: 0.0,
      zoom: 3,
      index: 0,
      isLoggedIn: false,
      pos: 0,
      showData: false,
      value:{ min: this.minYear, max: this.maxYear },
      currentPage:1,
    }
  }

  componentDidMount() {
    const leafletMap = this.leafletMap.leafletElement;

    console.log("Inside component did mount.");

    this.updateSlice();

    leafletMap.on('zoomend', () => {
      this.setState({zoom:leafletMap.getZoom()});
    });
    this.updateDimensions();
    window.addEventListener("resize", this.updateDimensions.bind(this));
  }

  updateDimensions(){
    let update_width  = window.innerWidth;
    let update_height = window.innerHeight;
    this.setState({ width: update_width, height: update_height });
  }


  /**
   * Gets called when the selection is changed.
   */
  handleChange(parent, event) {
    this.setValueFromType(parent, event.target.value);
  }

  handleClick(parent) {
    this.setValueFromType(parent, "Todos");
  }

  handleDownload(parent) {
    let fields = ["title","genre","country","city","year","language"];
    let csv = json2csv({ data: this.state.slice, fields: fields });
    download(csv, "datos.csv", "text/csv");
  }

  handleOnZoomLevelsChange(event) {
    if(this.state.zoom < zoom_threshold) {
      this.setValueFromType("country", "Todos");
    }
  }

  handleSliderChange(value) {
    this.setState({value:value});
    console.log(this.state.value);
    this.updateSlice();
  }

  handleMarkerClick(type, value) {
    if(this.state.zoom < zoom_threshold) {
      this.setState({zoom:zoom_threshold});
    }
    this.setState({lat:value.position[0]});
    this.setState({lng:value.position[1]});
    this.setValueFromType(type, value.name);
  }

  handleNextPage(page) {
    this.setState({currentPage:page});
  }

  handleMenu() {
    console.log("Handle Menu was clicked");
    let value = !this.state.showData;
    this.setState({showData:value});
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
    let copy = JSON.parse(JSON.stringify(countries))
    copy.features = [];
    for(let i = 0; i < countries.features.length; i++) {
      if(tokens.indexOf(countries.features[i].id) > -1) {
            copy.features.push(JSON.parse(JSON.stringify(countries.features[i])));
      }
    }
    return copy;
  }

  /**
  The filter object is copied and the value that is accessed is updated,
  the slice with the filter in the information is updated as well.
  **/
  setValueFromType(type, value) {
    let helper = this.state.filter.slice();
    let changed = false;
    helper.forEach(function(option){
      if(option.key === type) {
        option.value = value;
        changed =  true;
      }
    });
    this.setState({filter:helper});

    console.log(this.state.filter);

    if(changed){
      // Maybe this shouldn't happend every time the filter changes?
      // Now I only do it if the selection actualy changed.
      this.updateSlice();
    }
  }

  updateSlice() {
    let newSlice = sliceByFilter(books, this.state.filter, this.state.value);
    this.setState({slice:newSlice, currentPage:1});
  }

  renderGeoJsonLayers() {
    let layers = [];
    this.filterCountries().features.forEach(feature => {
        layers.push(<GeoJSON key={ feature.id } data={ feature } style={this.getStyle}/>);
    });
    return layers;
  }

  renderDropdown(type) {
    return <Dropdown options={mapValues(this.state.slice, type)} 
                     selectedOption={this.getValueFromType(type)} 
                     type={type}
                     onChange={(event)=>this.handleChange(type,event)}/>
           
  }


  renderSelection(type) {

    return <Selection value={this.getValueFromType(type)} 
                      onClick={()=>this.handleClick(type)}/>
  }

  renderCities() {
    let markers = [];
    let zoomLevel = this.state.zoom;
    let type = null;
    if(zoomLevel < zoom_threshold) {
      //console.log("Display by country.");
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
      markers = countries;
    }
    else {
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

    return values.map((value, index) => 
      <CircleMarker key={ index } 
                    center={ value.position } 
                    radius={ Math.log(value.count) * 3 + 3 }
                    onClick={(e) => this.handleMarkerClick(type, value)} >
        <Popup>
          <span>{value.name} <br/> {value.count}</span>
        </Popup>
      </CircleMarker>
    );
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
    let width = container.offsetWidth;

    pos = pos + 3;
    this.setState({pos:pos});

    if(pos > width) {
      clearInterval(this.timerID);
      this.setState({isLoggedIn: false});
      this.setState({pos:0});
    }
  }

  renderEasterEgg(event){
    let codes = [38,38,40,40,37,39,37,39,65,66];
    let index = this.state.index;
    if(codes[index] === event.keyCode){
      index = index + 1;
      this.setState({index:index});
      if(!(index < codes.length)){
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
      <div tabIndex="0" onKeyDown={(d) => this.renderEasterEgg(d)}>
        <div className="App-map-and-controls">
          <Map className="App-map" 
               ref={map => { this.leafletMap = map; }} 
               center={position} 
               zoom={this.state.zoom} 
               maxZoom={15} 
               minZoom={3} 
               onZoom={(e)=>this.handleOnZoomLevelsChange(e)}>
              <TileLayer
                      attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
                      url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'
                    />
                  {this.renderCities()}
          </Map>
          <div className="App-dropdown mycontainer vertical">
            {this.renderDropdown("genre")}
            {this.renderDropdown("language")}
            {this.renderDropdown("country")}
            {this.renderDropdown("city")}
          </div>
          <div className="App-slider mycontainer">
            <Chart data={this.state.chartData}
                value={this.state.value}/>
            <InputRange
              minValue={this.minYear}
              maxValue={this.maxYear}
              value={this.state.value}
              onChange={value => this.handleSliderChange(value)} />
          </div>
          <div className="App-hamburger" onClick={()=> this.handleMenu()}>
             <span>*</span>
          </div>
          <div className="App-selection mycontainer">
            {this.renderSelection("genre")}
            {this.renderSelection("language")}
            {this.renderSelection("country")}
            {this.renderSelection("city")}
          </div>
        </div>
        <div className={"App-data" + (this.state.showData?"":" hide-data")}>
          <Data data={this.state.slice} 
            handleDownload={this.handleDownload.bind(this)}
            handleNextPage={this.handleNextPage.bind(this)}
            pageSize={pageSize}
            currentPage={this.state.currentPage}/>
        </div>
        
        {easterEgg}
      </div>
    );
  }
}

export default App;
