import React, { Component } from 'react';
import Data from './Data';
import Dropdown from './Dropdown';
import CitiesLayer from './CitiesLayer';
import Selection from './Selection';
import InputRange from 'react-input-range';
import { Map, TileLayer } from 'react-leaflet';
import { extractContent, mapValuesYear, mapValues, sliceBySelection, download } from './util';
import './App.css';
import json2csv from 'json2csv';
import assets from './assets.js';
import Chart from './Chart'
import 'react-input-range/lib/css/index.css';
import _ from 'lodash';
import { BounceLoader } from 'react-spinners';

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();
const zoom_threshold = 5;
const API = "https://amaurs.com/api"

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
      selection: [{key:"genre", value:"Todos"}, 
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
      value:{ min: 1886, max: 2018 },
      currentPage:1,
      isLoading:true,
    }
    this.handleMarkerClick = this.handleMarkerClick.bind(this);
    this.updateSliceDebounced = _.debounce(this.updateSlice,250);
  }

  componentDidMount() {
    fetch(API)
      .then(response => response.json())
      .then(data => {
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions.bind(this));
        let newData = data.map(element => {
          let row = {};
          row.author = element.AUTOR == null?"S.D.":entities.decode(element.AUTOR);
          row.language = element.Lengua == null?"S.D.":element.Lengua;
          row.title = element.TITULO_TRADUCCION == null?"S.D.":element.TITULO_TRADUCCION;
          row.original_title = element.TITULO_ORIGINAL == null?"S.D.":element.TITULO_ORIGINAL;
          row.publisher = element.EDITORIALES == null?"S.D.":entities.decode(element.EDITORIALES);
          row.year = element.ANIO == null?"S.D.":element.ANIO;
          row.city = element.CIUDAD == null?"S.D.":element.CIUDAD;
          row.genre = element.GENERO == null?"S.D.":element.GENERO;
          row.lat = element.CIUDAD_LATITUD == null?0:element.CIUDAD_LATITUD;
          row.lng = element.CIUDAD_LONGITUD == null?0:element.CIUDAD_LONGITUD;
          row.country = element.PAIS == null?"S.D.":element.PAIS;
          row.lat_country = element.PAIS_LATITUD == null?0:element.PAIS_LATITUD;
          row.lng_country = element.PAIS_LONGITUD == null?0:element.PAIS_LONGITUD;
          row.url_title = element.URL_TRADUCCION == null?0:element.URL_TRADUCCION;
          row.title_plus_url = row.title + "|" + row.url_title;
          row.translator =  element.TRADUCTORES == null?"S.D.":entities.decode(element.TRADUCTORES);
          return row;
        });




        this.setState({isLoading:false, 
                       books:newData});

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

  handleYearClick(parent) {
    console.log("Reset years.");
    this.resetSliceYear();
    this.updateSliceDebounced();
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
    let fields = ["title",
                  "translator",
                  "original_title",
                  "author",
                  "country",
                  "city",
                  "publisher",
                  "year",
                  "language",
                  "genre"];
    let copy = this.state.slice.map(function(element){
      let elementCopy = {};
      elementCopy["title"] = extractContent(element["title"]);
      elementCopy["translator"] = extractContent(element["translator"]);
      elementCopy["original_title"] = extractContent(element["original_title"]);
      elementCopy["author"] = extractContent(element["author"]);
      elementCopy["country"] = element["country"];
      elementCopy["city"] = element["city"];
      elementCopy["publisher"] = element["publisher"];
      elementCopy["year"] = element["year"];
      elementCopy["language"] = element["language"];
      elementCopy["genre"] = element["genre"];
      return elementCopy;
    });
    let csv = json2csv({ data: copy, fields: fields });
    download(csv, "datos.csv", "text/csv");
  }

  handleOnZoomLevelsChange(event) {
    if(this.state.zoom < zoom_threshold) {
      this.setValueFromType("country", "Todos");
    }
  }

  handleSliderChange(value) {
    this.setState({value:value});
    this.updateSliceDebounced();
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
    return this.state.selection.filter(option => option.key === type)
                               .map(option    => option.value)
                               .reduce(value  => value);
  }

  /**
  The selection object is copied and the value that is accessed is updated,
  the slice with the selection in the information is updated as well.
  **/
  setValueFromType(type, value) {
    let helper = this.state.selection.slice();
    let changed = false;
    helper.forEach(function(option){
      if(option.key === type) {
        option.value = value;
        changed =  true;
      }
    });

    this.setState({selection:helper});
    if(changed){
      // Maybe this shouldn't happend every time the selection changes?
      // Now I only do it if the selection actualy changed.
      this.updateSliceDebounced();
    }
  }

  resetSliceYear() {
    this.setState({value:{ min: 1886, max: 2018 }});
  }

  updateSlice() {
    console.log("Updating slice");
    let books = this.state.books;
    let newSlice = sliceBySelection(books, this.state.selection, this.state.value);
    
    let yearsObj = mapValuesYear(newSlice, "year");
    delete yearsObj[0];
    let years = Object.keys(yearsObj);
    let chartData = [];
    let minYear = Math.min.apply(Math, years);
    let maxYear = Math.max.apply(Math, years);

    for(let year = minYear; year < maxYear + 1; year++) {
      chartData.push({name:year, value:(yearsObj[year]?yearsObj[year]:0)});
    }


    this.setState({slice:newSlice, 
                   currentPage:1, 
                   chartData:chartData, 
                   maxYear:maxYear, 
                   minYear:minYear,
                   value:{ min: minYear, max: maxYear }});
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

  renderYearSelection() {

    return <Selection value={"Reestablecer años"} 
                      onClick={()=>this.handleYearClick()}/>
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
      return <div className='App-spinner'>
               <BounceLoader color='#3388ff' />
             </div>
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
            <p className="App-slider-range">{this.state.value.min + "-" + this.state.value.max}</p>
            <Chart 
              data={this.state.chartData}
              value={this.state.value}/>
            <InputRange
              minValue={this.state.minYear}
              maxValue={this.state.maxYear}
              formatLabel={value => ""}
              value={this.state.value}
              onChange={value => this.handleSliderChange(value)} />
          </div>
          <div className="App-burger">
            <button className="button is-danger is-fullwidth"   
                    onClick={()=>this.handleMenu()}>{(this.state.hideData?"Datos":"Mapa")}</button>
            <button className="button is-danger is-fullwidth"   
                    onClick={()=>this.handleModal()}>Acerca de</button>
          </div>
          <div className="App-selection mycontainer">
            {this.renderSelection("genre")}
            {this.renderSelection("language")}
            {this.renderSelection("country")}
            {this.renderSelection("city")}
            {this.renderYearSelection()}
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
              <p className="modal-card-title">Acerca de</p>
              <button className="delete" aria-label="close" onClick={()=>this.handleModal()}></button>
            </header>
            <section className="modal-card-body content">
              <p>La siguiente <span class="is-italic">puesta en mapa</span> permite observar las maneras en que la literatura de México ha sido traducida, en el último siglo y medio, a las lenguas de otros espacios literarios del mundo.</p>
              <p>Cuando menos 367 lenguas –364 indígenas u originarias, 2 romances (español y véneto) y 1 criolla (mascogo)–, conforman el espacio lingüístico nacional; sin embargo, en México sólo han sido reconocidas las lenguas indígenas (en fecha muy reciente) y el español, como lenguas nacionales. </p>
              <p>Por su parte, el español ha sido la lengua de la que ha derivado la mayoría de las obras que conforman la literatura escrita del país y es, por esta razón, la principal lengua fuente de la <span class="is-italic">extraducción</span> literaria (exportación de los textos de un espacio lingüístico nacional a las lenguas de otras naciones).</p>
              <p>El corpus se encuentra en constante crecimiento. Incluye una cantidad significativa de títulos, autores/as, traductores/as, editoriales, lugares de edición y lenguas meta. Aspira a abarcar la totalidad de las lenguas a las que se han vertido las obras literarias de México.</p>
              <p>Por primera vez, contaremos con una visión de conjunto capaz de mostrar, a medida que se enriquezca, un aspecto de la difusión de nuestras letras y el grado de contacto, a través del libro, entre los agentes de las <span class="is-italic">comunidades orales</span>, las <span class="is-italic">ciudades letradas</span> y la <span class="is-italic">República mundial de las Letras</span>, desde la perspectiva de la extraducción.</p>
              <p>Bajo las coordenadas de espacio y tiempo, se ha elegido el término de puesta en mapa, en analogía de la puesta en página, noción con que se suele aludir a la manera en que se plasma un texto en las páginas de un libro.</p>
              <p><span class="is-italic">Con la Puesta en mapa: la literatura de México en lenguas nacionales a través de sus traducciones</span>, la ELEM se sitúa en el horizonte de las Humanidades Digitales y comienza el largo camino que buscará desembocar en un <span class="is-italic">Atlas de la literatura en México.</span></p>
              <ul>
                <li class="has-text-weight-semibold">Roberto González</li>
                <li>Coordinador de catalogación</li>
              </ul>
              <ul>
                <li class="has-text-weight-semibold">Julio César Cardoso</li>
                <li>Programador</li>
              </ul>
              <ul>
                <li class="has-text-weight-semibold">Amaury Gutiérrez </li>
                <li>Desarrollador</li>
              </ul>
              <ul>
                <li class="has-text-weight-semibold">Silvia Eunice Gutiérrez de la Torre</li>
                <li>Coordinadora</li>
                <li>Atlas de la literatura en México</li>
              </ul>
              <ul>
                <li class="has-text-weight-semibold">Jorge Mendoza Romero</li>
                <li>Coordinador general</li>
                <li>Enciclopedia de la literatura en México</li>
              </ul>
            </section>
          </div>
        </div>
        {easterEgg}
      </div>
    );
  }
}

export default App;
