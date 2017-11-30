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
        return <select className="Dropdown" value={this.props.selectedOption} onChange={(event)=>this.props.onChange(event)}>{items}</select>;
    }
}

function Option(props) {
    return (
        <option>{props.value}</option>
    );
}

export default Dropdown;