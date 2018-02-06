import React from 'react';

class Data extends React.Component {
    render() {
        let shortBooks = this.props.data.slice(0,10);
        const rows = shortBooks.map((book, index) => 
                
                <tr key={index}>
                  <td>{book.title}</td>
                  <td>{book.year}</td>
                  <td>{book.genre}</td>
                  <td>{book.country}</td>
                  <td>{book.city}</td>
                  <td>{book.language}</td>
                </tr>
                
            );
        return <table className="table">
                 <thead>
                   <tr>
                     <th>Título</th>
                     <th>Año</th>
                     <th>Género</th>
                     <th>País</th>
                     <th>Ciudad</th>
                     <th>Idioma</th>
                   </tr>
                 </thead>
                 <tbody>
                   {rows}
                 </tbody>
               </table>
    }
}

export default Data;