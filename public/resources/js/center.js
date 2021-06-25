$(function() {
	$("#menu_main").on("click", function(e) {
		$(location).attr("href", "/center/main");
	});
	$("#menu_mgr").on("click", function(e) {
		$(location).attr("href", "/center/mgr");
	});
});

function centerInit() {
	if($("#first_name").length && $("#first_no").length) {
		viewBranchList($("#first_name").val(), $("#first_no").val(), 1);
	}
	$("#checkall").on("click", function() {
		var chk = $(this).is(":checked");
		if(chk) {
			$("input[name=check_cno]:checkbox").prop("checked", true);
		} else {
			$("input[name=check_cno]:checkbox").prop("checked", false);
		}
	});
	setMonthPicker("#from_date", null);
	setMonthPicker("#to_date", null);
}

function getAddr() {
	setPrefix("");
	getAddress();
}

function getAddr2() {
	setPrefix("b");
	getAddress();
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

function cancelAction() {
	var page = $("#page").val();
	var careCenterNo = 0;
	if($("#care_center_no").length) {
		careCenterNo = parseInt($("#care_center_no").val());
	}
	var url = "/center/mgr?page="+page;
	if(careCenterNo > 0) {
		url = url + "&care_center_no="+careCenterNo;
	}
	$(location).attr("href", url);
}

function addCenter() {
	var page = $("#page").val();
	var url = "/center/add?page="+page;
	$(location).attr("href", url);
}

function addCenterExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var page = $("#page").val();
	var name  = $("#name").val();
	var phone = $("#phone").val();
	var fax = $("#fax").val();
	if(isNull(name)) {
		alert(t("center.inputname"));
		return false;
	}
//	if(isNull(phone)) {
//		alert("전화번호를 입력해주세요.");
//		return false;
//	}
//	if(isNull(fax)) {
//		alert("fax번호를 입력해주세요.");
//		return false;
//	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			name : $("#name").val(),
			phone : $("#phone").val(),
			fax : $("#fax").val(),
			bno : bno
		},
		traditional: true,
		url: '/center/addexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var url = "/center/mgr?page="+page;
				$(location).attr("href", url);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/center/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("center.candaddpostnatal"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function modifyCenter(no) {
	var page = $("#page").val();
	var url = "/center/modify?page="+page+"&care_center_no=" + no;
	$(location).attr("href", url);
}

function modifyCenterExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var page = $("#page").val();
	var careCenterNo = $("#care_center_no").val();
	var name  = $("#name").val();
	var phone = $("#phone").val();
	var fax = $("#fax").val();
	if(isNull(name)) {
		alert(t("center.inputname"));
		return false;
	}
//	if(isNull(phone)) {
//		alert("전화번호를 입력해주세요.");
//		return false;
//	}
//	if(isNull(fax)) {
//		alert("fax번호를 입력해주세요.");
//		return false;
//	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			care_center_no : careCenterNo,
			name : $("#name").val(),
			phone : $("#phone").val(),
			fax : $("#fax").val(),
			bno : bno
		},
		traditional: true,
		url: '/center/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var url = "/center/mgr?page="+page;
				$(location).attr("href", url);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/center/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("center.cantcorpostnatal"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function deleteCenterExe(no) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var page = $("#page").val();
	if(!confirm(t("discount.reallydel"))) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			care_center_no : no,
			bno : bno
		},
		traditional: true,
		url: '/center/deleteexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var url = "/center/mgr?page="+page;
				$(location).attr("href", url);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/center/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("center.cantdelpostnatal"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function viewBranchList(cname, no, page) {
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
			care_center_no : no,
			page : page,
			bno : bno
		},
		traditional: true,
		url: '/branch/list/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var branch_total_count = data.branch_total_count;
				var branch_list = data.branch_list;
				var contents = "";
				contents = contents + "<span style=\"font-weight:bold;font-size:12pt;\">["+cname+"] 지점 목록</span>";
				contents = contents + "<div class=\"table_more\">";
				contents = contents + "<button type=\"button\" class=\"btn_orange1\" onclick=\"javascript:addBranch('"+no+"');\">" + t("center.addbranch") + "</button>";
				contents = contents + "</div>";
				contents = contents + "<table>";
				contents = contents + "<colgroup>";
				contents = contents + "<col width=\"25%\" />";
				contents = contents + "<col width=\"25%\" />";
				contents = contents + "<col width=\"25%\" />";
				contents = contents + "<col width=\"25%\" />";
				contents = contents + "</colgroup>";
				contents = contents + "<thead>";
				contents = contents + "<tr>";
				contents = contents + t("center.name");
				contents = contents + t("center.phonenum");
				contents = contents + "<th scope=\"col\">FAX</th>";
				contents = contents + t("center.manage");
				contents = contents + "</tr>";
				contents = contents + "</thead>";
				contents = contents + "<tbody>";
				if(branch_total_count > 0) {
					for(var i=0; i<branch_list.length; i++) {
						var branch = branch_list[i];
						contents = contents + "<tr>";
						contents = contents + "<td style=\"text-align:center;\">"+branch.name+"</td>";
						contents = contents + "<td style=\"text-align:center;\">"+branch.phone+"</td>";
						contents = contents + "<td style=\"text-align:center;\">"+branch.fax+"</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + "<a href=\"javascript:modifyBranch('"+no+"', '"+branch.no+"');\">" + t("center.correct") + "</a> / ";
						contents = contents + "<a href=\"javascript:deleteBranchExe('"+no+"', '"+branch.no+"');\">" + t("gongu.del") + "</a>";
						contents = contents + "</td>";
						contents = contents + "</tr>";
					}
				} else {
					contents = contents + "<tr><td style=\"text-align:center;\" colspan=\"4\">등록된 지점 없습니다.</td></tr>";
				}
				contents = contents + "</tbody>";
				contents = contents + "</table>";
//				contents = contents + "<div class=\"paging\">";
//				if(branch_total_count > 0) {
//					
//				} else {
//					contents = contents + "<span>1</span>";
//				}
//				contents = contents + "</div>";
				$("#branchList").show();
				$("#branchList").html(contents);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/center/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("center.nobranchlist"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function checkBranchNull(mode) {
	if(isNull($("#bname").val())) {
		alert(t("center.inputbranch.name"));
		return false;
	}
	if(isNull($("#bphone").val())) {
		alert(t("center.inputbranch.phone"));
		return false;
	}
//	if(isNull($("#bfax").val())) {
//		alert("지점 FAX 번호를 입력해주세요.");
//		return false;
//	}
	if(isNull($("#bzipcode").val())) {
		alert(t("center.inputbranch.zip"));
		return false;
	}
	if(isNull($("#baddr").val())) {
		alert(t("center.inputbranch.address"));
		return false;
	}
	if(isNull($("#baddr_jibun").val())) {
		alert(t("center.inputbranch.address"));
		return false;
	}
//	if(isNull($("#baddr2").val())) {
//		alert(t("center.inputbranch.address"));
//		return false;
//	}
	if(isNull($("#bcode").val())) {
		if($("#org_bcode").length) {
			if(isNull($("#org_bcode").val())) {
				alert(t("center.inputbranch.find"));
				return false;
			} else {
				$("#bcode").val( $("#org_bcode").val() );
			}
		} else {
			alert(t("center.inputbranch.finds"));
			return false;
		}
	}
	if(isNull($("#min_money").val())) {
		alert(t("center.inputmin"));
		return false;
	}
	if(isNull($("#max_money").val())) {
		alert(t("center.inputmax"));
		return false;
	}
	
//	if(isNull($("#name").val())) {
//		alert("관리자 이름을 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#birthy").val()) == false && isNull($("#birthy").val()) == false && isNull($("#birthy").val()) == false) {
//		var birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
//		if( isValidDate(birth) == false ) {
//			alert(t("manage.input.wrongbirth"));
//			return false;
//		}
//	}
////	if(isNull($("#birth").val())) {
////		alert("관리자 생일을 입력해주세요.");
////		return false;
////	}
//	if(isNull($("#phone").val())) {
//		alert("관리자 전화번호를 입력해주세요.");
//		return false;
//	}
////	if(isNull($("#jumin1").val())) {
////		alert("관리자 주민등록번호를 입력해주세요.");
////		return false;
////	}
////	if(isNull($("#jumin2").val())) {
////		alert("관리자 주민등록번호를 입력해주세요.");
////		return false;
////	}
//	if(isNull($("#zipcode").val())) {
//		alert("관리자 우편번호를 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#addr").val())) {
//		alert("관리자 주소를 입력해주세요.");
//		return false;
//	}
//	if(mode == 1) {
//		if(isNull($("#idnum").val())) {
//			alert(t("manage.input.membernum"));
//			return false;
//		}
//	}
//	if(mode == 0) {
//		if(isNull($("#passwd").val())) {
//			alert(t("user.input.password"));
//			return false;
//		}
//	}
	return true;
}

function addBranch(no) {
	var page = $("#page").val();
	var url = "/branch/add?page="+page+"&care_center_no="+no;
	$(location).attr("href", url);
}

function addBranchExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkBranchNull(0) == false) {
		return false;
	}
	var careCenterNo = $("#care_center_no").val();
	var page = $("#page").val();
	var bname  = $("#bname").val();
	var bphone = $("#bphone").val();
	var bfax = $("#bfax").val();
	var bcode = $("#bcode").val();
	var bzipcode = $("#bzipcode").val();
	var baddress = $("#baddr").val();
	var baddress_jibun = $("#baddr_jibun").val();
	var baddress2 = $("#baddr2").val();
	var minMoney = uncomma($("#min_money").val());
	var maxMoney = uncomma($("#max_money").val());
	var shopEmoney = uncomma($("#shop_emoney").val());
	var shopGroup = $("#shop_group").val();
//	var name  = $("#name").val();
//	var birth = "";
//	if(isNull($("#birthy").val()) == false && isNull($("#birthy").val()) == false && isNull($("#birthy").val()) == false) {
//		birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
//	}
////	var birth = $("#birth").val();
////	var jumin1 = $("#jumin1").val();
////	var jumin2 = $("#jumin2").val();
//	var phone = $("#phone").val();
//	var zipcode = $("#zipcode").val();
//	var address = $("#addr").val();
//	var address2 = $("#addr2").val();
////	var idnum  = $("#idnum").val();
//	var passwd  = $("#passwd").val();
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			care_center_no : careCenterNo,
			bname : bname,
			bphone : bphone,
			bfax : bfax,
			dong_code : bcode,
			bzipcode : bzipcode,
			baddress : baddress,
			baddress_jibun : baddress_jibun,
			baddress_detail : baddress2,
			ismember : $(':radio[name="ismember"]:checked').val(),
			use_payback : $(':radio[name="use_payback"]:checked').val(),
			isshop : $(':radio[name="isshop"]:checked').val(),
			min_money : minMoney,
			max_money : maxMoney,
			shop_emoney : shopEmoney,
			shop_group : shopGroup,
			bno : bno
//			name : name,
//			birth : birth,
////			jumin1 : jumin1,
////			jumin2 : jumin2,
//			phone : phone,
//			zipcode : zipcode,
//			address : address+"@@@@"+address2,
////			idnum : idnum,
//			password : passwd
		},
		traditional: true,
		url: '/branch/addexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var url = "/center/mgr?page="+page+"&care_center_no="+careCenterNo;
				$(location).attr("href", url);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/center/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("center.inputbranch.cantadd"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function modifyBranch(care_center_no, branch_no) {
	var page = $("#page").val();
	var url = "/branch/modify?page="+page+"&care_center_no="+care_center_no+"&branch_no="+branch_no;
	$(location).attr("href", url);
}

function modifyBranchExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkBranchNull(1) == false) {
		return false;
	}
	var careCenterNo = $("#care_center_no").val();
	var branchNo = $("#branch_no").val();
	var managerNo = $("#manager_no").val();
	var page = $("#page").val();
	var bname  = $("#bname").val();
	var bphone = $("#bphone").val();
	var bfax = $("#bfax").val();
	var bcode = $("#bcode").val();
	var bzipcode = $("#bzipcode").val();
	var baddress = $("#baddr").val();
	var baddress_jibun = $("#baddr_jibun").val();
	var baddress2 = $("#baddr2").val();
	var minMoney = uncomma($("#min_money").val());
	var maxMoney = uncomma($("#max_money").val());
	var shopEmoney = uncomma($("#shop_emoney").val());
	var shopGroup = $("#shop_group").val();
