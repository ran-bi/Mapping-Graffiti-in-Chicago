// Reference: bl.ocks.org/mbostock/6526445e2b44303eebf21da3b6627320

var svgBeeSwarm = d3.select("#beeswarm").append("svg").attr("height", 550).attr("width", 600),
    margin = {top: 0, right: 30, bottom: 0, left: 30},
    width = svgBeeSwarm.attr("width") - margin.left - margin.right,
    height = 100;

var colorPaletteHighlight = ['#6e016b','#bfd3e6','#9ebcda','#8c96c6','#8c6bb1','#88419d']

var colorScaleHighlight = d3.scaleThreshold()
                      .domain([6,11,21,31,41])
                      .range(colorPaletteHighlight);
var x = d3.scaleLog()
    .domain([15,85])
    .rangeRound([0, width]);

var g1 = svgBeeSwarm.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var classids = ["y2012","y2013","y2014","y2015","y2016"]

d3.queue()
  .defer(d3.csv, "data/top2012.csv", type)
  .defer(d3.csv, "data/top2013.csv", type)
  .defer(d3.csv, "data/top2014.csv", type)
  .defer(d3.csv, "data/top2015.csv", type)
  .defer(d3.csv, "data/top2016.csv", type)
  .awaitAll(ready1)


function ready1 (error, results){
  if (error) throw error;
  for (index = 0; index < 6; ++index) {
    draw(results[index], index);
  }
}

function draw(data, index){
  var simulation = d3.forceSimulation(data)
      .force("x", d3.forceX(function(d) { return x(d.value); }).strength(1))
      .force("y", d3.forceY(height / 2))
      .force("collide", d3.forceCollide(4))
      .stop();

  for (var i = 0; i < 100; ++i) simulation.tick();

  var classid = classids[index];

  var cell = g1.append("g")
      .attr("class", "cells")
      .selectAll("g").data(data).enter();

  cell.append("circle")
      .attr("class", "swarm "+classid)
      .attr("r", 3)
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y+index*80; })
      .style("fill-opacity", 1)
      .style("fill", function(d){ 
        if(index == 0){
          return colorScale(d.value);
        }else{
          return colorScaleHighlight(d.value);}
      });
    }

g1.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0,410)")
    .call(d3.axisBottom(x).ticks(10, ".0s"));


function type(d) {
  if (!d.value) return;
  d.value = +d.value;
  return d;
}

function updateBeeSwarm(value){
  d3.selectAll(".swarm").style("fill", function(d){return colorScaleHighlight(d.value)});
  d3.selectAll("." + classids[value]).style("fill", function(d){return colorScale(d.value)});
}
