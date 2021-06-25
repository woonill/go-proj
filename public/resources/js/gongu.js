function initGongu() {
	$("input[type='radio'], input[type='checkbox']").labelauty({ minimum_width:"100px", class:"chkradio" });
	$("#v_room_grade").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#people").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true});
	$("#limit_date").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true});
	$("#room_grade").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#btn_help").hide();
}

function saveGonguLimitDate() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			limit_date_no : $("#limit_date").val(),
			bno : bno
		},
		traditional: true,
		url: '/gongu/modify/setting',
		error: function() {
			alert(t("gongu.error.set"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				alert(t("gongu.set"));
				$(location).attr("href", "/gongu/main");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/gongu/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.canteset"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function deleteGonguCode(no) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			code_no : no,
			bno : bno
		},
		traditional: true,
		url: '/gongu/delete/code',
		error: function() {
			alert(t("gongu.error.cantdelcode"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				alert(t("app.del"));
				getGonguList(1, 1);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/gongu/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.code.cantdel"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function validateGonguCode(opt) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var uri = "";
	if(opt == 1) {
		uri = "/gongu/main";
	} else if(opt == 2) {
		uri = "/reservation/add";
	}
	if($("#room_grade").length) {
		var room_grade_no = $("#room_grade").val();
		if($.isNumeric(room_grade_no)) {
			;
		} else {
			alert(t("gongu.selectgrade"));
			return false;
		}
	} else {
		alert(t("gongu.error.ask"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			gongu_code : $("#gongu_code").val(),
			room_grade_no : $("#room_grade").val(),
			bno : bno
		},
		traditional: true,
		url: '/gongu/validate/code',
		error: function() {
			alert(t("gongu.error.validity"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				if(data.result == RESULT_VALID_CODE) {
					alert(t("gongu.code.usable"));
					$("#validate_gongu").val("1");
				} else if(data.result == RESULT_PERSON_LIMIT) {
					alert(t("gongu.code.over"));
				} else if(data.result == RESULT_DATE_OVER) {
					alert(t("gongu.code.old"));
				} else if(data.result == RESULT_ROOM_PERMISSION) {
					alert(t("gongu.code.wronggrade"));
				}
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI(uri));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.code.validity"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function viewReservationByGongu(code) {
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
			gongu_code:code,
			bno : bno
		},
		traditional: true,
		url: '/reservation/gongu/list',
		error: function() {
			alert(t("reservation.error.reservelistn"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				if(data.reservation == null) {
					alert(t("reservation.codea")+code+t("reservation.codeb"));
					$("#gantt").hide();
				} else {
					$("#gantt").show();
					setViewGongu(data);
				}
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/gongu/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.cantreserve"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function setViewGongu(tdata) {
	var source = null;
	var reservation = tdata.reservation;
	if(reservation != null && reservation.source != null) {
		source = reservation.source;
	}
	$("#gantt").gantt({
		source:source,
		itemsPerPage:100,
		months:[t("balance.january"), t("balance.february"), t("balance.march"), t("balance.april"), t("balance.may"), t("balance.june"), t("balance.july"), t("balance.august"), t("balance.september"), t("balance.october"), t("balance.november"), t("balance.december")],
		dow:[t("common.Sunday"), t("common.Monday"), t("common.Tuesday"), t("common.Wednesday"), t("common.Thursday"), t("common.Friday"), t("common.Saturday")],
		navigate:"scroll",//buttons or scroll
		scale:"days",//days, weeks, months
		minScale:"hours",
		maxScale:"months",
		waitText:t("gongu.wait"),
		showSelector:false,
		showNavi:false,
		onItemClick:function(data) {
			//modifyReservation(data.reservation_no);
		},
		//onAddClick	function (dt, rowId) { return; },
		onRender:function () {
			var count = tdata.reservation_count;
			for(var i=0; i<count; i++) {
				var id="#bar" + i;
				var one = source[i];
				var value = one.values[0];
				var reservation_no = value.dataObj.reservation_no;
				var issetup = value.dataObj.issetup;
				var period = value.dataObj.period;
				var pay_type = value.dataObj.pay_type;
				var from_date = value.dataObj.from_date;
				var to_date = value.dataObj.to_date;
				var real_money = value.dataObj.real_money;
				var remain_money = value.dataObj.remain_money;
				var reservation_room_no = value.dataObj.reservation_room_no;
				var room_no = value.dataObj.room_no;
				var isslice = value.dataObj.isslice;
				var inserttime = value.dataObj.inserttime;
				var ofdate = value.dataObj.ofdate;
				var otdate = value.dataObj.otdate;
				var parameters = {
						issetup:issetup,
						period:period,
						pay_type:pay_type,
						reservation_no:reservation_no,
						from_date:from_date,
						to_date:to_date,
						real_money:real_money,
						remain_money:remain_money,
						reservation_room_no:reservation_room_no,
						room_no:room_no,
						inserttime:inserttime,
						rindex:i,
						ofdate:ofdate,
						otdate:otdate
				};
				var menu = [{
					name:t("gongu.checkenter"),
					title:t("gongu.checkenter"),
					parameters:parameters,
					fun:function(data, event) {
						setup(
								data.parameters.issetup,
								data.parameters.reservation_no,
								data.parameters.from_date,
								data.parameters.to_date,
								data.parameters.real_money,
								data.parameters.remain_money,
								data.parameters.period,
								data.parameters.pay_type
								);
					}
				}, {
					name:t("reservation.pay.list"),
					title:t("reservation.pay.list"),
					parameters:parameters,
					fun:function(data, event) {
						var r_no = data.parameters.reservation_no;
						viewPaymentHistory(r_no);
					}
				}, {
					name:t("reservation.process.detail"),
					title:t("reservation.process.detail"),
					parameters:parameters,
					fun:function(data, event) {
						var r_no = data.parameters.reservation_no;
						modifyReservation(r_no);
					}
				}];
				var option = {
						triggerOn : 'click',
						mouseClick :'right'
					};
				$(id).contextMenu(menu, option);
				$(id).data("parameters", parameters);
				$(id).css({"cursor":"pointer"});
			}
			var pheight = parseInt($("#container").outerHeight());
			var cheight = parseInt($("#gantt").outerHeight());
			var newheight = pheight + cheight;
			$("#container").css("height", newheight + "px");
		},
		useCookie:false,
		scrollToToday:true
	});
}

function createGonguCode() {
	var option = {
			id:"code",
			isreload:1,
			doMore:function() {},
			onComplete:function() {}
	};
	createGonguCodeWithOption(option);
}

function createGonguCodeNoReload() {
	var option = {
			id:"gongu_code",
			isreload:0,
			doMore:function(data) {
				$("#room_grade").val(data.room_grade_no);
				selectRoomGrade();
			},
			onComplete:function() {
				hideCreateGonguCode();
			}
	};
	createGonguCodeWithOption(option);
}

function createGonguCodeWithOption(option) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if($("#v_room_grade").length) {
		var room_grade_no = $("#v_room_grade").val();
		if($.isNumeric(room_grade_no)) {
			;
		} else {
			alert(t("gongu.selectgrade"));
			return false;
		}
	} else {
		alert(t("gongu.error.ask"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#v_room_grade").val(),
			people : $("#people").val(),
			bno : bno
		},
		traditional: true,
		url: '/gongu/create/code',
		error: function() {
			alert(t("gongu.error.gencode"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var d = {
						room_grade_no : $("#v_room_grade").val()
				};
				var id = option.id;
				$("#"+id).val("");
				$("#"+id).val(data.code);
				if(option.isreload == 1) {
					getGonguList(1, 1);
				} else {
					
				}
				option.doMore(d);
				option.onComplete();
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/gongu/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.code.cantgen"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function getGonguList(page, usemanage) {
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
			page : page,
			bno : bno
		},
		traditional: true,
		url: '/gongu/list',
		error: function() {
			alert(t("gongu.error.code"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var gongu_map = data.gongu_code;
				var navi_map = data.navigation;
				var gongu_code_list_size = gongu_map.gongu_code_list_size;
				var gongu_code_list = gongu_map.gongu_code_list;
				var page_list = navi_map.page_list;
				var pre_page = parseInt(navi_map.pre_page);
				var next_page = parseInt(navi_map.next_page);
				var cur_page = parseInt(navi_map.cur_page);
				var page_size = parseInt(navi_map.page_size);
				var contents = "";
				if(gongu_code_list_size > 0) {
					for(var i=0; i<gongu_code_list_size ; i++) {
						var gongu = gongu_code_list[i];
						var date = new Date(parseFloat(gongu.inserttime));
						contents = contents + "<tr>";
						contents = contents + "<td style=\"text-align:center;\">"+ gongu.code +"</td>";
						contents = contents + "<td style=\"text-align:center;\">"+ gongu.room_grade_name +"</td>";
						contents = contents + "<td style=\"text-align:center;\">"+ gongu.people +"</td>";
						contents = contents + "<td style=\"text-align:center;\">"+ gongu.limit_date +"</td>";
						contents = contents + "<td style=\"text-align:center;\">"+ date.format("isoDate") + "</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						if(usemanage == 1) {
//							contents = contents + "<button type=\"button\" class=\"btn_green1\" onclick=\"javascript:viewReservationByGongu('"+ gongu.code +"');\">" + t("gongu.reserve") + "</button>&nbsp;";
							contents = contents + "<button type=\"button\" class=\"btn_green1\" onclick=\"javascript:getReservationListByGongu('"+ gongu.code +"');\">" + t("gongu.reserve") + "</button>&nbsp;";
							contents = contents + "<button type=\"button\" class=\"btn_gray1\" onclick=\"javascript:deleteGonguCode('"+ gongu.no +"');\">" + t("gongu.del") +"</button>";
						} else {
							contents = contents + "<button type=\"button\" class=\"btn_green1\" onclick=\"javascript:selectGonguCode('"+ gongu.code +"', '"+ gongu.room_grade_no +"');\">" + t("gongu.select") + "</button>";
						}
						contents = contents + "</td>";
						contents = contents + "</tr>";
					}
				} else {
					contents = contents + t("gongu.code.no");
				}
				$("#contents_gongu_list").html(contents);
				var navigation = "";
				if(pre_page > 0) {
					navigation = navigation + "<a href=\"javascript:getGonguList(" + pre_page + ", " + usemanage + ");\">&lt;</a>";
				}
				if(page_size <= 0) {
					navigation = navigation + "<span>1</span>";
				} else {
					for(var i=0; i<page_list.length; i++) {
						var p = parseInt(page_list[i]);
						if(p == cur_page) {
							navigation = navigation + "<span>" + p + "</span>";
						} else {
							navigation = navigation + "<a href=\"javascript:getGonguList(" + p + ", " + usemanage + ");\">" + p + "</a>";
						}
					}
				}
				if(next_page > 0) {
					navigation = navigation + "<a href=\"javascript:getGonguList(" + next_page + ", " + usemanage + ");\">&gt;</a>";
				}
				$("#page_navi").html(navigation);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/gongu/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.code.cant"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function selectGonguCode(code, room_grade_no) {
	try {
		if($("#gongu_code").length) {
			$("#gongu_code").val(code);
		}
		if($("#room_grade").length) {
			$("#room_grade").val(room_grade_no);
			selectRoomGrade();
		}
		hideGonguList();
	} catch(e) {
	}
}

