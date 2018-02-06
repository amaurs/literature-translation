import React from 'react';
import './Selection.css';

class Selection extends React.Component {
  render() {
    return <div className={"columns tags has-addons " + (this.props.value==="Todos"?"is-invisible":"")} >
             <span className="column tag is-danger is-four-fifths">{this.props.value}</span>
             <button className="column tag is-delete is-one-fifth" onClick={()=>this.props.onClick()}></button>
           </div>;
  }
}

export default Selection;