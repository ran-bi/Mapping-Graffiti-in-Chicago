var colorCode = 
						{"#1696d2":{"0.3": "LL", "0.6": "LM", "0.9": "LH"},
						"#fdbf11":{"0.3": "ML", "0.6": "MM", "0.9": "MH"},
						"#ec008b":{"0.3": "HL", "0.6": "HM", "0.9": "HH"}}

var legendSvg = d3.select("#legend").append("svg").attr("transform", "translate(80,40)").attr("width", 500);
legendSvg.append("rect").attr("x",0).attr("y",0).attr("height", 30).attr("width",90).style("fill","#1696d2").style("fill-opacity", 0.3).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "LL");
legendSvg.append("rect").attr("x",90).attr("y",0).attr("height", 30).attr("width",90).style("fill","#1696d2").style("fill-opacity", 0.6).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "LM");
legendSvg.append("rect").attr("x",180).attr("y",0).attr("height", 30).attr("width",90).style("fill","#1696d2").style("fill-opacity", 0.9).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "LH");
legendSvg.append("rect").attr("x",0).attr("y",40).attr("height", 30).attr("width",90).style("fill","#fdbf11").style("fill-opacity", 0.3).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "ML");
legendSvg.append("rect").attr("x",90).attr("y",40).attr("height", 30).attr("width",90).style("fill","#fdbf11").style("fill-opacity", 0.6).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "MM");
legendSvg.append("rect").attr("x",180).attr("y",40).attr("height", 30).attr("width",90).style("fill","#fdbf11").style("fill-opacity", 0.9).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "MH");
legendSvg.append("rect").attr("x",0).attr("y",80).attr("height", 30).attr("width",90).style("fill","#ec008b").style("fill-opacity", 0.3).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "HL");
legendSvg.append("rect").attr("x",90).attr("y",80).attr("height", 30).attr("width",90).style("fill","#ec008b").style("fill-opacity", 0.6).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "HM");
legendSvg.append("rect").attr("x",180).attr("y",80).attr("height", 30).attr("width",90).style("fill","#ec008b").style("fill-opacity", 0.9).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "HH");

legendSvg.append("text").attr("x",280).attr("y",20).style("font-size", "16px").style("fill", "grey").text("Remove within 3 days");
legendSvg.append("text").attr("x",280).attr("y",60).style("font-size", "16px").style("fill", "grey").text("Remove within 6 days");
legendSvg.append("text").attr("x",280).attr("y",100).style("font-size", "16px").style("fill", "grey").text("Remove in more than 6 days");

legendSvg.append("text").attr("x",40).attr("y", 125).style("font-size", "16px").text("<100");
legendSvg.append("text").attr("x",130).attr("y", 125).style("font-size", "16px").text("<500");
legendSvg.append("text").attr("x",220).attr("y", 125).style("font-size", "16px").text(">500");
legendSvg.append("text").attr("x",0).attr("y", 145).style("font-size", "16px").style("fill","grey").text("Graffiti Removal Requests per 10,000 Population");

var lineLegendSvg = d3.select("#lineLegend").append("svg").attr("transform", "translate(80,0)").attr("width",500);
lineLegendSvg.append("line").attr("x1", 0).attr("y1", 30).attr("x2", 60).attr("y2", 30).style("stroke", "#5c5859").style("stroke-width", 2).style("stroke-dasharray", "4,4");
lineLegendSvg.append("text").attr("x", 70).attr("y", 35).style("font-size", "14px").style("fill", "grey").text("City Average");
lineLegendSvg.append("line").attr("x1", 180).attr("y1", 30).attr("x2", 240).attr("y2", 30).style("stroke", "red").style("stroke-width", 2);
lineLegendSvg.append("text").attr("x", 250).attr("y", 35).style("font-size", "14px").style("fill", "grey").text("Community Selected");


var scatterLegendSvg = d3.select("#scatterLegend").append("svg").attr("transform", "translate(50,0)").attr("width", 500).attr("height", 60);
scatterLegendSvg.append("line").attr("x1", 60).attr("y1",30).attr("x2",6*60).attr("y2",30).attr("stroke-width", 0.5).attr("stroke", "grey");
scatterLegendSvg.append("g").selectAll("circle")
								.data(colorPalette).enter()
								.append("circle")
								.attr("id", function(d,i){return "cr"+i})
								.attr("cx", function(d,i) {return (i+1)*60})
								.attr("cy", 30)
								.attr("r", 4)
								.style("fill", function(d){return d});
d3.select("#cr3").attr("r", 6);
d3.select("#cr4").attr("r", 8);
d3.select("#cr5").attr("r", 10);

var scatterLegendText = ["3-5", "6-10", "11-20", "21-30","31-40","> 40"]
scatterLegendSvg.append("g").selectAll("text")
								.data(scatterLegendText).enter()
								.append("text")
								.text(function(d){return d})
								.attr("x", function(d,i){return i*60+50})
								.attr("y",55).style("font-size", "14px").style("fill", "grey")

var beeSwarmLegendText = ["2012", "2013", "2014", "2015", "2016"]
svgBeeSwarm.append("g").selectAll("text")
					 .data(beeSwarmLegendText).enter()
					 .append("text")
					 .text(function(d){return d})
					 .attr("x",0)
					 .attr("y", function(d,i){return 50+80*i})
					 .style("font-size", "16px").style("fill", "grey")

svgBeeSwarm.append("text").text("Total Times of Requests for Each Location").attr("x",390).attr("y",440).style("font-size", "10px").style("fill","grey")
svgBeeSwarm.append("text").text("*Each point represents one location.").attr("x",30).attr("y",440).style("font-size", "11px").style("fill","red").style("font-style", "italic")



