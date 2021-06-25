

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

var mgrcolor = {};
var evcolor = [
		{
			bg:"#3A87AD",
			font:"#FFFFFF"
		},
		{
			bg:"#F4A460",
			font:"#696969"
		},
		{
			bg:"#FF69B4",
			font:"#FFFFFF"
		},
		{
			bg:"#7FFFD4",
			font:"#696969"
		},
		{
			bg:"#3CB371",
			font:"#696969"
		},
		{
			bg:"#32CD32",
			font:"#FFFFFF"
		},
		{
			bg:"#FFFF00",
			font:"#696969"
		},
		{
			bg:"#FFD700",
			font:"#696969"
		},
		{
			bg:"#FF8C00",
			font:"#FFFFFF"
		},
		{
			bg:"#FF4500",
			font:"#FFFFFF"
		},
		{
			bg:"#FF7F50",
			font:"#696969"
		}
];

function viewModifySchedule(event, jsEvent, view) {
	$(location).attr("href", "/aesthetic/schedule/modify?aesthetic_schedule_no="+event.id);
}

function addAestheticSchedule(no) {
	$(location).attr("href", "/aesthetic/schedule/add?aesthetic_no="+no);
}

function modifyAestheticSchedule(no) {
	$(location).attr("href", "/aesthetic/schedule/modify?aesthetic_no="+no);
}

function viewTicketList() {
	$(location).attr("href", "/aesthetic/ticket/list");
}

function addAestheticReservationExe() {
	var year = $("#year").val();
	var month = $("#month").val();
	$(location).attr("href", "/aesthetic/ticket/reservation/add?year="+year+"&month="+month);
}

function addReservationTicket() {
	$(location).attr("href", "/aesthetic/ticket/reservation/list");
}

function searchAestheticTicket() {
	var field = $("#field").val();
	var keyword = encodeURI(encodeURIComponent($("#keyword").val()));
	$(location).attr("href", "/aesthetic/ticket/list?field="+field+"&keyword="+keyword);
}

function searchReservationTicket() {
	var year = $("#year").val();
	var month = $("#month").val();
	$(location).attr("href", "/aesthetic/ticket/reservation/list?year="+year+"&month="+month);
}

function addAestheticTicket() {
	$(location).attr("href", "/aesthetic/ticket/add");
}

function modifyAestheticTicket(no) {
	$(location).attr("href", "/aesthetic/ticket/modify?aesthetic_no="+no);
}

function viewAestheticTicket(no) {
	$(location).attr("href", "/aesthetic/ticket/view?aesthetic_no="+no);
}

function viewAestheticList() {
	$(location).attr("href", "/aesthetic/list");
}

function selectProgram() {
	var aesthetic_setting_no = parseInt($("#aesthetic_setting_no").val());
	if(aesthetic_setting_no > 0) {
		var price = $("#price_" + aesthetic_setting_no).val();
		$("#real_money").val(comma(price));
	}
}

function initAestheticList() {
	$("#field").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	$("#keyword").on("keyup", function(e){
		if(e.keyCode == 13){
			searchAestheticTicket();
		}
	});
}

function initReservation() {
	$("#year").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":50, "ireadonly":true });
	$("#month").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":50, "ireadonly":true });
}

function initAddSchedule() {
	$("#add_from").datetimepicker(dtoption);
	$("#add_to").datetimepicker(dtoption);
	$("#type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":80, "ireadonly":true });
	if($("select[id='aesthetic_room_no']").length) {
		$("#aesthetic_room_no").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	}
	if($("select[id='manager_no']").length) {
		$("#manager_no").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	}
}

function initModifySchedule() {
	$("#modify_from").datetimepicker(dtoption);
	$("#modify_to").datetimepicker(dtoption);
	$("#type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":80, "ireadonly":true });
	if($("select[id='aesthetic_room_no']").length) {
		$("#aesthetic_room_no").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	}
	if($("select[id='manager_no']").length) {
		$("#manager_no").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	}
}

