var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 300 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

// Frequency line
var svg1 = d3.select("#frequency").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
var g1 = svg1.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Response line
var svg2 = d3.select("#response").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);
var g2 = svg2.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Define scales
var xScale = d3.scaleLinear().domain([2012, 2016]).range([0, width]),
    xAxis = d3.axisBottom(xScale)
              .tickValues([2012, 2013, 2014, 2015, 2016])
              .tickFormat(d3.format("d"));

var yScaleFrequency = d3.scaleLinear().domain([0,600]).range([height, 0]),
    yAxisFrequency = d3.axisLeft(yScaleFrequency).ticks(6);

var yScaleResponse = d3.scaleLinear().domain([0,9]).range([height, 0]),
    yAxisResponse = d3.axisLeft(yScaleResponse).ticks(6);
 
// Line generator
var frequencyLine = d3.line()
			.x(function(d) { return xScale(d.year); })
			.y(function(d) { return yScaleFrequency(d.count); })
      .curve(d3.curveBasis);

var responseLine = d3.line()
      .x(function(d) { return xScale(d.year); })
      .y(function(d) { return yScaleResponse(d.time); })
      .curve(d3.curveBasis);

// Frequency line graph
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
    .call(yAxisFrequency);
}

function updateFrequencyLine(area_number, summary = frequencyData) {
  console.log(area_number)
  data = [];
  average = summary[77]["frequency"];
  individual_community = summary[area_number]["frequency"];
  
  data.push(average);
  data.push(individual_community);
  

  // Scale the range of the data
  yScaleFrequency.domain([0, d3.max(data, function(d) { return d3.max(d,function(c) {return c.count})})]);

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
    .call(yAxisFrequency);
  }

// Response time line graph
var responseData;
d3.json("data/summary_response.json", function(data) {
  responseData = data;
  initializeResponseLine(responseData);
});

function initializeResponseLine(data){
  average = data[77]["response"];
  individual_community = data[0]["response"];
  
  g2.selectAll(".averageResponseLine")
    .data([average])
    .enter()
    .append("g").append("path")
    .attr("class", "averageResponseLine")
    .attr("d", function(d){return responseLine(d);})
    .attr("stroke", "red");

  g2.selectAll(".responseLine")
    .data([individual_community]).enter()
    .append("g")
    .append("path")
    .attr("class", "responseLine")
    .attr("d", function(d){return responseLine(d);});

  g2.append("g")
    .attr("class", "x.axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  g2.append("g")
    .attr("class", "y.axis")
    .call(yAxisResponse);
}

function updateResponseLine(area_number, summary = responseData) {
  data = [];
  average = summary[77]["response"];
  individual_community = summary[area_number]["response"];
  
  data.push(average);
  data.push(individual_community);
  

  // Scale the range of the data
  yScaleResponse.domain([0, d3.max(data, function(d) { return d3.max(d,function(c) {return c.time})})]);

  // Add the valueline path.
  g2.selectAll(".averageResponseLine")
    .data([data[0]])
    .transition()
    .duration(1000)
    .attr("d", function(d){return responseLine(d);});

  console.log(data[0])
  console.log(yScaleResponse.domain())

  g2.selectAll(".responseLine")
    .data([data[1]])
    .transition()
    .duration(1000)
    .attr("d", function(d){return responseLine(d);});
  console.log(data[1])

  // Update the Y Axis
  g2.select(".y.axis")
    .transition()
    .duration(1000)
    .call(yAxisResponse);
  }