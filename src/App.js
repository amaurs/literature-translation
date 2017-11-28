import React, { Component } from 'react';
import logo from './logo.svg';
import myData from './data/dataset.json';
import './App.css';

class App extends Component {
  render() {
    console.log(myData);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          This is the first difference to the code.
        </p>
      </div>
    );
  }
}

export default App;
