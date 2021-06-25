function initSido() {
	var scale = parseInt($("#scale").val());
	var x = parseInt($("#x").val());
	var y = parseInt($("#y").val());
	var code = $("#code").val();
	var depth = $("#depth").val();
	var group = parseInt($("#group").val());
	var option = {
		"labelLoc":labelLoc,	// data.js
		"legendLoc":legendLoc,	// data.js
		"initialScale":scale,
		"initialX":x,
		"initialY":y,
		"clickType":"action",
		"clickAction":viewDetail,
		"clickUrl":"/center/detail",
		"displayLabels":true,
		"code" : code,
	};
//	if(depth < 2) {
//		if(isSpecialCity(code, depth)) {
//			option["clickType"] = "action";
//		} else {
//			option["clickType"] = "link";
//		}
//	} else {
//		option["clickType"] = "action";
//	}
	var jsonpath = $("#jsonpath").val();
	drawMap(jsonpath, option);
}

function closeStatus() {
	$("#status_layer_pop").fadeOut();
//	sidoZoom(option["detail"]);
}

function viewDetail(d) {
	var id = d.properties.id;
	var isdetail = $("#isdetail").val();
	var mcount = d.mcount;
	var code = $("#code").val();
	if(isdetail == 1 || (d.group == 0 && d.depth == 2)) {
		if(mcount > 0) {
			drawStatus(id);
		} else {
			alert(t("sido.nopostnatal"));
		}
	} else {
		var url = "/center/detail" + d.urlparam;
		$(location).attr("href", url);
	}
	
//	var mcount = d.mcount;
//	if(mcount > 0) {
//		drawStatus(id);
//	} else {
//		alert(t("sido.nopostnatal"));
//	}
	
//	sidoZoom(d);
}

function sidoZoom(d) {
	var x, y, k;
	var path = option["path"];
	var centered = option["centered"];
	var states = option["states"];
	var width = option["width"];
	var height = option["height"];
	var id = d.properties.id;

	if (d && option["centered"] !== d) {
		var centroid = path.centroid(d);
		x = centroid[0];
		y = centroid[1];
		k = 4;
		option["centered"] = d;
	} else {
		x = width / 2;
		y = height / 2;
		k = 1;
		option["centered"] = null;
	}

	option["states"].selectAll("path")
		.classed("active", option["centered"] && 
			function(d) {
				return d === option["centered"];
			}
	);

	option["states"]
		.transition()
		.duration(1000)
		.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")");
//		.style("stroke-width", 1.5 / k + "px");
	
	if(option["iszoom"] == false) {
		option["iszoom"] = true;
		option["detail"] = d;
//		drawStatus(id);
	} else {
		if(d === option["detail"]) {
			option["detail"] = null;
			option["iszoom"] = false;
		} else {
			option["iszoom"] = true;
			option["detail"] = d;
//			drawStatus(id);
		}
	}
}

function drawStatus(code, mcount) {
	viewBranchStat(code, function(data) {
		var branch = data.branch;
		var avg_min_money = data.avg_min_money;
		var avg_max_money = data.avg_max_money;
		var avg_room_count = data.avg_room_count;
		var avg_enterance_count = data.avg_enterance_count;
		var avg_reservation_count = data.avg_reservation_count;
		alert(JSON.stringify(data));
	});
}

