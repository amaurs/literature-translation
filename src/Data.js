import React from 'react';

class Data extends React.Component {
    render() {
        let shortBooks = this.props.data.slice(0,10);
        const rows = shortBooks.map((book, index) => 
                
                <tr key={index}>
                  <td>{book.title}</td>
                  <td><button className="button">
                        <span className="icon">
                          <i className="fas fa-search"></i>
                        </span>
                      </button>
                  </td>
                </tr>
                
            );

        return <table className="table">
                 <thead>
                   <tr>
                     <th>Título</th>
                     <th>Información</th>
                   </tr>
                 </thead>
                 <tbody>
                   {rows}
                 </tbody>
               </table>
    }
}

export default Data;