

function displayEnterOut(id, list) {
	if(list != null && list.length > 0) {
		for(var i=0; i<list.length; i++) {
			var r = list[i];
			
			var clsName = '';
			if (r.room_grade_name == t("index.grade.gold") || r.room_grade_name == 'Gold' || r.room_grade_name == 'Gold Room') {
				clsName = 'gold'; 
			} else if (r.room_grade_name == t("index.grade.silver") || r.room_grade_name == 'Silver') {
				clsName = 'silver'; 
			} else {
				clsName = 'premium'; 
			}
			
			var contents = '<li>';
			contents += '<dl class="roon-inout">';
			contents += '<dt class="room ' + clsName + '">' + r.room_grade_name + '</dt>';
			contents += '<dd>';
			contents += '<span class="name">' + r.name + '</span>';
			contents += '<span class="date">' + r.from_date + '~' + r.to_date +'</span>';
			contents += '</dd>';
			contents += '</dl>';
			contents += '</li>';

			$(id).append(contents);
		}
	}
}

function displayReservationList(rid, room_grade_no, reservation_list) {
	var contents = "";
	var inner = "";

	if(reservation_list != null && reservation_list.length > 0) {
		contents += '<div class="status-panel-list">';
		contents += '<ul class="list" >';
		
		for(var i=0; i<reservation_list.length; i++) {
			var r = reservation_list[i];
			if(r.room_grade_no != room_grade_no) {
				continue;
			}
			inner += '<li>';
			inner += '<span class="cell name">' + r.name + '</span>';
			inner += '<span class="cell date">' + r.from_date + '~' + r.to_date +'</span>';
			inner += '</li>';
		}
		
		
		
		if(inner == "") {
			contents = "<p class=\"empty\">"+t("index.no.reservation") +"</p>";
		} else {
			contents += inner
			contents += '</ul>';
			contents += '</div>';
		}
		
		
	} else {
		contents = "<p class=\"empty\">"+t("index.no.reservation") +"</p>";
	}
	
	$("#"+rid).append(contents);
}

function getTodayReservaitonCount(room_grade_no, list) {
	var count = 0;
	if(list != null && list.length > 0) {
		for(var i=0; i<list.length; i++) {
			var r = list[i];
			if(room_grade_no == r.room_grade_no) {
				count = count + 1;
			}
		}
	}
	return count;
}

