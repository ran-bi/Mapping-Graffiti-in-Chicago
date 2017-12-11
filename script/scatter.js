// Reference: bl.ocks.org/bimannie/33494479e839c3fe3735eac00be69787
var map, hexLayer,locations;
createMap();

d3.queue()

  .defer(d3.json, "data/freq2012.geojson")
  .defer(d3.json, "data/freq2013.geojson")
  .defer(d3.json, "data/freq2014.geojson")
  .defer(d3.json, "data/freq2015.geojson")
  .defer(d3.json, "data/freq2016.geojson")
  .awaitAll(ready)

d3.select("#timeslide").on("input", function() {
    updatePoint(+this.value);
    updateBeeSwarm(+this.value);
});

function createMap(){
  var center = [41.838299, -87.706953],
      zoom = 11;
  map = L.map('map').setView(center, zoom);
  var mapUrl = 'http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png',
      mapAttrib = 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.',
      mapLayer = L.tileLayer(mapUrl, {attribution: mapAttrib}).addTo(map);
}

var points;

function ready(error, results){
  if (error) throw error;
  points = results
  initializePoint(points[0]);
}
  
var svg = d3.select(map.getPanes().overlayPane).append("svg"),
      g = svg.append("g").attr("class", "leaflet-zoom-hide");

var colorPalette = ['#ffffb2','#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026'];
var colorScale = d3.scaleThreshold()
                      .domain([6,11,21,31,41])
                      .range(colorPalette);
var radiusScale = d3.scaleThreshold()
                      .domain([21, 31, 41])
                      .range([3, 6, 8, 10]);

// Define the div for the tooltip. Reference: http://bl.ocks.org/d3noob/a22c42db65eb00d4e369
var div = d3.select("body").append("div") 
    .attr("class", "tooltip")       
    .style("opacity", 0);

function initializePoint(location){

  var transform = d3.geoTransform({point: projectPoint}),
      path = d3.geoPath().projection(transform);

  var bounds = path.bounds(location),
    topLeft = bounds[0],
    bottomRight = bounds[1];

  location.features.forEach(function(d) {
    d.LatLng = new L.LatLng(d.geometry.coordinates[1],
    d.geometry.coordinates[0]);
  });

  g.selectAll(".circle").remove();
  var features = g.selectAll(".circle")
              .data(location.features)
              .enter()
              .append("a")
                .on("click", function(d){
                  d3.select(this).attr("xlink:href", function(d){return "https://www.google.com/maps/@?api=1&map_action=pano&viewpoint="+d.geometry.coordinates[1]+","+d.geometry.coordinates[0]})
                  .attr("xlink:show", "new");
                })
              .append("circle")
              .attr("class", "circle")
              .style("fill-opacity", 0.8)
              .style("fill", function(d){ return colorScale(d.properties.count)})
              .attr("r", function(d){ return radiusScale(d.properties.count)})
              .on("mouseover", function(d) {
                div.transition().duration(200).style("opacity", .9);    
                div.html(d.properties.street_address +  "<br/>" + d.properties.count + " times")  
                   .style("left", (d3.event.pageX) + "px")   
                   .style("top", (d3.event.pageY - 28) + "px");
              })          
              .on("mouseout", function(d) {
                div.transition()    
                   .duration(500)    
                   .style("opacity", 0);
                 });

  map.on("moveend", update);
  update();

  function update() {
    features.attr("transform", function(d) { 
      return "translate("+ 
            map.latLngToLayerPoint(d.LatLng).x +","+ 
            map.latLngToLayerPoint(d.LatLng).y +")";
        })
    svg.attr("width", bottomRight[0] - topLeft[0])
          .attr("height", bottomRight[1] - topLeft[1])
          .style("left", topLeft[0] + "px")
          .style("top", topLeft[1] + "px");

    g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");}
  
  function projectPoint(x, y) {
    var point = map.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
  }  
}

function updatePoint(value) {
  var year = [2012, 2013, 2014, 2015, 2016];
  document.getElementById("range").innerHTML = year[value];
  var location = points[value];
  initializePoint(location);
}
