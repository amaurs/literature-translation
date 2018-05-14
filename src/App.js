import React, { Component } from 'react';
import countries from './data/countries.geo.json';
import Data from './Data';
import Dropdown from './Dropdown';
import CitiesLayer from './CitiesLayer';
import Selection from './Selection';
import InputRange from 'react-input-range';
import { Map, TileLayer } from 'react-leaflet';
import { mapValuesYear, mapValues, uniqueValues, sliceByFilter, download, getCountryId } from './util';
import './App.css';
import json2csv from 'json2csv';
import assets from './assets.js';
import Chart from './Chart'
import 'react-input-range/lib/css/index.css';

const zoom_threshold = 5;
const API = "http://45.33.126.223:3000"

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
      filter: [{key:"genre", value:"Todos"}, 
               {key:"language", value:"Todos"}, 
               {key:"country", value:"Todos"}, 
               {key:"city", value:"Todos"}],
      slice: null,
      books: null,
      searchKey: "",
      chartData: null,
      lat: 0.0,
      lng: 0.0,
      zoom: 3,
      index: 0,
      minYear:0,
      maxYear:2000,
      isLoggedIn: false,
      pos: 0,
      modal: false,
      hideData: true,
      value:{ min: 0, max: 2000 },
      currentPage:1,
      isLoading:true,
    }
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
     
  }

  componentDidMount() {
    fetch(API)
      .then(response => response.json())
      .then(data => {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
        let newData = data.map(element => {
          let row = {};
          row.author = element.AUTOR == null?"X":element.AUTOR;
          row.language = element.LENGUA == null?"X":element.LENGUA;
          row.title = element.TITULO == null?"X":element.TITULO;
          row.publisher = element.EDITORIAL == null?"X":element.EDITORIAL;
          row.year = element.ANIO == null?"X":element.ANIO;
          row.city = element.CIUDAD == null?"X":element.CIUDAD;
          row.genre = element.GENERO == null?"X":element.GENERO;
          row.lat = element.CIUDAD_LATITUD == null?0:element.CIUDAD_LATITUD;
          row.lng = element.CIUDAD_LONGITUD == null?0:element.CIUDAD_LONGITUD;
          row.country = element.PAIS == null?"X":element.PAIS;
          row.lat_country = element.PAIS_LATITUD == null?0:element.PAIS_LATITUD;
          row.lng_country = element.PAIS_LONGITUD == null?0:element.PAIS_LONGITUD;
          return row;
        });

        let yearsObj = mapValuesYear(newData, "year");
        delete yearsObj[0];
        let years = Object.keys(yearsObj);
        let chartData = [];
        let minYear = Math.min.apply(Math, years);
        let maxYear = Math.max.apply(Math, years);

        for(let year = minYear; year < maxYear + 1; year++) {
          chartData.push({name:year, value:(yearsObj[year]?yearsObj[year]:0)});
        }


        this.setState({isLoading:false, 
                       books:newData, 
                       chartData:chartData, 
                       maxYear:maxYear, 
                       minYear:minYear, 
                       value:{ min: minYear, max: maxYear }});

        
        this.updateSlice();

        const leafletMap = this.leafletMap.leafletElement;
        leafletMap.on('zoomend', () => {
          this.setState({zoom:leafletMap.getZoom()});
        });
      });
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

  handleModal(){
    let modal = !this.state.modal;
    console.log("Show modal: " + modal);
    this.setState({modal:modal});
  }

  handleSearch(event) {
    this.setState({searchKey:event.target.value});
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
    let value = !this.state.hideData;
    this.setState({hideData:value});
  }

  handleChangeZoom(zoom) {
    this.setState({zoom:zoom});
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
    if(changed){
      // Maybe this shouldn't happend every time the filter changes?
      // Now I only do it if the selection actualy changed.
      this.updateSlice();
    }
  }

  updateSlice() {
    let books = this.state.books;
    let newSlice = sliceByFilter(books, this.state.filter, this.state.value);
    this.setState({slice:newSlice, currentPage:1});
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
    const {isLoggedIn, isLoading, slice} = this.state;
    let easterEgg = null;
    
    if (isLoading || slice == null) {
      return <p>Descargando la información desde el servidor...</p>
    }

    if (isLoggedIn) {
      let pos = this.state.pos;
      easterEgg =  <EasterEgg image={"easterImage"} pos={pos}/>
    }

    return (
      <div tabIndex="0" onKeyDown={(d) => this.renderEasterEgg(d)}>
        <div className="App-map-and-controls">
          <Map 
            className="App-map" 
            ref={map => { this.leafletMap = map; }} 
            center={position} 
            zoom={this.state.zoom} 
            maxZoom={15} 
            minZoom={3} 
            onZoom={(e)=>this.handleOnZoomLevelsChange(e)}>
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
              url='https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}' />
            <CitiesLayer 
              zoom={this.state.zoom}
              slice={this.state.slice}
              handleMarkerClick={this.handleMarkerClick}
              zoom_threshold={zoom_threshold}
              handleChangeZoom={this.handleChangeZoom} />
          </Map>
          <div className="App-dropdown mycontainer vertical">
            {this.renderDropdown("genre")}
            {this.renderDropdown("language")}
            {this.renderDropdown("country")}
            {this.renderDropdown("city")}
          </div>
          <div className="App-slider mycontainer">
            <Chart 
              data={this.state.chartData}
              value={this.state.value}/>
            <InputRange
              minValue={this.state.minYear}
              maxValue={this.state.maxYear}
              value={this.state.value}
              onChange={value => this.handleSliderChange(value)} />
          </div>
          <div className="App-burger">
            <button className="button is-danger"   
                    onClick={()=>this.handleMenu()}>Información</button>
            <button className="button is-danger"   
                    onClick={()=>this.handleModal()}>Acerca de</button>
          </div>
          <div className="App-selection mycontainer">
            {this.renderSelection("genre")}
            {this.renderSelection("language")}
            {this.renderSelection("country")}
            {this.renderSelection("city")}
          </div>
        </div>
        <div className={"App-data" + (this.state.hideData?" hide-data":"")}>
          <div className="App-buttons"> 
            <button 
              className="button is-danger"   
              onClick={()=>this.handleDownload()}>Descargar csv</button>
          </div>
          <div className="field">
            <label className="label">Búsqueda</label>
            <div className="control">
              <input className="input" 
                     type="text" 
                     placeholder="Filtro" 
                     onChange={(e)=>this.handleSearch(e)} />
            </div>
          </div>
          <Data 
            data={this.state.slice} 
            searchKey={this.state.searchKey.toLowerCase()} />
        </div>
        <div className={"modal" + (this.state.modal?" is-active":"")}>
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Modal title</p>
              <button className="delete" aria-label="close" onClick={()=>this.handleModal()}></button>
            </header>
            <section className="modal-card-body">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut eleifend tristique turpis, ut congue ipsum elementum eget. Nam luctus, tortor ac mollis rhoncus, turpis dolor porta quam, ut hendrerit leo erat eget dui. Donec quis ex venenatis, dapibus nibh id, tincidunt urna. Ut posuere lacinia eleifend. Sed vel enim at eros suscipit blandit. Quisque consectetur purus at tortor suscipit, ac feugiat erat fringilla. Nam massa sem, placerat in gravida ac, condimentum at arcu. Phasellus non iaculis arcu. Maecenas vulputate et magna sed auctor. Duis eu nisl et nunc ullamcorper consectetur. Nam condimentum eros eu vestibulum vestibulum. Nullam a tempus velit, sed lacinia leo. Nunc lectus elit, pharetra id sem sed, hendrerit lacinia mi. Fusce tincidunt quam non nisi tempus imperdiet. Donec tincidunt velit et sapien placerat, sit amet convallis diam condimentum. Pellentesque maximus vehicula diam sit amet fringilla.
              Donec malesuada, ipsum sit amet viverra efficitur, nunc felis scelerisque neque, eu euismod sem nisi vel velit. Curabitur blandit posuere ipsum in finibus. Morbi mauris ligula, finibus ac scelerisque nec, tristique at libero. Aliquam bibendum dolor odio, ac rutrum quam vehicula ac. Proin feugiat non nisl eget elementum. Nulla ex elit, commodo vitae hendrerit a, lacinia in nibh. Donec molestie ex non sagittis tristique. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Cras tristique tristique finibus. Maecenas elementum pharetra turpis, et efficitur justo interdum et. Maecenas tristique vulputate pharetra. Sed eleifend sapien quis diam ornare convallis. Mauris quis vulputate magna. Cras molestie lorem nisi, vel euismod nunc rutrum luctus. Mauris non pretium erat, non gravida mauris.
            </section>
          </div>
        </div>
        {easterEgg}
      </div>
    );
  }
}

export default App;
