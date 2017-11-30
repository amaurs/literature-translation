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
      filter:[{key:"year", value:"1900"}, 
              //{key:"genre", value:"Ensayo"}, 
              //{key:"language", value:"Inglés"}, 
              {key:"country", value:"México"}, 
              {key:"city", value:"Guadalajara"}]
    }
  }
  render() {
    return (
      <div>
        <div className="controls">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <Dropdown options={uniqueValues(books, "year")}/>
          <Dropdown options={uniqueValues(books, "genre")}/>
          <Dropdown options={uniqueValues(books, "language")}/>
          <Dropdown options={uniqueValues(books, "country")}/>
          <Dropdown options={uniqueValues(books, "city")}/>
          <Selection options={this.state.filter}/>
        </div>
        <div className="data">
          <Data data={sliceByFilter(books,this.state.filter)}/>
        </div>
      </div>
    );
  }
}

export default App;
