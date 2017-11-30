import React, { Component } from 'react';
import logo from './logo.svg';
import books from './data/dataset.json';
import Data from './Data';
import Dropdown from './Dropdown';
import Selection from './Selection';
import {uniqueValues, sliceByFilter} from './util';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filter:[{key:"year", value:"Todos"}, 
              {key:"genre", value:"Todos"}, 
              {key:"language", value:"Todos"}, 
              {key:"country", value:"Todos"}, 
              {key:"city", value:"Todos"}]
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

  getValueFromType(type) {
    let value = "Todos";
    this.state.filter.forEach(function(option){
      if(option.key == type) {
        value = option.value;
      }
    });
    return value;
  }

  setValueFromType(type, value) {
    let helper = this.state.filter.slice()


    helper.forEach(function(option){
      if(option.key == type) {
        option.value = value;
      }
    });
    this.setState({filter:helper});
  }

  renderDropdown(type) {
    return <div>
               <label>{type}</label>
               <Dropdown options={uniqueValues(sliceByFilter(books, this.state.filter), type)} selectedOption={this.getValueFromType(type)} onChange={(event)=>this.handleChange(type,event)}/>
           </div>;
  }

  renderSelection(type) {
    return <Selection value={this.getValueFromType(type)} onClick={()=>this.handleClick(type)}/>;
  }

  render() {

    return (
      <div>
        <div className="controls">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          {this.renderDropdown("year")}
          {this.renderDropdown("genre")}
          {this.renderDropdown("language")}
          {this.renderDropdown("country")}
          {this.renderDropdown("city")}
          <div className="selection-option">
            {this.renderSelection("year")}
            {this.renderSelection("genre")}
            {this.renderSelection("language")}
            {this.renderSelection("country")}
            {this.renderSelection("city")}
          </div>
        </div>
        <div className="data">
          <Data data={sliceByFilter(books, this.state.filter)}/>
        </div>
      </div>
    );
  }
}

export default App;
