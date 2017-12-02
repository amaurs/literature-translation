import React from 'react';
import './Selection.css';



class Selection extends React.Component {

    render() {
        return <div className={"Selection-option"} >{this.props.value} <button onClick={()=>this.props.onClick()}>X</button></div>;
    }
}


export default Selection;