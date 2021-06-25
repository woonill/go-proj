
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
//	var inventory_payment_no = $("#no").val();
//	$(location).attr("href", "/inventory/payment/reject?inventory_payment_no="+inventory_payment_no);
	var layer = $('.anti-reason').html();
    co.layer(layer,function(el){
        $(el).on('submit','form',function(){
            console.log(111);
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
	if(field == "name" || field == "bank_name") {
		param = param + "&keyword="+keyword;
	} else if(field == "request_date") {
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

function removeFile() {
	$("#prefile").hide();
	$("#file_exists").val(0);
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
	$("#from_date").datetimepicker(dtoption);
	$("#to_date").datetimepicker(dtoption);
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
	setDatePicker("#from_date");
	setDatePicker("#to_date");
	$("#count").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":80, "ireadonly":true, "iblur":function(selected){
		var count = selected.val();
		var type = $("#type").val();
		var field = $("#field").val();
		var keyword = $("#keyword").val();
		var from_date = $("#from_date").val();
		var to_date = $("#to_date").val();
		var url = "/inventory/payment/list?type="+type+"&field="+field+"&keyword="+keyword+"&from_date="+from_date+"&to_date="+to_date+"&count="+count;
		$(location).attr("href", url);
	}});
	$("#type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":80, "ireadonly":true, "iblur":function(selected){
		var count = $("#count").val();
		var type = selected.val();
		var field = $("#field").val();
		var isapprove = $("#isapprove").val();
		var keyword = $("#keyword").val();
		var from_date = $("#from_date").val();
		var to_date = $("#to_date").val();
		var url = "/inventory/payment/list?type="+type+"&field="+field+"&keyword="+keyword+"&from_date="+from_date+"&to_date="+to_date+"&count="+count;
		$(location).attr("href", url);
	}});
	$("#isapprove").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":80, "ireadonly":true, "iblur":function(selected){
		var count = $("#count").val();
		var type = $("#type").val();
		var isapprove = selected.val();
		var field = $("#field").val();
		var keyword = $("#keyword").val();
		var from_date = $("#from_date").val();
		var to_date = $("#to_date").val();
		var url = "/inventory/payment/list?type="+type+"&field="+field+"&keyword="+keyword+"&from_date="+from_date+"&to_date="+to_date+"&count="+count+"&isapprove="+isapprove;
		$(location).attr("href", url);
	}});
	$("#field").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":80, "ireadonly":true, "iblur":function(selected){
		var field = selected.val();
		var prefield = $("#prefield").val();
		if(prefield == field) {
			return ;
		}
		if(field == "name" || field == "bank_name") {
			$("#keyword").val("");
			$("#from_date").val("");
			$("#to_date").val("");
			$("#searchByKeyword").show();
			$("#searchByDate").hide();
		} else if(field == "request_date") {
			$("#keyword").val("");
			$("#from_date").val("");
			$("#to_date").val("");
			$("#searchByKeyword").hide();
			$("#searchByDate").show();
		}
		$("#prefield").val(field);
	}});
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
		$("#searchByKeyword").show();
		$("#searchByDate").hide();
	} else if(field == "request_date") {
		$("#searchByKeyword").hide();
		$("#searchByDate").show();
	}
	$("input[type='radio'], input[type='checkbox']").labelauty({ class:"chkradio_nolabel", label:false });
	$("#checkall").on("click", function() {
		var chk = $(this).is(":checked");
		if(chk) {
			$("input[name=check_no]:checkbox").prop("checked", true);
		} else {
			$("input[name=check_no]:checkbox").prop("checked", false);
		}
	});
	$(".tooltip").tooltipster({
		animation:'fade',
		delay:200,
		theme:'tooltipster-light',
		trigger:'click',
		side:'left'
	});
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
	setDatePicker("#request_date");
	setDatePicker("#due_date");
	setNumberEvent("#bank_account");
	setNumberEvent("#jumin1");
	setNumberEvent("#jumin2");
	$("#type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
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
	setDatePicker("#request_date");
	setDatePicker("#due_date");
	setNumberEvent("#bank_account");
	setNumberEvent("#jumin1");
	setNumberEvent("#jumin2");
	$("#type").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "iwidth":100, "ireadonly":true });
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
		alert(t("inventory.input.returnreason"));
		$("#reject_memo").focus();
		return false;
	}
}

function checkInventoryPaymentInput() {
	if(isNull($("#manager").val())) {
		alert(t("inventory.input.members"));
		$("#manager").focus();
		return false;
	}
	if(isNull($("#request_date").val())) {
		alert(t("inventory.input.applyday"));
		$("#request_date").focus();
		return false;
	}
	if(isNull($("#memo").val())) {
		alert(t("inventory.input.spenditem"));
		$("#memo").focus();
		return false;
	}
	if(isNull($("#name").val())) {
		alert(t("inventory.input.member"));
		$("#name").focus();
		return false;
	}
	if(isNull($("#bank_name").val())) {
		alert(t("inventory.input.bank"));
		$("#bank_name").focus();
		return false;
	}
	if(isNull($("#bank_account").val())) {
		alert(t("inventory.input.account"));
		$("#bank_account").focus();
		return false;
	}
	if(isNull($("#bank_user").val())) {
		alert(t("inventory.input.accountnames"));
		$("#bank_user").focus();
		return false;
	}
	if(isNull($("#bank_withdraw_content").val())) {
		alert(t("inventory.input.spendaccountitem"));
		$("#bank_withdraw_content").focus();
		return false;
	}
	if(isNull($("#bank_deposit_content").val())) {
		alert(t("inventory.input.accountitem"));
		$("#bank_deposit_content").focus();
		return false;
	}
	if(isNull($("#money").val())) {
		alert(t("inventory.input.spend"));
		$("#money").focus();
		return false;
	}
	var type = parseInt($("#type").val());
	if(type == 0) {
		if(isNull($("#jumin1").val())) {
			alert(t("inventory.input.reginum"));
			$("#jumin1").focus();
			return false;
		}
		if(isNull($("#jumin2").val())) {
			alert(t("inventory.input.reginum"));
			$("#jumin2").focus();
			return false;
		}
	} else if(type == 2) {
		if(isNull($("#due_date").val())) {
			alert(t("reservation.input.schedule"));
			$("#due_date").focus();
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
		alert(t("inventory.input.payapply"));
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
		alert(t("inventory.input.request"));
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
		alert(t("inventory.input.payapply"));
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
		alert(t("inventory.input.request"));
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

function addInventoryPaymentExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInventoryPaymentInput() == false) {
		return false;
	}
	var data = new FormData();
	if($("#ufile").val()) {
		var file = $("#ufile")[0].files[0];
		data.append("file", file);
	}
	data.append("manager", $("#manager").val());
	data.append("request_date", $("#request_date").val());
	data.append("type", $("#type").val());
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
				alert(t("system.added"));
				$(location).attr("href", "/inventory/payment/list");
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
	if($("#ufile").val()) {
		var file = $("#ufile")[0].files[0];
		data.append("file", file);
	}
	data.append("manager", $("#manager").val());
	data.append("request_date", $("#request_date").val());
	data.append("type", $("#type").val());
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
				alert(t("system.edited"));
				$(location).attr("href", "/inventory/payment/list");
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
				alert(t("app.del"));
				$(location).attr("href", "/inventory/payment/list");
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
			bno : bno
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


