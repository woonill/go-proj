$(function() {
	let uri = window.location.pathname;
	
	$("#id").keypress(function (e){
		if (e.keyCode == 13){
			if(uri == "/sa"){
				salogin();
			} else if(uri == "/login/login") {
				login();	
			}
		}
	});
	
	$("#passwd").keypress(function (e){
		if (e.keyCode == 13){
			if(uri == "/sa"){
				salogin();
			} else if(uri == "/login/login") {
				login();	
			}
		}
	});
})

function salogin() {
	var careCenterNo = $("#centerList").val();
	var branchNo = $("#branchList").val();
	if(branchNo != null){
		showLoadingLayer();
		$.ajax({
			type: 'post',
			async: true,
			dataType: 'json',
			traditional: true,
			url: '/login/dologin/sa',
			data : {
				"care_center_no": careCenterNo,
				"branch_no": branchNo,
				"id" : $("#id").val(),
				"password" : $("#passwd").val()
			},
			error: function() {
				alert(t("app.error"));
				hideLoadingLayer();
			},
			beforeSend: function() {},
			success: function(res) {
				var status = res.status;
				if(status.result == RESULT_SUCCESS) {
					if( isNaN(careCenterNo) == true || isNaN(branchNo) == true) {
						$(location).attr("href", "/center/main");
					} else {
						var cNo = parseInt(careCenterNo);
						var bNo = parseInt(branchNo);
						if(cNo > 0 && bNo > 0) {
							$(location).attr("href", "/"); 
						} else {
							$(location).attr("href", "/center/main");						
						}
					}
				} else {
					alert(t("login.failed"));
					hideLoadingLayer();
				}
			}
		});
	}else{
		alert("조리원과 지점을 선택하세요.");
	}
}

function login() {
	var url = $("#redirecturi").val();
	var branch_no = $("#branch_no").val();
	if(branch_no == -1) {
		alert(t("login.nobranchinfo"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		traditional: true,
		url: '/login/dologin',
		data : {
			"id" : $("#id").val(),
			"password" : $("#passwd").val(),
			"care_center_no":$("#centerList").val(),
			"branch_no":$("#branchList").val()
		},
		error: function() {
			alert(t("login.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				if(url.length<=0 || url == "" || url === null || url === undefined) {
					url = "/";
				}
				$(location).attr("href", url); 
			} else {
				alert(t("login.failed"));
				hideLoadingLayer();
			}
		}
	});
}

function reset() {
	$("#id").val("");
	$("#passwd").val("");
}

function initLogin() {
	$("#centerList").combobox({
		"iwidth":216,
		"scss":{"margin":"0 auto 8px", "display":"block", "text-align":"center"},
		"ireadonly":false,
		"iblur":selectCenter,
		"bcssClassName":"text",
		"bheight":27,
		"iheight":23,
	});
	$("#branchList").combobox({
		"iwidth":216,
		"scss":{"margin":"0 auto 8px", "display":"block", "text-align":"center"},
		"ireadonly":false,
		"bcssClassName":"text",
		"bheight":27,
		"iheight":23,
	});
	$("#passwd").on('keyup', function (e){
		if(e.keyCode == 13){
			var sa = 0;
			if($("#sa").length) {
				sa = parseInt($("#sa").val());
			}
			if(sa == 0) {
				login();
			} else {
				salogin();
			}
		}
	});
	getCenterList($("#centerList"));
}

function selectCenter() {
	var span = $("#branchList").next();
	var input = span.children(":first");
	input.val("");
	getBranchList($("#centerList"), $("#branchList"));
}