/**
 * 
 */

$( document ).ready(function() {
	
	$('a', $('#nav')).each(function( index ) {
		if ($(this).text() == t("schedule.postnatal") ) {
			$(this).parent().addClass("active");
		}
	});
	initCalendar("0,1,2,3");
});

function initCalendar(option){
	
	console.log("initCalendar");
	jQuery.datetimepicker.setLocale('ko');
	var today = new Date();
	var firstDay = new Date();
	var lastDay = new Date();
	firstDay.setFullYear(today.getFullYear(), today.getMonth(), 1);
	lastDay.setFullYear(today.getFullYear(), today.getMonth() + 1, 0);
	
	drawCalendar(today,option);
	
}

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
/*
var evcolor = {
		0 : {
				bg:"#55bcdd",
				font:"#FFFFFF"
			},
		1 : {
				bg:"#4a88db",
				font:"#FFFFFF"
			},
		2 : {
				bg:"#eb5463",
				font:"#696969"
			},
		3 : {
			bg:"#ff865d",
			font:"#696969"
		},
};
*/
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

function drawCalendar(today,option) {
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
			left: '',
			center: 'today prev title next',
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
			getMonthSchedule(start, end, callback,filter.join(","));
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
			viewAddSchedule(0);
			var fd = new Date(date);
			var td = dateAdd(fd, 'minute', 30);
			$("#add_from").val(fd.format("isoDateTime2"));
			$("#add_to").val(td.format("isoDateTime2"));
		},
		eventRender: function(event, element, view) {
			console.log(view.name);
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

function viewAddSchedule(isinit) {
	var layer = $('.add-schedule').html();
	co.layer(layer,function(el){
		
        
        el = $(el);
        if(isinit == 1) {
    		$("#add_from", el).val('');
    		$("#add_to", el).val('');
    	}
        //co.datepicker();
        $("#add_from", el).datetimepicker(dtoption);
    	$("#add_to", el).datetimepicker(dtoption);
    	
        el.on('submit','form',function(){
            co.confirm(t("schedule.adds"),function(){
            	addSchedule();
                //el.dialog('close');
            });
            return false;
        });
    });
	
	//$("#add_from").datetimepicker(dtoption);
	//$("#add_to").datetimepicker(dtoption);

}


function getMonthSchedule(start, end, callback,option) {
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
			bno:bno,
			type:option
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
		co.alert(t("schedule.input.schedule"), function(){$(eid).focus();});

		return false;
	}
	var elength = getByteLength(event);
	if(elength > maxEventByte) {
		co.alert(t("schedule.schedules")+elength+t("schedule.max")+maxEventByte+t("schedule.byte"), function(){$(eid).focus();});
		
		$(eid).focus();
		return false;
	}
	if(isNull(fromDate)) {
		co.alert(t("schedule.input.times"));
		
		return false;
	}
	if(isNull(toDate)) {
		co.alert(t("schedule.input.times"));
		return false;
	}
	var isvalid = isValidDateRange(fromDate, toDate);
	if(isvalid < 0) {
		co.alert(t("schedule.afterstarts"));
		return false;
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
	type = $(typeid).val();
	var retval = {
			"mode":mode,
			"eid":eid, "fid":fid, "tid":tid, "uid":uid, "typeid":typeid,
			"event":event, "from_date":fromDate, "to_date":toDate, "type":type
	};
	return retval;
}

function viewSchedule(event, jsEvent, view) {
	
	var layer = $('.view-schedule').html();
	co.layer(layer,function(el){
		
		var fdate = new Date(event.start);
		var tdate = null;
		if(event.end == null || isNull(event.end)) {
			var minutes = 30;
			tdate = dateAdd(fdate, 'minute', 30);
		} else {
			tdate = new Date(event.end);
		}
		$("#view_id", el).val(event.id);
		$("#view_event", el).val(event.title);
		$("#view_from", el).val(fdate.format("isoDateTime2"));
		$("#view_to", el).val(tdate.format("isoDateTime2"));
		
		$("#view_from", el).datetimepicker(dtoption);
		$("#view_to", el).datetimepicker(dtoption);
		$("#view_type", el).val(event.type);
		var span = $("#view_type", el).next();
		var input = span.children(":first");
		input.val($("select[id='view_type'] option:selected").text());
		
		
        
		
    });
	
	
	//layer_open("view_schedule_layer", "fade", true);
}

function modifyViewEvent() {
	co.confirm(t("schedule.edits"),function(){
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
    });
	
	
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
					co.alert(param["msg"]);
					
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
	co.confirm(t("schedule.dels"),function(){
		deleteSchedule();
    });
	
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
