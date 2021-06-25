function initDiscount() {
	$("#room_grade_payment").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#dmoney_list_payment").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#room_grade_revisit").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#dmoney_list_revisit").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#room_grade_paytype").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#dmoney_list_paytype").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#room_grade_day").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#day_list").combobox({"bcssClassName":"text", "bheight":27, "iwidth":80, "iheight":23, "ireadonly":true});
	$("#dmoney_list").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#room_grade_gongu").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("#people").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true});
	$("#dmoney_list_gongu").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
	$("input[type='radio'], input[type='checkbox']").labelauty({ minimum_width:"100px", class:"chkradio" });
}

function selectPayType(obj) {
	if(obj.value == 0) {
		var discount = $("#payment_discount_money").val();
		$("#money_list").show();
		$("#rate_list").hide();
		$("#payment_discount").val(discount);
	} else {
		var discount = $("#payment_discount_rate").val();
		$("#money_list").hide();
		$("#rate_list").show();
		$("#payment_discount").val(discount);
	}
}

function selectPayTypeByDay(obj) {
	if(obj.value == 0) {
		$("#dmoney_list").show();
		$("#drate_list").hide();
	} else {
		$("#dmoney_list").hide();
		$("#drate_list").show();
	}
}

function selectPayMoney(obj) {
	if(obj.value == "--------") {
		return false;
	} else {
		$("#payment_discount").val(obj.value);
	}
}

function selectPayRate(obj) {
	if(obj.value == "--------") {
		return false;
	} else {
		$("#payment_discount").val(obj.value);
	}
}

function addDiscountByDayExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	
	if($("#room_grade_day").val() == "") {
		co.alert(t("discount.selectgrade"));
		return false;
	}
	
	if($("#day_list").val() == "") {
		co.alert(t("discount.selectpreorder"));
		return false;
	}
	
	if($("#dmoney_list").val() == "") {
		co.alert(t("discount.select"));
		return false;
	}
	
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_day").val(),
			type : $("#day_discount_type").val(),
			day : $("#day_list").val(),
			discount : $("#dmoney_list").val(),
			bno : bno
		},
		traditional: true,
		url: '/discount/day/addexe',
		error: function() {
			hideLoadingLayer();
			co.alert(t("discount.error.add"));
			
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				co.alert(t("system.added"), function(){$(location).attr("href", "/discount/main");});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/main"));
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

function modifyDiscountByDayCancel() {
	$("#btn_add_day").show();
	$("#btn_modify_day").hide();
	$("#btn_cancel_day").hide();
	$("#room_grade_day").val("");
	$("#dmoney_list").val("");
	$("#drate_list").val("");
	$("#day_list").val("");
	$("#day_no").val("");
//	initDiscount();
}

function modifyDiscountByDay(no, grade, room_grade_no, type, day, discount) {
	$("#btn_add_day").hide();
	$("#btn_modify_day").show();
	$("#btn_cancel_day").show();
	$("#day_no").val(no);
	$("#room_grade_day").val(room_grade_no);
	$("#room_grade_day_no").val(room_grade_no);
	$("#day_list").val(day);
	$("#day_discount_type").val(type);
	$("#dmoney_list").val(discount);

}

function modifyDiscountByDayExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if($("#room_grade_day").val() == "") {
		co.alert(t("discount.selectgrade"));
		return false;
	}
	
	if($("#day_list").val() == "") {
		co.alert(t("discount.selectpreorder"));
		return false;
	}
	
	if($("#dmoney_list").val() == "") {
		co.alert(t("discount.select"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_day").val(),
			type : $("#day_discount_type").val(),
			day : $("#day_list").val(),
			discount : $("#dmoney_list").val(),
			day_no : $("#day_no").val(),
			bno : bno
		},
		traditional: true,
		url: '/discount/day/modifyexe',
		error: function() {
			hideLoadingLayer();
			co.alert(t("discount.error.add"));
			
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				
				co.alert(t("system.edited"), function(){$(location).attr("href", "/discount/main");});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.failcorrect"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function deleteDiscountByDayExe(no) {
	co.confirm(t("discount.realdel"),function(){
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
				day_no : no,
				bno : bno
			},
			traditional: true,
			url: '/discount/day/delexe',
			error: function() {
				hideLoadingLayer();
				co.alert(t("discount.error.del"));
				
			},
			beforeSend: function() {},
			success: function(res) {
				hideLoadingLayer();
				var status = res.status;
				if(status.result == RESULT_SUCCESS) {
					co.alert(t("app.del"), function(){$(location).attr("href", "/discount/main");});
					
				} else {
					if(parseInt(status.code) == 20102) {
						alert(t("discount.logout"));
						$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/main"));
					} else if(parseInt(status.code) == 20104) {
						alert(t("discount.login"));
						$(location).attr("href", "/login/logout");
					} else {
						alert(t("discount.faildel"));
						
					}
				}
			}
		});
	});
	
}

function addDiscountByGonguExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var discount = $("#dmoney_list_gongu").val();
	if(discount == "--------") {
		alert(t("discount.selects"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_gongu").val(),
			people : $("#people").val(),
			discount : discount,
			bno : bno
		},
		traditional: true,
		url: '/discount/gongu/addexe',
		error: function() {
			alert(t("rooms.error.add"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$(location).attr("href", "/discount/main");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.failadd"));
					
				}
			}
		}
	});
}

function modifyDiscountByGonguCancel() {
	$("#btn_add_gongu").show();
	$("#btn_modify_gongu").hide();
	$("#btn_cancel_gongu").hide();
	$("#dmoney_list_gongu").val("--------");
	$("#people").val("1");
	$("#gongu_no").val("");
//	initDiscount();
}

function modifyDiscountByGongu(no, grade, room_grade_no, people, discount) {
	$("#btn_add_gongu").hide();
	$("#btn_modify_gongu").show();
	$("#btn_cancel_gongu").show();
	$("#gongu_no").val(no);
	$("#room_grade_gongu").combobox("autocomplete", room_grade_no);
	$("#room_grade_gongu_no").val(room_grade_no);
	$("#dmoney_list_gongu").combobox("autocomplete", discount);
	$("#people").combobox("autocomplete", people);
//	initDiscount();
}

function modifyDiscountByGonguExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var discount = $("#dmoney_list_gongu").val();
	if(discount == "--------") {
		alert(t("discount.selects"));
		return false;
	}
	if($("#people").val() == "--------") {
		alert(t("discount.selectperson"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_gongu").val(),
			people : $("#people").val(),
			discount : discount,
			gongu_no : $("#gongu_no").val(),
			bno : bno
		},
		traditional: true,
		url: '/discount/gongu/modifyexe',
		error: function() {
			alert(t("discount.error.corrects"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$(location).attr("href", "/discount/main");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.failcorrect"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function deleteDiscountByGonguExe(no) {
	if(confirm(t("discount.reallydel"))) {
		;
	} else {
		return false;
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
			gongu_no : no,
			bno : bno
		},
		traditional: true,
		url: '/discount/gongu/delexe',
		error: function() {
			alert(t("manage.error.del"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$(location).attr("href", "/discount/main");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.faildel"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function addDiscountByPaytypeExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if($("#room_grade_paytype").val() == "") {
		co.alert(t("discount.selectgrade"));
		return false;
	}
	
	if($("#dmoney_list_paytype").val() == "") {
		co.alert(t("discount.select"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_paytype").val(),
			discount : $("#dmoney_list_paytype").val(),
			bno : bno
		},
		traditional: true,
		url: '/discount/paytype/addexe',
		error: function() {
			co.alert(t("discount.error.add"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				
				co.alert(t("system.added"), function(){$(location).attr("href", "/discount/paytype");});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/paytype"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.failadd"));
				}
			}
		}
	});
}

function modifyDiscountByPaytypeCancel() {
	$("#btn_add_paytype").show();
	$("#btn_modify_paytype").hide();
	$("#btn_cancel_paytype").hide();
	$("#dmoney_list_paytype").val("");
	$("#paytype_no").val("");
//	initDiscount();
}

function modifyDiscountByPaytype(no, grade, room_grade_no, discount) {
	$("#btn_add_paytype").hide();
	$("#btn_modify_paytype").show();
	$("#btn_cancel_paytype").show();
	$("#paytype_no").val(no);
	$("#room_grade_paytype").val(room_grade_no);
	$("#room_grade_paytype_no").val(room_grade_no);
	$("#dmoney_list_paytype").val(discount);
//	initDiscount();
}

function modifyDiscountByPaytypeExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if($("#room_grade_paytype").val() == "") {
		co.alert(t("discount.selectgrade"));
		return false;
	}
	
	if($("#dmoney_list_paytype").val() == "") {
		co.alert(t("discount.select"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_paytype").val(),
			discount : $("#dmoney_list_paytype").val(),
			paytype_no : $("#paytype_no").val(),
			bno : bno
		},
		traditional: true,
		url: '/discount/paytype/modifyexe',
		error: function() {
			co.alert(t("discount.error.correct"));		
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				
				co.alert(t("discount.correct"), function(){$(location).attr("href", "/discount/paytype");});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/paytype"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.failcorrect"));
					
				}
			}
		}
	});
}

