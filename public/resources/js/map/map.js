var option = {
		"width":898,
		"height":698,
		"initialScale":5500,
		"initialX":-11800,
		"initialY":4050,
		"centered":null,
		"labels":null,
		"labelLoc":null,
		"clickType":"link",		//link : go to url. / action : run action.
		"clickUrl":null,
		"clickAction":null,
		"initialZoom":null,
		"displayLabels":true,
		"iszoom":false,
		"legendLoc":null,
		"code":null,
	};

var color = [
             ["#1f77b4", "#aec7e8"], ["#ff7f0e", "#ffbb78"],
             ["#2ca02c", "#98df8a"], ["#d62728", "#ff9896"],
             ["#9467bd", "#c5b0d5"], ["#8c564b", "#c49c94"],
             ["#e377c2", "#f7b6d2"], ["#7f7f7f", "#c7c7c7"],
             ["#bcbd22", "#dbdb8d"], ["#17becf", "#9edae5"]
             ];

function initOption(newoption) {
	if("width" in newoption) {
		option["width"] = newoption["width"];
	}
	if("height" in newoption) {
		option["height"] = newoption["height"];
	}
	if("initialScale" in newoption) {
		option["initialScale"] = newoption["initialScale"];
	}
	if("initialX" in newoption) {
		option["initialX"] = newoption["initialX"];
	}
	if("initialY" in newoption) {
		option["initialY"] = newoption["initialY"];
	}
	if("centered" in newoption) {
		option["centered"] = newoption["centered"];
	}
	if("labels" in newoption) {
		option["labels"] = newoption["labels"];
	}
	if("labelLoc" in newoption) {
		option["labelLoc"] = newoption["labelLoc"];
	}
	if("legendLoc" in newoption) {
		option["legendLoc"] = newoption["legendLoc"];
	}
	if("clickType" in newoption) {
		option["clickType"] = newoption["clickType"];
	}
	if("clickUrl" in newoption) {
		option["clickUrl"] = newoption["clickUrl"];
	}
	if("clickAction" in newoption) {
		option["clickAction"] = newoption["clickAction"];
	}
	if("displayLabels" in newoption) {
		option["displayLabels"] = newoption["displayLabels"];
	}
	if("code" in newoption) {
		option["code"] = newoption["code"];
	}
}

function drawMap(jsonpath, newoption) {
	if(newoption != null) {
		initOption(newoption);
	}

	var projection = d3.geo.mercator()
		.scale(option["initialScale"])
		.translate([option["initialX"], option["initialY"]]);
	option["projection"] = projection;

	var path = d3.geo.path()
		.projection(option["projection"]);
	option["path"] = path;

	var zoomObj = d3.behavior.zoom()
		.translate(option["projection"].translate())
		.scale(option["projection"].scale())
		.scaleExtent([option["height"], 800 * option["height"]])
		.on("zoom", zoom);
	option["zoom"] = zoomObj;

	var svg = d3.select("#maparea").append("svg")
		.attr("width", option["width"])
		.attr("height", option["height"])
		.attr('id', 'map');
	option["svg"] = svg;

	var states = option["svg"].append("g")
		.attr("id", "states");
//		.call(option["zoom"]);
	states.append("rect")
		.attr("class", "background")
		.attr("width", option["width"])
		.attr("height", option["height"])
	option["states"] = states;

	d3.json(jsonpath, function(json) {
		var maxCount = json.data.max_count;
		var minCount = json.data.min_count;
		var maxR = (40 / maxCount) * maxCount;
		var depth = json.data.depth;
		option["depth"] = depth;
		var features = json.data.features;
		option["states"].selectAll("path")
			.data(features)
			.enter().append("path")
			.attr("d", option["path"])
			.attr("id", function(d) { return 'path-'+d.properties.id; })
			.on("click", click)
		
		drawLine(features);
		//drawCircle(features, maxR, minCount, maxCount);
		drawLabel(features);
		drawDonut(features);
		drawLegend();
	});
}

