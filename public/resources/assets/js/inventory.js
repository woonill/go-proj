
// datetimepicker option
var dtoption = {
		validateOnBlur:true,
		format:"Y-m-d H:i",
		ignoreReadonly:true,
		step:15,
		onGenerate:function(ct, $input){
			$input.prop('readonly', true);
			var $this = $(this);
			$this.find('.xdsoft_date').removeClass('xdsoft_disabled');
			$this.find('.xdsoft_time').removeClass('xdsoft_disabled');
		}
};

function addInventory() {
	$(location).attr("href", "/inventory/add");
}

function addInventoryHistory(inventory_no) {
	$(location).attr("href", "/inventory/history/add?inventory_no="+inventory_no);
}

function addInventorySpend() {
	$(location).attr("href", "/inventory/spend/add");
}

function addInventoryPayment() {
	$(location).attr("href", "/inventory/payment/add");
}

function modifyInventory(inventory_no) {
	$(location).attr("href", "/inventory/modify?inventory_no="+inventory_no);
}

function modifyInventoryHistory(inventory_no, inventory_history_no) {
	$(location).attr("href", "/inventory/history/modify?inventory_history_no="+inventory_history_no+"&inventory_no="+inventory_no);
}

function modifyInventorySpend(inventory_spend_no) {
	$(location).attr("href", "/inventory/spend/modify?inventory_spend_no="+inventory_spend_no);
}

function modifyInventoryPayment() {
	var no = $("#no").val();
	$(location).attr("href", "/inventory/payment/modify?no="+no);
}


function approveInventoryPayment() {
	var no = $("#no").val();
	$(location).attr("href", "/inventory/payment/approve?no="+no);
}

function rejectInventoryPayment() {
	var layer = $('.anti-reason').html();
    co.layer(layer,function(el){
        $(el).on('submit','form',function(){
        	rejectInventoryPaymentExe();
            return false;
        })
    });
}

function viewInventory(inventory_no) {
	$(location).attr("href", "/inventory/history/list?inventory_no="+inventory_no);
}

function viewInventorySpend(inventory_spend_no) {
	$(location).attr("href", "/inventory/spend/view?inventory_spend_no="+inventory_spend_no);
}

function viewInventoryPayment(no) {
	$(location).attr("href", "/inventory/payment/view?no="+no);
}

function searchInventory() {
	var field = $("#field").val();
	var keyword = encodeURI(encodeURIComponent($("#keyword").val()));
	$(location).attr("href", "/inventory/list?field="+field+"&keyword="+keyword);
}

function searchInventoryHistory() {
	var inventory_no = $("#inventory_no").val();
	var type = $("#type").val();
	var from_date = $("#from_date").val();
	var to_date = $("#to_date").val();
	$(location).attr("href", "/inventory/history/list?type="+type+"&from_date="+from_date+"&to_date="+to_date+"&inventory_no="+inventory_no);
}

function searchInventorySpend() {
	var from_date = $("#from_date").val();
	var to_date = $("#to_date").val();
	$(location).attr("href", "/inventory/spend/list?from_date="+from_date+"&to_date="+to_date);
}

function searchInventoryPayment() {
	var count = $("#count").val();
	var type = $("#type").val();
	var field = $("#field").val();
	var keyword = $("#keyword").val();
	var from_date = $("#from_date").val();
	var to_date = $("#to_date").val();
	var param = "";
	if(field == "name" || field == "bank_name" || field == "etc") {
		param = param + "&keyword="+keyword;
	}
	if(from_date != null && to_date != null){
		param = param + "&from_date="+from_date+"&to_date="+to_date;
	}
	
	if(field == "request_date") {
		param = param + "&from_date="+from_date+"&to_date="+to_date;
	}
	var url = "/inventory/payment/list?count="+count+"&type="+type+"&field="+field+param;
	$(location).attr("href", url);
}

function setTotalMoney(amount, price) {
	var total = 0;
	if(uncomma(amount) > 0) {
		total = uncomma(amount) * uncomma(price);
	}
	$("#total_money").val( comma(total) );
}

function initInventoryHistoryList() {
	$("#type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":70, "ireadonly":true });
	setDatePicker("#from_date");
	setDatePicker("#to_date");
	$("#from_date").on("keyup", function(e){
		if(e.keyCode == 13){
			searchInventoryHistory();
		}
	});
	$("#to_date").on("keyup", function(e){
		if(e.keyCode == 13){
			searchInventoryHistory();
		}
	});
}

