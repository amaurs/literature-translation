import React from 'react';
import ReactTable from 'react-table'
import 'react-table/react-table.css'

export default class Data extends React.Component {
    render() {
        console.log(this.props.data);

        const columns = [{
                           Header: 'Title',
                           accessor: 'title'
                         }, {
                           Header: 'Year',
                           accessor: 'year'
                         }, {
                           Header: 'Genre',
                           accessor: 'genre'
                         }, {
                           Header: 'Country',
                           accessor: 'country'
                         }, {
                           Header: 'City',
                           accessor: 'city'
                         }, {
                           Header: 'Language',
                           accessor: 'language'
                         }]
        return <ReactTable
                     data={this.props.data}
                     columns={columns}
                   />
    }
}
