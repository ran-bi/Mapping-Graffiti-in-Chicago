var map;
createMap();
d3.queue()
  .defer(d3.json, "data/Boundaries.geojson")
  .defer(d3.json, "data/summary2012.json")
  .defer(d3.json, "data/summary2013.json")
  .defer(d3.json, "data/summary2014.json")
  .defer(d3.json, "data/summary2015.json")
  .defer(d3.json, "data/summary2016.json")
  .awaitAll(ready)

d3.select("#timeslide").on("input", function() {
    updateColor(+this.value);
});

function createMap(){
  // Define map parameters
  var center = [41.838299, -87.706953],
      zoom = 11;
  map = L.map('map').setView(center, zoom);
  // Create tile layer
  var mapUrl = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
      mapAttrib = '<a id="home-link" target="_top" href="../">Map tiles</a> by <a target="_top" href="http://stamen.com">Stamen Design</a>, under <a target="_top" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',   
      mapLayer = L.tileLayer(mapUrl, {attribution: mapAttrib}).addTo(map);
  // Create svg layer
  L.svg({clickable:true}).addTo(map);
}  

var svg = d3.select("#map").select("svg")
            .attr("pointer-events", "auto"),
    g = svg.select("g");

var colorScale = d3.scaleThreshold()
                      .domain([3, 6])
                      .range(["#74add1","#fdae61","#a50026"]);

var opacityScale = d3.scaleThreshold()
                      .domain([100, 500])
                      .range([0.2,0.6,1]);
var collection;
var summaries;

function ready(error, results){
  if (error) throw error;
  collection = results[0];    // Boundaries
  summaries = results.slice(1,6);  // Summary by year
  initializeColor(collection, summaries[0]);
}
  

function initializeColor(collection, summary){
  var transform = d3.geoTransform({point: projectPoint}),
      path = d3.geoPath().projection(transform);
  
  var featureElement = g.selectAll("path")
                .data(collection.features)
                .enter().append("path")
                .attr("fill", function (d){ return colorScale(summary[d.properties.area_numbe - 1]["response"]);})
                .attr("fill-opacity", function(d){ return opacityScale(summary[d.properties.area_numbe - 1]["requests_per_10000"]);})
                .on("click", function(d){
                  d3.select(this).style("stroke", "black");
                  updateFrequencyLine(d.properties.area_numbe, frequencyData);
                })

  map.on("moveend", updatePosition);
  updatePosition();
  
  function updatePosition(){
    featureElement.attr("d", path);
  }

  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }
}

function updateColor(value) {
  var year = [2012, 2013, 2014, 2015, 2016];
  document.getElementById("range").innerHTML = year[value];
  summary = summaries[value]
  svg.selectAll("path")
    .attr("fill", function (d) { return colorScale(summary[d.properties.area_numbe - 1]["response"]);})
    .attr("fill-opacity", function(d){ return opacityScale(summary[d.properties.area_numbe - 1]["requests_per_10000"]);})
    .on("click", function(d){
      d3.select(this).style("stroke", "black");
      updateFrequencyLine(d.properties.area_numbe, frequencyData);
    })
}
