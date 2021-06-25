function init() {
	$("#room_grade_price").on('keydown', function (e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var room_grade_price = uncomma($("#room_grade_price").val());
				if(room_grade_price == "" || isNull(room_grade_price)) {
					return false;
				}
				if($.isNumeric(room_grade_price) == false) {
					alert(t("rooms.only.contractmoney"));
					return false;
				}
				$("#room_grade_price").val(comma(room_grade_price));
			}
		}, 1);
	});
	initListCombobox();
}

function initListCombobox() {
	$("#proom_grade").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#reserve_day_list").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#room_grade").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
}

function initLevelCombobox() {
	$("#level").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true});
}

function addInit() {
	initLevelCombobox();
	
	$("#birth").datepicker({
		dateFormat: "yy-mm-dd",
		beforeShow: function() {
	        setTimeout(function(){
	            $('.ui-datepicker').css('z-index', 99999999999999);
	        }, 0);
	    }
	});
	
//	$("#f_panorama").change(function() {
//		upload("panorama");
//	});
//	
//	$("#f_information").change(function() {
//		upload("information");
//	});
//	
//	$("#f_photo").change(function() {
//		upload("photo");
//	});
	
	$("#price").on('keydown', function (e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var price = uncomma($("#price").val());
				if(price == "" || isNull(price)) {
					return false;
				}
				if($.isNumeric(price) == false) {
					alert(t("rooms.only.baseprice"));
					return false;
				}
				$("#price").val(comma(price));
			}
		}, 1);
	});
	
	$("#deposit").on('keydown', function (e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var deposit = uncomma($("#deposit").val());
				if(deposit == "" || isNull(deposit)) {
					return false;
				}
				if($.isNumeric(deposit) == false) {
					alert(t("rooms.only.contractmoney"));
					return false;
				}
				$("#deposit").val(comma(deposit));
			}
		}, 1);
	});
}

function addRoomGrade() {
	$(location).attr("href", "/room/grade/add");
}

function modifyRoomGrade(room_grade_no) {
	$(location).attr("href", "/room/grade/modify?room_grade_no="+room_grade_no);
}

function checkInput(ismodify) {
	if(isNull($("#grade").val())) {
		alert(t("rooms.input.grade"));
		return false;
	}
	if(isNull($("#price").val())) {
		alert(t("rooms.input.baseprice"));
		return false;
	}
	if(isNull($("#deposit").val())) {
		alert(t("rooms.input.contractmoney"));
		return false;
	}
//	if(isNull($("#panorama").val())) {
//		alert("상단이미지를 선택해주세요.");
//		return false;
//	}
//	if(isNull($("#information").val())) {
//		alert("상세정보를 선택해주세요.");
//		return false;
//	}
//	if(isNull($("#photo").val())) {
//		alert("객실이미지를 선택해주세요.");
//		return false;
//	}
	return true;
}

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
//			panorama : panorama,
//			photo : photo,
//			information : information,
//			ispanorama : $("#ispanorama").val()
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

function addRoomGradeExit() {
	$(location).attr("href", "/room/main");
}

function rupload(appid, url, id) {
	var data = new FormData();
	var file = $("#f_" + id)[0].files[0];
	data.append("file", file);
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		contentType: false,
		processData: false,
		data: data,
		traditional: true,
		url: url + "?appid=" + appid,
		error: function() {
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.message == RESULT_OK) {
				var resdata = res.data;
				var fileList = resdata.fileList[0];
				var fileinfo = fileList.fileName + "_" + fileList.fileLink;
				if(id == "photo") {
					var filelist = $("#" + id).val();
					if(filelist == "" || isNull(filelist)) {
						filelist = fileinfo;
					} else {
						filelist = filelist + "____" + fileinfo;
					}
					$("#" + id).val(filelist);
					var photocnt = parseInt($("#photocnt").val());
					var contents = "<li id='onephoto" + photocnt + "'><input type='hidden' id='vonephoto" + photocnt + "' value='" + photocnt + "'/><img src='" + fileList.fileLink + "' style='width:100px;height:100px;' alt='" + fileList.fileName + "'/><img src='/resources/images/delete.png' style='width:20px;height20px;' onclick='javascript:removePhoto(\"vonephoto" + photocnt + "')\"/></li>";
					photocnt = photocnt + 1;
					$("#photocnt").val(photocnt);
					$("#" + id + "_list").append(contents);
				} else if(id == "panorama") {
					$("#" + id).val(fileinfo);
					if(parseInt($("#ispanorama").val()) == 0) {
						var contents = "<img src='" + fileList.fileLink + "' style='width:500px;height:500px;'/>";
						$("#" + id + "_view").html(contents);	
					}
				} else {
					$("#" + id).val(fileinfo);
					$("#" + id + "_view").load(fileList.fileLink);
				}
			}
			hideLoadingLayer();
		}
	});
}

