/**
 * 설정 - 직원관리
 */
$( document ).ready(function() {
	
	$('a', $('#nav')).each(function( index ) {
		if ($(this).text() == t("rooms.set") ) {
			$(this).parent().addClass("active");
		}
	});
	
	if($("#phone1").length) {
		setPhoneEvent("#phone1");
	}
	if($("#phone2").length) {
		setPhoneEvent("#phone2");
	}
	if($("#phone3").length) {
		setPhoneEvent("#phone3");
	}
	
	if($("#keyword").length) {
		$("#keyword").keydown(function(event) { if (event.which == 13) { searchManager(); } });
	}
	
	if($("#name").length) {
		$("#name").focus();
	}
});

/**
 * 직원 검색 (검색 버튼 클릭 시)
 * @returns
 */
function searchManager() {
	var field = $("#field").val();
	var keyword = encodeURI(encodeURIComponent($("#keyword").val()));
	var url = "/mgr/list?field=" + field + "&keyword=" + keyword;
	$(location).attr("href", url);
}

/**
 * 직원 추가 화면으로 이동(리스트 화면에서 추가 버튼 클릭 시)
 * @returns
 */
function addManager() {
	$(location).attr("href", "/mgr/add");
}

/**
 * 직원 수정 화면으로 이동
 * @param manager_no
 * @returns
 */
function modifyManager(manager_no) {
	var url = "/mgr/modify?manager_no=" + manager_no;
	$(location).attr("href", url);
}

/**
 * 직원 삭제 실행
 * @param manager_no
 * @returns
 */
function deleteManager(manager_no) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(!confirm(t("rooms.del"))) {
		return;
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

/**
 * 주민등록번호 앞자리
 * @param e
 * @returns
 */
function jumin1(e) {
	if(e.value.length == 6) {
		$("#jumin2").focus();
	}
}

/**
 * 주민등록번호 뒷자리
 * @param e
 * @returns
 */
function jumin2(e) {
	if(e.value.length == 7) {
		$("#phone").focus();
	}
}

/**
 * 다음 주소 검색
 * @returns
 */
function findZipCode() {
	new daum.Postcode({
        oncomplete: function(data) {
            $('#zipcode').val(data.zonecode);
            $('#addr').val(data.roadAddress);
            $('#addr_jibun').val(data.jibunAddress);
            $('#addr2').focus();
        }
    }).open();
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

function checkInput(ismodify) {
	if(isNull($("#name").val())) {
		co.alert(t("manage.input.name"), function(){$("#name").focus();});
		return false;
	}

	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		var birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
		if( isValidDate(birth) == false ) {
			co.alert(t("manage.input.wrongbirth"));
			return false;
		}
	}
	
	if(!isNull($('#jumin1').val())) {
		if($.isNumeric($('#jumin1').val()) == false) {
			co.alert(t("manage.only.reginum"), function(){$("#jumin1").focus();});
			return false;
		}
	}
	
	if(!isNull($('#jumin2').val())) {
		if($.isNumeric($('#jumin2').val()) == false) {
			co.alert(t("manage.only.reginum"), function(){$("#jumin2").focus();});
			return false;
		}
	}
	
	var phone1 = $("#phone1").val();
	var phone2 = $("#phone2").val();
	var phone3 = $("#phone3").val();
	if(isNull(phone1)) {
		co.alert(t("counsel.input.contact"), function(){$("#phone1").focus();});
		return false;
	}
	if(isNull(phone2)) {
		co.alert(t("counsel.input.contact"), function(){$("#phone2").focus();});
		return false;
	}
	if(isNull(phone3)) {
		co.alert(t("counsel.input.contact"), function(){$("#phone3").focus();});
		return false;
	}
	if($.isNumeric(phone1) == false) {
		co.alert(t("manage.only.phone"), function(){$("#phone1").focus();});
		return false;
	}
	if($.isNumeric(phone2) == false) {
		co.alert(t("manage.only.phone"), function(){$("#phone2").focus();});
		return false;
	}
	if($.isNumeric(phone3) == false) {
		co.alert(t("manage.only.phone"), function(){$("#phone3").focus();});
		return false;
	}
	if(phone1.length < 2 || phone1.length > 4) {
		co.alert(t("counsel.input.phonefirst"), function(){$("#phone1").focus();});
		return false;
	}
	if(phone2.length < 3 || phone2.length > 4) {
		co.alert(t("counsel.input.phonesecond"), function(){$("#phone2").focus();});
		return false;
	}
	if(phone3.length != 4) {
		co.alert(t("manage.only.phonefour"), function(){$("#phone3").focus();});
		return false;
	}

	if(isNull($("#idnum").val())) {
		co.alert(t("manage.input.membernums"), function(){$("#idnum").focus();});
		return false;
	}
	if(ismodify == 0) {
		if(isNull($("#passwd").val())) {
			co.alert(t("manage.input.password"), function(){$("#passwd").focus();});
			return false;
		}
	}
	if(isNull($("#role").val())) {
		co.alert(t("manage.input.powers"), function(){$("#role").focus();});
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

function addManagerExit() {
	$(location).attr("href", "/mgr/list");
}

function modifyManagerExit() {
	$(location).attr("href", "/mgr/list");
}