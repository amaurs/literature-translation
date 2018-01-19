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
        return <div className="field">
                <label>{this.props.type}</label>
                <div class="control">
                  <div class="select">
                   <select value={this.props.selectedOption} 
                           onChange={(event)=>this.props.onChange(event)}>{items}
                   </select>
                  </div>
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