function upload(id) {
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
		url: '/fileupload',
		error: function() {
			alert(t("app.error"));
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var url = data.url;
				var appid = data.appid;
				rupload(appid, url, id);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/room/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("app.error"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function addRoomExe() {
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

function modifyRoom(no, name, grade, room_grade_no) {
	initListCombobox();
	$("#modify_no").val(no);
	$("#btn_add").hide();
	$("#btn_modify").show();
	$("#btn_cancel").show();
	$("#room_name").val(name);
	$("#room_grade").combobox("autocomplete", room_grade_no);
}

function modifyCancel() {
	initListCombobox();
	$("#modify_no").val("");
	$("#btn_add").show();
	$("#btn_modify").hide();
	$("#btn_cancel").hide();
	$("#room_name").val("");
	$("#room_grade").val("----");
}

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

function deleteRoomGradeExe(no) {
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

function modifyInit() {
	initLevelCombobox();
	
	$("#birth").datepicker({
		dateFormat: "yy-mm-dd",
		beforeShow: function() {
	        setTimeout(function(){
	            $('.ui-datepicker').css('z-index', 99999999999999);
	        }, 0);
	    }
	});
	
	$("#f_panorama").change(function() {
		upload("panorama");
	});
	
	$("#f_information").change(function() {
		upload("information");
	});
	
	$("#f_photo").change(function() {
		upload("photo");
	});
	
	$("#level").val($("#org_level").val());
	var panorama = $("#panorama").val();
	var information = $("#information").val();
	
	if(!isNull(panorama)) {
		var ploc = panorama.indexOf("_");
		var pname = panorama.substring(0, ploc);
		var purl = panorama.substring(ploc + 1);
		var pcontents = "<img src='" + purl + "' style='width:500px;height:500px;' alt='" + pname + "'/><img src='/resources/images/delete.png' style='width:2px;height2px;' onclick='javascript:removePanorama();'/>";
		$("#panorama_view").html(pcontents);
	}
	
	if(!isNull(information)) {
		var iloc = information.indexOf("_");
		var iname = information.substring(0, iloc);
		var iurl = information.substring(iloc + 1);
		var icontents = iurl;
		$("#information_view").load(icontents);
	}
	
	if( !isNull($("#photo").val()) ) {
		var photo_list = $("#photo").val().split("____");
		for(var i=0; i<photo_list.length; i++) {
			var onephoto = photo_list[i];
			var phloc = onephoto.indexOf("_");
			var phname = onephoto.substring(0, phloc);
			var phurl = onephoto.substring(phloc + 1);
			var phcontents = "<li id='onephoto" + i + "'><input type='hidden' id='vonephoto" + i + "' value='" + i + "'/><img src='" + phurl + "' style='width:100px;height:100px;' alt='" + phname + "'/><img src='/resources/images/delete.png' style='width:20px;height20px;' onclick='javascript:removePhoto(\"onephoto" + i + "\")''/></li>";
			$("#photo_list").append(phcontents);
		}
		$("#photocnt").val(photo_list.length);
	}
}

function removePanorama() {
	$("#panorama_view").html("");
	$("#panorama").val("");
}

function removeInformation() {
	$("#information_view").html("");
	$("#information").val("");
}

function removePhoto(id) {
	var photo = $("#" + id).val();
	var photo_list = $("#photo").val().split("____");
	photo_list = photo_list.removeElement(photo);
	var fileList = photo_list.join("____");
	$("#photo").val(fileList);
	$("#" + id).remove();
}

function modifyRoomGradeExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInput(0) == false) {
		return false;
	}
//	var panorama = "", photo="", information="";
//	if( $("#panorama") && !isNull($("#panorama").val()) ) {
//		panorama = $("#panorama").val();
//	}
//	if( $("#photo") && !isNull($("#photo").val()) ) {
//		photo = $("#photo").val();
//	}
//	if( $("#information") && !isNull($("#information").val()) ) {
//		information = $("#information").val();
//	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_no").val(),
			grade : $("#grade").val(),
			level : $("#level").val(),
//			ispanorama : $("#ispanorama").val(),
//			panorama : panorama,
//			photo : photo,
//			information : information,
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

function modifyRoomGradeExit() {
	$(location).attr("href", "/room/main");
}

function modifyRoomGradePriceExit() {
	$(location).attr("href", "/room/main");
}

function addRoomGradePriceExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var room_grade_price = uncomma($("#room_grade_price").val());
	if(isNull(room_grade_price)) {
		alert(t("rooms.input.price"));
		return false;
	}
	if($.isNumeric(room_grade_price) == false) {
		alert(t("rooms.only.price"));
		return false;
	}
	if($("#proom_grade").val() == "----") {
		alert(t("gongu.selectgrade"));
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

function modifyRoomGradePrice(no, day, price, grade, room_grade_no) {
	initListCombobox();
	$("#modify_price_no").val(no);
	$("#btn_padd").hide();
	$("#btn_pmodify").show();
	$("#btn_pcancel").show();
	$("#room_grade_price").val(comma(price));
	$("#proom_grade").combobox("autocomplete", room_grade_no);
	$("#reserve_day_list").combobox("autocomplete", day);
}

function modifyGradePriceCancel() {
	initListCombobox();
	$("#modify_price_no").val("");
	$("#btn_padd").show();
	$("#btn_pmodify").hide();
	$("#btn_pcancel").hide();
	$("#room_grade_price").val("");
	$("#proom_grade").val("----");
	$("#reserve_day_list").val("----");
}

function modifyRoomGradePriceExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var room_grade_price = uncomma($("#room_grade_price").val());
	if(isNull(room_grade_price)) {
		alert(t("rooms.input.price"));
		return false;
	}
	if($.isNumeric(room_grade_price) == false) {
		alert(t("rooms.only.price"));
		return false;
	}
	if($("#proom_grade").val() == "----") {
		alert(t("gongu.selectgrade"));
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

function deleteRoomGradePriceExe(no) {
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
