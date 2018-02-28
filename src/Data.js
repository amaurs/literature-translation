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
                         }]
        return <ReactTable
                     data={this.props.data}
                     columns={columns}
                     pageSizeOptions={[5, 10, 20]}
                   />
    }
}