function initInventorySpendList() {
	
	$("#from_date").on("keyup", function(e){
		if(e.keyCode == 13){
			searchInventorySpend();
		}
	});
	$("#to_date").on("keyup", function(e){
		if(e.keyCode == 13){
			searchInventorySpend();
		}
	});
}

function initInventoryPaymentList() {
	
	$("#count").bind('change', function() {
		var count = $(this).val();
		var type = $("#type").val();
		var field = $("#field").val();
		var keyword = $("#keyword").val();
		var from_date = $("#from_date").val();
		var to_date = $("#to_date").val();
		var url = "/inventory/payment/list?type="+type+"&field="+field+"&keyword="+keyword+"&from_date="+from_date+"&to_date="+to_date+"&count="+count;
		$(location).attr("href", url);
	});
	
	$("#type").bind('change', function() {
		var count = $("#count").val();
		var type = $(this).val();
		var field = $("#field").val();
		var keyword = $("#keyword").val();
		var from_date = $("#from_date").val();
		var to_date = $("#to_date").val();
		var url = "/inventory/payment/list?type="+type+"&field="+field+"&keyword="+keyword+"&from_date="+from_date+"&to_date="+to_date+"&count="+count;
		$(location).attr("href", url);
	});
	
	$("#isapprove").bind('change', function() {
		var count = $("#count").val();
		var type = $("#type").val();
		var isapprove = $(this).val();
		var field = $("#field").val();
		var keyword = $("#keyword").val();
		var from_date = $("#from_date").val();
		var to_date = $("#to_date").val();
		var url = "/inventory/payment/list?type="+type+"&field="+field+"&keyword="+keyword+"&from_date="+from_date+"&to_date="+to_date+"&count="+count+"&isapprove="+isapprove;
		$(location).attr("href", url);
	});
	
	$("#field").bind('change', function() {
		var field = $(this).val();
		
		var prefield = $("#prefield").val();
		if(prefield == field) {
			return ;
		}
		if(field == "name" || field == "bank_name") {
			$("#keyword").val("");
			$("#from_date").val("");
			$("#to_date").val("");
			$(".i-search").show();
		}
		$("#prefield").val(field);
	});
	
	$("#keyword").on("keyup", function(e){
		if(e.keyCode == 13){
			searchInventoryPayment();
		}
	});
	$("#from_date").on("keyup", function(e){
		if(e.keyCode == 13){
			searchInventoryPayment();
		}
	});
	$("#to_date").on("keyup", function(e){
		if(e.keyCode == 13){
			searchInventoryPayment();
		}
	});
	var field = $("#field").val();
	if(field == "name" || field == "bank_name") {
		$(".i-search").show();
	}
}

function initInventoryList() {
	$("#field").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	$("#keyword").on("keyup", function(e){
		if(e.keyCode == 13){
			searchInventory();
		}
	});
}

