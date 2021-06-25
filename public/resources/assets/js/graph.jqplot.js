function drawPie(divid, dataList, title, padding, legend) {
	var gridPadding = {top:20, bottom:38, left:0, right:0};
	var glegend = {show:true};
	if(padding != null) {
		gridPadding = padding;
	}
	if(legend != null) {
		glegend = legend;
	}
	var options = {
			title : title,
			animate: !$.jqplot.use_excanvas,
			gridPadding: gridPadding,
			seriesDefaults:{
				renderer: $.jqplot.PieRenderer,
				rendererOptions: {
					shadow:false,
					sliceMargin: 1,
					startAngle: -90,
					dataLabels: 'value',
					showDataLabels:true
				}
			},
			legend:glegend,
			grid:{
				drawBorder:true,
				shadow:false,
				background:"#FFFFFF",
				borderWidth:0.5,
			}
	};
	var chart = $.jqplot(
			divid,
			dataList,
			options
		);
	return chart;
}

function drawLineGraph(divId, title, dataList, seriesList, label, option) {
	var options = {
			title: title,
			animate: !$.jqplot.use_excanvas,
			series:seriesList,
			legend:{
				show:true,
				location:'ne',
				renderer: $.jqplot.EnhancedLegendRenderer,
				placement:"outsideGrid"
			},
			axes: {
				xaxis: {
					renderer: $.jqplot.CategoryAxisRenderer,
					tickRenderer:$.jqplot.CanvasAxisTickRenderer,
					labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
					ticks: label,
					tickOptions: {
						angle: -30
					}
				},
				yaxis: {
					tickOptions: {
						formatString: "%'d"
					}
				}
			},
			highlighter: {
				show: false
			},
			grid:{
				drawBorder:false,
				shadow:false,
				background:"#FFFFFF"
			}
		};
	if("seriesColors" in option) {
		options["seriesColors"] = option["seriesColors"];
	}
	var chart = $.jqplot(
			divId,
			dataList,
			options
		);
	return chart;
}

function drawGraph(divId, title, dataList, seriesList, label, base, option) {
	var seriesDefaults = {
		renderer:$.jqplot.BarRenderer,
		rendererOptions: {
			fillToZero: true,
			barMargin: 10,
			animation: {
				speed: 2000
			},
			varyBarColors: true,
			pointLabels: {
				show: true,
				edgeTolerance: -10,
				hideZeros: false
			},
			shadow:false,
		},
	};
	if("barDirection" in option) {
		seriesDefaults["rendererOptions"]["barDirection"] = option["barDirection"];
	}
	if("pointLabels" in option) {
		seriesDefaults["pointLabels"] = option["pointLabels"];
	}
	var options = {
			title: title,
			animate: !$.jqplot.use_excanvas,
			seriesDefaults:seriesDefaults,
			series:seriesList,
			legend:{
				show:true,
				location:'s',
				renderer: $.jqplot.EnhancedLegendRenderer,
				placement:"outsideGrid",
				rowSpacing : '0px',
				rendererOptions: {
			        numberRows: 1
			    }
			},
			axes: {
				xaxis: {
					renderer: $.jqplot.CategoryAxisRenderer,
					tickRenderer:$.jqplot.CanvasAxisTickRenderer,
					labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
					ticks: label,
					tickOptions: {
						angle: -30
					}
				},
				yaxis: {
					tickOptions: {
						formatString: "%'d"
					}
				}
			},
			highlighter: {
				show: false
			},
			grid:{
				drawBorder:false,
				shadow:false,
				background:"#FFFFFF"
			}
		};
	if("stackSeries" in option) {
		options["stackSeries"] = option["stackSeries"];
	}
	if("seriesColors" in option) {
		options["seriesColors"] = option["seriesColors"];
	}
	if("negativeSeriesColors" in option) {
		options["negativeSeriesColors"] = option["negativeSeriesColors"];
	}
	if("axes" in option) {
		options["axes"] = option["axes"];
	}
	if(parseInt(base) > 0) {
		var canvasOverlay = {
				show:true,
				objects:[
					{horizontalLine: {
						name: 'base',
						y: parseInt(base),
						lineWidth: 3,
						xOffset: 0,
						color: '#FF00FF',
						shadow: false
					}}
				]
		};
		options["canvasOverlay"] = canvasOverlay;
	}
	var chart = $.jqplot(
			divId,
			dataList,
			options
		);
	return chart;
}

function createGraphObject(parentid, objid, css) {
	var gObj = $(document.createElement("div"))
		.attr({"id":objid})
		.css(css);
	$("#" + parentid).append(gObj);
}