function drawLegend() {
	var loc = option["legendLoc"];
	var code = option["code"];
	var x = 670, y = 520;
	if(loc != null) {
		if(code in loc) {
			var lloc = loc[code];
			x = lloc["x"];
			y = lloc["y"];
		}
	}
	d3.select("#tooltip")
		.style({
			left:x + "px",
			top:y+"px"
		});
	d3.select("#legend_0_0")
		.style("border", "1px solid " + color[0][0])
		.style("background-color", color[0][0]);
	d3.select("#legend_0_1")
		.style("border", "1px solid " + color[0][1])
		.style("background-color", color[0][1]);
	d3.select("#legend_1_0")
		.style("border", "1px solid " + color[1][0])
		.style("background-color", color[1][0]);
	d3.select("#legend_1_1")
		.style("border", "1px solid " + color[1][1])
		.style("background-color", color[1][1]);
//	d3.select("#tooltip").classed("hidden", false);
}

function drawLine(features) {
	var lines = option["states"].selectAll("line")
		.data(features)
		.enter().append("line")
		.style("stroke", "black")
		
		//for TEST
//		.attr("x1", function(d) { if(d.group == 0) {return d.pointx;} })
//		.attr("y1", function(d) { if(d.group == 0) {return d.pointy;} })
//		.attr("x2", function(d) { if(d.group == 0) {return getTransform(d)[0];} })
//		.attr("y2", function(d) { if(d.group == 0) {return getTransform(d)[1];} });
		
		//for REAL
		.attr("x1", function(d) {
			if(d.group == 0) {
				if(isDrawDonut(d) == 1) { return d.pointx; }
				else { return 0; }
			}
		})
		.attr("y1", function(d) {
			if(d.group == 0) {
				if(isDrawDonut(d) == 1) { return d.pointy; }
				else { return 0; }
			}
		})
		.attr("x2", function(d) {
			if(d.group == 0) {
				if(isDrawDonut(d) == 1) { return getTransform(d)[0]; }
				else { return 0; }
			}
		})
		.attr("y2", function(d) {
			if(d.group == 0) {
				if(isDrawDonut(d) == 1) { return getTransform(d)[1]; }
				else { return 0; }
			}
		});
}

function drawCircle(features, maxR, minCount, maxCount) {
//	var opacity = d3.scale.quantize()
//		.range([1.0, 1.0, 1.0, 0.9, 0.9, 0.9, 0.8, 0.8, 0.7]);
	var color = d3.scale.quantize()
		.range([
		        "rgb(8,48,107)", "rgb(8,81,156)", "rgb(33,113,181)", 
		        "rgb(66,146,198)", "rgb(107,174,214)", "rgb(158,202,225)", 
		        "rgb(198,219,239)", "rgb(222,235,247)", "rgb(247,251,255)"]);
//	opacity.domain([minCount, maxCount]);
	color.domain([minCount, maxCount]);
	var circles = option["states"].selectAll("circle")
		.data(features)
		.enter().append("circle")
		.attr("transform", labelsTransform)
		.attr("r", function(d) {
			if(d.group == 0) {
				var r = d.count;
				if(r > 0) {
					r = r * maxR / maxCount;
				}
				return r;
			}
		})
		.attr("fill", function(d) {
			if(d.group == 0) {
				var count = d.count;
				if(count) {
					return color(count);
				} else {
					return "rgb(247,251,255)";
				}
			}
		})
	//	.attr("fill-opacity", function(d) {
	//		var count = d.count;
	//		if(count) {
	//			return opacity(count);
	//		} else {
	//			return 1.0;
	//		}
	//	})
		.on("click", click)
	option["circles"] = circles;
}

function makeDonutData(d) {
	var data = {
			//for TEST
//			count:[(d.mcount > 0) ? d.mcount : 1, ((d.count - d.mcount) > 0) ? (d.count - d.mcount) : 1],
//			money:[(d.min_money > 0) ? d.min_money : 1, (d.max_money > 0) ? d.max_money : 1]
////			money:[(d.max_money > 0) ? d.max_money : 1, (d.min_money > 0) ? d.min_money : 1]
			
			//for REAL
			count:[d.mcount, (d.count - d.mcount)],
			money:[d.min_money, d.max_money]
	};
	return data;
}

