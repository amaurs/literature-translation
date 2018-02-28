import React from 'react';
import './Dropdown.css';

class Dropdown extends React.Component {
    render() {

        let myArray = Object.keys(this.props.options).sort();
        const items = myArray.map((option, index) => 
                <Option key={index} value={option} size={this.props.options[option]}/>
            );

        let icon = "fa-";

        switch (this.props.type) {
          case "year":
            icon = icon + "calendar";
            break;
          case "genre":
            icon = icon + "book";
            break;
          case "language":
            icon = icon + "language";
            break;
          case "country":
            icon = icon + "globe";
            break;
          case "city":
            icon = icon + "building";
            break;
          default:
            icon = icon + "chain-broken";
            break;
        }

        return <div className="field has-addons">
                <div className="Dropdown-control control ">
                  <span className="icon Dropdown-icon"><i className={"fas " + icon}></i></span>
                  <select className="select Dropdown-select is-four-fifths" value={this.props.selectedOption} 
                          onChange={(event)=>this.props.onChange(event)}>{items}
                  </select>
                  
                </div>
               </div>
    }
}

function Option(props) {
    return (
        <option value={props.value}>{props.value + " (" + props.size + ")"}</option>
    );
}

export default Dropdown;