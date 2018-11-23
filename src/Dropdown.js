import React from 'react';
import './Dropdown.css';
import genreImg from './images/genero.png';
import cityImg from './images/ciudad.png';
import languageImg from './images/lengua.png';
import countryImg from './images/pais.png';

export default class Dropdown extends React.Component {
    render() {
        let myArray = Object.keys(this.props.options).sort();
        const items = myArray.map((option, index) => 
                <Option key={index} value={option} size={this.props.options[option]}/>
            );

        let alt = "";
        let image = null;

        switch (this.props.type) {
          case "year":
            alt = "Año";
            image = null;
            break;
          case "genre":
            alt = "Género";
            image = genreImg;
            break;
          case "language":
            alt = "Lengua Meta";
            image = languageImg;
            break;
          case "country":
            alt = "País";
            image = countryImg;
            break;
          case "city":
            alt = "Ciudad";
            image = cityImg;
            break;
          default:
            alt = "";
            image = null;
            break;
        }

        return <div className="field has-addons">
                <div className="Dropdown-control control ">
                  <img style={{'height':'30px'}} src={image} alt={alt}/>
                  <select className="select Dropdown-select is-four-fifths" value={this.props.selectedOption} 
                          onChange={(event)=>this.props.onChange(event)}>{items}
                  </select>
                </div>
               </div>
    }
}

function Option(props) {
    return (
        <option value={props.value}>{props.value + " ("+ props.size +")"}</option>
    );
}