function drawStatusOld(id) {	// id == map geo code
	setTimeout(function () {
		viewBranchStatOld(id, function(current_room_status){
			if(current_room_status != null && current_room_status != "null" &&
					current_room_status != "undefined") {
				// popup layer.
				d3.select("#status_layer_pop")
					.style({
						left:"0px",
						top:"0px",
					});
				var el = $("#status_layer");
				el.css({
					"margin-top":'-'+el.outerHeight()/2+'px',
					"margin-left":'-'+el.outerWidth()/2+'px'
				});
				$("#status_layer_pop").fadeIn();
				// draw canvas.
				$("#canvas").empty();
				var isfirst = true;
				for(var branch_no in current_room_status) {
					if(current_room_status.hasOwnProperty(branch_no)) {
						var branch = current_room_status[branch_no];
						var centerName = branch['care_center_name'];
						var branchName = branch['branch_name'];
						var roomStatus = branch['room'];
						var balanceStatus = branch['balance'];
						// title area.
						var css = {"margin-left":"10px","margin-bottom":"10px","width":"750px","text-align":"center"};
						if(isfirst == false) {
							css["margin-top"] = "20px";
						}
						var tdObj = $(document.createElement("div"))
							.css(css);
						var tsObj = $(document.createElement("div"))
							.html(centerName + " " + branchName)
							.css({"font-weight":"bold","font-size":"12pt","color":"#4682B4"});
						tdObj.append(tsObj);
						$("#canvas").append(tdObj);
						// room status
						var stObj = $(document.createElement("div"))
							.css({"width":"750px","text-align":"left","font-weight":"bold","color":"#008080","margin-bottom":"10px"})
							.html(t("sido.roomlist") + "(" + $("#today").val() + ")");
						$("#canvas").append(stObj);
						drawRoom(branch_no, roomStatus);
						// balance
						var blObj = $(document.createElement("div"))
							.css({"width":"750px","text-align":"left","font-weight":"bold","color":"#008080","margin-top":"20px"})
							.html(t("sido.salelist"));
						$("#canvas").append(blObj);
						drawBalance(branch_no, balanceStatus);
						isfirst = false;
					}
				}
			}
		});
	}, 0);
}

function drawRoom(branch_no, roomStatus) {
	if(roomStatus != null && roomStatus != 'null' && roomStatus != 'undefined') {
		for(var i=0; i<roomStatus.length; i++) {
			var status = roomStatus[i];
			var id = "room_status_" + branch_no + "_" + i;
			createGraphObject("canvas", id, {"width":"200px","height":"200px","float":"left","margin-left":"20px"});
			var title = status.name;
			var room_count = parseInt(status.room_count);
			var enterance_count = parseInt(status.enterance_count);
			var reservation_count = parseInt(status.reservation_count);
			var empty_room_count = room_count - (enterance_count + reservation_count);
			var pdata = [
			             	[t("sido.reservation"), reservation_count],
			            	[t("balance.enter"), enterance_count],
			            	[t("sido.emptyroom"), empty_room_count]
			            ];
			drawPie(id, [pdata], title, null, null);
		}
	} else {
		var id = "room_status_" + branch_no;
		createGraphObject("canvas", id, {"width":"200px","height":"200px","float":"left","margin-left":"20px"});
		var pdata = [
		             	[t("sido.reservation"), 0],
		            	[t("balance.enter"), 0],
		            	[t("sido.emptyroom"), 0]
		            ];
		drawPie(id, [pdata], "", null, null);
	}
}

function drawBalance(branch_no, balanceStatus) {
	var balance = balanceStatus['balance'];
	var setting = balanceStatus['balance_setting'];
	var label = balanceStatus['label'];
	var rseries = [
	               {label:t("center.reservecase")},
	               {label:t("balance.enterschedule")},
	               {label:t("balance.entercase")}
	               ];
	var pseries = [
	               {label:t("sido.realpay")},
	               {label:t("sido.payschedule")}
	               ];
	var rid = "balace_status_R_" + branch_no;
	var pid = "balace_status_P_" + branch_no;
	createGraphObject("canvas", rid, {"width":"650px","height":"200px","margin-left":"20px","margin-top":"10px"});
	createGraphObject("canvas", pid, {"width":"650px","height":"200px","margin-left":"20px","margin-top":"10px"});
	var roption = {pointLabels:{show: true,edgeTolerance: -5,hideZeros: false},};
	var rChart = drawGraph(rid, t("sido.reservelist"), [balance[0], balance[1], balance[2]], rseries, label, setting["base_count"], roption);
	var poption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},};
	var pChart = drawGraph(pid, t("sido.salelist"), [balance[3], balance[4]], pseries, label, setting["base_money"], poptions);
}

function isSpecialCity(code, depth) {
	var root = code;
	if(depth < 2) {
		code.substring(0, 2);
	}
	if(root in specialCicy) {
		return true;
	} else {
		return false;
	}
}
