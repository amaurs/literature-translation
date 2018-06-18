import React from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class Data extends React.Component {
    render() {
        const columns = [{
                           Header: 'Título',
                           accessor: 'title_plus_url',
                           Cell: function(e){
                              if(e.value.split("|")[1]==null) {
                                return <span>{e.value.split("|")[0]}</span>;
                              } else {
                                return <a href={e.value.split("|")[1]}> {e.value.split("|")[0]}</a>;
                              }
                            }
                         },
                         {
                           Header: 'Año',
                           accessor: 'year'
                         }, {
                           Header: 'Género',
                           accessor: 'genre'
                         }, {
                           Header: 'País',
                           accessor: 'country'
                         }, {
                           Header: 'Ciudad',
                           accessor: 'city'
                         }, {
                           Header: 'Idioma',
                           accessor: 'language'
                         }];
        const searchKey = this.props.searchKey;

        const filtered = this.props.data.filter(function(element){
             return element['title'].toLowerCase().includes(searchKey) ||
                    element['year'].toString().toLowerCase().includes(searchKey) ||
                    element['genre'].toLowerCase().includes(searchKey) ||
                    element['country'].toLowerCase().includes(searchKey) ||
                    element['city'].toLowerCase().includes(searchKey) ||
                    element['language'].toLowerCase().includes(searchKey) ||
                    element['url_title'].toLowerCase().includes(searchKey);
        });
        return <ReactTable
                     data={filtered}
                     columns={columns}
                     pageSizeOptions={[5, 10, 20]}
                   />
    }
}
