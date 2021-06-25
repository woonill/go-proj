function initMgr() {
	if($("#birthy").length) {
		$("#birthy").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#birthm").length) {
		$("#birthm").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#birthd").length) {
		$("#birthd").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	}
	if($("#field").length) {
		$("#field").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true});
	}
	if($("#role").length) {
		$("#role").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true});
	}
	if($("#phone1").length) {
		setPhoneEvent("#phone1");
	}
	if($("#phone2").length) {
		setPhoneEvent("#phone2");
	}
	if($("#phone3").length) {
		setPhoneEvent("#phone3");
	}
}

function deleteManager(manager_no) {
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
			bno : bno
		},
		traditional: true,
		url: '/mgr/delete?manager_no=' + manager_no,
		error: function() {
			alert(t("manage.error.del"));
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
					$(location).attr("href", "/login/login?uri=" + encodeURI("/mgr/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("manage.fail.del"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function searchManager() {
	var field = $("#field").val();
	var keyword = encodeURI(encodeURIComponent($("#keyword").val()));
	var url = "/mgr/list?field=" + field + "&keyword=" + keyword;
	$(location).attr("href", url);
}

function checkDup() {
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
			id : $("#idnum").val(),
			bno :bno
		},
		traditional: true,
		url: '/mgr/checkdup',
		error: function() {
			alert(t("rooms.error.add"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				if(parseInt(status.code) == 20303) {
					alert(t("manage.correct.membernum"));
					$("#checkdup").val(1);
				} else {
					alert(t("manage.error.exist"));
				}
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/mgr/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("manage.fail.overlap"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function createNum() {
	createNumWithBranchNo(0);
}

function createNumWithBranchNo(branch_no) {
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
			id : $("#idnum").val(),
			branch_no : branch_no,
			bno : bno
		},
		traditional: true,
		url: '/mgr/workernum',
		error: function() {
			alert(t("manage.error.nogen"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var worker_num = data.worker_num;
				$("#idnum").val(worker_num);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/mgr/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("manage.membernum.nogen"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function modifyManager(manager_no) {
	var url = "/mgr/modify?manager_no=" + manager_no;
	$(location).attr("href", url);
}

function addManager() {
	$(location).attr("href", "/mgr/add");
}

function checkInput(ismodify) {
	if(isNull($("#name").val())) {
		alert(t("center.inputname"));
		return false;
	}
//	if(isNull($("#birth").val())) {
//		alert("생일을 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#jumin1").val())) {
//		alert("주민등록번호를 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#jumin2").val())) {
//		alert("주민등록번호를 입력해주세요.");
//		return false;
//	}
	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		var birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
		if( isValidDate(birth) == false ) {
			alert(t("manage.input.wrongbirth"));
			return false;
		}
	}
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
//	if(isNull($("#zipcode").val())) {
//		alert("주소를 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#addr").val())) {
//		alert("주소를 입력해주세요.");
//		return false;
//	}
	if(isNull($("#idnum").val())) {
		alert(t("manage.input.membernum"));
		return false;
	}
	if(ismodify == 0) {
		if(isNull($("#passwd").val())) {
			alert(t("user.input.password"));
			return false;
		}
	}
	if(isNull($("#role").val())) {
		alert(t("manage.input.power"));
		return false;
	}
	return true;
}

function addManagerExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInput(0) == false) {
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
			jumin1 : $("#jumin1").val(),
			jumin2 : $("#jumin2").val(),
			zipcode : $("#zipcode").val(),
			address : $("#addr").val(),
			address_jibun : $("#addr_jibun").val(),
			address_detail : $("#addr2").val(),
			id : $("#idnum").val(),
			password : $("#passwd").val(),
			manager_role_no : $("#role").val(),
			bno : bno
		},
		traditional: true,
		url: '/mgr/addexe',
		error: function() {
			alert(t("rooms.error.add"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$(location).attr("href", "/mgr/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/mgr/list"));
				} else if(parseInt(status.code) == 20304) {
					alert(t("manage.error.overlap"));
					hideLoadingLayer();
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("manage.fail.add"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function checkModify() {
	var orgid = $("#orgid").val();
	var curid = $("#idnum").val();
	var checkdup = $("#checkdup").val();
	checkdup = parseInt(checkdup);
	
	if(orgid != curid) {
		if(checkdup == 0) {
			alert(t("manage.membernum.change"));
			return false;
		}
	}
	return true;
}

function modifyManagerExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInput(1) == false) {
		return false;
	}
//	if(checkModify() == false) {
//		return false;
//	}
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
			jumin1 : $("#jumin1").val(),
			jumin2 : $("#jumin2").val(),
			zipcode : $("#zipcode").val(),
			address : $("#addr").val(),
			address_jibun : $("#addr_jibun").val(),
			address_detail : $("#addr2").val(),
			id : $("#idnum").val(),
			org_idnum : $("#org").val(),
			password : $("#passwd").val(),
			manager_no : $("#manager_no").val(),
			manager_role_no : $("#role").val(),
			bno : bno
		},
		traditional: true,
		url: '/mgr/modifyexe',
		error: function() {
			alert(t("discount.error.corrects"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$(location).attr("href", "/mgr/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/mgr/list"));
				} else if(parseInt(status.code) == 20304) {
					alert(t("manage.error.overlap"));
					hideLoadingLayer();
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("manage.fail.correct"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function deleteManager(manager_no) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(confirm(t("discount.reallydel")) == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			manager_no : manager_no,
			bno : bno
		},
		traditional: true,
		url: '/mgr/delexe',
		error: function() {
			alert(t("manage.error.del"));
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
					$(location).attr("href", "/login/login?uri=" + encodeURI("/mgr/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("manage.fail.del"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function addManagerExit() {
	$(location).attr("href", "/mgr/list");
}

function modifyManagerExit() {
	$(location).attr("href", "/mgr/list");
}

function jumin1(e) {
	if(e.value.length == 6) {
		$("#jumin2").focus();
	}
}

function jumin2(e) {
	if(e.value.length == 7) {
		$("#phone").focus();
	}
}