function initAddTicket() {
	$("input[type='radio'], input[type='checkbox']").labelauty({ minimum_width:"100px", class:"chkradio" });
	$("#prepressure").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true });
	$("#postpressure").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true });
	$("#birth_count").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":50, "ireadonly":true });
	$("#bsex").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":50, "ireadonly":true });
	setPhoneEvent("#phone1");
	setPhoneEvent("#phone2");
	setPhoneEvent("#phone3");
	setPhoneEvent("#pphone1");
	setPhoneEvent("#pphone2");
	setPhoneEvent("#pphone3");
	setDatePicker("#birth");
	setDatePicker("#pbirth");
	setDatePicker("#due_date");
	setDatePicker("#contract_date");
	setMoneyCommaEvent("#real_money");
	var aesthetic_setting_no = parseInt($("#aesthetic_setting_no").val());
	if(aesthetic_setting_no >= 0) {
		$("#aesthetic_setting_no").combobox({"bcssClassName":"text", "bheight":27, "iwidth":150, "iheight":23, "ireadonly":true, "iblur":selectProgram });
	}
	if($("select[id='manager_no']").length) {
		$("#manager_no").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	}
	if($("#birthy").length) {
		$("#birthy").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#birthm").length) {
		$("#birthm").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#birthd").length) {
		$("#birthd").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#pbirthy").length) {
		$("#pbirthy").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#pbirthm").length) {
		$("#pbirthm").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#pbirthd").length) {
		$("#pbirthd").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
}

function initModifyTicket() {
	$("input[type='radio'], input[type='checkbox']").labelauty({ minimum_width:"100px", class:"chkradio" });
	$("#prepressure").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true });
	$("#postpressure").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true });
	$("#birth_count").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":50, "ireadonly":true });
	$("#bsex").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":50, "ireadonly":true });
	setPhoneEvent("#phone1");
	setPhoneEvent("#phone2");
	setPhoneEvent("#phone3");
	setPhoneEvent("#pphone1");
	setPhoneEvent("#pphone2");
	setPhoneEvent("#pphone3");
	setDatePicker("#birth");
	setDatePicker("#pbirth");
	setDatePicker("#due_date");
	setDatePicker("#contract_date");
	setMoneyCommaEvent("#real_money");
	var aesthetic_setting_no = parseInt($("#aesthetic_setting_no").val());
	if(aesthetic_setting_no >= 0) {
		$("#aesthetic_setting_no").combobox({"bcssClassName":"text", "bheight":27, "iwidth":150, "iheight":23, "ireadonly":true, "iblur":selectProgram });
	}
	if($("select[id='manager_no']").length) {
		$("#manager_no").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	}
	if($("#birthy").length) {
		$("#birthy").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#birthm").length) {
		$("#birthm").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#birthd").length) {
		$("#birthd").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#pbirthy").length) {
		$("#pbirthy").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#pbirthm").length) {
		$("#pbirthm").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#pbirthd").length) {
		$("#pbirthd").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
}

function initAestheticScheduler() {
	jQuery.datetimepicker.setLocale('ko');
	var manager_no = 0;
	if($("select[id='manager_no']").length) {
		manager_no = parseInt($("#manager_no").val());
	}
	var today = new Date();
	var firstDay = new Date();
	var lastDay = new Date();
	firstDay.setFullYear(today.getFullYear(), today.getMonth(), 1);
	lastDay.setFullYear(today.getFullYear(), today.getMonth() + 1, 0);
	drawCalendar(today, manager_no);
}

function addInit() {
	setMoneyCommaEvent("#price");
	setMoneyCommaEvent("#count");
}

function modifyInit() {
	setMoneyCommaEvent("#price");
}

function listInit() {
	$("#aesthetic_room_name").on('keyup', function (e){
		if(e.keyCode == 13){
			var mdisp = $("#btn_modify").css("display");
			if(mdisp == "none") {
				addAestheticRoomExe();
			} else {
				modifyAestheticRoomExe();
			}
		}
	});
}

