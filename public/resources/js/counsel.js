function modifyCounsel(counsel_no) {
	var url = "/counsel/modify?counsel_no=" + counsel_no;
	$(location).attr("href", url);
}

function viewCounsel(counsel_no) {
	var url = "/counsel/view?counsel_no=" + counsel_no;
	$(location).attr("href", url);
}

function addCounsel() {
	$(location).attr("href", "/counsel/add");
}

function viewBranchList(no) {
	var id = "#"+no+"_branch_list";
	var branch_list = JSON.parse(id.val());
}

function searchCounsel() {
	var count = $("#count").val();
	var field = $("#field").val();
	var k = $("#keyword").val();
	var f = "", t = "";
	if(field == "cdate" || field == "cancel") {
		f = $("#from_date").val();
		t = $("#to_date").val();
		if(isNull(f)) {
			alert(t("counsel.input.searchday"));
			$("#from_date").focus();
			return false;
		}
		if(isNull(t)) {
			alert(t("counsel.input.searchday"));
			$("#to_date").focus();
			return false;
		}
	}
	var keyword = encodeURI(encodeURIComponent(k));
	var url = "/counsel/list?field=" + field + "&keyword=" + keyword + "&from_date=" + f + "&to_date=" + t + "&count=" + count;
	console.log(url);
	$(location).attr("href", url);
}

function checkInput() {
	if(isNull($("#name").val())) {
		alert(t("center.inputname"));
		return false;
	}
//	if(isNull($("#birth").val())) {
//		alert("생일을 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#job").val())) {
//		alert("직업을 입력해주세요.");
//		return false;
//	}
	var phone1 = $("#phone1").val();
	var phone2 = $("#phone2").val();
	var phone3 = $("#phone3").val();
	if(isNull(phone1)) {
		alert(t("reservation.phone.num"));
		$("#phone1").focus();
		return false;
	}
	if(isNull(phone2)) {
		alert(t("reservation.phone.num"));
		$("#phone2").focus();
		return false;
	}
	if(isNull(phone3)) {
		alert(t("reservation.phone.num"));
		$("#phone3").focus();
		return false;
	}
	if($.isNumeric(phone1) == false) {
		alert(t("manage.only.phonenum"))
		$("#phone1").focus();
		return false;
	}
	if($.isNumeric(phone2) == false) {
		alert(t("manage.only.phonenum"))
		$("#phone2").focus();
		return false;
	}
	if($.isNumeric(phone3) == false) {
		alert(t("manage.only.phonenum"))
		$("#phone3").focus();
		return false;
	}
	if(phone1.length < 2 || phone1.length > 4) {
		alert(t("reservation.phone.first"));
		$("#phone1").focus();
		return false;
	}
	if(phone2.length < 3 || phone2.length > 4) {
		alert(t("reservation.phone.second"));
		$("#phone2").focus();
		return false;
	}
	if(phone3.length != 4) {
		alert(t("counsel.phonefour"));
		$("#phone3").focus();
		return false;
	}
	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		var birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
		if( isValidDate(birth) == false ) {
			alert(t("manage.input.wrongbirth"));
			return false;
		}
	}
//	if(isNull($("#zipcode").val())) {
//		alert("주소를 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#addr").val())) {
//		alert("주소를 입력해주세요.");
//		return false;
//	}
	if(isNull($("#due_date").val())) {
		alert(t("reservation.schedule.day"));
		return false;
	}
	if( isValidDate($("#due_date").val()) == false ) {
		alert(t("counsel.wrong.scheduledays"));
		return false
	}
	if(isNull($("#hospital").val())) {
		alert(t("counsel.input."));
		return false;
	}
	if(isNull($("#counsel").val())) {
		alert(t("counsel.input.items"));
		return false;
	}
	if(isNull($("#cdate").val())) {
		alert(t("counsel.input.days"));
		return false;
	}
	if( isValidDate($("#cdate").val()) == false ) {
		alert(t("counsel.wrong.days"));
		return false
	}
	if(isNull($("#manager_name").val())) {
		alert(t("counsel.input.members"));
		$("#manager_name").focus();
		return false;
	}
	return true;
}

function addCounselExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInput() == false) {
		return false;
	}
	var birth = "";
	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
	}
	var phone = $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			name : $("#name").val(),
			birth : birth,
			phone : phone,
			job : $("#job").val(),
			zipcode : $("#zipcode").val(),
			address : $("#addr").val(),
			address_jibun : $("#addr_jibun").val(),
			address_detail : $("#addr2").val(),
			due_date : $("#due_date").val(),
			hospital : $("#hospital").val(),
			birth_count : $("#birth_count").val(),
			revisit : $("#revisit").val(),
			baby : $("#baby").val(),
			counsel : $("#counsel").val(),
			cdate : $("#cdate").val(),
			manager_no: $("#manager_no").val(),
			manager_name : $("#manager_name").val(),
			bno : bno
		},
		traditional: true,
		url: '/counsel/addexe',
		error: function() {
			alert(t("counsel.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.added"));
				$(location).attr("href", "/counsel/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/counsel/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("app.cantadd"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function addCounselExit() {
	$(location).attr("href", "/counsel/list");
}

function modifyCounselExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInput() == false) {
		return false;
	}
	var birth = "";
	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
	}
	var phone = $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			counsel_no : $("#counsel_no").val(),
			user_no : $("#user_no").val(),
			name : $("#name").val(),
			birth : birth,
			phone : phone,
			job : $("#job").val(),
			zipcode : $("#zipcode").val(),
			address : $("#addr").val(),
			address_jibun : $("#addr_jibun").val(),
			address_detail : $("#addr2").val(),
			due_date : $("#due_date").val(),
			hospital : $("#hospital").val(),
			birth_count : $("#birth_count").val(),
			revisit : $("#revisit").val(),
			baby : $("#baby").val(),
			counsel : $("#counsel").val(),
			cdate : $("#cdate").val(),
			manager_no: $("#manager_no").val(),
			manager_name : $("#manager_name").val(),
			bno : bno
		},
		traditional: true,
		url: '/counsel/modifyexe',
		error: function() {
			alert(t("discount.error.corrects"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.edited"));
				$(location).attr("href", "/counsel/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/counsel/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.edit"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function modifyCounselExit() {
	$(location).attr("href", "/counsel/list");
}

function deleteCounselExe(counsel_no) {
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
			counsel_no : counsel_no,
			bno : bno
		},
		traditional: true,
		url: '/counsel/deleteexe',
		error: function() {
			alert(t("manage.error.del"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$('#resCounDelConfirm').bPopup().hide();
				alert(t("app.del"));
				$(location).attr("href", "/counsel/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/counsel/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.del"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function selectCondition() {
	var field = $("#field").val();
	if(field == "cdate" || field == "cancel") {
		$("#keyword").hide();
		$("#cdate").show();
	} else {
		$("#keyword").show();
		$("#cdate").hide();
	}
}

function selectManager() {
	var manager_no = parseInt($("#manager_no").val());
	if(manager_no == 0) {
		$("#manager_name").show();
		$("#manager_name").val('');
	} else {
		$("#manager_name").val($("#manager_no option:selected").text());
		$("#manager_name").hide();
	}
}

function initCounsel() {
	if($("#from_date").length) {
		setDatePicker("#from_date");
	}
	if($("#to_date").length) {
		setDatePicker("#to_date");
	}
	if($("#due_date").length) {
		setDatePicker("#due_date");
	}
	
	if($("#cdate").length) {
		if($("#from_date").length && $("#to_date").length) {
			;
		} else {
			setDatePicker("#cdate");
		}
		if($("#field").length) {
			selectCondition();
		}
	}
	if($("#manager_no").length) {
		$("#manager_no").combobox({"bcssClassName":"text", "iwidth":100, "bheight":27, "iheight":23, "ireadonly":true, "iblur":selectManager});
		selectManager();
	}
	setPhoneEvent("#phone1");
	setPhoneEvent("#phone2");
	setPhoneEvent("#phone3");
	$("#keyword").on("keyup", function(e){
		if(e.keyCode == 13){
			searchCounsel();
		}
	});
	$("#from_date").on("keyup", function(e){
		if(e.keyCode == 13){
			searchCounsel();
		}
	});
	$("#to_date").on("keyup", function(e){
		if(e.keyCode == 13){
			searchCounsel();
		}
	});
	$(".tooltip").tooltipster({
		animation:'fade',
		delay:200,
		theme:'tooltipster-light',
		trigger:'click',
		side:'right'
	});
	
	if($("#count").length) {
		/*
		$("#count").combobox({ "iblur":function(selected){
			var count = selected.val();
			var field = $("#field").val();
			var keyword = $("#keyword").val();
			var from_date = $("#from_date").val();
			var to_date = $("#to_date").val();
			var url = "/counsel/list?field="+field+"&keyword="+keyword+"&from_date="+from_date+"&to_date="+to_date+"&count="+count;
			$(location).attr("href", url);
		}});
		*/
	}
	
	$('#top_menu_15').addClass("active");
	
}