//	var name  = $("#name").val();
//	var birth = "";
//	if(isNull($("#birthy").val()) == false && isNull($("#birthy").val()) == false && isNull($("#birthy").val()) == false) {
//		birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
//	}
////	var birth = $("#birth").val();
////	var jumin1 = $("#jumin1").val();
////	var jumin2 = $("#jumin2").val();
//	var phone = $("#phone").val();
//	var zipcode = $("#zipcode").val();
//	var address = $("#addr").val();
//	var address2 = $("#addr2").val();
//	var idnum  = $("#idnum").val();
//	var passwd  = $("#passwd").val();
//	var orgidnum = $("#orgid").val();
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			branch_no : branchNo,
			manager_no : managerNo,
			bname : bname,
			bphone : bphone,
			bfax : bfax,
			dong_code : bcode,
			bzipcode : bzipcode,
			baddress : baddress,
			baddress_jibun : baddress_jibun,
			baddress_detail : baddress2,
			ismember : $(':radio[name="ismember"]:checked').val(),
			use_payback : $(':radio[name="use_payback"]:checked').val(),
			isshop : $(':radio[name="isshop"]:checked').val(),
			min_money : minMoney,
			max_money : maxMoney,
			shop_emoney : shopEmoney,
			shop_group : shopGroup,
			bno : bno
