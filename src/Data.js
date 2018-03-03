import React from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

export default class Data extends React.Component {
    render() {
        const columns = [{
                           Header: 'Título',
                           accessor: 'title'
                         }, {
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
                    element['year'].toLowerCase().includes(searchKey) ||
                    element['genre'].toLowerCase().includes(searchKey) ||
                    element['country'].toLowerCase().includes(searchKey) ||
                    element['city'].toLowerCase().includes(searchKey) ||
                    element['language'].toLowerCase().includes(searchKey);
        });
        return <ReactTable
                     data={filtered}
                     columns={columns}
                     pageSizeOptions={[5, 10, 20]}
                   />
    }
}
