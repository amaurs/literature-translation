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
    console.log("Hello change from " + parent + "!");
    console.log(event.target.value);
    this.setValueFromType(parent, event.target.value);
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
               <Dropdown options={uniqueValues(books, type)} selectedOption={this.getValueFromType(type)} onChange={(event)=>this.handleChange(type,event)}/>
           </div>;
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
          <Selection options={this.state.filter}/>
        </div>
        <div className="data">
          <Data data={sliceByFilter(books, this.state.filter)}/>
        </div>
      </div>
    );
  }
}

export default App;
