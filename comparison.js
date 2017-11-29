var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var svg1 = d3.select("#frequency").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);
var g1 = svg1.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleLinear().domain([2012, 2016]).range([0, width]);
var yScale = d3.scaleLinear().domain([0,600]).range([height, 0]);
var xAxis = d3.axisBottom(xScale)
              .tickValues([2012, 2013, 2014, 2015, 2016])
              .tickFormat(d3.format("d"));
var yAxis = d3.axisLeft(yScale)
              .ticks(6);

var frequencyLine = d3.line()
			.x(function(d) { return xScale(d.year); })
			.y(function(d) { return yScale(d.count); })
      .curve(d3.curveBasis);


var frequencyData;
d3.json("data/summary_frequency.json", function(data) {
  frequencyData = data;
  initializeFrequencyLine(frequencyData);
});

function initializeFrequencyLine(data){
  average = data[77]["frequency"];
  individual_community = data[0]["frequency"];
  
  g1.selectAll(".averageFrequencyLine")
    .data([average])
    .enter()
    .append("g").append("path")
    .attr("class", "averageFrequencyLine")
    .attr("d", function(d){return frequencyLine(d);})
    .attr("stroke", "red");

  g1.selectAll(".frequencyLine")
    .data([individual_community]).enter()
    .append("g")
    .append("path")
    .attr("class", "frequencyLine")
    .attr("d", function(d){return frequencyLine(d);});

  g1.append("g")
    .attr("class", "x axis frequency")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  g1.append("g")
    .attr("class", "y axis frequency")
    .call(yAxis);
}

function updateFrequencyLine(area_number, summary = frequencyData) {
  console.log(area_number)
  data = [];
  average = summary[77]["frequency"];
  individual_community = summary[area_number]["frequency"];
  
  data.push(average);
  data.push(individual_community);
  

  // Scale the range of the data
  yScale.domain([0, d3.max(data, function(d) { return d3.max(d,function(c) {return c.count})})]);

  // Add the valueline path.
  g1.selectAll(".averageFrequencyLine")
    .data([data[0]])
    .transition()
    .duration(1000)
    .attr("d", function(d){return frequencyLine(d);});

  g1.selectAll(".frequencyLine")
    .data([data[1]])
    .transition()
    .duration(1000)
    .attr("d", function(d){return frequencyLine(d);});

  // Update the Y Axis
  g1.select(".y.axis")
    .transition()
    .duration(1000)
    .call(yAxis);
  }