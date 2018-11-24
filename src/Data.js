import React from 'react';
import ReactTable from 'react-table';
import './Data.css';
import 'react-table/react-table.css';
import { extractContent } from './util.js';

export default class Data extends React.Component {
   
    render() {
        const columns = [{
                           Header: function(e){ return <div>Título traducido <i class="fas fa-arrow-up fa-sm"></i> <i class="fas fa-arrow-down fa-sm"></i></div>},
                           accessor: 'title',
                           Cell: function(e){
                                return <div dangerouslySetInnerHTML={{ __html: e.value}} />;
                           },
                           sortMethod: (a, b) => {
                             return extractContent(a).trim().localeCompare(extractContent(b).trim());
                           }
                         },
                         {
                           Header: function(e){ return <div>Traductor <i class="fas fa-arrow-up fa-sm"></i> <i class="fas fa-arrow-down fa-sm"></i></div>},
                           accessor: 'translator',
                           Cell: function(e){
                                return <div dangerouslySetInnerHTML={{ __html: e.value}} />;
                           },
                           sortMethod: (a, b) => {
                             return extractContent(a).trim().localeCompare(extractContent(b).trim());
                           }
                         },
                         {
                           Header: function(e){ return <div>Título original <i class="fas fa-arrow-up fa-sm"></i> <i class="fas fa-arrow-down fa-sm"></i></div>},
                           accessor: 'original_title',
                           Cell: function(e){
                                return <div dangerouslySetInnerHTML={{ __html: e.value}} />;
                           },
                           sortMethod: (a, b) => {
                             return extractContent(a).trim().localeCompare(extractContent(b).trim());
                           }
                         },
                         {
                           Header: function(e){ return <div>Autor <i class="fas fa-arrow-up fa-sm"></i> <i class="fas fa-arrow-down fa-sm"></i></div>},
                           accessor: 'author',
                           Cell: function(e){
                                return <div dangerouslySetInnerHTML={{ __html: e.value}} />;
                           },
                           sortMethod: (a, b) => {
                             return extractContent(a).trim().localeCompare(extractContent(b).trim());
                           }
                         },
                         {
                           Header: function(e){ return <div>País <i class="fas fa-arrow-up fa-sm"></i> <i class="fas fa-arrow-down fa-sm"></i></div>},
                           accessor: 'country'
                         }, 
                         {
                           Header: function(e){ return <div>Ciudad <i class="fas fa-arrow-up fa-sm"></i> <i class="fas fa-arrow-down fa-sm"></i></div>},
                           accessor: 'city'
                         },
                         {
                           Header: function(e){ return <div>Editorial <i class="fas fa-arrow-up fa-sm"></i> <i class="fas fa-arrow-down fa-sm"></i></div>},
                           accessor: 'publisher'
                         },
                         {
                           Header: function(e){ return <div>Año <i class="fas fa-arrow-up fa-sm"></i> <i class="fas fa-arrow-down fa-sm"></i></div>},
                           accessor: 'year'
                         }, 
                         {
                           Header: function(e){ return <div>Lengua Meta <i class="fas fa-arrow-up fa-sm"></i> <i class="fas fa-arrow-down fa-sm"></i></div>},
                           accessor: 'language'
                         },
                         {
                           Header: function(e){ return <div>Género <i class="fas fa-arrow-up fa-sm"></i> <i class="fas fa-arrow-down fa-sm"></i></div>},
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
        return <ReactTable
                     data={filtered}
                     columns={columns}
                     defaultPageSize={10}
                     pageSizeOptions={[5, 10]}
                   />
    }
}