function checkAestheticScheduleInput() {
	var type = parseInt($("#type").val());
	var remain = 0;
	if(type == 0) {
		remain = parseInt($("#remain_pre").val());
	} else if(type == 1) {
		remain = parseInt($("#remain_post").val());
	} else if(type == 2) {
		remain = parseInt($("#remain_program").val());
	} else {
		alert(t("aesthetic.error"));
		return false;
	}
	if(remain <= 0) {
		alert(t("aesthetic.nocount"));
		return false;
	}
	if(!$("select[id='aesthetic_room_no']").length) {
		alert(t("aesthetic.regiroom"));
		return false;
	}
	var event = $("#event").val();
	if(isNull(event)) {
		alert(t("aesthetic.schedule"));
		$("#event").focus();
		return false;
	}
	var from_date = "";
	if($("#add_from").length) {
		from_date = $("#add_from").val();
	} else if($("#modify_from").length) {
		from_date = $("#modify_from").val();
	}
	var to_date = "";
	if($("#add_to").length) {
		to_date = $("#add_to").val();
	} else if($("#modify_to").length) {
		to_date = $("#modify_to").val();
	}
	if(isNull(from_date)) {
		alert(t("aesthetic.starttime"));
		return false;
	}
	if(isNull(to_date)) {
		alert(t("aesthetic.endtime"));
		return false;
	}
}

function checkAestheticTicketInput() {
	if(isNull($("#name").val())) {
		alert(t("aesthetic.momname"));
		$("#name").focus();
		return false;
	}
	if(isNull($("#phone1").val())) {
		alert(t("reservation.input.momcontact"));
		$("#phone1").focus();
		return false;
	}
	if(isNull($("#phone2").val())) {
		alert(t("reservation.input.momcontact"));
		$("#phone2").focus();
		return false;
	}
	if(isNull($("#phone3").val())) {
		alert(t("reservation.input.momcontact"));
		$("#phone3").focus();
		return false;
	}
	if(isNull($("#birthy").val()) == false && isNull($("#birthy").val()) == false && isNull($("#birthy").val()) == false) {
		var birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
		if( isValidDate(birth) == false ) {
			alert(t("manage.input.wrongbirth"));
			return false;
		}
	}
	if(isNull($("#due_date").val())) {
		alert(t("aesthetic.day"));
		$("#due_date").focus();
		return false;
	}
	if(isNull($("#hospital").val())) {
		alert(t("aesthetic.hospital"));
		$("#hospital").focus();
		return false;
	}
}

function addAesthetic() {
	var url = "/aesthetic/add";
	$(location).attr("href", url);
}

function modifyAesthetic(no) {
	var url = "/aesthetic/modify?aesthetic_no="+no;
	$(location).attr("href", url);
}

function modifyAestheticRoom(no, name) {
	$("#modify_aesthetic_room_no").val(no);
	$("#aesthetic_room_name").val(name);
	$("#btn_add").hide();
	$("#btn_modify").show();
	$("#btn_cancel").show();
}

function modifyAestheticRoomCancel() {
	$("#modify_aesthetic_room_no").val("");
	$("#aesthetic_room_name").val("");
	$("#btn_add").show();
	$("#btn_modify").hide();
	$("#btn_cancel").hide();
}