//			name : name,
//			birth : birth,
////			jumin1 : jumin1,
////			jumin2 : jumin2,
//			phone : phone,
//			zipcode : zipcode,
//			address : address+"@@@@"+address2,
//			idnum : idnum,
//			password : passwd,
//			org_idnum : orgidnum
		},
		traditional: true,
		url: '/branch/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var url = "/center/mgr?page="+page+"&care_center_no="+careCenterNo;
				$(location).attr("href", url);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/center/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else if(parseInt(status.code) == 20304) {
					alert(t("manage.error.overlap"));
					hideLoadingLayer();
				} else {
					alert(t("center.inputbranch.cantcor"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function deleteBranchExe(care_center_no, branch_no) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var page = $("#page").val();
	if(!confirm(t("discount.reallydel"))) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			care_center_no : care_center_no,
			branch_no : branch_no,
			bno : bno
		},
		traditional: true,
		url: '/branch/deleteexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var url = "/center/mgr?page="+page+"&care_center_no="+care_center_no;
				$(location).attr("href", url);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/center/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("center.cantdelpostnatal"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function viewBalance(care_center_no) {
	var nolist = [care_center_no];
	viewCareCenterBalance(nolist);
}

function viewAllBalance() {
	var length = $("input[name=check_cno]:checkbox:checked").length;
	if(length <= 0) {
		alert(t("center.selectpostnatal"));
		return false;
	}
	var nolist = [];
	$("input[name=check_cno]:checkbox:checked").each(function (){
		nolist.push($(this).val());
	});
	viewCareCenterBalance(nolist);
}

function viewBalanceManually() {
	var nolist = JSON.parse($("#nolist").val());
	viewCareCenterBalance(nolist);
}

function viewCareCenterBalance(nolist) {
	var lid = "balance";
	$("#balance").empty();
	var loading = "#" + lid + "_loading";
	var contents = "#" + lid + "_lcontents";
	$(loading).show();
	$(contents).hide();
	layer_open(lid+"_layer", "fade", true);
	setTimeout(function () {
		getCareCenterBalance(lid, nolist);
	}, 1000);
}

function getCareCenterBalance(lid, nolist) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			care_center_no_list : nolist,
			from_date : $("#from_date").val(),
			to_date : $("#to_date").val(),
			bno : bno
		},
		traditional: true,
		url: '/center/balance/data',
		error: function() {
			alert(t("app.error"));
			layer_close(lid+"_layer", "fade");
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var loading = "#" + lid + "_loading";
				var contents = "#" + lid + "_lcontents";
				$(loading).hide();
				$(contents).show();
				$("#nolist").val(JSON.stringify(nolist));
				// 정산 정보 출력.
				var data = res.data;
				var balance = data.balance;
				for(var i=0; i<nolist.length; i++) {
					var cno = nolist[i];
					var cname = $("#cname_" + cno).val();
					var cmap = balance[cno];
					var keys = $.map(cmap, function(v, i){
						var branch = cmap[i];
						var balance = branch["balance"];
						var label = branch["label"];
						var setting = branch["balance_setting"];
						var branch_no = i;
						var branch_name = branch["name"];
						var oid = cno + "_" + i;
						var header = createBranchHeader(i, oid, cno, branch_no, cname, branch_name);
						var body = createBranchBody(oid);
						$("#balance").append(header);
						$("#balance").append(body);
						var rseries = [
						               {label:t("center.reservecase")},
						               {label:t("balance.enterschedule")},
						               {label:t("balance.entercase")}
						               ];
						var pseries = [
						               {label:t("sido.realpay")},
						               {label:t("sido.payschedule")}
						               ];
						var roption = {pointLabels:{show: true,edgeTolerance: -5,hideZeros: false},};
						var rChart = drawGraph("chartR_" + oid, t("balance.nolist"), [balance[0], balance[1], balance[2]], rseries, label, setting["base_count"], roption);
						var poption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},};
						var pChart = drawGraph("chartP_" + oid, t("center.monthlypay"), [balance[3], balance[4]], pseries, label, setting["base_money"], poption);
					});
				}
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/sa");
				} if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("center.nocalc"));
					layer_close(lid+"_layer", "fade");
				}
			}
		}
	});
}

