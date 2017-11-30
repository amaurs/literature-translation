import React from 'react';
import './Selection.css';



class Selection extends React.Component {

    render() {
        const items = this.props.options.map((option, index) => 
                <Option key={index} value={option.value} />
            );
        return <div className="Selection">{items}</div>;
    }
}

function Option(props) {
    return (
        <div className="Selection-option">{props.value} <button>X</button></div>
    );
}

export default Selection;