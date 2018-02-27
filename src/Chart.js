import React, { Component } from 'react';
import * as d3 from 'd3';

const innerPadding = 0;

export default class Chart extends Component {


  componentDidMount() {

    let dims = this.svg.getBoundingClientRect();
    this.width = dims.width;
    this.height = dims.height;


    let x = d3.scaleBand()
              .range([0, this.width])
              .domain(this.props.data.map(function(d) { return d.name; }))
              .paddingInner(innerPadding);
    let y = d3.scaleLinear()
              .rangeRound([this.height, 0])
              .domain([0, d3.max(this.props.data, function(d) { return d.value; })]);

    let height = this.height;
    let up = this.props.value.max;
    let bottom = this.props.value.min;

    d3.select(this.svg)
      .selectAll(".bar")
      .data(this.props.data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {return x(d.name)})
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { 
          if(+d.name >= bottom && +d.name <= up) {
             return 'steelblue';
          }else {
             return 'gray';
          }
      })
  }

  componentDidUpdate() {
    console.log("Chart did update.");

    let dims = this.svg.getBoundingClientRect();
    this.width = dims.width;
    this.height = dims.height;

    let x = d3.scaleBand()
              .range([0, this.width])
              .domain(this.props.data.map(function(d) { return d.name; }))
              .paddingInner(innerPadding);
    let y = d3.scaleLinear()
              .rangeRound([this.height, 0])
              .domain([0, d3.max(this.props.data, function(d) { return d.value; })]);

    let height = this.height;
    let up = this.props.value.max;
    let bottom = this.props.value.min;

    d3.select(this.svg)
      .selectAll(".bar")
      .data(this.props.data)
      .attr("x", function(d) {return x(d.name)})
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      
      .attr("fill", function(d) { 
          if(+d.name >= bottom && +d.name <= up) {
             return '#3f51b5';
          }else {
             return '#ccc';
          }
      });
  }

  componentWillUnmount() {
    console.log("Chart will unmount.");
    this.cities = d3.select(this.svg)
                    .append("g")
                    .attr("class", "bar")
                    .selectAll(".bar")
                    .data([])
                    .remove();
  }






  render() {
    return <svg width={this.width} 
                height={this.height} 
                ref={ svg => this.svg = svg } />;
  }
}