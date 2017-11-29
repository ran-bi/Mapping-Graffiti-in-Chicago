var map, hexLayer,locations;
createMap();
d3.queue()
  .defer(d3.json, "data/Boundaries.geojson")
  .defer(d3.json, "data/2012.json")
  .defer(d3.json, "data/2013.json")
  .defer(d3.json, "data/2014.json")
  .defer(d3.json, "data/2015.json")
  .defer(d3.json, "data/2016.json")
  .awaitAll(ready)

d3.select("#timeslide").on("input", function() {
    updateHex(+this.value);
});

function createMap(){
  var center = [41.838299, -87.706953],
      zoom = 11;
  map = L.map('map').setView(center, zoom);
  var mapUrl = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
      mapAttrib = '<a id="home-link" target="_top" href="../">Map tiles</a> by <a target="_top" href="http://stamen.com">Stamen Design</a>, under <a target="_top" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_top" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_top" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>',   
      mapLayer = L.tileLayer(mapUrl, {attribution: mapAttrib}).addTo(map);
}


function ready(error, results){
  if (error) throw error;
//  collection = results[0];
  locations = results.slice(1,6);
  initializeHex(results[0], locations[0]);
}
  

function initializeHex(collection, location){
  var options = {
    radius : 14,
    opacity: 0.8,
    colorScaleExtent: [1, 500],
    colorRange: ['#ffffb2', '#fed976', '#feb24c', '#fd8d3c', '#f03b20', '#bd0026']
    };
  hexLayer = L.hexbinLayer(options).addTo(map);
  hexLayer
    .lat(function(d) { return d[0]; })
    .lng(function(d) { return d[1]; })
    .colorValue(function(d) { return d.length; });
  hexLayer.data(location);

  var svg = d3.select(map.getPanes().overlayPane).append("svg"),
      g = svg.append("g").attr("class", "leaflet-zoom-hide");

  var transform = d3.geoTransform({point: projectPoint}),
      path = d3.geoPath().projection(transform);
  
  var featureElement = g.selectAll("path")
                .data(collection.features)
                .enter().append("path")
                .attr("fill", "white")
                .attr("fill-opacity", 0)
                .style("stroke", "steelblue")
                .on("click", function(d){
                  d3.select(this).style("stroke", "black");
                });

  map.on("moveend", updatePosition);
  updatePosition();

  function updatePosition(){
    var bounds = path.bounds(collection),
        topLeft = bounds[0],
        bottomRight = bounds[1];
    svg.attr("width", bottomRight[0] - topLeft[0])
      .attr("height", bottomRight[1] - topLeft[1])
      .style("left", topLeft[0] + "px")
      .style("top", topLeft[1] + "px");
    
    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
    featureElement.attr("d", path);    
  }

  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }  
}

function updateHex(value) {
  var year = [2012, 2013, 2014, 2015, 2016];
  document.getElementById("range").innerHTML = year[value];
  hexLayer.data(locations[value]);
}