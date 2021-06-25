

function displayEnterOut(id, list) {
	if(list != null && list.length > 0) {
		for(var i=0; i<list.length; i++) {
			var r = list[i];
			var contents = "<tr>";
			contents = contents + "<td style='border:0px;vertical-align:middle;'>";
			contents = contents + t("index.grade") + r.room_grade_name;
			contents = contents + "</td>"
			contents = contents + "<td style='border:0px;vertical-align:middle;'>";
			contents = contents + t("index.momname") + r.name;
			contents = contents + "</td>"
			contents = contents + "<td style='border:0px;vertical-align:middle;'>";
			contents = contents + t("index.reserveday") + r.from_date + "~" + r.to_date;
			contents = contents + "</td>"
			contents = contents + "</tr>";
			$(id).append(contents);
		}
	}
}

function displayReservationList(rid, room_grade_no, reservation_list) {
	var contents = "";
	var inner = "";
	contents = contents + "<table>";
	contents = contents + "<tr>";
	contents = contents + "<td style='font-size:10pt;font-weight:bold;' colspan='3'>미입실 예약</td>";
	contents = contents + "</tr>";
	if(reservation_list != null && reservation_list.length > 0) {
		for(var i=0; i<reservation_list.length; i++) {
			var r = reservation_list[i];
			if(r.room_grade_no != room_grade_no) {
				continue;
			}
			inner = inner + "<tr>";
			inner = inner + "<td style='border:0px;vertical-align:middle;'>";
			inner = inner + t("index.grade") + r.room_grade_name;
			inner = inner + "</td>"
			inner = inner + "<td style='border:0px;vertical-align:middle;'>";
			inner = inner + t("index.momname") + r.name;
			inner = inner + "</td>"
			inner = inner + "<td style='border:0px;vertical-align:middle;'>";
			inner = inner + t("index.reserveday") + r.from_date + "~" + r.to_date;
			inner = inner + "</td>"
			inner = inner + "</tr>";
		}
		if(inner == "") {
			inner = t("index.reserve.noshows");
		}
	} else {
		inner = t("index.reserve.noshows");
	}
	contents = contents + inner;
	contents = contents + "</table>";
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
						contents = t("index.reserve.todayenter");
						$("#today_enter_list").append(contents);
					}
					if(data.today_out != null && data.today_out.length > 0) {
						list = data.today_out;
						displayEnterOut("#today_out_list", list);
					} else {
						contents = t("index.reserve.todayexit");
						$("#today_out_list").append(contents);
					}
					if(data.tomorrow_enter != null && data.tomorrow_enter.length > 0) {
						list = data.tomorrow_enter;
						displayEnterOut("#tomorrow_enter_list", list);
					} else {
						contents = t("index.reserve.enterschedule");
						$("#tomorrow_enter_list").append(contents);
					}
					if(data.tomorrow_out != null && data.tomorrow_out.length > 0) {
						list = data.tomorrow_out;
						displayEnterOut("#tomorrow_out_list", list);
					} else {
						contents = t("index.reserve.tomorrowexit");
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
						var chartDivObj = $(document.createElement("div"))
									.attr({"id":id})
									.css({"width":"300px","height":"300px","float":"left","margin-left":"10px"});
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
						             	[t("index.today.exitschedule"), today_out_count],
						            	[t("index.room.full"), enterance_count],
						            	[t("index.today.enterschedule"), today_enter_count]
						            ];
						var legend = {
								show: true,
						};
						var chart = drawPie(id, [pdata], title, null, legend);
					}
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
		alert(t("index.input.enterday"));
		return false;
	}
	if( isValidDate(from_date) == false ) {
		alert(t("index.wrong.enterday"));
		return false
	}
	if(isNull(to_date)) {
		alert(t("index.input.exitday"));
		return false;
	}
	if( isValidDate(to_date) == false ) {
		alert(t("index.wrong.exitday"));
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

