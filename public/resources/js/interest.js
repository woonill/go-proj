

function selectMCenter() {
	var span = $("#branchList").next();
	var input = span.children(":first");
	input.val("");
	getBranchList($("#centerList"), $("#branchList"));
}

function addInterest() {
	$("#centerList").combobox({
		"iwidth":200,
		"scss":{"margin":"0 auto 8px", "display":"block", "text-align":"center"},
		"ireadonly":false,
		"iblur":selectMCenter,
		"bcssClassName":"text",
		"bheight":27,
		"iheight":23,
	});
	$("#branchList").combobox({
		"iwidth":200,
		"scss":{"margin":"0 auto 8px", "display":"block", "text-align":"center"},
		"ireadonly":false,
		"bcssClassName":"text",
		"bheight":27,
		"iheight":23,
	});
	getCenterList($("#centerList"));
	layer_open("interest_layer", "fade", true);
}

function initInterest() {
	
}

function checkInterestInput() {
	var careCenterNo = $("#centerList").val();
	var branchNo = $("#branchList").val();
	if(isNull(careCenterNo)) {
		alert(t("common.selectpostnatal"));
		return false;
	}
	if(isNull(branchNo)) {
		alert(t("common.selectbranch"));
		return false;
	}
	return true;
}

function addInterestExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var branchNo = $("#branchList").val();
	if(checkInterestInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			who : branchNo,
			bno : bno
		},
		traditional: true,
		url: '/interest/addexe',
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
				$(location).attr("href", "/interest/main");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?uri=" + encodeURI("/interest/main"));
				} else if(parseInt(status.code) == 21906) {
					alert(t("interest.cantaddself"));
				} else {
					alert(t("system.error.add"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function deleteInterestExe(no) {
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
			no : no,
			bno : bno
		},
		traditional: true,
		url: '/interest/modify',
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
				$(location).attr("href", "/interest/main");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?uri=" + encodeURI("/interest/main"));
				} else {
					alert(t("interest.error"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function modifyInterestforControl(b, d){
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
			no : b,
			isdel : d,
			bno : bno
		},
		traditional: true,
		url: '/interest/modify',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("gongu.set"));
				$(location).attr("href", "/interest/main");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?uri=" + encodeURI("/interest/main"));
				} else {
					alert(t("interest.error.modify"));
				}
			}
			hideLoadingLayer();
		}
	});
}
