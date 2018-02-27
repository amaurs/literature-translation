import React, { Component } from 'react';
import * as d3 from 'd3';

export default class Chart extends Component {

  componentDidMount() {

    let dims = this.svg.getBoundingClientRect();
    this.width = dims.width;
    this.height = dims.height;

    console.log("**************");
    console.log(this.width);
    console.log(this.height);

    let x = d3.scaleBand()
              .range([0, this.width])
              .domain(this.props.data.map(function(d) { return d.name; }))
              .paddingInner(0.2)
              .paddingOuter(0.1);

    console.log(x)
    let y = d3.scaleLinear()
              .rangeRound([this.height, 0]);

    y.domain([0, d3.max(this.props.data, function(d) { return d.value; })]);

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

    d3.select(this.svg)
      .selectAll(".bar")
      .append("text")
      .attr("x", x.bandwidth() / 2)
      .attr("y", function(d) { return y(d.value); })
      .attr("dy", "0.5em")
      .text(function(d) { return d.name; })
      .attr("fill", "black");



  }

  componentDidUpdate() {
    console.log("Chart did update.");

    let up = this.props.value.max;
    let bottom = this.props.value.min;
    d3.select(this.svg)
      .selectAll(".bar")
      .data(this.props.data)
      .attr("fill", function(d) { 
          if(+d.name >= bottom && +d.name <= up) {
             return 'steelblue';
          }else {
             return 'gray';
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