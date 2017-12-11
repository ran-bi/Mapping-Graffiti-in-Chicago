//Reference: http://www.tnoda.com/blog/2013-12-19

var width = 100;
var height = 25;
var x = d3.scaleLinear().range([0, width - 2]);
var y = d3.scaleLinear().range([height - 4, 0]);
var line = d3.line()
             .x(function(d) { return x(d.year); })
             .y(function(d) { return y(d.value); })
             .curve(d3.curveLinear);

function sparkline(elemId, data) {
  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain(d3.extent(data, function(d) { return d.value; }));

  var svg = d3.select(elemId)
              .append('svg')
              .attr('width', width)
              .attr('height', height)
              .append('g')
              .attr('transform', 'translate(0, 2)');
  svg.append('path')
     .datum(data)
     .attr('class', 'sparkline')
     .attr('d', line);
  svg.append('circle')
     .attr('class', 'sparkcircle')
     .attr('cx', x(data[0].year))
     .attr('cy', y(data[0].value))
     .attr('r', 2);  
}

d3.json('data/stat_total.json', function(error, data){
	sparkline('#total', data)
})
d3.json('data/stat_response.json', function(error, data){
	sparkline('#response', data)
})
d3.json('data/stat_budget.json', function(error, data){
	sparkline('#budget', data)
})