function initAddInventory() {
	$("#type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
}

function initAddInventoryHistory() {
	$("#type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	setMoneyCommaEvent("#amount");
	setMoneyCommaEvent("#price");
	$("#amount").on("keyup", function(e) {
		var price = uncomma($("#price").val());
		var amount =$(this).val();
		setTotalMoney(amount, price);
	});
	$("#price").on("keyup", function(e) {
		var amount = uncomma($("#amount").val());
		var price =$(this).val();
		setTotalMoney(amount, price);
	});
	setDatePicker("#stock_date");
}

function initAddInventorySpend() {
	setMoneyCommaEvent("#amount");
	setMoneyCommaEvent("#money");
	$("#spendtime").datetimepicker(dtoption);
	$("#inventory_type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	$("#type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
}

function initAddInventoryPayment() {
	setMoneyCommaEvent("#money");
	setNumberEvent("#bank_account");
	setNumberEvent("#jumin1");
	setNumberEvent("#jumin2");
	
}

function initModifyInventory() {
	$("#type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
}

function initModifyInventoryHistory() {
	setMoneyCommaEvent("#amount");
	setMoneyCommaEvent("#price");
	$("#amount").on("keyup", function(e) {
		var price = uncomma($("#price").val());
		var amount =$(this).val();
		setTotalMoney(amount, price);
	});
	$("#price").on("keyup", function(e) {
		var amount = uncomma($("#amount").val());
		var price =$(this).val();
		setTotalMoney(amount, price);
	});
	setDatePicker("#stock_date");
}

function initModifyInventorySpend() {
	setMoneyCommaEvent("#amount");
	setMoneyCommaEvent("#money");
	$("#spendtime").datetimepicker(dtoption);
	$("#inventory_type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
	$("#type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
}

function initModifyInventoryPayment() {
	setMoneyCommaEvent("#money");
	
	setNumberEvent("#bank_account");
	setNumberEvent("#jumin1");
	setNumberEvent("#jumin2");
	
}

function checkInventoryInput() {
	if(isNull($("#name").val())) {
		alert(t("inventory.input.itemname"));
		$("#name").focus();
		return false;
	}
//	if(isNull($("#standard").val())) {
//		alert(t("inventory.input.standard"));
//		$("#standard").focus();
//		return false;
//	}
	return true;
}

function checkInventoryHistoryInput() {
	if(isNull($("#manager").val())) {
		alert(t("inventory.input.members"));
		$("#manager").focus();
		return false;
	}
	if(isNull($("#amount").val())) {
		alert(t("inventory.input.amounts"));
		$("#amount").focus();
		return false;
	}
	var amount = parseInt($("#amount").val());
	if(amount <= 0) {
		alert(t("inventory.amount.overzero"));
		$("#amount").focus();
		return false;
	}
	if(isNull($("#price").val())) {
		alert(t("inventory.input.unitprice"));
		$("#price").focus();
		return false;
	}
//	var price = parseInt($("#price").val());
//	if(price <= 0) {
//		alert("단가는 0보다 큰 값이어야 합니다.");
//		$("#price").focus();
//		return false;
//	}
	if(isNull($("#total_money").val())) {
		alert(t("inventory.input.amount"));
		$("#total_money").focus();
		return false;
	}
//	var total_money = parseInt($("#total_money").val());
//	if(total_money <= 0) {
//		alert("단가는 0보다 큰 값이어야 합니다.");
//		$("#total_money").focus();
//		return false;
//	}
	return true;
}

function checkInventorySpendInput() {
	if(isNull($("#manager").val())) {
		alert(t("inventory.input.members"));
		$("#manager").focus();
		return false;
	}
	var inventory_type = parseInt($("#inventory_type").val());
	if(inventory_type == 0 || inventory_type == 1) {
		if(isNull($("#name").val())) {
			alert(t("inventory.input.itemnames"));
			$("#name").focus();
			return false;
		}
		if(isNull($("#amount").val())) {
			alert(t("inventory.input.amounts"));
			$("#amount").focus();
			return false;
		}
		if(isNull($("#client").val())) {
			alert(t("inventory.input.client"));
			$("#client").focus();
			return false;
		}
		if(isNull($("#standard").val())) {
			alert(t("inventory.input.standard"));
			$("#standard").focus();
			return false;
		}
	}
	if(isNull($("#money").val())) {
		alert(t("inventory.input.spend"));
		$("#money").focus();
		return false;
	}
	if(isNull($("#spendtime").val())) {
		alert(t("inventory.input.spendtime"));
		$("#spendtime").focus();
		return false;
	}
	if(isNull($("#spend").val())) {
		alert(t("inventory.input.spenditem"));
		$("#spend").focus();
		return false;
	}
	return true;
}

function checkInventoryPaymentRejectInput() {
	if(isNull($("#reject_memo").val())) {
		co.alert(t("inventory.input.returnreasons"), function(){$("#reject_memo").focus();});
		return false;
	}
}

function checkInventoryPaymentInput() {
	if(isNull($("#manager").val())) {
		co.alert(t("inventory.input.memberss"), function(){$("#manager").focus();});
		return false;
	}
	if(isNull($("#request_date").val())) {
		co.alert(t("inventory.input.applydays"), function(){$("#request_date").focus();});
		return false;
	}
	if(isNull($("#memo").val())) {
		co.alert(t("inventory.input.spend.item"), function(){$("#memo").focus();});
		return false;
	}
	
	if($('#pay_type_1').is(':checked')) {
		if(isNull($("#name").val())) {
			co.alert(t("inventory.input.spent.member"), function(){$("#name").focus();});
			return false;
		}
		
		
		if(isNull($("#bank_name").val())) {
			co.alert(t("inventory.input.banks"), function(){$("#bank_name").focus();});
			
			return false;
		}
		if(isNull($("#bank_account").val())) {
			co.alert(t("inventory.input.accounts"), function(){$("#bank_account").focus();});
			
			return false;
		}
		if(isNull($("#bank_user").val())) {
			co.alert(t("inventory.input.accountname"), function(){$("#bank_user").focus();});
			
			return false;
		}
		if(isNull($("#bank_withdraw_content").val())) {
			co.alert(t("inventory.spend.accountitem"), function(){$("#bank_withdraw_content").focus();});
			
			return false;
		}
		if(isNull($("#bank_deposit_content").val())) {
			co.alert(t("inventory.input.accountitems"), function(){$("#bank_deposit_content").focus();});
			
			return false;
		}
		if(isNull($("#money").val())) {
			co.alert(t("inventory.input.spends"), function(){$("#money").focus();});
			
			return false;
		} else {
			var money = uncomma($("#money").val());
			if($.isNumeric(money) == false) {
				co.alert(t("inventory.input.spend.onlynum"), function(){$("#money").focus();});
				
				return false;
			}
		}
		
		if($('#type_1').is(':checked')) {
			if(isNull($("#jumin1").val())) {
				co.alert(t("inventory.input.reginums"), function(){$("#jumin1").focus();});
				
				return false;
			} else {
				if ($("#jumin1").val().length != 6) {
					co.alert(t("inventory.input.reginumsix"), function(){$("#jumin1").focus();});
					
					return false;
				}
				
				if($.isNumeric($("#jumin1").val()) == false) {
					co.alert(t("inventory.input.reginum.onlynum"), function(){$("#jumin1").focus();});
					
					return false;
				}
			}
			if(isNull($("#jumin2").val())) {
				co.alert(t("inventory.input.reginums"), function(){$("#jumin2").focus();});
				
				return false;
			} else {
				if ($("#jumin2").val().length != 7) {
					co.alert(t("inventory.input.reginumseven"), function(){$("#jumin2").focus();});
					
					return false;
				}
				
				if($.isNumeric($("#jumin2").val()) == false) {
					co.alert(t("inventory.input.reginum.onlynum"), function(){$("#jumin2").focus();});
					
					return false;
				}
			}
		} else if($('#type_3').is(':checked')) {
			if(isNull($("#due_date").val())) {
				co.alert(t("inventory.input.scheduleday"), function(){$("#due_date").focus();});
				
				return false;
			}
		}
	} else if($('#pay_type_2').is(':checked')) {
		if(isNull($("#name").val())) {
			co.alert(t("inventory.input.card"), function(){$("#name").focus();});
			return false;
		}
		
		if(isNull($("#bank_account").val())) {
			co.alert(t("inventory.input.approvalnum"), function(){$("#bank_account").focus();});
			return false;
		} else if($.isNumeric($("#bank_account").val()) == false) {
			co.alert(t("inventory.onlynum.approvalnum"), function(){$("#bank_account").focus();});
			
			return false;
		}
		
		if(isNull($("#money").val())) {
			co.alert(t("inventory.input.money"), function(){$("#money").focus();});
			return false;
		} else {
			var money = uncomma($("#money").val());
			if($.isNumeric(money) == false) {
				co.alert(t("inventory.onlynum.money"), function(){$("#money").focus();});
				
				return false;
			}
		}
		
		if(isNull($("#due_date").val())) {
			co.alert(t("inventory.input.approvaltime"), function(){$("#due_date").focus();});
			return false;
		}
	}
	return true;
}

function multiApprove() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var length = $("input[name=check_no]:checkbox:checked").length;
	if(length <= 0) {
		co.alert(t("inventory.noapprovalitem"));
		
		return false;
	}
	var url = "";
	var count = 0;
	$("input[name=check_no]:checkbox:checked").each(function (){
		var no = $(this).val();
		var id = "#" + no + "_isapprove";
		var isapprove = parseInt($(id).val());
		if(isapprove == 0) {
			if(url == "") {
				url = "/inventory/payment/approve/all?no_list=" + $(this).val();
			} else {
				url = url + "&no_list=" + $(this).val();
			}
			count = count + 1;
		}
	});
	if(count == 0) {
		co.alert(t("inventory.select.request"));
		return false;
	}
	url = url + "&bno=" + bno;
	$(location).attr("href", url);
}

function downloadInventoryPayment() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var length = $("input[name=check_no]:checkbox:checked").length;
	if(length <= 0) {
		co.alert(t("inventory.noapprovalitem"));
		return false;
	}
	var url = "";
	var count = 0;
	$("input[name=check_no]:checkbox:checked").each(function (){
		var no = $(this).val();
		var id = "#" + no + "_isapprove";
		var isapprove = parseInt($(id).val());
		if(isapprove == 0) {
			if(url == "") {
				url = "/excel/inventory/payment?no_list=" + $(this).val();
			} else {
				url = url + "&no_list=" + $(this).val();
			}
			count = count + 1;
		}
	});
	if(count == 0) {
		co.alert(t("inventory.select.requests"));
		return false;
	}
	url = url + "&bno=" + bno;
	$("<a>").attr("href", url).attr("target", "_blank")[0].click();
}

function addInventoryExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInventoryInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			type : $("#type").val(),
			company : $("#company").val(),
			name : $("#name").val(),
			standard : $("#standard").val(),
			bno : bno
		},
		traditional: true,
		url: '/inventory/addexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				alert(t("system.added"));
				$(location).attr("href", "/inventory/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/add"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("system.error.add"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function modifyInventoryExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInventoryInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			inventory_no : $("#inventory_no").val(),
			type : $("#type").val(),
			company : $("#company").val(),
			name : $("#name").val(),
			standard : $("#standard").val(),
			bno : bno
		},
		traditional: true,
		url: '/inventory/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.edited"));
				$(location).attr("href", "/inventory/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/modify"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function deleteInventoryExe(inventory_no) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(!confirm(t("discount.reallydel"))) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			inventory_no : inventory_no,
			bno : bno
		},
		traditional: true,
		url: '/inventory/deleteexe',
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
				$(location).attr("href", "/inventory/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("interest.error"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function addInventoryHistoryExe() {
	var inventory_no = $("#inventory_no").val();
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInventoryHistoryInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			manager : $("#manager").val(),
			memo : $("#memo").val(),
			type : $("#type").val(),
			inventory_no : inventory_no,
			amount : uncomma($("#amount").val()),
			price : uncomma($("#price").val()),
			total_money : uncomma($("#total_money").val()),
			client : $("#client").val(),
			stock_date : $("#stock_date").val(),
			bno : bno
		},
		traditional: true,
		url: '/inventory/history/addexe',
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
				$(location).attr("href", "/inventory/history/list?inventory_no=" + inventory_no);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/history/list?inventory_no=" + inventory_no));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("system.error.add"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function modifyInventoryHistoryExe() {
	var inventory_no = $("#inventory_no").val();
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInventoryHistoryInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			inventory_history_no : $("#inventory_history_no").val(),
			manager : $("#manager").val(),
			memo : $("#memo").val(),
			type : $("#type").val(),
			inventory_no : inventory_no,
			amount : uncomma($("#amount").val()),
			price : uncomma($("#price").val()),
			total_money : uncomma($("#total_money").val()),
			client : $("#client").val(),
			stock_date : $("#stock_date").val(),
			bno : bno
		},
		traditional: true,
		url: '/inventory/history/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.edited"));
				$(location).attr("href", "/inventory/history/list?inventory_no=" + inventory_no);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/history/list?inventory_no=" + inventory_no));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function deleteInventoryHistoryExe(inventory_history_no) {
	var inventory_no = $("#inventory_no").val();
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(!confirm(t("discount.reallydel"))) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			inventory_history_no : inventory_history_no,
			bno : bno
		},
		traditional: true,
		url: '/inventory/history/deleteexe',
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
				$(location).attr("href", "/inventory/history/list?inventory_no=" + inventory_no);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/history/list?inventory_no=" + inventory_no));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("interest.error"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function addInventorySpendExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInventorySpendInput() == false) {
		return false;
	}
	var inventory_type = $("#inventory_type").val();
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			manager : $("#manager").val(),
			inventory_type : inventory_type,
			amount : uncomma($("#amount").val()),
			client : $("#client").val(),
			company : $("#company").val(),
			standard : $("#standard").val(),
			money : uncomma($("#money").val()),
			spendtime : $("#spendtime").val(),
			spend : $("#spend").val(),
			type : $("#type").val(),
			name : $("#name").val(),
			bno : bno
		},
		traditional: true,
		url: '/inventory/spend/addexe',
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
				if(inventory_type == 0 || inventory_type == 1) {
					$(location).attr("href", "/inventory/list");
				} else {
					$(location).attr("href", "/inventory/spend/list");
				}
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/spend/add"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("system.error.add"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function modifyInventorySpendExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInventorySpendInput() == false) {
		return false;
	}
	var inventory_type = $("#inventory_type").val();
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			inventory_spend_no : $("#inventory_spend_no").val(),
			manager : $("#manager").val(),
			inventory_type : inventory_type,
			amount : uncomma($("#amount").val()),
			client : $("#client").val(),
			company : $("#company").val(),
			standard : $("#standard").val(),
			money : uncomma($("#money").val()),
			spendtime : $("#spendtime").val(),
			spend : $("#spend").val(),
			type : $("#type").val(),
			name : $("#name").val(),
			bno : bno
		},
		traditional: true,
		url: '/inventory/spend/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.edited"));
				if(inventory_type == 0 || inventory_type == 1) {
					$(location).attr("href", "/inventory/list");
				} else {
					$(location).attr("href", "/inventory/spend/list");
				}
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/spend/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function deleteInventorySpendExe(inventory_spend_no) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(!confirm(t("discount.reallydel"))) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			inventory_spend_no : inventory_spend_no,
			bno : bno
		},
		traditional: true,
		url: '/inventory/spend/deleteexe',
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
				$(location).attr("href", "/inventory/spend/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/spend/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("interest.error"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function removeFile() {
	let fileName = $("#delId").val();
	var no = $("#no").val();
	var bno = $("#bno").val();
	var manager = $("#user").val();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			bno : bno,
			no : no,
			filename : fileName,
			manager : manager
		},
		traditional: true,
		url: '/inventory/payment/delfile',
		error: function() {
			alert(t("app.error"));
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				$('#iventoryPaymentDeleteConfirm').bPopup().close();
				co.alert(t("삭제되었습니다"), function() {$(location).attr("href", "/inventory/payment/modify?no="+no);});
				;
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/payment/modify"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));s
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("system.error.add"));
				}
			}
		}
	});
}

