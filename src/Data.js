import React from 'react';

class Data extends React.Component {


    render() {
        let init = (this.props.currentPage - 1) * this.props.pageSize;
        let end = this.props.pageSize * ( (this.props.currentPage - 1) + 1);
        let shortBooks = this.props.data.slice(init, end);

        let paginationList = pagination(this.props.currentPage, Math.floor(this.props.data.length / this.props.pageSize) + 1);
        const handleNextPage = this.props.handleNextPage;
        const buttons = [];

        console.log("Current page: " + this.props.currentPage);
        console.log("Size of shortBooks: " + shortBooks.length);

        paginationList.forEach(function(page, index) {

                if(isNaN(page)){
                    buttons.push(<span key={index} 
                                        className="is-primary">...</span>);
                }else{
                    buttons.push(<button key={index} 
                                        className="button is-primary"
                                        onClick={()=>handleNextPage(page)}>{page}</button>);
                }
            });


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
        return <div className="App-table">
                 <table className="table">
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
                 <div className="App-buttons">
                    <button className="button is-danger" 
                         onClick={()=>this.props.handleDownload("json")}>Descargar json</button>
                    {buttons}
                 </div>
               </div>
    }
}

function pagination(currentPage, nrOfPages) {
    let delta = 2,
        range = [],
        rangeWithDots = [],
        l;

    range.push(1);  

    if (nrOfPages <= 1){
    return range;
    }

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
        if (i < nrOfPages && i > 1) {
            range.push(i);
        }
    }  
    range.push(nrOfPages);

    for (let i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots;
}

export default Data;