function deleteDiscountByPaytypeExe(no) {
	co.confirm(t("discount.realdel"),function(){
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
				paytype_no : no,
				bno : bno
			},
			traditional: true,
			url: '/discount/paytype/delexe',
			error: function() {
				co.alert(t("discount.error.del"));
				hideLoadingLayer();
			},
			beforeSend: function() {},
			success: function(res) {
				hideLoadingLayer();
				var status = res.status;
				if(status.result == RESULT_SUCCESS) {
					
					co.alert(t("discount.del"), function(){$(location).attr("href", "/discount/paytype");});
				} else {
					if(parseInt(status.code) == 20102) {
						alert(t("discount.logout"));
						$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/paytype"));
					} else if(parseInt(status.code) == 20104) {
						alert(t("discount.login"));
						$(location).attr("href", "/login/logout");
					} else {
						alert(t("discount.faildel"));
						
					}
				}
			}
		});
	});
	
}

function addDiscountByRevisitExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	
	if($("#room_grade_revisit").val() == "") {
		co.alert(t("discount.selectgrade"));
		return false;
	}
	
	if($("#dmoney_list_revisit").val() == "") {
		co.alert(t("discount.select"));
		return false;
	}
	
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_revisit").val(),
			discount : $("#dmoney_list_revisit").val(),
			bno : bno
		},
		traditional: true,
		url: '/discount/revisit/addexe',
		error: function() {
			hideLoadingLayer();
			co.alert(t("discount.error.add"));
			
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				
				co.alert(t("system.added"), function(){$(location).attr("href", "/discount/revisit");});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/revisit"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.failadd"));
					
				}
			}
		}
	});
}

function modifyDiscountByRevisitCancel() {
	$("#btn_add_revisit").show();
	$("#btn_modify_revisit").hide();
	$("#btn_cancel_revisit").hide();
	$("#dmoney_list_revisit").val("");
	$("#revisit_no").val("");
//	initDiscount();
}

function modifyDiscountByRevisit(no, grade, room_grade_no, discount) {
	$("#btn_add_revisit").hide();
	$("#btn_modify_revisit").show();
	$("#btn_cancel_revisit").show();
	$("#revisit_no").val(no);
	$("#room_grade_revisit").val(room_grade_no);
	$("#room_grade_revisit_no").val(room_grade_no);
	$("#dmoney_list_revisit").val(discount);
//	initDiscount();
}

function modifyDiscountByRevisitExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if($("#room_grade_revisit").val() == "") {
		co.alert(t("discount.selectgrade"));
		return false;
	}
	
	if($("#dmoney_list_revisit").val() == "") {
		co.alert(t("discount.select"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_revisit").val(),
			discount : $("#dmoney_list_revisit").val(),
			revisit_no : $("#revisit_no").val(),
			bno : bno
		},
		traditional: true,
		url: '/discount/revisit/modifyexe',
		error: function() {
			co.alert(t("discount.error.correct"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				
				co.alert(t("discount.correct"), function(){$(location).attr("href", "/discount/revisit");});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/revisit"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.failcorrect"));
					
				}
			}
		}
	});
}