function drawCalendar(today, manager_no) {
	$("#calendar").fullCalendar({
		theme: true,
		locale: 'ko',
		timezone: 'local',
//		customButtons: {
//			btnAddSchedule: {
//				text: t("schedule.addd"),
//				click: function() {
////					viewAddSchedule(1);
//				}
//			},
//		},
		header: {
//			left: 'prev,next today btnAddSchedule',
			left: 'prev,next today',
			center: 'title',
			right: 'month,agendaWeek,agendaDay,listMonth'
		},
		views: {
			month: {titleFormat : 'YYYY MMMM'},
			week: {titleFormat : 'YYYY MMM D'},
			day: {titleFormat : 'YYYY MMMM D'},
		},
		minTime: "05:00",
		maxTime: "23:00",
		defaultTimedEventDuration: '00:60:00',
		nextDayThreshold: '00:00:00',
		firstDay: 1,
		defaultView: 'agendaWeek',
		timeFormat: 'a h(:mm)',
		allDaySlot: false,
		forceEventDuration: true,
		navLinks: true,		// can click day/week names to navigate views
		editable: true,
		eventLimit: true,	// allow "more" link when too many events
		defaultDate: today.format("isoDate"),
		nowIndicator: true,
		events: function(start, end, timezone, callback) {
			getAestheticMonthSchedule(start, end, manager_no, callback);
		},
		eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) {
			modifyAestheticEvent(event, delta, revertFunc, jsEvent, ui, view);
		},
		eventResize: function(event, delta, revertFunc, jsEvent, ui, view) {
			modifyAestheticEvent(event, delta, revertFunc, jsEvent, ui, view);
		},
		eventClick: function(event, jsEvent, view) {
			viewModifySchedule(event, jsEvent, view);
			return false;
		},
		dayClick: function(date, jsEvent, view) {
			var fd = new Date(date);
			var td = dateAdd(fd, 'minute', 60);
			$("#add_from").val(fd.format("isoDateTime2"));
			$("#add_to").val(td.format("isoDateTime2"));
//			viewAddSchedule(0);
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
			var manager_no = event.manager_no;
			var evcss = null;
			if(manager_no in mgrcolor) {
				evcss = mgrcolor[manager_no];
			} else {
				evcss = evcolor.shift();
				mgrcolor[manager_no] = evcss;
			}
			element.css("color", evcss["font"]);
			element.css("background-color", evcss["bg"]);
		},
		eventAfterAllRender: function(event, element, view) {
			if($("select[id='manager_no']").length) {
//				$(".fc-toolbar").css({"display":"table-cell","vertical-align":"middle"});
				$(".fc-left").append($("select[id='manager_no']"));
				$("#manager_no").combobox({
					"bcssClassName":"text", "bheight":21, "iheight":17, "iwidth":100, "ireadonly":true,
					"bcss":{"margin-top":"0px"},"icss":{"margin-top":"1px"},
					"iblur":chooseManager
					});
			}
		}
	});
}

function chooseManager() {
	var manager_no = 0;
	if($("select[id='manager_no']").length) {
		manager_no = $("#manager_no").val();
	}
	var url = "/aesthetic/main";
	if(manager_no > 0) {
		url = url + "?manager_no="+manager_no;
	}
	$(location).attr("href", url);
}

function getAestheticMonthSchedule(start, end, manager_no, callback) {
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
			manager_no: manager_no,
			bno:bno
		},
		traditional: true,
		url: '/aesthetic/schedule',
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
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/main"));
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

