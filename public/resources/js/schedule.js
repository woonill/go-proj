
// datetimepicker option
var dtoption = {
		validateOnBlur:true,
		format:"Y-m-d H:i",
		ignoreReadonly:true,
		step:15,
		onGenerate:function(ct, $input){
			$input.prop('readonly', true);
			var $this = $(this);
			$this.find('.xdsoft_date').removeClass('xdsoft_disabled');
			$this.find('.xdsoft_time').removeClass('xdsoft_disabled');
		}
};

var evcolor = {
		0 : {
				bg:"#3A87AD",
				font:"#FFFFFF"
			},
		1 : {
				bg:"#D20C0C",
				font:"#FFFFFF"
			},
		2 : {
				bg:"#0FE23E",
				font:"#696969"
			},
		3 : {
			bg:"#FFA500",
			font:"#696969"
		},
};

function checkInput(inputValue) {
	var maxEventByte = 90;
	var maxUrlByte = 250;
	var eid = inputValue.eid;
	var fid = inputValue.fid;
	var tid = inputValue.tid;
	var uid = inputValue.uid;
	var event = inputValue.event;
	var fromDate = inputValue.from_date;
	var toDate = inputValue.to_date;
	var url = inputValue.url;
	if(isNull(event)) {
		alert(t("schedule.input"));
		$(eid).focus();
		return false;
	}
	var elength = getByteLength(event);
	if(elength > maxEventByte) {
		alert(t("schedule.scheduless")+elength+t("schedule.max")+maxEventByte+t("schedule.byte"));
		$(eid).focus();
		return false;
	}
	if(isNull(fromDate)) {
		alert(t("schedule.input.time"));
		return false;
	}
	if(isNull(toDate)) {
		alert(t("schedule.input.time"));
		return false;
	}
	var isvalid = isValidDateRange(fromDate, toDate);
	if(isvalid < 0) {
		alert(t("schedule.afterstart"));
		return false;
	}
	if(isNull(url)) {
		;
	} else {
		var ulength = getByteLength(url);
		if(ulength > maxUrlByte) {
			alert(t("schedule.url")+ulength+t("schedule.max")+maxUrlByte+t("schedule.byte"));
			$(uid).focus();
			return false;
		}
	}
	return true;
}

function getScheduleInputValue(mode) {
	var event = "", fromDate = "", toDate = "", url = "", type=0;
	var eid = "", fid = "", tid = "", uid = "", typeid = "";
	if(mode == "add") {
		eid = "#add_event";
		fid = "#add_from";
		tid = "#add_to";
		uid = "#add_url";
		typeid = "#add_type";
	} else if(mode == "modify") {
		eid = "#modify_event";
		fid = "#modify_from";
		tid = "#modify_to";
		uid = "#modify_url";
		typeid = "#modify_type";
	}
	event = $(eid).val();
	fromDate = $(fid).val();
	toDate = $(tid).val();
	url = $(uid).val();
	type = $(typeid).val();
	var retval = {
			"mode":mode,
			"eid":eid, "fid":fid, "tid":tid, "uid":uid, "typeid":typeid,
			"event":event, "from_date":fromDate, "to_date":toDate, "url":url, "type":type
	};
	return retval;
}

function addSchedule() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var inputValue = getScheduleInputValue("add");
	if(checkInput(inputValue) == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			type: inputValue.type,
			event: inputValue.event,
			from_date: inputValue.from_date.substr(0, 16).replace(" ", "T"),
			to_date: inputValue.to_date.substr(0, 16).replace(" ", "T"),
			url: inputValue.url,
			bno:bno
		},
		traditional: true,
		url: '/schedule/addexe',
		error: function() {
			alert(t("center.cantaddschedule"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$(location).attr("href", "/schedule/main?from_date="+inputValue.from_date+"&to_date="+inputValue.to_date);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/schedule/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("schedule.error.add"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function modifyEvent(event, delta, revertFunc, jsEvent, ui, view) {
	var allday = false;
	var id = event.id;
	var start = event.start;
	var end = event.end;
	if(end == null || isNull(end)) {
		end = start;
	}
	if(event.allDay) {
		allday = true;
	}
	var param = {
			id: id,
			from_time: start+"",
			to_time: end+"",
			msg:null,
			reload:false,
			allDay:allday,
	};
	modifySchedule(param, revertFunc);
}

function modifyViewEvent() {
	var id = $("#view_id").val();
	var event = $("#view_event").val();
	var from_date = $("#view_from").val().substr(0, 16).replace(" ", "T");
	var to_date = $("#view_to").val().substr(0, 16).replace(" ", "T");
	var url = $("#view_url").val();
	var type = $("#view_type").val();
	var param = {
			id: id,
			event: event,
			from_date: from_date,
			to_date: to_date,
			url: url,
			msg:t("schedule.edited"),
			reload:true,
			type:type,
	};
	modifySchedule(param, null);
}

function modifySchedule(param, revertFunc) {
	showLoadingLayer();
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	param["bno"] = bno;
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: param,
		traditional: true,
		url: '/schedule/modifyexe',
		error: function() {
			alert(t("schedule.editn"));
			if(revertFunc != null) {
				revertFunc();
			}
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				if(param["msg"]) {
					alert(param["msg"]);
				}
				if(param["reload"]) {
					location.reload();
				}
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/schedule/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("schedule.error.edit"));
					if(revertFunc != null) {
						revertFunc();
					}
				}
			}
			hideLoadingLayer();
		}
	});
}