function deleteDiscountByRevisitExe(no) {
	co.confirm(t("discount.realdel"),function(){
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
				revisit_no : no,
				bno : bno
			},
			traditional: true,
			url: '/discount/revisit/delexe',
			error: function() {
				co.alert(t("discount.error.del"));
				hideLoadingLayer();
			},
			beforeSend: function() {},
			success: function(res) {
				var status = res.status;
				if(status.result == RESULT_SUCCESS) {
					hideLoadingLayer();
					co.alert(t("app.del"), function(){$(location).attr("href", "/discount/revisit");});
				} else {
					if(parseInt(status.code) == 20102) {
						alert(t("discount.logout"));
						$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/revisit"));
					} else if(parseInt(status.code) == 20104) {
						alert(t("discount.login"));
						$(location).attr("href", "/login/logout");
					} else {
						alert(t("discount.faildel"));
						hideLoadingLayer();
					}
				}
			}
		});
	});
	
}

function addDiscountByPaymentExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	
	if($("#room_grade_payment").val() == "") {
		co.alert(t("discount.selectgrade"));
		return false;
	}
	
	if($("#dmoney_list_payment").val() == "") {
		co.alert(t("discount.select"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_payment").val(),
			discount : $("#dmoney_list_payment").val(),
			bno : bno
		},
		traditional: true,
		url: '/discount/payment/addexe',
		error: function() {
			co.alert(t("discount.error.add"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("system.added"), function(){$(location).attr("href", "/discount/payment");});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/payment"));
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

function modifyDiscountByPaymentCancel() {
	$("#btn_add_payment").show();
	$("#btn_modify_payment").hide();
	$("#btn_cancel_payment").hide();
	$("#dmoney_list_payment").val("");
	$("#payment_no").val("");
//	initDiscount();
}

function modifyDiscountByPayment(no, grade, room_grade_no, discount) {
	$("#btn_add_payment").hide();
	$("#btn_modify_payment").show();
	$("#btn_cancel_payment").show();
	$("#payment_no").val(no);
	$("#room_grade_payment").val(room_grade_no);
	$("#room_grade_payment_no").val(room_grade_no);
	$("#dmoney_list_payment").val(discount);
//	initDiscount();
}

function modifyDiscountByPaymentExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if($("#room_grade_payment").val() == "") {
		co.alert(t("discount.selectgrade"));
		return false;
	}
	
	if($("#dmoney_list_payment").val() == "") {
		co.alert(t("discount.select"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			room_grade_no : $("#room_grade_payment").val(),
			discount : $("#dmoney_list_payment").val(),
			payment_no : $("#payment_no").val(),
			bno : bno
		},
		traditional: true,
		url: '/discount/payment/modifyexe',
		error: function() {
			co.alert(t("discount.error.correct"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("system.edited"), function(){$(location).attr("href", "/discount/payment");});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.failcorrect"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function deleteDiscountByPaymentExe(no) {
	co.confirm(t("discount.realdel"),function(){
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
				payment_no : no,
				bno : bno
			},
			traditional: true,
			url: '/discount/payment/delexe',
			error: function() {
				co.alert(t("discount.error.del"));
				hideLoadingLayer();
			},
			beforeSend: function() {},
			success: function(res) {
				var status = res.status;
				if(status.result == RESULT_SUCCESS) {
					hideLoadingLayer();
					co.alert(t("app.del"), function(){$(location).attr("href", "/discount/payment");});
				} else {
					if(parseInt(status.code) == 20102) {
						alert(t("discount.logout"));
						$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/payment"));
					} else if(parseInt(status.code) == 20104) {
						alert(t("discount.login"));
						$(location).attr("href", "/login/logout");
					} else {
						alert(t("discount.faildel"));
						hideLoadingLayer();
					}
				}
			}
		});
	});
	
}

function saveDiscountRole(url) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var day = 0, gongu = 0, payment = 0, paytype = 0, revisit = 0;
	day = $('#discount_by_day').val();
	gongu = $('#discount_by_gongu').val();
	payment = $('#discount_by_payment').val();
	paytype = $('#discount_by_paytype').val();
	revisit = $('#discount_by_revisit').val();
	
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			discount_by_day : day,
			discount_by_gongu : gongu,
			discount_by_payment : payment,
			discount_by_paytype : paytype,
			discount_by_revisit : revisit,
			bno : bno
		},
		traditional: true,
		url: '/discount/role/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				$(location).attr("href", url);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/discount/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("discount.cantsave"));
					hideLoadingLayer();
				}
			}
		}
	});
}