function addAestheticExe() {
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
			name : $("#name").val(),
			program : $("#program").val(),
			price : uncomma($("#price").val()),
			count : uncomma($("#count").val()),
			bno : bno
		},
		traditional: true,
		url: '/aesthetic/addexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.added"));
				$(location).attr("href", "/aesthetic/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/add"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("system.error.add"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function modifyAestheticExe(no) {
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
			aesthetic_no : no,
			name : $("#name").val(),
			program : $("#program").val(),
			price : uncomma($("#price").val()),
			count : uncomma($("#count").val()),
			bno : bno
		},
		traditional: true,
		url: '/aesthetic/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.edited"));
				$(location).attr("href", "/aesthetic/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/modify"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function deleteAestheticExe(no) {
	if(!confirm(t("discount.reallydel"))) {
		return false;
	}
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
			aesthetic_no : no,
			bno : bno
		},
		traditional: true,
		url: '/aesthetic/deleteexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("app.del"));
				location.reload();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("interest.error"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function addAestheticRoomExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var name = $("#aesthetic_room_name").val();
	if(isNull(name)) {
		alert(t("aesthetic.roomname"));
		$("#aesthetic_room_name").focus();
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			name : name,
			bno : bno
		},
		traditional: true,
		url: '/aesthetic/room/addexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.added"));
				location.reload();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("system.error.add"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function modifyAestheticRoomExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var name = $("#aesthetic_room_name").val();
	if(isNull(name)) {
		alert(t("aesthetic.roomname"));
		$("#aesthetic_room_name").focus();
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			aesthetic_room_no : $("#modify_aesthetic_room_no").val(),
			name : name,
			bno : bno
		},
		traditional: true,
		url: '/aesthetic/room/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.edited"));
				location.reload();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function changeAestheticRoomStatusExe(no, status) {
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
			aesthetic_room_no : no,
			status: status,
			bno : bno
		},
		traditional: true,
		url: '/aesthetic/room/changeexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.edited"));
				location.reload();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function addAestheticTicketExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkAestheticTicketInput() == false) {
		return false;
	}
	var birth = "";
	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
	}
	var pbirth = "";
	if(isNull($("#pbirthy").val()) == false && isNull($("#pbirthm").val()) == false && isNull($("#pbirthd").val()) == false) {
		pbirth = $("#pbirthy").val() + "-" + $("#pbirthm").val() + "-" + $("#pbirthd").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			name : $("#name").val(),
			phone1 : $("#phone1").val(),
			phone2 : $("#phone2").val(),
			phone3 : $("#phone3").val(),
			birth : birth,
			birth_type : $("#birth_type").val(),
			birth_count : $("#birth_count").val(),
			due_date : $("#due_date").val(),
			hospital : $("#hospital").val(),
			job : $("#job").val(),
			zipcode : $("#zipcode").val(),
			address : $("#addr").val(),
			address_jibun : $("#addr_jibun").val(),
			address_detail : $("#addr2").val(),
			pname : $("#pname").val(),
			pphone1 : $("#pphone1").val(),
			pphone2 : $("#pphone2").val(),
			pphone3 : $("#pphone3").val(),
			pbirth : pbirth,
			bname : $("#bname").val(),
			bsex : $("#bsex").val(),
			bweight : uncomma($("#bweight").val()),
			contract_date : $("#contract_date").val(),
			aesthetic_setting_no : $("#aesthetic_setting_no").val(),
			pay_method : $("input:radio[name='pay_method']:checked").val(),
			real_money : uncomma($("#real_money").val()),
			memo : $("#memo").val(),
			prememo : $("#prememo").val(),
			prepressure : $("#prepressure").val(),
			prepointmemo : $("#prepointmemo").val(),
			postmemo : $("#postmemo").val(),
			postpressure : $("#postpressure").val(),
			postpointmemo : $("#postpointmemo").val(),
			bno : bno
		},
		traditional: true,
		url: '/aesthetic/ticket/addexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.added"));
				$(location).attr("href", "/aesthetic/ticket/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/ticket/add"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("system.error.add"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function modifyAestheticTicketExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkAestheticTicketInput() == false) {
		return false;
	}
	var birth = "";
	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
	}
	var pbirth = "";
	if(isNull($("#pbirthy").val()) == false && isNull($("#pbirthm").val()) == false && isNull($("#pbirthd").val()) == false) {
		pbirth = $("#pbirthy").val() + "-" + $("#pbirthm").val() + "-" + $("#pbirthd").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			aesthetic_no : $("#aesthetic_no").val(),
			name : $("#name").val(),
			phone1 : $("#phone1").val(),
			phone2 : $("#phone2").val(),
			phone3 : $("#phone3").val(),
			birth : birth,
			birth_type : $("#birth_type").val(),
			birth_count : $("#birth_count").val(),
			due_date : $("#due_date").val(),
			hospital : $("#hospital").val(),
			job : $("#job").val(),
			zipcode : $("#zipcode").val(),
			address : $("#addr").val(),
			address_jibun : $("#addr_jibun").val(),
			address_detail : $("#addr2").val(),
			pname : $("#pname").val(),
			pphone1 : $("#pphone1").val(),
			pphone2 : $("#pphone2").val(),
			pphone3 : $("#pphone3").val(),
			pbirth : pbirth,
			bname : $("#bname").val(),
			bsex : $("#bsex").val(),
			bweight : uncomma($("#bweight").val()),
			contract_date : $("#contract_date").val(),
			aesthetic_setting_no : $("#aesthetic_setting_no").val(),
			pay_method : $("input:radio[name='pay_method']:checked").val(),
			real_money : uncomma($("#real_money").val()),
			memo : $("#memo").val(),
			prememo : $("#prememo").val(),
			prepressure : $("#prepressure").val(),
			prepointmemo : $("#prepointmemo").val(),
			postmemo : $("#postmemo").val(),
			postpressure : $("#postpressure").val(),
			postpointmemo : $("#postpointmemo").val(),
			bno : bno
		},
		traditional: true,
		url: '/aesthetic/ticket/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.edited"));
				$(location).attr("href", "/aesthetic/ticket/view?aesthetic_no=" + $("#aesthetic_no").val());
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/ticket/modify"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function deleteAestheticTicketExe(no) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(!confirm(t("discount.reallydel"))) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			aesthetic_no : no,
			bno : bno
		},
		traditional: true,
		url: '/aesthetic/ticket/deleteexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("app.del"));
				$(location).attr("href", "/aesthetic/ticket/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/ticket/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("interest.error"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function addAestheticScheduleExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkAestheticScheduleInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			aesthetic_no : $("#aesthetic_no").val(),
			type : $("#type").val(),
			event : $("#event").val(),
			from_date : $("#add_from").val().substr(0, 16).replace(" ", "T"),
			to_date : $("#add_to").val().substr(0, 16).replace(" ", "T"),
			aesthetic_room_no : $("select[id='aesthetic_room_no']").val(),
			manager_no : $("#manager_no").val(),
			bno : bno
		},
		traditional: true,
		url: '/aesthetic/schedule/addexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.added"));
				$(location).attr("href", "/aesthetic/main");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("system.error.add"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function modifyAestheticEvent(event, delta, revertFunc, jsEvent, ui, view) {
	var id = event.id;
	var start = event.start;
	var end = event.end;
	if(end == null || isNull(end)) {
		end = start;
	}
	var param = {
			aesthetic_schedule_no: id,
			from_time : start+"",
			to_time : end+""
		};
	modifyExe(param, revertFunc);
}

function modifyAestheticScheduleExe() {
	if(checkAestheticScheduleInput() == false) {
		return false;
	}
	var param = {
			aesthetic_schedule_no : $("#aesthetic_schedule_no").val(),
			aesthetic_no : $("#aesthetic_no").val(),
			type : $("#type").val(),
			event : $("#event").val(),
			from_date : $("#modify_from").val().substr(0, 16).replace(" ", "T"),
			to_date : $("#modify_to").val().substr(0, 16).replace(" ", "T"),
			manager_no : $("#manager_no").val(),
			aesthetic_room_no : $("select[id='aesthetic_room_no']").val()
		};
	modifyExe(param, null);
}

function modifyExe(param, revertFunc) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	param["bno"] = bno;
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: param,
		traditional: true,
		url: '/aesthetic/schedule/modifyexe',
		error: function() {
			alert(t("app.error"));
			if(revertFunc != null) {
				revertFunc();
			}
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.edited"));
				$(location).attr("href", "/aesthetic/main");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/aesthetic/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("inventory.error.cantcorrect"));
					if(revertFunc != null) {
						revertFunc();
					}
				}
			}
			hideLoadingLayer();
		}
	});
}

