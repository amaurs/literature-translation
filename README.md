# Puesta en Mapa
Map of literary translations with data from the [Encyclopedia of Mexican Literature](http://elem.mx/) a collaboration between de [Fundación Mexicana para las Letras](http://flm.mx/) and the [Daniel Cosío Villegas Library](https://biblioteca.colmex.mx/).

## Contact
For more information on this project contact Silvia Gutiérrez (segutierrez {at} colmex.mx), Digital Humanities Librarian at El Colegio de México


## Demo

A beta version of this project is available [here](http://www.elem.mx/estgrp/datos/1335):

![alt text](/elem_mapa.gif)

## Installation

The application is build using React. To install the dependencies type:

```
npm install
```

To start the application:

```
npm start
```

This will launch the application in a browser. To deploy the application in a real server, an optimized bundled build must be created with the command:

```
npm run build
```

A directory called build will be created. This can be deployed to a server and the application will be ready to be used.

## Technical Details

We now describe how the map works. This effort was build on top of an existent website which was built with *php*. This scenario offered the possibility of using a different technology with the advantages and disadvantages that this represented. On the one hand, it was easier for the developer to use a programing environment in which he feels more confortable, but on the other, integration of both systems represented a challenge. 

### Database

The web site [elem.mx](http://www.elem.mx/) uses a Microsoft Database hosted on Azure. Several changes where implemented to fit needs of the map. The most important one was that the database was not georeferenced. In order to place the points of interest in a map we needed latitude and longitude for each point. Given the number of cities and countries involved, it was prohibitive to try this manually. A script was written to havest the locations from the Google Maps API, and then this information was ingested into the database. To reproduce a similiar effort, it would be convenient to consider the georeference from the begining.

### Backend

As we mentioned, the programming language that the [elem.mx](http://www.elem.mx/) was written in is not the same as the one used for the map. This means that we needed a way to expose the information from the database. To this end, a node.js service was written. It queries the database and transforms the data into json which is served through http as an [endpoint](https://amaurs.com/api). The code for this service can be found [here](https://gist.github.com/amaurs/6087980f24f6fb4e0847237566363ca5).

### Fronted

With the data service in place, we will now describe how does the map works. It uses [React](https://reactjs.org/) as the development framework to build the interface, additionally, we use [Leaflet](https://leafletjs.com/) to draw our map, and [D3](https://d3js.org/) to build our chart selector. 

The application itself is an information filter. The user decides which filter parameters to use, and the information is displayed according to the current selection. The application loads the information using the backend service. The data is then stored in memory and available for the rest of the session. We use the array filter facilities that javascript offers, and we keep updating the current slice through the entire session. Each time the selection changes we need to update the interface and repaint both the chart and the map, here is where React shines. React uses stateless components that are repainted each time the state changes. In our case, the state is the result of filtering the data with the current selection, each time the user changes the selection, the components are redrawn flawlessly. These architecture, has many advantages. Holding the state of the filter at each moment allows to download the selection without further overhead as we only need to process it and write it in a csv file. Another aspect of the map that is worth mentioning is the table that shows the information of the book translations. The map intends to be a way to visualize and navigate the information, but we need a link to the elem.mx records. We show a table with hyperlinks to the records for each author, translator, and title, this information is shown with pagination for both performance and readability.