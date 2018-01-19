import React from 'react';
import './Selection.css';



class Selection extends React.Component {

    render() {
        return <button className={"button is-danger is-pulled-right " + (this.props.value==="Todos"?"is-invisible":"")} onClick={()=>this.props.onClick()}>
                 <span>{this.props.value}</span>
                 <span class="icon is-small">
                   <i class="fas fa-times"></i>
                 </span>
               </button>;
    }
}


export default Selection;