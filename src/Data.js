import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

function htmlDecode(input){
    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

export default class Data extends React.Component {
   
    render() {
        const columns = [{
                           Header: 'Título',
                           accessor: 'title',
                           Cell: function(e){
                                return <div dangerouslySetInnerHTML={{ __html: e.value}} />;
                           }
                         },
                         {
                           Header: 'Traductor',
                           accessor: 'translator',
                           Cell: function(e){
                                return <div dangerouslySetInnerHTML={{ __html: e.value}} />;
                           }
                         },
                         {
                           Header: 'Título original',
                           accessor: 'original_title',
                           Cell: function(e){
                                return <div dangerouslySetInnerHTML={{ __html: e.value}} />;
                           }
                         },
                         {
                           Header: 'Autor',
                           accessor: 'author',
                           Cell: function(e){
                                return <div dangerouslySetInnerHTML={{ __html: e.value}} />;
                           }
                         },
                         {
                           Header: 'País',
                           accessor: 'country'
                         }, 
                         {
                           Header: 'Ciudad',
                           accessor: 'city'
                         },
                         {
                           Header: 'Editorial',
                           accessor: 'publisher'
                         },
                         {
                           Header: 'Año',
                           accessor: 'year'
                         }, 
                         {
                           Header: 'Lengua de traducción',
                           accessor: 'language'
                         },
                         {
                           Header: 'Género',
                           accessor: 'genre'
                         }];
        const searchKey = this.props.searchKey;

        const filtered = this.props.data.filter(function(element){
             return element['title'].toLowerCase().includes(searchKey) ||
                    element['original_title'].toLowerCase().includes(searchKey) ||
                    element['year'].toString().toLowerCase().includes(searchKey) ||
                    element['genre'].toLowerCase().includes(searchKey) ||
                    element['country'].toLowerCase().includes(searchKey) ||
                    element['city'].toLowerCase().includes(searchKey) ||
                    element['language'].toLowerCase().includes(searchKey) ||
                    element['author'].toLowerCase().includes(searchKey) ||
                    element['translator'].toLowerCase().includes(searchKey)||
                    element['publisher'].toLowerCase().includes(searchKey);
        });
        console.log(filtered);
        return <ReactTable
                     data={filtered}
                     columns={columns}
                     defaultPageSize={10}
                     pageSizeOptions={[5, 10]}
                   />
    }
}