function getCurrentRoomStatus() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			from_date : $("#from_date").val(),
			to_date : $("#to_date").val(),
			bno : bno
		},
		traditional: true,
		url: '/room/current/status',
		error: function() {
			alert(t("index.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				if(data != null) {
					var contents = "";
					var list = null;
					if(data.today_enter != null && data.today_enter.length > 0) {
						list = data.today_enter;
						displayEnterOut("#today_enter_list", list);
					} else {
						contents = "<li class=\"empty\">"+ t("index.no.reservation") + "</li>";
						$("#today_enter_list").append(contents);
					}
					if(data.today_out != null && data.today_out.length > 0) {
						list = data.today_out;
						displayEnterOut("#today_out_list", list);
					} else {
						contents = t("index.reserve.todayexits");
						$("#today_out_list").append(contents);
					}
					if(data.tomorrow_enter != null && data.tomorrow_enter.length > 0) {
						list = data.tomorrow_enter;
						displayEnterOut("#tomorrow_enter_list", list);
					} else {
						contents = t("index.reserve.tomorrowenter");
						$("#tomorrow_enter_list").append(contents);
					}
					if(data.tomorrow_out != null && data.tomorrow_out.length > 0) {
						list = data.tomorrow_out;
						displayEnterOut("#tomorrow_out_list", list);
					} else {
						contents = t("index.reserve.tomorrowexits");
						$("#tomorrow_out_list").append(contents);
					}
				}
				
				if(data != null &&
						data.current_room_status != null &&
						data.current_room_status.length > 0) {
					$("#canvas").show();
					$("#noroom").hide();
					var current_room_status = data.current_room_status;
					for(var i=0; i<current_room_status.length; i++) {
						var status = current_room_status[i];
						var room_grade_no = status.room_grade_no
						var id = "curstatus"+i;
						var rid = "curstatus_r_"+i;
						var rgid = id+"_rgno";
						
						var title = status.name;
						var today_enter_count = getTodayReservaitonCount(room_grade_no, data.today_enter);
						var today_out_count = getTodayReservaitonCount(room_grade_no, data.today_out);
						var room_count = parseInt(status.room_count);
						var enterance_count = parseInt(status.enterance_count);
						var empty_room_count = room_count - (enterance_count + today_enter_count);
						empty_room_count = empty_room_count - today_out_count;
						
						if(empty_room_count < 0) {
							empty_room_count = 0;
						}
						if(enterance_count < 0) {
							enterance_count = 0;
						}
						
						var clsName = '';
						if (title == t("index.grade.gold") || title == 'Gold' || title == 'Gold Room') {
							clsName = 'gold'; 
						} else if (title == t("index.grade.silver") || title == 'Silver') {
							clsName = 'silver'; 
						} else {
							clsName = 'premium';
						}
						
						
						var content = '<div class="grid-col grid-col-6">';
						content += '<div class="current-room-status">';
						content += '<h2 class="room ' + clsName + '">' + title + '</h2>';
						content += '<div class="legend">';
						content += '<ul class="list">';
						content += '<li>';
						content += '<i class="color type-1"></i>';
						content += t("index.room.empty");
						content += '</li>';
						content += '<li>';
						content += '<i class="color type-2"></i>';
						content += t("index.room.fulls");
						content += '</li>';
						content += '<li>';
						content += '<i class="color type-3"></i>';
						content += t("index.room.todayenter");
						content += '</li>';
						content += '<li>';
						content += '<i class="color type-4"></i>';
						content += t("index.room.todayexit");
						content += '</li>';
						content += '</ul>';
						content += '</div>';
						
						content += '<div class="chart-display">';
						content += '<div class="bar-chart">';
						content += '<div class="bar type-1" data-value="' + empty_room_count + '"></div>';
						content += '<div class="bar type-2" data-value="'+ enterance_count +'"></div>';
						content += '<div class="bar type-3" data-value="'+ today_enter_count +'"></div>';
						content += '<div class="bar type-4" data-value="'+ today_out_count +'"></div>';
						content += '</div>';
						content += '</div>';
                    
						
						content += '<div class="status-content" id="' + rid + '">';
						
						contents = "<p class=\"empty\">"+ t("index.no.room.reservation")+"</p>";
						
						content += '</div>';
						content += '</div>';
						content += '</div>';
						
						$("#canvas").append(content);
						displayReservationList(rid, room_grade_no, data.reservation_list);
						/*
						
						
						var pdata = [
			             	[t("sido.emptyroom"), empty_room_count],
			             	[t("index.room.full"), enterance_count],
			             	[t("index.today.enter"), today_enter_count],
			             	[t("index.today.exit"), today_out_count]
			            	
			            ];
						var legend = {
								show: true,
					            rendererOptions: {
					                numberRows: 1
					            },
					            location: 'ne'
						};
						var chart = drawPie(id, [pdata], title, null, legend);
						*/
						/*
						var chartDivObj = $(document.createElement("div"))
									.attr({"id":id})
									.css({"width":"600px","height":"300px","float":"left","margin-left":"10px"});
						var reservationDivObj = $(document.createElement("div"))
									.attr({"id":rid})
									.css({"width":"600px","min-height":"300px","float":"left","margin-left":"10px"});
						var inputObj = $(document.createElement("input"))
									.attr({"id":rgid, "type":"hidden", "value":status.no});
						$("#canvas").append(chartDivObj);
						$("#canvas").append(reservationDivObj);
						$("#canvas").append(inputObj);
						displayReservationList(rid, room_grade_no, data.reservation_list);
						
						var title = status.name;
						var today_enter_count = getTodayReservaitonCount(room_grade_no, data.today_enter);
						var today_out_count = getTodayReservaitonCount(room_grade_no, data.today_out);
						var room_count = parseInt(status.room_count);
						var enterance_count = parseInt(status.enterance_count);
						var empty_room_count = room_count - (enterance_count + today_enter_count);
//						enterance_count = enterance_count - today_enter_count;
						empty_room_count = empty_room_count - today_out_count;
//						var reservation_count = parseInt(status.reservation_count);
//						var today_reservation_count = parseInt(status.today_reservation_count);
//						var empty_room_count = room_count - (enterance_count + reservation_count + today_reservation_count);
						if(empty_room_count < 0) {
							empty_room_count = 0;
						}
						if(enterance_count < 0) {
							enterance_count = 0;
						}
						var pdata = [
						             	[t("sido.emptyroom"), empty_room_count],
						             	[t("index.room.full"), enterance_count],
						             	[t("index.today.enter"), today_enter_count],
						             	[t("index.today.exit"), today_out_count]
						            	
						            ];
						var legend = {
								show: true,
					            rendererOptions: {
					                numberRows: 1
					            },
					            location: 'ne'
						};
						var chart = drawPie(id, [pdata], title, null, legend);
						*/
					}
					
					$('.bar-chart').each(function(){
				        var el = $(this),
				            bars = el.find('.bar'),
				            total = 0;
				        bars.each(function(){
				            var bar = $(this),
				                value = bar.data('value');
				            total += value;
				            if (value != 0) {
				                bar.text(value);
				            }
				        });
				        bars.each(function(){
				            var bar = $(this),
				                value = bar.data('value');
				            if (value != 0) {
				                bar.css('width', (value / total * 100) + '%');
				            }
				        })
				      
				    })
				} else {
					$("#canvas").hide();
					$("#noroom").show();
				}
				
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("index.wrong.check"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function getEmptyRoomList(room_grade_no, from_date, to_date) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			from_date : from_date,
			to_date : to_date,
			bno : bno
		},
		traditional: true,
		url: '/reservation/check',
		error: function() {
			alert(t("index.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$("#empty_room").html("");
				var data = res.data;
				var room_grade_list = data.room_grade_list;
				var room_status = data.room_status.room;
				var contents = "";
				if($.isEmptyObject(room_status)) {
					contents = t("index.reserve.noroom");
				} else {
					for(var i=0; i<room_grade_list.length; i++) {
						var grade = room_grade_list[i];
						if(grade.no in room_status && grade.no == room_grade_no) {
							contents = contents + "<li>";
							contents = contents + grade.name + " : ";
							var room_list = room_status[grade.no];
							for(var k=0; k<room_list.length; k++) {
								var room = room_list[k];
								if(k != 0) {
									contents = contents + ", ";
								}
								contents = contents + "<span style=\"font-weight:bold;color:#1E90FF;\">" + room.room_name + "</span>";
							}
							contents = contents + "</li>";
						}
					}
				}
				$("#empty_room").append(contents);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("index.wrong.check"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function checkReservation() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var from_date = $("#from_date").val();
	var to_date = $("#to_date").val();
	if(isNull(from_date)) {
		co.alert(t("index.input.enterdays"), function(){$("#from_date").focus();});
		return false;
	}
	if( isValidDate(from_date) == false ) {
		co.alert(t("index.wrong.enterdays"), function(){$("#from_date").focus();});
		return false
	}
	if(isNull(to_date)) {
		co.alert(t("index.input.exitdays"), function(){$("#to_date").focus();});
		return false;
	}
	if( isValidDate(to_date) == false ) {
		co.alert(t("index.wrong.exitdays"), function(){$("#to_date").focus();});
		return false
	}
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			from_date : $("#from_date").val(),
			to_date : $("#to_date").val(),
			bno : bno
		},
		traditional: true,
		url: '/reservation/check',
		error: function() {
			alert(t("index.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$("#check_result").html("");
				var data = res.data;
				var room_grade_list = data.room_grade_list;
				var room_status = data.room_status.room;
				var contents = "";
				if($.isEmptyObject(room_status)) {
					contents = t("index.reserve.noroom");
				} else {
					for(var i=0; i<room_grade_list.length; i++) {
						var grade = room_grade_list[i];
						if(grade.no in room_status) {
							contents += '<li>';
							contents += '<h2 class="cell room-type">';
							contents += grade.name;
							contents += '</h2>';
							contents += '<ul class="cell room-list clearfix">';
							
							var room_list = room_status[grade.no];
							for(var k=0; k<room_list.length; k++) {
								var room = room_list[k];
								contents += '<li><a href="#" class="room-number">';
								contents += room.room_name;
								contents += '</a></li>';
							}
							
							contents += '</ul>';
							contents += '</li>';
						}
					}
				}
				$("#check_result").append(contents);
				$("#check_box").show();
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("index.wrong.check"));
					hideLoadingLayer();
				}
			}
		}
	});
}

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
			
			animate: !$.jqplot.use_excanvas,
			gridPadding: gridPadding,
			seriesDefaults:{
				seriesColors: ["#55bcdd", "#4a88db", "#eb5463", "#d1d1d1"],
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
				drawBorder:false,
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

$( document ).ready(function() {
	
	$('a', $('#nav')).each(function( index ) {
		if ($(this).text() == t("counsel.home") ) {
			$(this).parent().addClass("active");
		}
	});
	
	getCurrentRoomStatus();
});