function createBranchHeader(idx, oid, cno, bno, cname, bname) {
	var marginTop = "10px";
	if(idx > 0) {
		marginTop = "40px";
	}
	var obj = $(document.createElement("div")).addClass("dashboard2").css({"margin-top":marginTop,"width":"830px"}).attr({"id":"branch_balance_" + oid});
	var contents = "";
	var title = cname + " : " + bname;
	contents = contents + "<div class='fn-gantt' style='width:100%;'>";
	contents = contents + "<div class='fn-content' style='margin:10px;'>";
	contents = contents + "<table style='width:98%;border:0px;'>";
	contents = contents + "<tr style='border:0px;cursor:pointer;' onclick='javascript:displayBalance(\"" + oid + "\");'>";
	contents = contents + "<td style='border:0px;width:50%;text-align:left;font-weight:bold;font-size:14pt;'>" + title + "</td>";
	contents = contents + "<td style='border:0px;width:50%;text-align:right;'>";
	contents = contents + "<input type='hidden' id='isbalance_" + oid + "' value='1'/>";
	contents = contents + "<img id='balanceup_" + oid + "' src='/resources/images/up.jpg' style='border:0px;text-align:right;vertical-align:middle;'/>";
	contents = contents + "<img id='balancedown_" + oid + "' src='/resources/images/down.jpg' style='border:0px;text-align:right;vertical-align:middle;display:none;'/>";
	contents = contents + "</td>";
	contents = contents + "</tr>";
	contents = contents + "</table>";
	contents = contents + "</div>";
	contents = contents + "</div>";
	obj.html(contents);
	$("#balanceup_" + oid).on("click", function(e){
		e.stopPropagation();
		hideBalance(oid);
	});
	$("#balancedown_" + oid).on("click", function(e){
		e.stopPropagation();
		showBalance(oid);
	});
	return obj;
}

