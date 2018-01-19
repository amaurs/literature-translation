import React from 'react';
import './Dropdown.css';



class Dropdown extends React.Component {

    doSomething() {
        console.log();
    }

    render() {
        const items = this.props.options.map((option, index) => 
                <Option key={index} value={option} />
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
                <div className="control is-full-width">

                  <div className="select">
                   <select value={this.props.selectedOption} 
                           onChange={(event)=>this.props.onChange(event)}>{items}
                   </select>
                  </div>
                  <span className="icon"><i className={"fas " + icon}></i></span>
                </div>
               </div>
    }
}

function Option(props) {
    return (
        <option>{props.value}</option>
    );
}

export default Dropdown;