/**
 * 객실 관리 스크립트 모듈
 */

$( document ).ready(function() {
	
	$('a', $('#nav')).each(function( index ) {
		if ($(this).text() == t("rooms.set") ) {
			$(this).parent().addClass("active");
		}
	});
});

/**
 * 객실등급 등록 화면 이동
 * @returns
 */
function addRoomGrade() {
	$(location).attr("href", "/room/grade/add");
}

/**
 * 객실등급 수정 화면 이동
 * @param room_grade_no 객실등급고유번호
 * @returns
 */
function modifyRoomGrade(room_grade_no) {
	$(location).attr("href", "/room/grade/modify?room_grade_no="+room_grade_no);
}

/**
 * 객실 등급 추가 실행
 * @returns
 */
function addRoomGradeExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInput(0) == false) {
		return false;
	}
	var panorama = "", photo="", information="";
	if( $("#panorama") && !isNull($("#panorama").val()) ) {
		panorama = $("#panorama").val();
	}
	if( $("#photo") && !isNull($("#photo").val()) ) {
		photo = $("#photo").val();
	}
	if( $("#information") && !isNull($("#information").val()) ) {
		information = $("#information").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			grade : $("#grade").val(),
			level : $("#level").val(),
			price : uncomma($("#price").val()),
			deposit : uncomma($("#deposit").val()),
			bno : bno
		},
		traditional: true,
		url: '/room/grade/addexe',
		error: function() {
			alert(t("rooms.error.add"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$(location).attr("href", "/room/main");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/room/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.failadd"));
					hideLoadingLayer();
				}
			}
		}
	});
}

/**
 * 객실등급 수정 실행
 * @returns
 */
function modifyRoomGradeExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInput(0) == false) {
		return false;
	}

	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_no").val(),
			grade : $("#grade").val(),
			level : $("#level").val(),
			price : uncomma($("#price").val()),
			deposit : uncomma($("#deposit").val()),
			bno : bno
		},
		traditional: true,
		url: '/room/grade/modifyexe',
		error: function() {
			alert(t("discount.error.corrects"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$(location).attr("href", "/room/main");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/room/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("rooms.fail.edit"));
					hideLoadingLayer();
				}
			}
		}
	});
}

/**
 * 객실등급 삭제 실행
 * @param no
 * @returns
 */
function deleteRoomGradeExe(no) {
	if(!confirm(t("rooms.del"))) {
		return;
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
			room_grade_no : no,
			bno : bno
		},
		traditional: true,
		url: '/room/grade/delexe',
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
					$(location).attr("href", "/login/login?uri=" + encodeURI("/room/main"));
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

/**
 * 객실 등급 등록/수정 취소 (목록으로 이동)
 * @returns
 */
function editRoomGradeExit() {
	$(location).attr("href", "/room/main");
}

/**
 * 객실 등급 등록/수정 시 필수 항목 체크
 * @param ismodify
 * @returns
 */
function checkInput() {
	if(isNull($("#grade").val())) {
		co.alert(t("rooms.input.grades"));
		return false;
	}
	if(isNull($("#price").val())) {
		co.alert(t("rooms.input.baseprices"));
		return false;
	}
	if(isNull($("#deposit").val())) {
		co.alert(t("rooms.input.contractmoneys"));
		return false;
	}

	return true;
}

/**
 * 객실 가격 추가 실행
 * @returns
 */
function addRoomGradePriceExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	
	var room_grade_price = uncomma($("#room_grade_price").val());
	if(isNull(room_grade_price)) {
		co.alert(t("rooms.input.prices"));
		return false;
	}
	if($.isNumeric(room_grade_price) == false) {
		co.alert(t("rooms.only.prices"));
		return false;
	}
	if($("#proom_grade").val() == "----") {
		co.alert(t("rooms.input.roomgrade"));
		return false;
	}
	if($("#reserve_day_list").val() == "----") {
		co.alert(t("rooms.input.contractterm"));
		return false;
	}
	
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			day : $("#reserve_day_list").val(),
			price : room_grade_price,
			room_grade_no : $("#proom_grade").val(),
			bno : bno
		},
		traditional: true,
		url: '/room/grade/price/addexe',
		error: function() {
			alert(t("rooms.error.add"));
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
					$(location).attr("href", "/login/login?uri=" + encodeURI("/room/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.failadd"));
					hideLoadingLayer();
				}
			}
		}
	});
}

/**
 * 객실 가격 수정 데이터 수정 폼에 로딩
 * @param no
 * @param day
 * @param price
 * @param grade
 * @param room_grade_no
 * @returns
 */
function modifyRoomGradePrice(no, day, price, grade, room_grade_no) {
	$("#modify_price_no").val(no);
	$("#btn_padd").hide();
	$("#btn_pmodify").show();
	$("#btn_pcancel").show();
	$("#room_grade_price").val(uncomma(price));
	$("#proom_grade").val(room_grade_no);
	$("#reserve_day_list").val(day);
}