function createBranchBody(oid) {
	var obj = $(document.createElement("div")).css({"margin-top":"20px"}).attr({"id":"canvas_" + oid});
	var contents = "";
	contents = contents + "<div id='chartR_" + oid + "' style=\"height:300px;width:830px;\"></div>";
	contents = contents + "<div id='chartP_" + oid + "' style=\"height:300px;width:830px;margin-top:30px;\"></div>";
	obj.html(contents);
	return obj;
}

function showBalance(oid) {
	$("#balanceup_" + oid).show();
	$("#balancedown_" + oid).hide();
	$("#canvas_" + oid).slideDown();
	$("#isbalance_" + oid).val(1);
}

function hideBalance(oid) {
	$("#balanceup_" + oid).hide();
	$("#balancedown_" + oid).show();
	$("#canvas_" + oid).slideUp();
	$("#isbalance_" + oid).val(0);
}

function displayBalance(oid) {
	var is = parseInt($("#isbalance_" + oid).val());
	if(is == 0) {
		showBalance(oid);
	} else {
		hideBalance(oid);
	}
}

function viewBranchStat(code, callback) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			code : code,
			bno : bno
		},
		traditional: true,
		url: '/center/member/branch',
		error: function() {
			alert(t("app.error"));
			layer_close("status_layer", "fade");
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				if(data == null) {
					alert(t("center.noroominfo"));
				} else {
					callback(data);
				}
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/sa");
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("aesthetic.nolist"));
				}
			}
		}
	});
}

function viewBranchStatOld(code, callback) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			code : code,
			bno : bno
		},
		traditional: true,
		url: '/center/area/balance/data',
		error: function() {
			alert(t("app.error"));
			layer_close("status_layer", "fade");
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var current_room_status = data.current_room_status;
				callback(current_room_status);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/sa");
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("aesthetic.nolist"));
				}
			}
		}
	});
}



