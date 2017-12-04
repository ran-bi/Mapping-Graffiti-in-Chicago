var colorCode = 
						{"#1696d2":{"0.3": "LL", "0.6": "LM", "0.9": "LH"},
						"#fdbf11":{"0.3": "ML", "0.6": "MM", "0.9": "MH"},
						"#ec008b":{"0.3": "HL", "0.6": "HM", "0.9": "HH"}}

var legendSvg = d3.select("#legend").append("svg").attr("transform", "translate(80,0)").attr("width", 500);
legendSvg.append("rect").attr("x",0).attr("y",0).attr("height", 30).attr("width",90).style("fill","#1696d2").style("fill-opacity", 0.3).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "LL");
legendSvg.append("rect").attr("x",90).attr("y",0).attr("height", 30).attr("width",90).style("fill","#1696d2").style("fill-opacity", 0.6).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "LM");
legendSvg.append("rect").attr("x",180).attr("y",0).attr("height", 30).attr("width",90).style("fill","#1696d2").style("fill-opacity", 0.9).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "LH");
legendSvg.append("rect").attr("x",0).attr("y",40).attr("height", 30).attr("width",90).style("fill","#fdbf11").style("fill-opacity", 0.3).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "ML");
legendSvg.append("rect").attr("x",90).attr("y",40).attr("height", 30).attr("width",90).style("fill","#fdbf11").style("fill-opacity", 0.6).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "MM");
legendSvg.append("rect").attr("x",180).attr("y",40).attr("height", 30).attr("width",90).style("fill","#fdbf11").style("fill-opacity", 0.9).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "MH");
legendSvg.append("rect").attr("x",0).attr("y",80).attr("height", 30).attr("width",90).style("fill","#ec008b").style("fill-opacity", 0.3).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "HL");
legendSvg.append("rect").attr("x",90).attr("y",80).attr("height", 30).attr("width",90).style("fill","#ec008b").style("fill-opacity", 0.6).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "HM");
legendSvg.append("rect").attr("x",180).attr("y",80).attr("height", 30).attr("width",90).style("fill","#ec008b").style("fill-opacity", 0.9).style("stroke","black").attr("stroke-opacity",0).attr("stroke-width",2).attr("id", "HH");

legendSvg.append("text").attr("x",280).attr("y",20).style("font-size", "16px").text("Response within 3 days");
legendSvg.append("text").attr("x",280).attr("y",60).style("font-size", "16px").text("Response within 6 days");
legendSvg.append("text").attr("x",280).attr("y",100).style("font-size", "16px").text("Response more than 6 days");

legendSvg.append("text").attr("x",40).attr("y", 125).style("font-size", "16px").text("<100");
legendSvg.append("text").attr("x",130).attr("y", 125).style("font-size", "16px").text("<500");
legendSvg.append("text").attr("x",220).attr("y", 125).style("font-size", "16px").text(">500");
legendSvg.append("text").attr("x",40).attr("y", 145).style("font-size", "16px").text("Requests per 10,000 Population");

var lineLegendSvg = d3.select("#lineLegend").append("svg").attr("transform", "translate(80,0)").attr("width",500);
lineLegendSvg.append("line").attr("x1", 0).attr("y1", 30).attr("x2", 60).attr("y2", 30).style("stroke", "#5c5859").style("stroke-width", 2).style("stroke-dasharray", "4,4");
lineLegendSvg.append("text").attr("x", 70).attr("y", 35).style("font-size", "14px").text("City Average");
lineLegendSvg.append("line").attr("x1", 180).attr("y1", 30).attr("x2", 240).attr("y2", 30).style("stroke", "red").style("stroke-width", 2);
lineLegendSvg.append("text").attr("x", 250).attr("y", 35).style("font-size", "14px").text("Selected Community");