function drawDonut(features) {
	var cindex = 0, cwidth = 20;
	var pie = d3.layout.pie().sort(null);
	var arc = d3.svg.arc();
//	var color = d3.scale.category20();
	for(var k=0; k<features.length; k++) {
		cindex = 0;
		var f = features[k];
		if(f.group == 0) {
			var donut = makeDonutData(f);
			var g1 = option["svg"]
				.append("g")
				.attr("transform", function(d){
			    	return "translate(" + f.pointx + "," + f.pointy + ")";
			    });
			var gs = g1.selectAll("g")
				.data(d3.values(donut))
				.enter().append("g");
			var path = gs.selectAll("path")
				.data(function(d){
					return pie(d);
				})
				.enter().append("path")
			    .attr("fill", function(d, i, j) {
//			    	return color(cindex++);
			    	return color[j][i];
			    })
			    .attr("id", function(d, i, j) { return "donut_" + i + "_" + j + "__" + k })
			    .attr("d", function(d, i, j){
			    	return arc.innerRadius(3+cwidth*(j+0)).outerRadius(cwidth*(j+1))(d);
			    })
			var text = gs.selectAll("text")
				.data(function(d){
					return pie(d);
				})
				.enter().append("text")
				.style("fill", "Black")
				.style("font", "bold 9px Arial");
			gs.selectAll("text")
				.each(function (d, i, j) {
					if(j == 0) {			// normal label
						var c = arc.innerRadius(5+cwidth*(j+0)).outerRadius(cwidth*(j+1));
						d3.select(this)
							.attr("text-anchor", "middle") //center the text on it's origin
							.attr("transform", function() {
								return "translate(" + c.centroid(d) + ")";
							})
							.text(function() {
								if(d.data > 0) { return comma(d.data); }
								else { return ""; }
							});
					} else if(j == 1) {		// curved label inside arc
						d3.select(this)
							.attr("x", 5)
							.attr("dy", 13)
							.append("textPath")
							.attr("xlink:href", function() {
								return "#donut_" + i + "_" + j + "__" + k;
							})
							.text(function() {
								if(d.data > 0) { return comma(d.data); }
								else { return ""; }
							});
					}
				})
		}
	}
}

function drawLabel(features) {
	var gmap = {}, rmap = {};
	var lpos = [];
	var lsize = [];
	var rects = option["states"].selectAll("rect")
		.filter("mlabel")
		.data(features)
		.enter().append("rect")
		.on("click", click)
		.attr("class", "mlabel");
	var labels = option["states"].selectAll("text")
		.data(features)
		.enter().append("text")
		.attr("fill", function(d, i) {
			if(option["displayLabels"] == true) {
				if(d.group == 0) {
					return "#F5F5F5";
				} else {
					if(d.group in gmap) {
						;
					} else {
						return "#2F4F4F";
					}
				}
			}
		})
		.attr("transform", labelsTransform)
		.attr("id", function(d) { return 'label-'+d.properties.id; })
		.attr("text-anchor", "middle")
		.attr("dy", ".15em")
		.style("font-size", "10px")
		.on("click", click)
		.text(function(d) {
			if(option["displayLabels"] == true) {
				if(d.group == 0) {
					return d.properties.name;
				} else {
					if(d.group in gmap) {
						return "";
					} else {
						gmap[d.group] = 1;
						return d.groupname;
					}
				}
			} else {
				return "";
			}
		});
	option["states"].selectAll("text")
		.each(function(d, i) {
			lsize[i] = this.getBBox();
			lpos[i] = getTransform(d);
		});
//		.on("mouseover", mapMouseOver)
//		.on("mouseout", mapMouseOut);
	var marginW = 4, marginH = 4;
	var roundX = 6, roundY = 6;
	option["states"].selectAll(".mlabel")
		.attr("rx", roundX)
		.attr("ry", roundY)
		.attr("fill", function(d, i) {
			if(d.group == 0) {
				return "#778899";
			} else {
				if(d.group in rmap) {
					;
				} else {
					rmap[d.group] = 1;
					return "#FFA500";
				}
			}
		})
		.attr("width", function(d, i) {
			if(lsize[i].width > 0 && lsize[i].height > 0) {
				return Math.ceil(lsize[i].width) + marginW;
			}
		})
		.attr("height", function(d, i) {
			if(lsize[i].width > 0 && lsize[i].height > 0) {
				return Math.ceil(lsize[i].height) + marginH;
			}
		})
		.attr("transform", function(d, i, j) { //set the label's origin to the center of the arc
			if(lsize[i].width > 0 && lsize[i].height > 0) {
				var pos = lpos[i];
				var x = (lsize[i].width + marginW) / 2;
				var y = (lsize[i].height + marginH) / 2;
				x = pos[0] - x;
				y = pos[1] - y - 2;
				return "translate(" + x + ", " + y + ")";
			}
		});
	option["labels"] = labels;
}