function InventoryPaymentFileDeletePopup(){
	BPOPUP =  $('#iventoryPaymentDeleteConfirm').bPopup({
       	modalClose : false
    });
}

function removeInventoryPaymentFile(e){
	if($("#input_"+e).val() != undefined){
		$("#delId").val($("#input_"+e).val());
		InventoryPaymentFileDeletePopup()
	} else{
		removeInventoryPaymentFileExe(e);
	};
}

function removeInventoryPaymentFileExe(e){
	if(e==undefined){
		e = 0;
	}
	var fileName = $("#input_"+e).closest($(".i-filename")).val();
	if($(".file-field").size() == 1){
		if(fileName != "" || fileName != undefined){
			$("#field_count").val($("#field_count").val() -1);	
			$("#field_"+ e).remove();
			addInventoryPaymentFile();
		};
	}else{
		$("#field_count").val($("#field_count").val() -1);
		$("#field_"+ e).remove();
	};
	
	if(fileName =! "" || fileName != undefined && $("#file_count").val() > 1){
		$("#file_count").val($("#file_count").val() - 1);
		$("#field_"+ e).remove();
	};
}

function addInventoryPaymentFile(){
	var fieldCount = parseInt($("#field_count").val());
	var fieldNumCount = parseInt($("#file_id_count").val()) + 1; 
	var contents = "";
	contents += "<li id='field_" + fieldNumCount+ "'><div class='field-row file-field' style='height:40px;'>";
    contents += "<div class='field'><input type='text' class='i-filename'></div>";
    contents += "<label class='i-file field'><input type='file' id='file_" + fieldNumCount + "' class='ufile'><span class='text'>" + t("manage.find.file") + "</span></label>";
	contents += "<span class='tools' style='margin-left:5px;'>";
	contents += "<a href='javascript:addInventoryPaymentFile();' class='file-append' id='' style='display:inline-block;'><i class='icon-row-append'></i></a>";
	contents += "<a href='javascript:removeInventoryPaymentFile(" + fieldNumCount + ");' class='file-canceled' id='' style='display:inline-block; margin-left:4px;'><i class='icon-row-remove'></i></a>";
	contents += "</span></div></li>";
	$("#inventory_payment_file").append(contents);
	$("#field_count").val(fieldCount + 1);
	$("#file_id_count").val(fieldNumCount + 1);
	
	$('.file-field').on('change','input:file',function(){
		var files = this.files[0];
		files = files && files.name || '';
		$(this).closest('.file-field').find('.i-filename').val(files);
	});
}

function addInventoryPaymentExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInventoryPaymentInput() == false) {
		return false;
	}
	var data = new FormData();
	var fileCount = 0;
		
	for(var i=0; i<$(".file-field").size(); i++){
		if($(".ufile").val()) {
			if($(".ufile")[i].files[0] != undefined){
				var file = $(".ufile")[i].files[0];
				data.append("file", file);
				fileCount += 1;	
			};
		};	
	};

	var type = '';
	if ($("#type_1").is(":checked")) {
		type = '0' // 기존 인건비
	} else if ($("#type_2").is(":checked")) {
		type = '1' // 기존 지출
	} else if ($("#type_3").is(":checked")) {
		type = '2' // 기존 환불
	} else if ($("#category_11").is(":checked")) {
		type = '11' // 4대보험
	} else if ($("#category_12").is(":checked")) {
		type = '12' // 세금
	} else if ($("#category_13").is(":checked")) {
		type = '13' // 외주용역비
	} else if ($("#category_14").is(":checked")) {
		type = '14' // 식자재비
	} else if ($("#category_15").is(":checked")) {
		type = '15' // 임대료
	} else if ($("#category_16").is(":checked")) {
		type = '16' // 환불
	} else if ($("#category_21").is(":checked")) {
		type = '21' // 직원(4대보험 가입자)
	} else if ($("#category_22").is(":checked")) {
		type = '22' // 사업소득(3.3%)
	} else if ($("#category_23").is(":checked")) {
		type = '23' // 잡급(일용직)
	} else if ($("#category_31").is(":checked")) {
		type = '31' // 통신료
	} else if ($("#category_32").is(":checked")) {
		type = '32' // 도시가스
	} else if ($("#category_33").is(":checked")) {
		type = '33' // 수도세
	} else if ($("#category_34").is(":checked")) {
		type = '34' // 전기세
	} else if ($("#category_41").is(":checked")) {
		type = '41' // 수선비
	} else if ($("#category_42").is(":checked")) {
		type = '42' // 비품 구매
	} else if ($("#category_43").is(":checked")) {
		type = '43' // 소모품 구매
	} else if ($("#category_44").is(":checked")) {
		type = '44' // 기타 잡비
	} else if ($("#category_45").is(":checked")) {
		type = '45' // 일반보험료
	}
	
	
	var payType = '';
	if ($("#pay_type_1").is(":checked")) {
		payType = '0' // 현금
	} else if ($("#pay_type_2").is(":checked")) {
		payType = '1' // 카드
	}
	data.append("manager", $("#manager").val());
	data.append("request_date", $("#request_date").val());
	data.append("type", type);
	data.append("pay_type", payType);
	data.append("memo", $("#memo").val());
	data.append("name", $("#name").val());
	data.append("bank_name", $("#bank_name").val());
	data.append("bank_account", $("#bank_account").val());
	data.append("bank_user", $("#bank_user").val());
	data.append("money", uncomma($("#money").val()));
	data.append("jumin1", $("#jumin1").val());
	data.append("jumin2", $("#jumin2").val());
	data.append("due_date", $("#due_date").val());
	data.append("bank_withdraw_content", $("#bank_withdraw_content").val());
	data.append("bank_deposit_content", $("#bank_deposit_content").val());
	data.append("bno", bno);
	data.append("file_count", fileCount);
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: data,
		contentType: false,
		processData: false,
		cache: false,
		traditional: true,
		url: '/inventory/payment/addexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("inventory.added"), function() {$(location).attr("href", "/inventory/payment/list");});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/payment/add"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("system.error.add"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function modifyInventoryPaymentExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInventoryPaymentInput() == false) {
		return false;
	}
	var data = new FormData();
	
	var fileCount = 0;
	for(var i=0; i<$(".file-field").size(); i++){
		if($(".ufile")[i].files[0] != undefined){
			var file = $(".ufile")[i].files[0];
			data.append("file", file);
			fileCount += 1;	
		};
	};
	
	var type = '';
	if ($("#type_1").is(":checked")) {
		type = '0' // 기존 인건비
	} else if ($("#type_2").is(":checked")) {
		type = '1' // 기존 지출
	} else if ($("#type_3").is(":checked")) {
		type = '2' // 기존 환불
	} else if ($("#category_11").is(":checked")) {
		type = '11' // 4대보험
	} else if ($("#category_12").is(":checked")) {
		type = '12' // 세금
	} else if ($("#category_13").is(":checked")) {
		type = '13' // 외주용역비
	} else if ($("#category_14").is(":checked")) {
		type = '14' // 식자재비
	} else if ($("#category_15").is(":checked")) {
		type = '15' // 임대료
	} else if ($("#category_16").is(":checked")) {
		type = '16' // 환불
	} else if ($("#category_21").is(":checked")) {
		type = '21' // 직원(4대보험 가입자)
	} else if ($("#category_22").is(":checked")) {
		type = '22' // 사업소득(3.3%)
	} else if ($("#category_23").is(":checked")) {
		type = '23' // 잡급(일용직)
	} else if ($("#category_31").is(":checked")) {
		type = '31' // 통신료
	} else if ($("#category_32").is(":checked")) {
		type = '32' // 도시가스
	} else if ($("#category_33").is(":checked")) {
		type = '33' // 수도세
	} else if ($("#category_34").is(":checked")) {
		type = '34' // 전기세
	} else if ($("#category_41").is(":checked")) {
		type = '41' // 수선비
	} else if ($("#category_42").is(":checked")) {
		type = '42' // 비품 구매
	} else if ($("#category_43").is(":checked")) {
		type = '43' // 소모품 구매
	} else if ($("#category_44").is(":checked")) {
		type = '44' // 기타 잡비
	} else if ($("#category_45").is(":checked")) {
		type = '45' // 일반보험료
	}
	
	var payType = '';
	if ($("#pay_type_1").is(":checked")) {
		payType = '0' // 현금
	} else if ($("#pay_type_2").is(":checked")) {
		payType = '1' // 카드
	}
	
	var fileExist = $("#file_exists").val();
	
	data.append("manager", $("#manager").val());
	data.append("request_date", $("#request_date").val());
	data.append("type", type);
	data.append("pay_type", payType);
	data.append("memo", $("#memo").val());
	data.append("name", $("#name").val());
	data.append("bank_name", $("#bank_name").val());
	data.append("bank_account", $("#bank_account").val());
	data.append("bank_user", $("#bank_user").val());
	data.append("money", uncomma($("#money").val()));
	data.append("jumin1", $("#jumin1").val());
	data.append("jumin2", $("#jumin2").val());
	data.append("due_date", $("#due_date").val());
	data.append("bank_withdraw_content", $("#bank_withdraw_content").val());
	data.append("bank_deposit_content", $("#bank_deposit_content").val());
	data.append("no", $("#no").val());
	data.append("file_exists", $("#file_exists").val());
	data.append("bno", bno);
	data.append("file_count",fileCount);
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: data,
		contentType: false,
		processData: false,
		cache: false,
		traditional: true,
		url: '/inventory/payment/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("inventory.correct"), function() {$(location).attr("href", "/inventory/payment/list");});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/payment/modify"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function deleteInventoryPaymentExe(no) {

	co.confirm(t("inventory.questiondel"),function(){
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
			url: '/inventory/payment/deleteexe',
			error: function() {
				alert(t("app.error"));
				hideLoadingLayer();
			},
			beforeSend: function() {},
			success: function(res) {
				var status = res.status;
				var data = res.data;
				if(status.result == RESULT_SUCCESS) {
					hideLoadingLayer();
					co.alert(t("inventory.del"), function() {$(location).attr("href", "/inventory/payment/list");});
				} else {
					if(parseInt(status.code) == 20102) {
						alert(t("discount.logout"));
						$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/payment/list"));
					} else if(parseInt(status.code) == 20104) {
						alert(t("discount.login"));
						$(location).attr("href", "/login/logout");
					} else {
						alert(t("interest.error"));
					}
				}
				hideLoadingLayer();
			}
		});
	});
	
}

function rejectInventoryPaymentExe() {
	var no = $("#no").val();
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInventoryPaymentRejectInput() == false) {
		return false;
	}
	var args = {
			inventory_payment_no : no,
			bno : bno,
			memo : $("#reject_memo").val()
	};
	$.redirectPost('/inventory/payment/reject', args);
}

function reapproveInventoryPaymentExe() {
	var bno = 0;
	let fileCount = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			no : $("#no").val(),
			bno : bno,
			fileCount : fileCount
			
		},
		traditional: true,
		url: '/inventory/payment/reapprove',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				alert(t("inventory.reapplied"));
				$(location).attr("href", "/inventory/payment/list");
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/inventory/payment/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("inventory.error.reapply"));
				}
			}
			hideLoadingLayer();
		}
	});
}

$( document ).ready(function() {
	$('a', $('#nav')).each(function( index ) {
		if ($(this).text() == t("inventory.spends") || $(this).text() == t("inventory.spend") ) {
			$(this).parent().addClass("active");
		}
	});
	
});