/**
 * 객실가격 수정 취소
 * @returns
 */
function modifyGradePriceCancel() {
	
	$("#modify_price_no").val("");
	$("#btn_padd").show();
	$("#btn_pmodify").hide();
	$("#btn_pcancel").hide();
	$("#room_grade_price").val("");
	$("#proom_grade").val("----");
	$("#reserve_day_list").val("----");
}

/**
 * 객실 가격 수정 실행
 * @returns
 */
function modifyRoomGradePriceExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var room_grade_price = uncomma($("#room_grade_price").val());
	if(isNull(room_grade_price)) {
		co.alert(t("rooms.input.prices"));
		return false;
	}
	if($.isNumeric(room_grade_price) == false) {
		co.alert(t("rooms.only.prices"));
		return false;
	}
	if($("#proom_grade").val() == "----") {
		co.alert(t("rooms.input.roomgrade"));
		return false;
	}
	if($("#reserve_day_list").val() == "----") {
		co.alert(t("rooms.input.contractterm"));
		return false;
	}
	
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			day : $("#reserve_day_list").val(),
			price : room_grade_price,
			room_grade_no : $("#proom_grade").val(),
			room_grade_price_no : $("#modify_price_no").val(),
			bno : bno
		},
		traditional: true,
		url: '/room/grade/price/modifyexe',
		error: function() {
			alert(t("discount.error.corrects"));
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
					$(location).attr("href", "/login/login?uri=" + encodeURI("/room/main"));
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

/**
 * 객실 가격 삭제
 * @param no
 * @returns
 */
function deleteRoomGradePriceExe(no) {
	if(!confirm(t("rooms.del"))) {
		return;
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
			room_grade_price_no : no,
			bno : bno
		},
		traditional: true,
		url: '/room/grade/price/delexe',
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
					$(location).attr("href", "/login/login?uri=" + encodeURI("/room/main"));
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

/**
 * 객실 추가 실행
 * @returns
 */
function addRoomExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(isNull($("#room_name").val())) {
		co.alert(t("rooms.input.roomnums"));
		return false;
	}
	if($("#room_grade").val() == "----") {
		co.alert(t("rooms.input.roomgrade"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			name : $("#room_name").val(),
			room_grade_no : $("#room_grade").val(),
			bno : bno
		},
		traditional: true,
		url: '/room/addexe',
		error: function() {
			alert(t("rooms.error.add"));
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
					$(location).attr("href", "/login/login?uri=" + encodeURI("/room/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.failadd"));
					hideLoadingLayer();
				}
			}
		}
	});
}

/**
 * 수정 데이터 로드
 * @param no
 * @param name
 * @param grade
 * @param room_grade_no
 * @returns
 */
function modifyRoom(no, name, grade, room_grade_no) {
	
	$("#modify_no").val(no);
	$("#btn_add").hide();
	$("#btn_modify").show();
	$("#btn_cancel").show();
	$("#room_name").val(name);
	$("#room_grade").val(room_grade_no);
}

/**
 * 객실 수정 취소
 * @returns
 */
function modifyCancel() {
	$("#modify_no").val("");
	$("#btn_add").show();
	$("#btn_modify").hide();
	$("#btn_cancel").hide();
	$("#room_name").val("");
	$("#room_grade").val("----");
}

/**
 * 객실 정보 수정 실행
 * @returns
 */
function modifyRoomExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(isNull($("#room_name").val())) {
		alert(t("rooms.input.roomnum"));
		return false;
	}
	if($("#room_grade").val() == "----") {
		alert(t("gongu.selectgrade"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			name : $("#room_name").val(),
			room_grade_no : $("#room_grade").val(),
			room_no : $("#modify_no").val(),
			bno : bno
		},
		traditional: true,
		url: '/room/modifyexe',
		error: function() {
			alert(t("discount.error.corrects"));
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
					$(location).attr("href", "/login/login?uri=" + encodeURI("/room/main"));
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

/**
 * 객실 사용중지
 * @param no
 * @returns
 */
function deleteRoomExe(no) {

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
			room_no : no,
			bno : bno
		},
		traditional: true,
		url: '/room/delexe',
		error: function() {
			alert(t("rooms.error.stop"));
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
					$(location).attr("href", "/login/login?uri=" + encodeURI("/room/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("rooms.fail.stop"));
					hideLoadingLayer();
				}
			}
		}
	});
}

/**
 * 객실 재사용
 * @param no
 * @returns
 */
function reuseRoomExe(no) {
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
			room_no : no,
			bno : bno
		},
		traditional: true,
		url: '/room/reuseexe',
		error: function() {
			alert(t("rooms.error.reuses"));
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
					$(location).attr("href", "/login/login?uri=" + encodeURI("/room/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("rooms.error.reuse"));
					hideLoadingLayer();
				}
			}
		}
	});
}