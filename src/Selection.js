import React from 'react';
import './Selection.css';

class Selection extends React.Component {
  render() {
    return <div className={"tags has-addons " + (this.props.value==="Todos"?"is-invisible":"")} >
             <span className="tag is-danger">{this.props.value}</span>
             <button className="tag is-delete" onClick={()=>this.props.onClick()}></button>
           </div>;
  }
}

export default Selection;