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
      zoom = 10.5;
  map = L.map('map').setView(center, zoom);

  // Create tile layer
  var mapUrl = 'http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png',
      mapAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
      mapLayer = L.tileLayer(mapUrl, {attribution: mapAttrib}).addTo(map);
  // Create svg layer
  L.svg({clickable:true}).addTo(map);
}  

var svg = d3.select("#map").select("svg")
            .attr("pointer-events", "auto"),
    g = svg.select("g");

var colorPalette = ["#1696d2", "#fdbf11","#ec008b"];
var colorScale = d3.scaleThreshold()
                      .domain([3, 6])
                      .range(colorPalette);
//                      .range(["#1696d2", "#55b748", "#fdbf11"]);
//                      .range(['#fc8d59','#ffffbf','#91bfdb'])
//                      .range(["#74add1","#fdae61","#a50026"]);
//                      .range(["#92c5de", "#ca0020", "#f4a582"]);
//                      .range(["#bebada","#ffffb3","#8dd3c7"])
//                     .range(["#ccebc5", "#b3cde3", "#fbb4ae"])
//                      .range(["#1696d2", "#fdbf11"," #db2b27"]);

var opacityScale = d3.scaleThreshold()
                      .domain([100, 500])
                      .range([0.3,0.6, 1]);
var collection,
    summaries,
    communityName;

function ready(error, results){
  if (error) throw error;
  collection = results[0];    // Boundaries
  summaries = results.slice(1,6);  // Summary by year
  initializeColor(collection, summaries[0]);
  initializeName(summaries[0]);
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
                  updateFrequencyLine(d.properties.area_numbe, frequencyData);
                  updateResponseLine(d.properties.area_numbe, responseData);
                  updateName(d.properties.area_numbe, summary);
                })
                .on("mousemove", function(d){
                  updateName(d.properties.area_numbe, summary)
                  color = colorScale(summary[d.properties.area_numbe - 1]["response"]);
                  opacity = opacityScale(summary[d.properties.area_numbe - 1]["requests_per_10000"]);
                  highlightLegend(color, opacity);
                })
                .on("mouseout", function(d){
                  color = colorScale(summary[d.properties.area_numbe - 1]["response"]);
                  opacity = opacityScale(summary[d.properties.area_numbe - 1]["requests_per_10000"]);
                  unHighlightLegend(color, opacity);
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
      updateFrequencyLine(d.properties.area_numbe, frequencyData);
      updateResponseLine(d.properties.area_numbe, responseData);
      updateName(d.properties.area_numbe, summary);
    })
    .on("mousemove", function(d){
      color = colorScale(summary[d.properties.area_numbe - 1]["response"]);
      opacity = opacityScale(summary[d.properties.area_numbe - 1]["requests_per_10000"]);
      highlightLegend(color, opacity);
      updateName(d.properties.area_numbe, summary);
    })
    .on("mouseout", function(d){
      color = colorScale(summary[d.properties.area_numbe - 1]["response"]);
      opacity = opacityScale(summary[d.properties.area_numbe - 1]["requests_per_10000"]);
      unHighlightLegend(color, opacity);
    })
}

function highlightLegend(color, opacity){
  id = colorCode[color][opacity];
  d3.select("#" + id).style("stroke-opacity",1);
}

function unHighlightLegend(color, opacity){
  id = colorCode[color][opacity];
  d3.select("#" + id).style("stroke-opacity",0);
}

function initializeName(summary){
  communityName = d3.select("#info").append("g")
    .selectAll("name")
    .data([summary[0]["name"]]).enter()
    .append("text")
    .text(function(d) {return d;})
    .attr("class", "name")
    .style("font-size", "30px");
}

function updateName(area_number, summary){
  communityName.text(summary[area_number-1]["name"])
    .transition()
    .duration(1000);
}