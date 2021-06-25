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

function viewCanceledCounsel() {
	$(location).attr("href", "/counsel/canceled");
}

function viewBranchList(no) {
	var id = "#"+no+"_branch_list";
	var branch_list = JSON.parse(id.val());
}
function pressEnter(){
	if(window.event.keyCode == 13){
		searchCounsel();
	}
}

function searchCounsel(page, order) {
	if(page == undefined){
		page = 1;
	}
	
	if(order == "next"){
		page = parseInt(page) + 10;
	}else if(order == "last"){
		page = $("#lastPage").val();
	}else if(order == "prev"){
		page = parseInt(page) - 10;
	}else if(order == "first"){
		page = 1;
	}
	
	var count = $("#count").val();
	var field = $("#field").val();
	var k = $("#keyword").val();
	var f = "", t = "";
	if(field == "cdate" || field == "cancel" || field == "counselcancel") {
		f = $("#from_date").val();
		t = $("#to_date").val();
		if(field != "counselcancel"){
			if(isNull(f)) {
				alert("검색일을 입력해주세요.");
				$("#from_date").focus();
				return false;
			}
			if(isNull(t)) {
				alert("검색일을 입력해주세요.");
				$("#to_date").focus();
				return false;
			}	
		} else {}
	}
	var keyword = encodeURI(encodeURIComponent(k));
	var listurl = "/counsel/list?field=" + field + "&page=" + page + "&keyword=" + keyword + "&from_date=" + f + "&to_date=" + t + "&count=" + count;
	var canceledurl = "/counsel/canceled?field=" + field + +"&page=" + page + "&keyword=" + keyword + "&from_date=" + f + "&to_date=" + t + "&count=" + count;
	if(field == "counselcancel") {
		$(location).attr("href", canceledurl);
	} else {
		$(location).attr("href", listurl);
	}
}

function checkInput() {
	if(isNull($("#name").val())) {
		co.alert(t("manage.input.name"), function(){$("#name").focus();});
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
		co.alert(t("counsel.input.contact"), function(){$("#phone1").focus();});
		return false;
	}
	if(isNull(phone2)) {
		co.alert(t("counsel.input.contact"), function(){$("#phone2").focus();});
		$("#phone2").focus();
		return false;
	}
	if(isNull(phone3)) {
		co.alert(t("counsel.input.contact"), function(){$("#phone3").focus();});
		$("#phone3").focus();
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
	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		var birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
		if( isValidDate(birth) == false ) {
			co.alert(t("counsel.wrong.birth"));
			
			return false;
		}
	}

	if(isNull($("#due_date").val())) {
		co.alert(t("counsel.input.scheduleday"), function(){$("#due_date").focus();});
		
		return false;
	}
	if( isValidDate($("#due_date").val()) == false ) {
		co.alert(t("counsel.wrong.scheduleday"), function(){$("#due_date").focus();});
		return false
	}
	if(isNull($("#hospital").val())) {
		co.alert(t("counsel.input.hospital"), function(){$("#hospital").focus();});
		return false;
	}
	if(isNull($("#counsel").val())) {
		co.alert(t("counsel.input.item"), function(){$("#counsel").focus();});
		return false;
	}
	if(isNull($("#cdate").val())) {
		co.alert(t("counsel.input.day"), function(){$("#cdate").focus();});
		
		return false;
	}
	if( isValidDate($("#cdate").val()) == false ) {
		co.alert(t("counsel.wrong.day"), function(){$("#cdate").focus();});
		return false
	}
	if(isNull($("#manager_name").val())) {
		co.alert(t("counsel.input.member"), function(){$("#manager_name").focus();});
		
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
	
	var email = "";
	if(isNull($("#email1").val()) == false && isNull($("#email2").val()) == false) {
		email = $("#email1").val() + "@" + $("#email2").val();
	}
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
			email : email,
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
				hideLoadingLayer();
				co.alert(t("system.added"), function(){$(location).attr("href", "/counsel/list");});
				
				
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
	var email = "";
	if(isNull($("#email1").val()) == false && isNull($("#email2").val()) == false) {
		email = $("#email1").val() + "@" + $("#email2").val();
	}
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
			email : email,
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
				hideLoadingLayer();
				co.alert(t("system.edited"), function(){$(location).attr("href", "/counsel/list");});
				
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
				hideLoadingLayer();
				co.alert(t("app.del"), function(){$(location).attr("href", "/counsel/list");});
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

function counselDeletePopup(counsel_no){
	$("#resCounDelBtn").attr("href","javascript:deleteCounselExePopUp('"+counsel_no+"');");
	BPOPUP =  $('#resCounDelConfirm').bPopup({
       	modalClose : false
    });
}

function deleteCounselExePopUp(counsel_no) {
	var bno = 0;
	var manager = $('#user').val();
	var today = new Date();
	var yyyy = today.getFullYear();
	var mm = String(today.getMonth() + 1); //January is 0!
	var dd = String(today.getDate());
	var HH = String(today.getHours());
	var MM = String(today.getMinutes());
	var ss = String(today.getSeconds());
	var resCounDelDate = yyyy + '-' + mm + '-' + dd +" "+ HH + ':' + MM + ':' + ss;
	if($("#resCounCancelReason").val() == ""){
		BPOPUP =  $('#resCounDelNull').bPopup({
    	});
	} else {
		var resCounDelReason = $("#resCounCancelReason").val();		
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
			bno : bno,
			resCounDelDate : resCounDelDate,
			resCounDelReason : resCounDelReason,
			manager_name : manager
		},
		traditional: true,
		url: '/counsel/resdeleteexe',
		error: function() {
			alert(t("manage.error.del"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				$('#resCounDelConfirm').bPopup().close();				
				co.alert(t("app.del"), function(){$(location).attr("href", "/counsel/list");});
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
				hideLoadingLayer();
				co.alert(t("app.del"), function(){$(location).attr("href", "/counsel/list");});
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

	if($("#cdate").length) {
		
		if($("#field").length) {
			selectCondition();
		}
	}
	if($("#manager_no").length) {
		//$("#manager_no").combobox({"bcssClassName":"text", "iwidth":100, "bheight":27, "iheight":23, "ireadonly":true, "iblur":selectManager});
		$("#manager_no").bind('change', function(){
			selectManager();
		});
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

$( document ).ready(function() {
	var path = document.location.pathname;
	
	if (path == '/') {
		$('a', $('#nav')).each(function( index ) {
			if ($(this).text() == t("counsel.home") ) {
				$(this).parent().addClass("active");
			}
		});
	} else {
		$('a', $('#nav')).each(function( index ) {
			if ($(this).text() == t("counsel.manages") ) {
				$(this).parent().addClass("active");
			}
		});
	}
	
});