function deleteViewEvent() {
	if(confirm(t("discount.reallydel"))) {
		deleteSchedule();
	}
}

function deleteSchedule() {
	showLoadingLayer();
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			bno: bno,
			id: $("#view_id").val()
		},
		traditional: true,
		url: '/schedule/deleteexe',
		error: function() {
			alert(t("schedule.error.del"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				location.reload();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/schedule/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("schedule.del"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function getMonthSchedule(start, end, callback) {
	showLoadingLayer();
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var from_time = start + "";
	var to_time = end + "";
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			from_time: from_time,
			to_time: to_time,
			bno:bno
		},
		traditional: true,
		url: '/schedule/month',
		error: function() {
			alert(t("schedule.errorn"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var events = data.events;
				callback(events);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/schedule/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("schedule.error"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function drawCalendar(today) {
	$("#calendar").fullCalendar({
		theme: true,
		locale: 'ko',
		timezone: 'local',
		customButtons: {
			btnAddSchedule: {
				text: t("schedule.addd"),
				click: function() {
					viewAddSchedule(1);
				}
			},
		},
		header: {
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay,listMonth btnAddSchedule'
		},
		views: {
			month: {titleFormat : 'YYYY MMMM'},
			week: {titleFormat : 'YYYY MMM D'},
			day: {titleFormat : 'YYYY MMMM D'},
		},
		minTime: "05:00",
		maxTime: "22:00",
		defaultTimedEventDuration: '00:30:00',
		nextDayThreshold: '00:00:00',
		firstDay: 1,
		defaultView: 'agendaWeek',
		timeFormat: 'a h(:mm)',
		forceEventDuration: true,
		navLinks: true,		// can click day/week names to navigate views
		editable: true,
		eventLimit: true,	// allow "more" link when too many events
		defaultDate: today.format("isoDate"),
		nowIndicator: true,
		events: function(start, end, timezone, callback) {
//			var t = makeEventDate(start, end);
//			getMonthSchedule(t.start, t.end, callback);
			getMonthSchedule(start, end, callback);
		},
		eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
			modifyEvent(event, delta, revertFunc, jsEvent, ui, view);
		},
		eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
			modifyEvent(event, delta, revertFunc, jsEvent, ui, view);
		},
		eventClick: function(event, jsEvent, view) {
			viewSchedule(event, jsEvent, view);
			return false;
		},
		dayClick: function(date, jsEvent, view) {
			var fd = new Date(date);
			var td = dateAdd(fd, 'minute', 30);
			$("#add_from").val(fd.format("isoDateTime2"));
			$("#add_to").val(td.format("isoDateTime2"));
			viewAddSchedule(0);
		},
		eventRender: function(event, element, view) {
			if(view.name == 'month' || (event.allDay && view.name == 'agendaWeek')) {
				var titleLimit = 15;
				if(event.allDay) {
					titleLimit = 21;
				}
				var byteLengthTitle = getByteLength(event.title);
				if(byteLengthTitle > titleLimit) {
					var title = cutString(event.title, titleLimit) + "...";
					element.find(".fc-title").text(title);
				}
			}
			var evcss = evcolor[event.type];
			element.css("color", evcss["font"]);
			element.css("background-color", evcss["bg"]);
		},
	});
}

function makeEventDate(start, end) {
	var sdate = new Date(start);
	var edate = new Date(end);
	var sd = sdate.format("isoDate");
	var ed = edate.format("isoDate");
	var sd = sd + " 00:00:00";
	var ed = ed + " 23:59:59";
	sdate = new Date(sd);
	edate = new Date(ed);
	var retval = {
			"start":sdate.getTime(),
			"end":edate.getTime()
	};
	if(isNaN(retval.start) || isNaN(retval.end)) {
		var today = new Date();
		var tdate = today.format("isoDate");
	}
	return retval;
}

function viewAddSchedule(isinit) {
	if(isinit == 1) {
		$("#add_from").val('');
		$("#add_to").val('');
	}
	$("#add_from").datetimepicker(dtoption);
	$("#add_to").datetimepicker(dtoption);
	layer_open("add_schedule_layer", "fade", true);
}

function viewSchedule(event, jsEvent, view) {
	if(event.url) {
		if(confirm(t("schedule.link"))) {
			window.open(event.url);
			return false;
		}
	}
	var fdate = new Date(event.start);
	var tdate = null;
	if(event.end == null || isNull(event.end)) {
		var minutes = 30;
		tdate = dateAdd(fdate, 'minute', 30);
	} else {
		tdate = new Date(event.end);
	}
	$("#view_id").val(event.id);
	$("#view_event").val(event.title);
	$("#view_from").val(fdate.format("isoDateTime2"));
	$("#view_to").val(tdate.format("isoDateTime2"));
	$("#view_url").val(event.url);
	$("#view_from").datetimepicker(dtoption);
	$("#view_to").datetimepicker(dtoption);
	$("#view_type").val(event.type);
	var span = $("#view_type").next();
	var input = span.children(":first");
	input.val($("select[id='view_type'] option:selected").text());
	layer_open("view_schedule_layer", "fade", true);
}

function initScheduler() {
	jQuery.datetimepicker.setLocale('ko');
	var today = new Date();
	var firstDay = new Date();
	var lastDay = new Date();
	firstDay.setFullYear(today.getFullYear(), today.getMonth(), 1);
	lastDay.setFullYear(today.getFullYear(), today.getMonth() + 1, 0);
	drawCalendar(today);
	$("#add_type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	$("#view_type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
}

