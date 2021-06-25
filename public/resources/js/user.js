
function viewShopPoint(name, phone, shop_no) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	$("#username").text(name);
	$("#userphone").text(phone);
	layer_open("shoppoint_layer", "fade", true);
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			shop_no: shop_no,
			bno: bno
		},
		traditional: true,
		url: '/user/shop/point',
		error: function() {
			alert(t("user.error.shoppoint"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var totalpoint = parseInt(data.total);
				var usedpoint = parseInt(data.used);
				var remainpoint = totalpoint - usedpoint;
				if(remainpoint <= 0) {
					usedpoint = totalpoint;
					remainpoint = 0;
				}
				$("#totalpoint").text(comma(totalpoint));
				$("#usedpoint").text(comma(usedpoint));
				$("#remainpoint").text(comma(remainpoint));
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("user.fail.shopinfo"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function modifyReservation(reservation_no) {
	var url = "/reservation/modify?reservation_no=" + reservation_no;
	$(location).attr("href", url);
}

function addReservation(no) {
	$(location).attr("href", "/reservation/add?user_no="+no);
}

function viewUserReservation(no) {
	$(location).attr("href", "/reservation/user/list?user_no="+no);
}

function setFilter() {
	var page = 1;
	var isr = $("#isr").val();
	var field = $("#field").val();
	var keyword = encodeURI(encodeURIComponent($("#keyword").val()));
	var url = "/user/list?page=" + page + "&isr=" + isr + "&field=" + field + "&keyword=" + keyword;
	$(location).attr("href", url);
}

function searchUser() {
	var isr = $("#isr").val();
	var field = $("#field").val();
	var keyword = encodeURI(encodeURIComponent($("#keyword").val()));
	var url = "/user/list?isr=" + isr + "&field=" + field + "&keyword=" + keyword;
	$(location).attr("href", url);
}

//function deleteUser(user_no) {
//	var bno = 0;
//	if($("#bno").length) {
//		bno = $("#bno").val();
//	}
//	showLoadingLayer();
//	$.ajax({
//		type: 'get',
//		async: true,
//		dataType: 'json',
//		data: {
//			user_no : user_no,
//			bno : bno
//		},
//		traditional: true,
//		url: '/user/delete',
//		error: function() {
//			alert(t("manage.error.del"));
//			hideLoadingLayer();
//		},
//		beforeSend: function() {},
//		success: function(res) {
//			var status = res.status;
//			if(status.result == RESULT_SUCCESS) {
//				alert("삭제했습니다.");
//				location.reload();
//			} else {
//				if(parseInt(status.code) == 20102) {
//					alert(t("discount.logout"));
//					$(location).attr("href", "/login/login?uri=" + encodeURI("/user/list"));
//				} else if(parseInt(status.code) == 20104) {
//					alert(t("discount.login"));
//					$(location).attr("href", "/login/logout");
//				} else {
//					alert(t("user.fail.del"));
//					hideLoadingLayer();
//				}
//			}
//		}
//	});
//}

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
			phone : $("#phone").val(),
			bno : bno
		},
		traditional: true,
		url: '/user/checkdup',
		error: function() {
			alert(t("rooms.error.add"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				if(parseInt(status.code) == 20033) {
					alert(t("user.correctcontact"));
					$("#checkdup").val(1);
				} else {
					alert(t("user.existcontact"));
				}
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/user/list"));
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

function modifyUser(user_no) {
	var url = "/user/modify?user_no=" + user_no;
	$(location).attr("href", url);
}

function addUser() {
	$(location).attr("href", "/user/add");
}

function checkInput(ismodify) {
	if(isNull($("#userid").val())) {
		alert(t("user.input.id"));
		return false;
	}
	if(isNull($("#name").val())) {
		alert(t("center.inputname"));
		return false;
	}
//	if(isNull($("#email").val())) {
//		alert("이메일을 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#birthy").val())) {
//		alert("생일(년도)를 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#birthm").val())) {
//		alert("생일(월)을 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#birthd").val())) {
//		alert("생일(일)을 입력해주세요.");
//		return false;
//	}
//	var birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
//	if( isValidDate(birth) == false ) {
//		alert(t("manage.input.wrongbirth"));
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
//	if(isNull($("#job").val())) {
//		alert("직업을 입력해주세요.");
//		return false;
//	}
	if(ismodify == 0) {
		if(isNull($("#passwd").val())) {
			alert(t("user.input.password"));
			return false;
		}
	}
	return true;
}

function makeInterest() {
	var interest_elec="N", interest_tv="N", interest_cook="N", interest_book="N";
	var interest_software="N", interest_movie="N", interest_fashion="N", interest_concert="N";
	var interest_car="N", interest_ani="N", interest_mas="N", interest_show="N", interest_web="N";
	var interest_game="N", interest_trav="N", interest_music="N", interest_internet="N";
	var interest_photo="N", interest_health="N", interest_art="N";
	if($("input:checkbox[name='interest_elec']").is(":checked")) {
		interest_elec = "Y";
	}
	if($("input:checkbox[name='interest_tv']").is(":checked")) {
		interest_tv = "Y";	
	}
	if($("input:checkbox[name='interest_cook']").is(":checked")) {
		interest_cook = "Y";
	}
	if($("input:checkbox[name='interest_book']").is(":checked")) {
		interest_book = "Y";
	}
	if($("input:checkbox[name='interest_software']").is(":checked")) {
		interest_software = "Y";
	}
	if($("input:checkbox[name='interest_movie']").is(":checked")) {
		interest_movie = "Y";
	}
	if($("input:checkbox[name='interest_fashion']").is(":checked")) {
		interest_fashion = "Y";
	}
	if($("input:checkbox[name='interest_concert']").is(":checked")) {
		interest_concert = "Y";
	}
	if($("input:checkbox[name='interest_car']").is(":checked")) {
		interest_car = "Y";
	}
	if($("input:checkbox[name='interest_ani']").is(":checked")) {
		interest_ani = "Y";
	}
	if($("input:checkbox[name='interest_mas']").is(":checked")) {
		interest_mas = "Y";
	}
	if($("input:checkbox[name='interest_show']").is(":checked")) {
		interest_show = "Y";
	}
	if($("input:checkbox[name='interest_web']").is(":checked")) {
		interest_web = "Y";
	}
	if($("input:checkbox[name='interest_game']").is(":checked")) {
		interest_game = "Y";
	}
	if($("input:checkbox[name='interest_trav']").is(":checked")) {
		interest_trav = "Y";
	}
	if($("input:checkbox[name='interest_music']").is(":checked")) {
		interest_music = "Y";
	}
	if($("input:checkbox[name='interest_internet']").is(":checked")) {
		interest_internet = "Y";
	}
	if($("input:checkbox[name='interest_photo']").is(":checked")) {
		interest_photo = "Y";
	}
	if($("input:checkbox[name='interest_health']").is(":checked")) {
		interest_health = "Y";
	}
	if($("input:checkbox[name='interest_art']").is(":checked")) {
		interest_art = "Y";
	}
	var interest = "";
	interest = interest + interest_elec + "|" + interest_tv + "|" + interest_cook + "|" + interest_book;
	interest = interest + "|" + interest_software + "|" + interest_movie + "|" + interest_fashion + "|" + interest_concert;
	interest = interest + "|" + interest_car + "|" + interest_ani + "|" + interest_mas + "|" + interest_show;
	interest = interest + "|" + interest_web + "|" + interest_game + "|" + interest_trav + "|" + interest_music;
	interest = interest + "|" + interest_internet + "|" + interest_photo + "|" + interest_health + "|" + interest_art;
	return interest;
}

function addUserExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var checkdup = $("#checkdup").val();
	checkdup = parseInt(checkdup);
	if(checkdup == 0) {
		alert(t("user.overlap"));
		return false;
	}
	if(checkInput(0) == false) {
		return false;
	}
	var interest = makeInterest();
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
			userid : $("#userid").val(),
			password : $("#passwd").val(),
			nickname : $("#nickname").val(),
			name : $("#name").val(),
			email : $("#email").val(),
			birth : birth,
			phone : phone,
//			jumin1 : $("#jumin1").val(),
//			jumin2 : $("#jumin2").val(),$("input:radio[name='pay_method']:checked").val()
			zipcode : $("#zipcode").val(),
			address : $("#addr").val(),
			address_jibun : $("#addr_jibun").val(),
			address_detail : $("#addr2").val(),
			job : $("#job").val(),
			issms : $("input:radio[name='issms']:checked").val(),
			isemail : $("input:radio[name='isemail']:checked").val(),
			ismarketting : $("input:radio[name='ismarketting']:checked").val(),
			interest: interest,
			bno : bno
		},
		traditional: true,
		url: '/user/addexe',
		error: function() {
			alert(t("rooms.error.add"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.added"));
				$(location).attr("href", "/user/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/user/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("user.fail.add"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function checkModify() {
	var orgphone = $("#orgphone").val();
	var curphone = $("#phone").val();
	var checkdup = $("#checkdup").val();
	checkdup = parseInt(checkdup);
	
	if(orgphone != curphone) {
		if(checkdup == 0) {
			alert(t("user.overlaps"));
			return false;
		}
	}
	return true;
}

function modifyUserExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInput(1) == false) {
		return false;
	}
	if(checkModify() == false) {
		return false;
	}
	var interest = makeInterest();
	var birth = "";
	if(isNull($("#birthy").val()) && isNull($("#birthm").val()) && isNull($("#birthd").val())) {
		birth = "";
	} else {
		birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
	}
	if(birth != "") {
		if( isValidDate(birth) == false ) {
			alert(t("manage.input.wrongbirth"));
			return false;
		}
	}
	var phone = $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			userid : $("#userid").val(),
			password : $("#passwd").val(),
			nickname : $("#nickname").val(),
			name : $("#name").val(),
			email : $("#email").val(),
			birth : birth,
			phone : phone,
//			jumin1 : $("#jumin1").val(),
//			jumin2 : $("#jumin2").val(),$("input:radio[name='pay_method']:checked").val()
			zipcode : $("#zipcode").val(),
			address : $("#addr").val(),
			address_jibun : $("#addr_jibun").val(),
			address_detail : $("#addr2").val(),
			job : $("#job").val(),
			issms : $("input:radio[name='issms']:checked").val(),
			isemail : $("input:radio[name='isemail']:checked").val(),
			ismarketting : $("input:radio[name='ismarketting']:checked").val(),
			interest: interest,
			user_no : $("#user_no").val(),
			bno : bno
		},
		traditional: true,
		url: '/user/modifyexe',
		error: function() {
			alert(t("discount.error.corrects"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.edited"));
				$(location).attr("href", "/user/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/user/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("user.fail.correct"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function deleteUser(user_no) {
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
			user_no : user_no,
			bno : bno
		},
		traditional: true,
		url: '/user/delexe',
		error: function() {
			alert(t("manage.error.del"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				alert(t("app.del"));
				location.reload();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/user/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("user.fail.del"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function addUserExit() {
	$(location).attr("href", "/user/list");
}

function modifyUserExit() {
	$(location).attr("href", "/user/list");
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

function initUser() {
	if($("#isr").length) {
		$("#isr").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true, "iblur":setFilter, });
	}
	if($("#field").length) {
		$("#field").combobox({"bcssClassName":"text", "bheight":27, "iwidth":80, "iheight":23, "ireadonly":true});
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
	$("input[type='radio'], input[type='checkbox']").labelauty({ minimum_width:"100px", class:"chkradio" });
	if($("#phone1").length) {
		setPhoneEvent("#phone1");
	}
	if($("#phone2").length) {
		setPhoneEvent("#phone2");
	}
	if($("#phone3").length) {
		setPhoneEvent("#phone3");
	}
	$("#keyword").on("keyup", function(e){
		if(e.keyCode == 13){
			searchUser();
		}
	});
}

