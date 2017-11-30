import React, { Component } from 'react';
import logo from './logo.svg';
import myData from './data/dataset.json';
import Data from './Data';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slice : myData,
    }

  }
  render() {
    console.log(myData);
    return (
      <div>
        <div className="controls">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            This is the first difference to the code.
          </p>
        </div>
        <div className="data">
          <Data data={this.state.slice}/>
        </div>
      </div>
    );
  }
}

export default App;