function isDrawDonut(d) {
	var result = 0;
	if( d.count>0 || 
			(d.min_money > 0 && d.max_money > 0) ) {
		result = 1;
	}
	return result;
}

function mapMouseOver(d) {
	if(option["iszoom"] == false) {
		var x = 670, y = 520;
		d3.select("#tooltip")
			.style({
				left:x + "px",
				top:y+"px"
			})
			.select("#tvalue")
			.text(d.properties.name);
		d3.select("#tooltip")
			.select("#tcount")
			.text(comma(d.count));
		d3.select("#tooltip")
			.select("#mcount")
			.text(comma(d.mcount));
		d3.select("#tooltip")
			.select("#nmcount")
			.text(comma(d.count - d.mcount));
		d3.select("#tooltip")
			.select("#min_money")
			.text(comma(d.min_money));
		d3.select("#tooltip")
			.select("#max_money")
			.text(comma(d.max_money));
		d3.select("#tooltip").classed("hidden", false);
	}
}

function mapMouseOut(d) {
	d3.select("#tooltip").classed("hidden", true);
}

function click(d) {
	var code = d.properties.id;
	var param = "";
	if(d.group == 0) {
		param = "?code=" + code + "&depth=" + (parseInt(option["depth"]) + 1);
	} else {
		if(parseInt(option["depth"]) == 1) {
			param = "?code=" + $("#code").val() + "&depth=" + parseInt(option["depth"]) + "&group=" + d.group;
		} else {
			param = "?code=" + $("#code").val() + "&depth=" + $("#depth").val() + "&group=" + d.group + "&detail_code=" + code;
		}
	}
	d.urlparam = param;
	if(option["clickType"] == "link") {
		var url = option["clickUrl"] + param;
		$(location).attr("href", url);
	} else if(option["clickType"] == "action") {
		option["clickAction"](d);
	} else {
		;
	}
}

function zoom() {
	var path = option["path"];
	var projection = option["projection"];
	var states = option["states"];
	var labels = option["labels"];
	var circles = option["circles"];
	
	projection.translate(d3.event.translate).scale(d3.event.scale);
	states.selectAll("path").attr("d", path);
	labels.attr("transform", labelsTransform);
	circles.attr("transform", labelsTransform);
}

function labelsTransform(d) {
	return "translate(" + getTransform(d) + ")";
}

function getTransform(d) {
	var initialScale = option["initialScale"];
	var width = option["width"];
	var height = option["height"];
	var loc = option["labelLoc"];

	var id = parseInt(d.properties.id);
	try {
		if (id in loc) {
			var lloc = loc[id];
			var isgroup = lloc["isgroup"];
			var value = 0;
			var arr = option["path"].centroid(d);
			if(isgroup == 1 && d.group != 0) {
				isgroup = 0;
			}
			if(isgroup == 0) {
				if("y" in lloc) {
					value = lloc["y"];
					arr[1] += (d3.event && d3.event.scale) ? (d3.event.scale / height + value) : (initialScale / height + value);
				}
				if("x" in lloc) {
					value = lloc["x"];
					arr[0] += (d3.event && d3.event.scale) ? (d3.event.scale / width + value) : (initialScale / width + value);
				}
			}
			return arr;
		} else {
			return option["path"].centroid(d);
		}
	} catch (e) {
		return option["path"].centroid(d);
	}
}
