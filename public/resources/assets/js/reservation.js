var room_grade = null;
var room_grade_price = null;
var room_list = null;
var room_no_list = [];
var reservation_id_list = {};
var pre_bar_id_list = [];
var sub_id_list = {};
var bar_from_date_list = {};
var bar_to_date_list = {};
var context_data = null;
var bno = 0;
var monthOption = {
		Button: false,
		MonthFormat: "yy-mm",
		i18n: {
			year: t("balance.year"),
			prevYear: t("balance.pastyear"),
			nextYear: t("balance.nextyear"),
			next12Years: t("balance.pastdozen"),
			prev12Years: t("balance.nextdozen"),
			nextLabel: t("balance.next"),
			prevLabel: t("reservation.back"),
			buttonText: t("reservation.select.month"),
			jumpYears: t("reservation.process.moveyear"),
			backTo: t("balance.back"),
			months: [t("balance.january"), t("balance.february"), t("balance.march"), t("balance.april"), t("balance.may"), t("balance.june"), t("balance.july"), t("balance.august"), t("balance.september"), t("balance.october"), t("balance.november"), t("balance.december")]
		}
};

function backUserList() {
	var url = "/user/list";
	$(location).attr("href", url);
}

function viewUserList() {
	layer_open("userlist_layer", "fade", true);
}

function hideUserList() {
	layer_close("userlist_layer", "fade");
}

function viewExcelDownload() {
	var excelDownload = $('#excel-download-template').html();
    var excelDownload = co.download(excelDownload,function(){
    	downloadAesthetic();
    });
    

    $(".excel-download.ui-dialog-content.ui-widget-content #download_year").change( function(){
    	$("#download_year").val($(this).val());
    });
    $(".excel-download.ui-dialog-content.ui-widget-content #download_month").change( function(){
    	$("#download_month").val($(this).val());
    });
    

    return false;
}

function hideExcelDownload() {
	layer_close("aesthetic_layer", "fade");
}

function viewCounselList() {
	layer_open("counsellist_layer", "fade", true);
}

function hideCounselList() {
	layer_close("counsellist_layer", "fade");
}

function viewGonguList() {
	layer_open("gongulist_layer", "fade", true);
	getGonguList(1, 0);
}

function hideGonguList() {
	layer_close("gongulist_layer", "fade");
}

function viewCreateGonguCode() {
	$("#v_room_grade").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true, "layerId":"gongucode_layer"});
	$("#people").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true, "layerId":"gongucode_layer"});
	layer_open("gongucode_layer", "fade", true);
}

function hideCreateGonguCode() {
	layer_close("gongucode_layer", "fade");
}

function viewChangeRoom(r_no, r_room_no, r_reservation_room_no, fdate, tdate, issetup) {
	if(issetup == 0) {
		co.alert(t("reservation.error.moves"));
		return ;
	}
	
	var layer = $('.move-room').html();
    co.layer(layer,function(el){
        co.datepicker();
        
        getRoomInfoByOption(1);
    	$("#reservation_no_p", el).val(r_no);
    	$("#reservation_room_no_p", el).val(r_reservation_room_no);
    	$("#room_o", el).val(r_room_no);
    	$("#from_date_p", el).val(fdate);
    	$("#to_date_p", el).val(tdate);
    	$("#from_date_o", el).val(fdate);
    	$("#to_date_o", el).val(tdate);
    	$("#room_p", el).empty();
    	var contents = "<option value='----'>----</option>";
    	$("#room_p", el).append(contents);
    	$("#room_grade_p", el).val("----");
    	$("#room_grade_p", el).bind('change', function (){
    		var grade_no = $(this).val();
    		if(grade_no == "----") {
    			return false;
    		}
    		selectRoomGradeByGrade(grade_no);
    	});
    	
        $(el).on('submit','form',function(){
        	changeRoom();
            return false;
        })
    });
    
}

function hideChangeRoom() {
	$("#mask_popup4").hide();
	$("#div_loading4").hide();
}

function viewChangeContract(r_no, contract_date) {
	
	var layer = $('.modify-contract-date').html();
	
    co.layer(layer,function(el){
        co.datepicker();
        $("#reservation_no_c", el).val(r_no);
    	$("#contract_date", el).val(contract_date);
    	
        $(el).on('submit','form',function(){
        	changeContract();
            return false;
        })
    });
}

function hideChangeContract() {
	$("#mask_popup5").hide();
	$("#div_loading5").hide();
}

function viewSleepReservation(reservation_no, issetup, name, from_date, to_date, real_money, remain_money) {
	if(issetup != 0) {
		co.alert(t("reservation.process.resevegiveup"));
		
		return false;
	}
	
	var layer = $('.contract-abandon').html();
    co.layer(layer,function(el){
    	$("#sl_reservation_no").val(reservation_no);
    	$("#sl_issetup").val(issetup);
    	$("#sl_name").text(name);
    	var from_to = from_date + " ~ " + to_date;
    	$("#sl_from_to").text(from_to);
    	$("#sl_org_from_date").val(from_date);
    	$("#sl_org_to_date").val(to_date);
    	$("#sl_realmoney").text(comma(real_money) + t("reservation.won"));
    	$("#sl_remain").text(comma(remain_money) + t("reservation.won"));
    	var payment = parseInt(real_money) - parseInt(remain_money);
    	$("#sl_payment").text(comma(payment) + t("reservation.won"));
    	$("#sl_org_payment").val(payment);
    	setMoneyCommaEvent("#sl_refund");
    	
        co.datepicker();
        $(el).on('submit','form',function(){
        	sleepReservation();
            return false;
        })
    });
	
}

function viewDeleteReservation(name, reservation_no, from_date, to_date, real_money) {
	var layer = $('.delete-reserve').html();
    co.layer(layer,function(el){
    	$("#reservation_no_d", el).val(reservation_no);
    	$("#name_d", el).text(name);
    	$("#period_d", el).text(from_date + " ~ " + to_date);
    	$("#realmoney_d", el).text(comma(real_money));
    	
    	co.datepicker();
        
        $(el).on('submit','form',function(){
			deleteReservation(reservation_no);
            return false;
        })
    });
	
}

function addUser() {
	$(location).attr("href", "/user/add");
}

function modifyReservation(reservation_no) {
	var url = "/reservation/modify?reservation_no=" + reservation_no;
	$(location).attr("href", url);
}

function viewReservation(reservation_no) {
	var url = "/reservation/view?reservation_no=" + reservation_no;
	$(location).attr("href", url);
}

function addReservation() {
	$(location).attr("href", "/reservation/add");
}

function checkInputConfirm() {
	let payMoneyCheck = $("#paylist").val();
	if(payMoneyCheck != undefined){
		payMoneyCheck = JSON.parse(payMoneyCheck);
		for(var i=0; i<payMoneyCheck.length; i++) {
			let money = $("#payment_" + payMoneyCheck[i]).val();
			if(money == 0){
				alert(t("reservation.pay.money"));
				$("#payment_"+payMoneyCheck[i]).focus();
				return false;
			};
		};	
	}
	
	var reservation_no = 0;
	if($("#reservation_no").length) {
		reservation_no = parseInt($("#reservation_no").val());
	}
	var room_grade_no = $("#room_grade_no").val();
	if(!$("#noroom").length || $("#room_" + room_grade_no).length) {
		;
	} else {
		if($("#room").length) {
			var room = $("#room").val();
			if(room == "----") {
				alert(t("reservation.select.room"));
				return false;
			}
		} else {
			alert(t("reservation.error.noroom"));
			return false;
		}
	}
//	var noroom = $("#noroom").val();
//	var room_grade_no = $("#room_grade_no").val();
//	if($("#room_" + room_grade_no).length) {
//		noroom = 0;
//	} else {
//		alert("예약 가능한 객실이 없습니다.\n예약을 진행할 수 없습니다.");
//		return false;
//	}
//	if(parseInt(noroom) == 1) {
//		alert("예약 가능한 객실이 없습니다.\n예약을 진행할 수 없습니다.");
//		return false;
//	}
	var enable_code = parseInt($("#enable_code").val());
	if(enable_code == 0) {
		var message = $("#gongu_message").val() + t("reservation.error.process");
		alert(message);
		return false;
	}
	var pay_method = $("#pay_method").val();
	if(pay_method == 'cash') {
//		if(isNull($("#payment_0").val())) {
//			alert("실제 결제 금액을 입력해주세요.");
//			return false;
//		}
//	} else {
		var pay_count = parseInt($("#pay_count").val());
		pay_count = pay_count + 1;
		for(var i=0; i<pay_count; i++) {
			if($("#payment_"+i).length) {
				if(isNull($("#payment_"+i).val())) {
					alert(t("reservation.input.nopay"));
					return false;
//				} else {
//					var p = parseInt($("#payment_"+i).val());
//					if(p <= 0) {
//						alert("결제금액이 0원 이하인 항목이 있습니다.");
//						return false;
//					}
				}
			}
		}
	}
	var issetup = parseInt($("#issetup").val());
	if(issetup == 0) {
		if(pay_method == 'cashcard' || pay_method == 'card') {
			var cash_count = 0, card_count = 0;
			var paylist = $("#paylist").val();
			paylist = JSON.parse(paylist);
			for(var i=0; i<paylist.length; i++) {
				var oneid = paylist[i];
				var pmethod = $("#pay_method_" + oneid).val();
				if(pmethod == 'card') {
					card_count = card_count + 1;
				} else if(pmethod == 'cash') {
					cash_count = cash_count + 1;
				}
			}
			if(pay_method == 'cashcard' && cash_count == 0) {
				alert(t("reservation.notappointcash"));
				return false;
			}
			if(pay_method == 'card' && cash_count > 0 && reservation_no == 0) {
				alert(t("reservation.card.notcash"));
				return false;
			}
			if(card_count == 0) {
				alert(t("reservation.card.notpay"));
				return false;
			}
		}
	}
	var pay_type = $("#pay_type").val();
	var remain_money = parseInt($("#remain_money").val());
	if(remain_money < 0) {
		alert(t("reservation.balancezero"));
		return false;
	}
	var issetup = parseInt($("#issetup").val());
	if(issetup == 1) {
		if(remain_money != 0) {
			alert(t("reservation.balance.zero"));
			return false;
		}
	} else {
		if(pay_type == 'full') {
			if(remain_money != 0) {
				alert(t("reservation.zeropay"));
				return false;
			}
		} else {
			;
//			if(remain_money <= 0) {
//				alert("계약금 선납일 경우 잔액은 0원 이상이어야 합니다.");
//				return false;
//			}
		}
	}
	return true;
}

function checkInput() {

	var reservation_no = 0;
	if($("#reservation_no").length) {
		reservation_no = parseInt($("#reservation_no").val());
	}
	var shopid = "";
	var isjoin = -1;
	if($("input:radio[name='isjoin']").length) {
		shopid = $("#shopid").val();
		isjoin = parseInt($("input:radio[name='isjoin']:checked").val());
		if(isjoin == 0 || isjoin == 1) {
			;
		} else {
			alert(t("reservation.select.membership"));
			return false;
		}

	}
	if(isNull($("#name").val())) {
		alert(t("center.inputname"));
		$("#name").focus();
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
	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		var birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
		if( isValidDate(birth) == false ) {
			alert(t("reservation.mom.wrongbirth"));
			return false;
		}
	}
	if(isNull($("#pbirthy").val()) == false && isNull($("#pbirthm").val()) == false && isNull($("#pbirthd").val()) == false) {
		var pbirth = $("#pbirthy").val() + "-" + $("#pbirthm").val() + "-" + $("#pbirthd").val();
		if( isValidDate(pbirth) == false ) {
			alert(t("reservation.guardian.wrongbirth"));
			return false;
		}
	}
	if(isNull($("#due_date").val())) {
		alert(t("reservation.schedule.day"));
		return false;
	}
	if( isValidDate($("#due_date").val()) == false ) {
		alert(t("counsel.wrong.scheduledays"));
		return false
	}
	if(isNull($("#hospital").val())) {
		alert(t("reservation.schedule.hospital"));
		return false;
	}
//	if(isNull($("#jumin1").val())) {
//		alert("주민등록번호를 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#jumin2").val())) {
//		alert("주민등록번호를 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#zipcode").val())) {
//		alert("주소를 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#addr").val())) {
//		alert("주소를 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#pname").val())) {
//		alert(t("center.inputname"));
//		return false;
//	}
//	if(isNull($("#pbirth").val())) {
//		alert("생일을 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#pjob").val())) {
//		alert("직업을 입력해주세요.");
//		return false;
//	}
//	if(isNull($("#pphone").val())) {
//		alert(t("reservation.phone.num"));
//		return false;
//	}
	if(isNull($("#massage_pre_count").val())) {
		alert(t("reservation.input.beforemassage"));
		return false;
	}
	if(isNull($("#massage_post_count").val())) {
		alert(t("reservation.input.aftermassage"));
		return false;
	}
	if($("#room_grade").val() == "----") {
		alert(t("reservation.select.grade"));
		return false;
	}
	if($("#room").val() == "----") {
		alert(t("reservation.select.room"));
		return false;
	}
	if($("#period").val() == "----") {
		alert(t("reservation.select.term"));
		return false;
	}
	var reservation_room_count = parseInt($("#reservation_room_count").val());
	if(reservation_room_count == 0) {
		if(isNull($("#from_date").val())) {
			alert(t("reservation.start"));
			return false;
		}
		if( isValidDate($("#from_date").val()) == false ) {
			alert(t("reservation.error.wrongday"));
			return false
		}
		if(isNull($("#to_date").val())) {
			alert(t("reservation.input.end"));
			return false;
		}
		if( isValidDate($("#to_date").val()) == false ) {
			alert(t("reservation.error.wrongend"));
			return false
		}
	}
	if($("#period").val() == "----") {
		alert(t("reservation.select.term"));
		return false;
	}
	if($("#contract_date").val() == "----") {
		alert(t("reservation.select.contractday"));
		return false;
	}
	if(reservation_no > 0) {
		var reservation_room_count = parseInt($("#reservation_room_count").val());
		if(reservation_room_count > 1) {
			var roomlist = $("#roomlist").val();
			roomlist = JSON.parse(roomlist);
			for(var i=0; i<roomlist.length; i++) {
				var idx = roomlist[i];
				var room_grade_no = $("#room_grade_rv_" + idx).val();
				var room_no = $("#room_rv_" + idx).val();
				var from_date = $("#from_date_rv_"+idx).val();
				var to_date = $("#to_date_rv_"+idx).val();
				if(room_grade_no == null) {
					alert(t("reservation.select.grade"));
					return false;
				}
				if(room_no == null || room_no == '----') {
					alert(t("reservation.select.room"));
					return false;
				}
				if(isNull(from_date)) {
					alert(t("reservation.input.enterday"));
					return false;
				}
				if(isNull(to_date)) {
					alert(t("reservation.inputexit"));
					return false;
				}
				if(isValidDate(from_date) == false) {
					alert(t("reservation.error.invailidenter"));
					return false;
				}
				if(isValidDate(to_date) == false) {
					alert(t("reservation.exitnotvalid"));
					return false;
				}
				var diff = calDateRange(from_date, to_date);
				if(diff <= 0) {
					alert(t("reservation.exitenter"));
					return false;
				}
			}
		} else {
			var from_date = $("#from_date_rv_0").val();
			var to_date = $("#to_date_rv_0").val();
			var diff = calDateRange(from_date, to_date);
			if(diff <= 0) {
				alert(t("reservation.exitenter"));
				return false;
			}
		}
	}
	return true;
}

function exitConfirmReservation() {
	alert("abc");  // alert은 막혀있음
};

function checkDuplication() {
	if(checkform() == false) {
		return false;
	}
	
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInputConfirm() == false) {
		return false;
	}
	var phone = $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
	var pphone = $("#pphone1").val() + "-" + $("#pphone2").val() + "-" + $("#pphone3").val();
	if(pphone == "--") {
		pphone = "";
	}
	
	var data = new FormData();
	var fileSize = $(".file-field").size();
	var fileCount = 0;
	for(var i=0; i<fileSize; i++){
		if($(".ufile")[i].files[0] != undefined){
			var file = $(".ufile")[i].files[0];
			data.append("file", file);
			fileCount += 1;	
		};
	};
	data.append("file_count", fileCount);
	
	let agreeFileSize = $(".agree-file-field").size();
	for(var i=0; i<agreeFileSize; i++){
		if($("#agree_file")[i].files[0] != undefined){
			var file = $("#agree_file")[i].files[0];
			data.append("agreeFile", file);
		};
	};
	
	data.append("name", $("#name").val());
	data.append("due_date", $("#due_date").val());
	data.append("phone", phone);
	data.append("bno", bno);
	
	
	
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: data,
		traditional: true,
		contentType: false,
		processData: false,
		cache: false,
		url: '/reservation/checkdup',
		error: function() {
			alert(t("reservation.error.cantreserve"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				confirmReservationExe();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else if(parseInt(status.code) == 20747) {
					alert(t("reservation.error.checkreserve"));
				} else {
					alert(t("reservation.cantreserve"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function checkform() {
	if(isNull($("#name").val())) {
		alert(t("center.inputname"));
		$("#name").focus();
		return false;
	} else if($("#phone1").val() == undefined){
		$("#phone1").val().foucus();
		return false;
	}
	if(isNull($("#phone1").val())) {
		alert(t("reservation.phone.num"));
		$("#phone1").focus();
		return false;
	}
	if(isNull($("#phone2").val())) {
		alert(t("reservation.phone.num"));
		$("#phone2").focus();
		return false;
	}
	if(isNull($("#phone3").val())) {
		alert(t("reservation.phone.num"));
		$("#phone3").focus();
		return false;
	}
	if($.isNumeric($("#phone1").val()) == false) {
		alert(t("manage.only.phonenum"))
		$("#phone1").focus();
		return false;
	}
	if($.isNumeric($("#phone2").val()) == false) {
		alert(t("manage.only.phonenum"))
		$("#phone2").focus();
		return false;
	}
	if($.isNumeric($("#phone3").val()) == false) {
		alert(t("manage.only.phonenum"))
		$("#phone3").focus();
		return false;
	}
	if(isNull($("#due_date").val())) {
		alert(t("reservation.schedule.day"));
		$("#due_date").focus();
		return false;
	}
	if( isValidDate($("#due_date").val()) == false ) {
		alert(t("counsel.wrong.scheduledays"));
		$("#due_date").focus();
		return false
	}
	if(isNull($("#hospital").val())) {
		alert(t("reservation.schedule.hospital"));
		$("#hospital").focus();
		return false;
	}
	if(isNull($("#massage_pre_count").val())) {
		alert(t("reservation.input.beforemassage"));
		$("#massage_pre_count").focus();
		return false;
	}
	if(isNull($("#massage_post_count").val())) {
		alert(t("reservation.input.aftermassage"));
		$("#massage_post_count").focus();
		return false;
	}
	if($("#room_grade").val() == "----") {
		alert(t("reservation.select.grade"));
		$("#room_grade").focus();
		return false;
	}
	if($("#period").val() == "----") {
		alert(t("reservation.select.term"));
		$("#period").focus();
		return false;
	}
	if($("#room").val() == "----") {
		alert(t("reservation.select.room"));
		$("#room").focus();
		return false;
	}
	return true;	
}

function confirmReservationExe() {
	if(checkInput() == false) {
		return false;
	}
	var reservation_no = 0;
	if($("#reservation_no").length) {
		reservation_no = $("#reservation_no").val();
	}
	var issetup = 0;
	if($("#issetup").length) {
		issetup = $("#issetup").val();
	}
	var reservation_room_count = 0;
	var reservation_room_no_list = new Array();
	var room_grade_no_list = new Array();
	var room_grade_name_list = new Array();
	var room_no_list = new Array();
	var room_name_list = new Array();
	var from_date_list =  new Array();
	var to_date_list = new Array();
	var room = 0;
	if($("#reservation_room_count").length) {
		reservation_room_count = $("#reservation_room_count").val();
		if(reservation_room_count > 0) {
			var roomlist = $("#roomlist").val();
			roomlist = JSON.parse(roomlist);
			for(var i=0; i<roomlist.length; i++) {
				var idx = roomlist[i];
				var room_grade_no = $("#room_grade_rv_" + idx).val();
				var room_grade_name = $("#room_grade_rv_" + idx +" option:selected").text();
				var room_no = $("#room_rv_" + idx).val();
				var room_name = $("#room_rv_" + idx +" option:selected").text();
				var from_date = $("#from_date_rv_"+idx).val();
				var to_date = $("#to_date_rv_"+idx).val();
				room_grade_no_list[i] = room_grade_no;
				room_grade_name_list[i] = room_grade_name;
				room_no_list[i] = room_no;
				room_name_list[i] = room_name;
				from_date_list[i] = from_date;
				to_date_list[i] = to_date;
			}
		}
	} else {
		room = $("#room").val();
	}
	var birth = "";
	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
	}
	var pbirth = "";
	if(isNull($("#pbirthy").val()) == false && isNull($("#pbirthm").val()) == false && isNull($("#pbirthd").val()) == false) {
		pbirth = $("#pbirthy").val() + "-" + $("#pbirthm").val() + "-" + $("#pbirthd").val();
	}
	var fromDate = "";
	if($("#from_date").length) {
		fromDate = $("#from_date").val();
	}
	var toDate = "";
	if($("#to_date").length) {
		toDate = $("#to_date").val();
	}
	var orgGonguCode = "";
	if($("#org_gongu_code").length) {
		orgGonguCode = $("#org_gongu_code").val();
	}
	var shopid = "";
	var isjoin = -1;
	if($("input:radio[name='isjoin']").length) {
		shopid = $("#shopid").val();
		isjoin = parseInt($("input:radio[name='isjoin']:checked").val());
	}
	var args = {
			reservation_no : reservation_no,
			shopid : shopid,
			isjoin : isjoin,
			user_no : $("#user_no").val(),
			name : $("#name").val(),
			birth : birth,
			phone1 : $("#phone1").val(),
			phone2 : $("#phone2").val(),
			phone3 : $("#phone3").val(),
			job : $("#job").val(),
//			jumin1 : $("#jumin1").val(),
//			jumin2 : $("#jumin2").val(),
			zipcode : $("#zipcode").val(),
			address : $("#addr").val(),
			address_jibun : $("#addr_jibun").val(),
			address_detail : $("#addr2").val(),
			due_date : $("#due_date").val(),
			hospital : $("#hospital").val(),
			birth_count : $("#birth_count").val(),
			revisit : $("#revisit").val(),
			baby : $("#baby").val(),
			pname : $("#pname").val(),
			pbirth : pbirth,
			pphone1 : $("#pphone1").val(),
			pphone2 : $("#pphone2").val(),
			pphone3 : $("#pphone3").val(),
			pjob : $("#pjob").val(),
			room_grade_no : $("#room_grade").val(),
			room_grade_name : $("#room_grade option:selected").text(),
			room : $("#room").val(),
			room_name : $("#room option:selected").text(),
			period : $("#period option:selected").text(),
			from_date : fromDate,
			to_date : toDate,
			pre_from : $("#pre_from").val(),
			pre_to : $("#pre_to").val(),
			gongu_code : $("#gongu_code").val(),
			org_gongu_code : orgGonguCode,
			revisit : $("#revisit").val(),
			pay_method : $("input:radio[name='pay_method']:checked").val(),
			massage_pre_count : uncomma($("#massage_pre_count").val()),
			massage_post_count : uncomma($("#massage_post_count").val()),
			pay_type : $("input:radio[name='pay_type']:checked").val(),
			counsel_no : $("#counsel_no").val(),
			counsel : $("#counsel").val(),
			manager_no : $("#manager_no").val(),
			manager_name : $("#manager_name").val(),
			counsel_cdate : $("#counsel_cdate").val(),
			gongu_code : $("#gongu_code").val(),
			pay_method : $("input:radio[name='pay_method']:checked").val(),
			total_money : uncomma($("#total_money").val()),
			real_money : uncomma($("#real_money").val()),
			issetup : issetup,
			reservation_room_count : reservation_room_count,
			reservation_room_no_list : reservation_room_no_list,
			room_grade_no_list : room_grade_no_list,
			room_grade_name_list : room_grade_name_list,
			room_no_list : room_no_list,
			room_name_list : room_name_list,
			from_date_list : from_date_list,
			to_date_list : to_date_list,
			pay_count : $("#pay_count").val(),
			contract_date : $("#contract_date").val(),
			aesthetic_no : $("#aesthetic_no").val()
	};
	
	var data = new FormData();
	let agreeFileSize = $(".agree-file-field").size();
	var fileSize = $(".file-field").size();
	var fileCount = 0;
	
	for(var i=0; i<agreeFileSize; i++){
		if($("#agree_file")[i].files[0] != undefined){
			var file = $("#agree_file")[i].files[0];
			data.append("agreeFile", file);
		};
	};
	for(var i=0; i<fileSize; i++){
		if($(".ufile")[i].files[0] != undefined){
			var file = $(".ufile")[i].files[0];
			data.append("file", file);
			fileCount += 1;	
		};
	};
	data.append("file_count", fileCount);
	data.append("bno", $("#bno").val());
	
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: false,
		dataType: 'json',
		data: data,
		traditional: true,
		contentType: false,
		processData: false,
		cache: false,
		url: '/reservation/modifyupload',
		error: function() {
			alert(t("reservation.error.cantreserve"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else if(parseInt(status.code) == 20747) {
					alert(t("reservation.error.checkreserve"));
				} else {
					alert(t("reservation.cantreserve"));
				}
			}
			hideLoadingLayer();
		}
	});
	
	$.redirectPost('/reservation/confirm', args);
}


function addReservationExe() {
	$("#exitPage").val("0");
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInputConfirm() == false) {
		return false;
	}
	var room_grade_no = $("#room_grade_no").val();
	var room = null;
	if($("#room_" + room_grade_no).length) {
		room = $("#room_" + room_grade_no).val();
	} else {
		room = $("#room").val();
	}
	var birth = "";
	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
	} else {
		if($("#birth").length) {
			birth = $("#birth").val();
		}
	}
	var pbirth = "";
	if(isNull($("#pbirthy").val()) == false && isNull($("#pbirthm").val()) == false && isNull($("#pbirthd").val()) == false) {
		pbirth = $("#pbirthy").val() + "-" + $("#pbirthm").val() + "-" + $("#pbirthd").val();
	} else {
		if($("#pbirth").length) {
			pbirth = $("#pbirth").val();
		}
	}
	var shopid = "";
	var isjoin = -1;
	if($("#isjoin").length) {
		shopid = $("#shopid").val();
		isjoin = parseInt($("#isjoin").val());
	}
	var phone = $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
	var pphone = $("#pphone1").val() + "-" + $("#pphone2").val() + "-" + $("#pphone3").val();
	if(pphone == "--") {
		pphone = "";
	}
	var email = $("#email1").val() + "@" + $("#email2").val();
	var param = {
			shopid : shopid,
			isjoin : isjoin,
			user_no : $("#user_no").val(),
			name : $("#name").val(),
			birth : birth,
			phone : phone,
			job : $("#job").val(),
			zipcode : $("#zipcode").val(),
			address : $("#addr").val(),
			address_jibun : $("#addr_jibun").val(),
			address_detail : $("#addr_detail").val(),
			due_date : $("#due_date").val(),
			hospital : $("#hospital").val(),
			birth_count : $("#birth_count").val(),
			revisit : $("#revisit").val(),
			baby : $("#baby").val(),
			pname : $("#pname").val(),
			pbirth : pbirth,
			pphone : pphone,
			pjob : $("#pjob").val(),
			room_grade_no : room_grade_no,
			room : room,
			period : $("#period").val(),
			from_date : $("#from_date").val(),
			to_date : $("#to_date").val(),
			gongu_code : $("#gongu_code").val(),
			revisit : $("#revisit").val(),
			massage_pre_count : uncomma($("#massage_pre_count").val()),
			massage_post_count : uncomma($("#massage_post_count").val()),
			pay_type : $("#pay_type").val(),
			counsel_no : $("#counsel_no").val(),
			counsel : $("#counsel").val(),
			manager_no : $("#manager_no").val(),
			manager_name : $("#manager_name").val(),
			counsel_cdate : $("#counsel_cdate").val(),
			gongu_code : $("#gongu_code").val(),
			pay_method : $("#pay_method").val(),
			total_money : uncomma($("#total_money").val()),
			real_money : uncomma($("#real_money").val()),
			remain_money : $("#remain_money").val(),
			discount : $("#discount").val(),
			contract_date : $("#contract_date").val(),
			bno : bno,
			email : email
	};
	var pay_count = parseInt($("#m_pay_count").val());
	pay_count = pay_count + 1;
	var paylist = $("#paylist").val();
	paylist = JSON.parse(paylist);
	for(var i=0; i<paylist.length; i++) {
		var oneid = paylist[i];
		var typeid = "pay_type_" + oneid;
		var timeid = "inserttime_" + oneid;
		var methodid = "pay_method_" + oneid;
		var paymentid = "payment_" + oneid;
		if($("#" + paymentid).is(":visible")) {
			var type = $("#" + typeid).val();
			var time = $("#" + timeid).val();
			var method = $("#" + methodid).val();
			var payment = uncomma($("#" + paymentid).val());
			param[typeid] = type;
			param[timeid] = time;
			param[methodid] = method;
			param[paymentid] = payment;
		}
	}
	param["pay_count"] = pay_count;
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: param,
		traditional: true,
		url: '/reservation/addexe',
		error: function() {
			alert(t("reservation.error.cantreserve"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				alert(t("reservation.reserved"));
				var url = "/reservation/list?search_condition=bydate&from_date="+$("#from_date").val()+"&to_date="+$("#to_date").val()+"&room_grade_no=all";
				$(location).attr("href", url);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					/*alert(t("reservation.cantreserve"));*/
					hideLoadingLayer();
				}
			}
		}
	});
}

function viewCanceledReservation() {
	$(location).attr("href", "/reservation/list/canceled");
}

function addReservationExit() {
	$(location).attr("href", "/reservation/list");
}

function modifyReservationExe() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	if(checkInputConfirm() == false) {
		return false;
	}
	var reservation_room_count = 0;
	var reservation_room_no_list = new Array();
	var room_grade_no_list = new Array();
	var room_grade_name_list = new Array();
	var room_no_list = new Array();
	var room_name_list = new Array();
	var from_date_list =  new Array();
	var to_date_list = new Array();
	if($("#reservation_room_count").length) {
		reservation_room_count = $("#reservation_room_count").val();
		if(reservation_room_count > 0) {
			for(var i=0; i<reservation_room_count; i++) {
				var reservation_room_no = $("#reservation_room_" + i).val();
				var room_grade_no = $("#room_grade_rv_" + i).val();
				var room_grade_name = $("#room_grade_rv_name_" + i).val();
				var room_no = $("#room_rv_" + i).val();
				var room_name = $("#room_rv_name_" + i).val();
				var from_date = $("#from_date_rv_" + i).val();
				var to_date = $("#to_date_rv_" + i).val();
				if( isValidDate(from_date) == false ) {
					alert(t("reservation.error.wrongstart"));
					return false
				}
				if( isValidDate(to_date) == false ) {
					alert(t("reservation.error.wrongends"));
					return false
				}
				reservation_room_no_list[i] = reservation_room_no;
				room_grade_no_list[i] = room_grade_no;
				room_grade_name_list[i] = room_grade_name;
				room_no_list[i] = room_no;
				room_name_list[i] = room_name;
				from_date_list[i] = from_date;
				to_date_list[i] = to_date;
			}
		}
	}
	var birth = "";
	if(isNull($("#birthy").val()) == false && isNull($("#birthm").val()) == false && isNull($("#birthd").val()) == false) {
		birth = $("#birthy").val() + "-" + $("#birthm").val() + "-" + $("#birthd").val();
	} else {
		if($("#birth").length) {
			birth = $("#birth").val();
		}
	}
	var pbirth = "";
	if(isNull($("#pbirthy").val()) == false && isNull($("#pbirthm").val()) == false && isNull($("#pbirthd").val()) == false) {
		pbirth = $("#pbirthy").val() + "-" + $("#pbirthm").val() + "-" + $("#pbirthd").val();
	} else {
		if($("#pbirth").length) {
			pbirth = $("#pbirth").val();
		}
	}
	var shopid = "";
	var isjoin = -1;
	if($("#isjoin").length) {
		shopid = $("#shopid").val();
		isjoin = parseInt($("#isjoin").val());
	}
	var phone = $("#phone1").val() + "-" + $("#phone2").val() + "-" + $("#phone3").val();
	var pphone = $("#pphone1").val() + "-" + $("#pphone2").val() + "-" + $("#pphone3").val();
	if(pphone == "--") {
		pphone = "";
	}
	var param = {
			shopid : shopid,
			isjoin : isjoin,
			reservation_no : $("#reservation_no").val(),
			user_no : $("#user_no").val(),
			name : $("#name").val(),
			birth : birth,
			phone : phone,
			job : $("#job").val(),
			zipcode : $("#zipcode").val(),
			address : $("#addr").val(),
			address_jibun : $("#addr_jibun").val(),
			address_detail : $("#addr_detail").val(),
			due_date : $("#due_date").val(),
			hospital : $("#hospital").val(),
			birth_count : $("#birth_count").val(),
			revisit : $("#revisit").val(),
			baby : $("#baby").val(),
			pname : $("#pname").val(),
			pbirth : pbirth,
			pphone : pphone,
			pjob : $("#pjob").val(),
			room_grade_no : $("#room_grade_no").val(),
			room : $("#room").val(),
			period : $("#period").val(),
			from_date : $("#from_date").val(),
			to_date : $("#to_date").val(),
			gongu_code : $("#gongu_code").val(),
			revisit : $("#revisit").val(),
			massage_pre_count : uncomma($("#massage_pre_count").val()),
			massage_post_count : uncomma($("#massage_post_count").val()),
			pay_type : $("#pay_type").val(),
			counsel_no : $("#counsel_no").val(),
			counsel : $("#counsel").val(),
			manager_no : $("#manager_no").val(),
			manager_name : $("#manager_name").val(),
			counsel_cdate : $("#counsel_cdate").val(),
			gongu_code : $("#gongu_code").val(),
			pay_method : $("#pay_method").val(),
			total_money : uncomma($("#total_money").val()),
			real_money : uncomma($("#real_money").val()),
			payment : $("#payment").val(),
			remain_money : $("#remain_money").val(),
			discount : $("#discount").val(),
			issetup : $("#issetup").val(),
			reservation_room_count : reservation_room_count,
			reservation_room_no_list : reservation_room_no_list,
			room_grade_no_list : room_grade_no_list,
			room_grade_name_list : room_grade_name_list,
			room_no_list : room_no_list,
			room_name_list : room_name_list,
			from_date_list : from_date_list,
			to_date_list : to_date_list,
			contract_date : $("#contract_date").val(),
			aesthetic_no : $("#aesthetic_no").val(),
			bno : bno
	};
	var pay_count = parseInt($("#m_pay_count").val());
	pay_count = pay_count + 1;
	var paylist = $("#paylist").val();
	paylist = JSON.parse(paylist);
	for(var i=0; i<paylist.length; i++) {
		var oneid = paylist[i];
		var typeid = "pay_type_" + oneid;
		var timeid = "inserttime_" + oneid;
		var methodid = "pay_method_" + oneid;
		var paymentid = "payment_" + oneid;
		var memoid = "payment_memo_" + oneid;
		if($("#" + paymentid).is(":visible")) {
			var type = $("#" + typeid).val();
			var time = $("#" + timeid).val();
			var method = $("#" + methodid).val();
			var payment = uncomma($("#" + paymentid).val());
			var memo = $("#" + memoid).val();
			param[typeid] = type;
			param[timeid] = time;
			param[methodid] = method;
			param[paymentid] = payment;
			param[memoid] = memo;
		}
	}
	param["pay_count"] = pay_count;
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: param,
		traditional: true,
		url: '/reservation/modifyexe',
		error: function() {
			alert(t("discount.error.corrects"));
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				alert(t("system.edited"));
				$(location).attr("href", "/reservation/view?reservation_no=" + $("#reservation_no").val());
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
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

function modifyReservationExit() {
	$(location).attr("href", "/reservation/list");
}

function drawCalendar(today) {
	$("#calendar").fullCalendar({
		theme: true,
		locale: 'ko',
		timezone: 'local',
		header: {
			left: '',
			center: 'today prev title next',
			//right: 'month,listMonth'
			right: 'month'
		},
		views: {
			month: {titleFormat : 'YYYY MMMM'},
		},
		defaultTimedEventDuration: '00:30:00',
		nextDayThreshold: '00:00:00',
		firstDay: 1,
		defaultView: 'month',
		timeFormat: 'a h(:mm)',
		forceEventDuration: true,
		navLinks: false,		// can click day/week names to navigate views
		editable: false,	// disable event resizing and dragging
		eventLimit: true,	// allow "more" link when too many events
		defaultDate: today.format("isoDate"),
		nowIndicator: true,
		events: function(start, end, timezone, callback) {
			getMonthReservationSchedule(start, end, callback);
		},
		eventClick: function(event, jsEvent, view) {
			viewReservation(event.reservation_no);
		},
		eventRender: function(event, element, view) {
			var color = "black";
			var backgroundColor = "";
			
			if(event.type == 1){
				color = "red";
				backgroundColor = "white";  
				if(event.issetup == 9){
					backgroundColor = "#F3E7FF";  
				}
			} else if(event.type == 0) {
				color = "blue";
				backgroundColor = "white";  
				if(event.issetup == 1 || event.issetup == 9){
					backgroundColor = "#F3E7FF";  
				}
			}
			
			if(event.type == 0){
				if(event.issetup == 0){
					element.addClass('enterplan'); // 입실 예정
				} else if(event.issetup == 1){
					element.addClass('enterconfirm'); // 입실 확정
				}
			} else if(event.type == 1){
				if(event.issetup == 1){
					element.addClass('exitplan'); // 퇴실 예정
				} else if(event.issetup == 9){
					element.addClass('exitconfirm'); // 퇴실 확정
				} 	
			}
			
			element.css("color", color);
			element.css("background-color", backgroundColor);
			element.css("border", "0px");
			element.css("cursor", "pointer");
		},
	});
}

function initReservationCalendar() {
	$("#help_layer").hide();
	var today = new Date();
	drawCalendar(today);
}

function init() {
	$("#from_date").datepicker({
		dateFormat: "yy-mm-dd",
		onSelect:function(date, inst) {
			selectDate(date);
		},
		beforeShow: function() {
			setTimeout(function(){
				$('.ui-datepicker').css('z-index', 99999999999999);
			}, 0);
		}
	});
	setDatePicker("#to_date");
	$("#due_date").datepicker({
		dateFormat: "yy-mm-dd",
		beforeShow: function() {
	        setTimeout(function(){
	            $('.ui-datepicker').css('z-index', 99999999999999);
	        }, 0);
	    },
	    onSelect: function(d, i) {
	    	if(d !== i.lastVal) {
	    		$(this).change();
	    	}
	    }
	}).on("change", function() {
		var d = $("#due_date").val();
   		$("#from_date").val(d);
	});
	$("#room_grade").bind('change', function (){
		selectRoomGrade();
	});
//	$("#period").bind('change', function (){
//		selectPeriod();
//	});
}

function initConfirm() {
	$("#btn_help").hide();
	var pay_method = $("#pay_method").val();
	var reservation_no = parseInt($("#reservation_no").val());
	var paylist = [];
	if(reservation_no > 0) {
		var pay_count = parseInt($("#pay_count").val());
		pay_count = pay_count + 1;
		for(var i=0; i<pay_count; i++) {
			var id = "#payment_" + i;
			setKeyEvent(id, i);
			var iid = "#inserttime_" + i;
			setDatePicker(iid);
			paylist.push(i);
		}
	} else {
		setKeyEvent("#payment_0", 0);
		paylist.push(0);
	}
	$("#paylist").val( JSON.stringify(paylist) );
	$("#real_money").on('paste, keydown', function(e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var real_money = uncomma($("#real_money").val());
				if(real_money == "" || isNull(real_money)) {
					real_money = 0;
				}
				if($.isNumeric(real_money) == false) {
					alert(t("reservation.only.fund"));
//					$("#real_money").val($("#org_real_money").val());
					real_money = real_money.replace(/[^0-9]/g,'');
					$("#real_money").val(comma(real_money));
					return false;
				}
				real_money = parseInt(real_money, 10);
				var p = getAllPayment(-1, 0);
				var remain_money = parseInt(real_money) - parseInt(p);
				if(real_money > 0) {
					$("#real_money").val(comma(real_money));
				}
				$("#remain_money").val(remain_money);
				$("#remain_money_display").val(comma(remain_money));
			}
		}, 100);
	});
	if($("#mod_modify").length && parseInt($("#mod_modify").val()) != 1) {
		$("#remain_money_display").val(comma($("#remain_money").val()));
	}
	getRoomInfoByOption(2);
	if($("select[id='room_grade_no']").length) {
		$("#room_grade_no").bind('change', function(){ selectRoomGrade(); });
	}
	
}

function initAdd() {
	$("#btn_help").hide();
	$("#keyword").on('keyup', function (e){
		if(e.keyCode == 13){
			searchAddress();
		}
	});
	$("#user_name").on('keyup', function (e){
		if(e.keyCode == 13){
			searchUser();
		}
	});
	$("#birthy").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	$("#birthm").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	$("#birthd").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	$("#pbirthy").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	$("#pbirthm").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	$("#pbirthd").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, });
	$("#birth_count").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true });
	$("#revisit").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true });
	$("#baby").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true });
	$("#room_grade").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true, "iblur":selectRoomGrade });
	$("#period").combobox({"bcssClassName":"text", "bheight":27, "iheight":23, "ireadonly":true, "iblur":selectPeriod });
	$("#room").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true });
	$("#field").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true });
	setDatePicker("#contract_date");
	setDatePicker("#counsel_cdate");
	$("input[type='radio'], input[type='checkbox']").labelauty({ minimum_width:"100px", class:"chkradio" });
	if($("input:radio[name='isjoin']").length) {
		$("input:radio[name='isjoin']").on("click", function(){
			var isjoin = parseInt($("input:radio[name='isjoin']:checked").val());
			if(isjoin == 0) {
				$("#disp_id").hide();
			} else {
				$("#disp_id").show();
			}
		});
		var isjoin = parseInt($("input:radio[name='isjoin']:checked").val());
		if(isjoin == 0) {
			$("#disp_id").hide();
		} else {
			$("#disp_id").show();
		}
	} else {
		$("#disp_id").hide();
	}
	if($("#manager_no").length) {
		$("#manager_no").combobox({"bcssClassName":"text", "iwidth":100, "bheight":27, "iheight":23, "ireadonly":true, "iblur":selectManager});
		selectManager();
	}
	if($("#shopid_type").length) {
		$("#shopid_type").combobox({"bcssClassName":"text", "iwidth":100, "bheight":27, "iheight":23, "ireadonly":true, "iblur":selectShopid});
	}
	setPhoneEvent("#phone1");
	setPhoneEvent("#phone2");
	setPhoneEvent("#phone3");
	setPhoneEvent("#pphone1");
	setPhoneEvent("#pphone2");
	setPhoneEvent("#pphone3");
	setMoneyCommaEvent("#massage_pre_count");
	setMoneyCommaEvent("#massage_post_count");
}

function initModify() {
	$("#btn_help").hide();
	setDatePicker("#contract_date");
	setDatePicker("#counsel_cdate");
	
	if($("#manager_no").length) {
		//$("#manager_no").combobox({"bcssClassName":"text", "iwidth":100, "bheight":27, "iheight":23, "ireadonly":true, "iblur":selectManager});
		selectManager();
	}
	setPhoneEvent("#phone1");
	setPhoneEvent("#phone2");
	setPhoneEvent("#phone3");
	setPhoneEvent("#pphone1");
	setPhoneEvent("#pphone2");
	setPhoneEvent("#pphone3");
	var roomlist = [];
	var rcount = parseInt($("#cur_room_count").val());
	for(var i=0; i<rcount; i++) {
		roomlist.push(i);
	}
	$("#roomlist").val( JSON.stringify(roomlist) );
	setMoneyCommaEvent("#massage_pre_count");
	setMoneyCommaEvent("#massage_post_count");
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

function selectShopid() {
	$("#shopid").val('');
	var shopIdType = parseInt($("#shopid_type").val());
	if(shopIdType == 0) {
		$("#shopid").hide();
	} else {
		$("#shopid").show();
	}
}

function setKeyEvent(id, idx) {
	$(id).on('paste, keydown', function (e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var payment = uncomma($(id).val());
				if(payment == "" || isNull(payment)) {
					payment = 0;
				}
				if(payment == "-") {
					;
				} else {
					if($.isNumeric(payment) == false) {
						alert(t("reservation.only.fund"));
						payment = payment.replace(/[^0-9]/g,'');
						$(id).val(comma(payment));
						return false;
					}
				}
				payment = parseInt(payment, 10);
				var real_money = 0;
				if(isNull($("#real_money").val())) {
					;
				} else {
					real_money = uncomma($("#real_money").val());
				}
				var p = getAllPayment(idx, payment);
				var remain_money = parseInt(real_money) - parseInt(p);
				if(payment > 0 || payment < 0) {
					$(id).val(comma(payment));
				}
				$("#remain_money").val(remain_money);
				$("#remain_money_display").val(comma(remain_money));
			}
		}, 100);
	});
}

function getAllPayment(idx, p) {
	var payment = 0;
	var paylist = $("#paylist").val();
	paylist = JSON.parse(paylist);
	for(var i=0; i<paylist.length; i++) {
		var oneid = paylist[i];
		if($("#payment_" + oneid).is(":visible")) {
			var ptype = 0;
			if($("#pay_type_" + oneid).length) {
				ptype = $("#pay_type_" + oneid).val();
				if(ptype == 0 || ptype == 1 || ptype == 7) {
					;
				} else {
					continue;
				}
			}
			var pval = $("#payment_" + oneid).val();
			if(isNull(pval)) {
				pval = 0;
			}
			if(pval == "-") {
				continue;
			}
			var one_pay = parseInt(uncomma(pval));
			payment = payment + one_pay;
		}
	}
	return payment;
}

function getRoomInfo() {
	getRoomInfoByOption(0);
}

function getRoomInfoByOption(option) {
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
		url: '/reservation/room/info',
		error: function() {
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				room_grade = data.room_grade;
				room_grade_price = data.room_grade_price;
				room_list = data.room_list;
				/*if(option == 0 ) {*/
				if(option == 0 || option == 1) {
					var contents = "";
					for(var i=0; i<room_grade.length; i++) {
						var grade = room_grade[i];
						contents = "<option value='" + grade.no + "'>" + grade.name + "</option>";
						$("#room_grade").append(contents);
					}
					init();
					if(parseInt($("#mod_modify").val()) == 1) {
						setModifyValue();
					}
				} else {
					if($("#noroom").length) {
						var noroom = parseInt($("#noroom").val());
						if(noroom == 1) {
							var room_grade_no = $("#room_grade_no").val();
							selectRoomGradeByGrade(room_grade_no);
						}
					}
				}
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.roominfo"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function setModifyValue() {
	$("#birth_count").val($("#pre_birth_count").val());
	$("#revisit").val($("#pre_revisit").val());
	selectRoomGrade();
	$("#room").val($("#pre_room").val());
	var period = $("#pre_period").val();
	$("select#period option").filter(function() {
	    //may want to use $.trim in here
	    return $(this).text() == period; 
	}).prop('selected', true);
	$("input:radio[name='pay_type'][value='"+$("#pre_pay_type").val()+"']").prop("checked", true);
	$("input:radio[name='pay_method'][value='"+$("#pre_pay_method").val()+"']").prop("checked", true);
	var reservation_room_count = parseInt($("#reservation_room_count").val());
	if(reservation_room_count > 0) {
		for(var i=0; i<reservation_room_count; i++) {
			setModifyRoom(i);
		}
	}
	$("#room_grade").val($("#room_grade_no_0").val());
}

function setModifyRoom(i) {
	var contents = "";
	var room_grade_rv_id = "#room_grade_rv_" + i;
	var room_rv_id = "#room_rv_" + i;
	var from_date_id = "#from_date_rv_" + i;
	var to_date_id = "#to_date_rv_" + i;
	var rgoptions = $("#room_grade > option").clone();
	var rvrno = $("#reservation_room_" + i).val();
	var rgno = $("#room_grade_no_" + i).val();
	var rno = $("#room_no_" + i).val();
	$(room_grade_rv_id).append(rgoptions);
	for(var k=0; k<room_list.length; k++) {
		var room = room_list[k];
		if(room.room_grade_no == rgno) {
			contents = "<option value='" + room.no + "'>" + room.name + "</option>";
			$(room_rv_id).append(contents);
		}
	}
	$(room_grade_rv_id).val(rgno);
	$(room_rv_id).val(rno);
	setDatePicker(from_date_id);
	setDatePicker(to_date_id);
	$(room_grade_rv_id).bind("change",function(selected){
		var id = $(this).attr('id');
		var rvrno = id.substring(14);
		setRoomList("room_rv_" + rvrno, $(this).val());
	});
	
	$(room_grade_rv_id).show();
	$(room_rv_id).show();
	//$(room_rv_id).combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true});
}

function addRoomMethod(i) {
	var idx = parseInt(i) + 1;
	var room_contents = createReservationRoomContents(idx);
	
	$("#all_room").append(room_contents);
	setModifyRoom(idx);
	var roomlist = $("#roomlist").val();
	roomlist = JSON.parse(roomlist);
	roomlist.push(idx);
	$("#roomlist").val( JSON.stringify(roomlist) );
	$("#room_add_" + i).hide();
	if(roomlist.length == 2) {
		var firstid = roomlist[0];
		$("#room_remove_" + firstid).show();
	}
	var cur_room_count = parseInt($("#cur_room_count").val());
	cur_room_count = cur_room_count + 1;
	$("#cur_room_count").val(cur_room_count);
	
	co.datepicker();
}

function removeRoomMethod(idx) {
	var cur_room_count = parseInt($("#cur_room_count").val());
	cur_room_count = cur_room_count - 1;
	$("#cur_room_count").val(cur_room_count);
	var roomlist = $("#roomlist").val();
	roomlist = JSON.parse(roomlist);
	findNremove(roomlist, idx);
	$("#roomlist").val( JSON.stringify(roomlist) );
	var lastid = parseInt(roomlist[ (roomlist.length - 1) ]);
	$("#room_add_" + lastid).show();
	if(roomlist.length > 1) {
		$("#room_remove_" + lastid).show();
	} else if(roomlist.length == 1) {
		$("#room_remove_" + lastid).hide();
	}
	$("#div_room_" + idx).remove();
}

function createReservationRoomContents(idx) {
	var contents = "";
	var disp = "";
	if(idx == 0) {
		disp = "none";
	}
	/*
	contents = contents + '<tr style="border:0px;"><td style="border:0px;height:32px;">';
	contents = contents + '<select id="room_grade_rv_'+idx+'"></select> ';
	contents = contents + '<select id="room_rv_'+idx+'"></select> ';
	contents = contents + '<input type="text" id="from_date_rv_'+idx+'" value="" class="w15per"/> ~ '; 
	contents = contents + '<input type="text" id="to_date_rv_'+idx+'" value="" class="w15per"/> ';
	contents = contents + '<img id="room_add_'+idx+'" src="/resources/images/plus.jpg" style="cursor: pointer;vertical-align:middle;" onclick="javascript:addRoomMethod(\''+idx+'\');"/> ';
	contents = contents + '<img id="room_remove_'+idx+'" src="/resources/images/minus.jpg" style="display:'+disp+';cursor:pointer;vertical-align:middle;" onclick="javascript:removeRoomMethod(\''+idx+'\');"/>';
	contents = contents + '</td></tr>';
	*/
	contents += '<li class="field-row full clearfix" id="div_room_'+idx+'">';
	contents += '<div class="field xsmall select">';
	contents += '<select name="" id="room_grade_rv_'+idx+'"></select>';
	contents += '</div>';
	contents += '<div class="field xsmall select">';
	contents += '<select name="" id="room_rv_'+idx+'"></select>';
	contents += '</div>';
	contents += '<div class="field xsmall datepicker">';
	contents += '<input type="text" class="i-text" readonly id="from_date_rv_'+idx+'" value="">';
	contents += '</div>';
	contents += '<div class="field-bridge">-</div>';
	contents += '<div class="field xsmall datepicker">';
	contents += '<input type="text" class="i-text" readonly id="to_date_rv_'+idx+'" value="">';
	contents += '</div>';
	contents += '<div class="tools">';
	contents += '<a id="room_add_'+idx+'" href="javascript:addRoomMethod(\''+idx+'\');" class="payment-append">';
	contents += '<i class="icon-row-append"></i>';
	contents += '<span class="text-ir">결제 추가</span>';
	contents += '</a>';
	contents += '<a id="room_remove_'+idx+'" href="javascript:removeRoomMethod(\''+idx+'\');" class="payment-canceled">';
	contents += '<i class="icon-row-remove"></i>';
	contents += '<span class="text-ir">결제 취소</span>';
	contents += '</a>';
	contents += '</div>';
	contents += '</li>';
	
	return contents;
}

function selectRoomGrade() {
	selectRoomGradeByGrade(0);
}

function selectRoomGradeByGrade(grade_no) {
	var room_grade_no = 0;
	if( parseInt(grade_no) > 0 ) {
		room_grade_no = parseInt(grade_no);
	} else {
		room_grade_no = $("#room_grade").val();
	}
	if(room_grade_no == "----") {
		return false;
	}
	var contents = "";
	if($("#empty_room").length) {
		$("#empty_room").hide();
	}
	if($("#room").length) {
		setRoomList("room", room_grade_no);
	}
	if($("#room_c").length) {
		setRoomList("room_c", room_grade_no);
	}
	if($("#room_p").length) {
		setRoomList("room_p", room_grade_no);
	}
	contents = "<option value='----'>----</option>";
	if($("#period").length) {
		$("select[id='period'] option").remove();
		$("#period").append(contents);
		for(var i=0; i<room_grade_price.length; i++) {
			var rgp = room_grade_price[i];
			if(rgp.room_grade_no == room_grade_no) {
				contents = "<option value='" + rgp.price + "'>" + rgp.day + "</option>";
				$("#period").append(contents);
			}
		}
		setSelectValue("#period", '----', '----');
	}
}

function setRoomList(id, room_grade_no) {
	var contents = "<option value='----'>----</option>";
	$("select[id='" + id + "']").empty();
	$("#" + id).append(contents);
	for(var i=0; i<room_list.length; i++) {
		var room = room_list[i];
		if(room.room_grade_no == room_grade_no) {
			contents = "<option value='" + room.no + "'>" + room.name + "</option>";
			$("#" + id).append(contents);
		}
	}
	setSelectValue("#" + id, '----', '----');
}

function selectPeriod() {
	if($("#period").val() == "----") {
		return false;
	}
	var period = $("select[id='period'] option:selected").text();
	var fd = $("#from_date").val();
	if(fd == "" || isNull(fd)) {
		return false;
	}
	calculateDate(fd, period);	
}

function selectDate(date) {
	if($("#period").val() == "----") {
		return false;
	}
	var period = $("select[id='period'] option:selected").text();
	var fd = date;
	if(fd == "" || isNull(fd)) {
		return false;
	}
	calculateDate(fd, period);
}

function calculateDate(fd, period) {
	var today = $("#today").val();
	$("#to_date").val("");
	var day = calDateRange(today, fd);
//	if(day <= 0) {
//		$("#from_date").val("");
//		alert("오늘보다 이전 날짜를 예약일로 선택할 수 없습니다.");
//		return false;
//	}
	var td = manipulateDate("d", parseInt(period) - 1, fd, "-");
	$("#to_date").val(td);
	$("#total_money").val(comma($("#period").val()));	// period객체의 value는 total_money, text는 기간.
	getEmptyRoomList($("#room_grade").val(), fd, td);
}

function getEmptyRoomList(room_grade_no, from_date, to_date) {
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
			from_date : from_date,
			to_date : to_date,
			bno : bno
		},
		traditional: true,
		url: '/reservation/check',
		error: function() {
			alert(t("reservation.error.emptylist"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				$("#empty_room").html("");
				var data = res.data;
				var room_grade_list = data.room_grade_list;
				var contents = "";
				var room_status = null;
				if(data.room_status != null && data.room_status.room != null) {
					room_status = data.room_status.room;
				}
				if($.isEmptyObject(data.room_status)) {
					contents = "<p class='field-message'>예약 가능한 객실이 없습니다.</p>";
				} else {
					for(var i=0; i<room_grade_list.length; i++) {
						var grade = room_grade_list[i];
						contents = contents + "<p class='field-message'><strong>";
						contents = contents + grade.name + "</strong> : ";
						var cnt = 0;
//						if(grade.no in room_status && grade.no == room_grade_no) {
						var rg_no = $("#room_grade").val();
						var firstroom = null;
						if(grade.no in room_status) {
							var room_list = room_status[grade.no];
							for(var k=0; k<room_list.length; k++) {
								var room = room_list[k];
								if(k == 0) {
									if(rg_no == grade.no) {
										firstroom = room;
									}
								} else {
									contents = contents + ", ";
								}
								cnt = cnt + 1;
								contents = contents + room.room_name;
							}
						}
						if(cnt == 0) {
							if(room_grade_no == grade.no) {
								$('#room').parent().addClass('select');
								$("#room").show();
								$("#roomDisp").hide();
								
							}
							contents = contents + t("reservation.process.noroom");
						} else {
							if(room_grade_no == grade.no) {
								$('#room').parent().removeClass('select');
								
								$("#room").hide();
								$("#roomDisp").show();
							}
							if( ($("#btnAddReservation").length || $("#btnModifyReservation").length) && $("#room").length ) {
								if(firstroom != null) {
									setSelectValue("#room", firstroom.room_no, firstroom.room_name);
									$("#roomDisp").val(firstroom.room_name);
								}
							}
						}
						contents = contents + "</p>";
					}
				}
				$("#empty_room").append(contents);
				$("#empty_room").show();
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("index.wrong.check"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function changeRoomGrade() {
	var roomGradeNo = $("#room_grade_no").val();
	var rgno = $("#rgno").val();
	if(rgno != roomGradeNo) {
		$("#msgnoroom").hide();
		if($("#room").length) {
			$("#room").hide();
		}
	} else {
		$("#msgnoroom").show();
		if($("#room").length) {
			$("#room").show();
		}
	}
	$("#room_grade_no option").each(function (){
		if(roomGradeNo == $(this).val()) {
			$("#room_"+$(this).val()).show();
		} else {
			$("#room_"+$(this).val()).hide();
		}
	});
	var total_price = parseInt($("#room_grade_price_" + roomGradeNo).val());
	var discount_money = parseInt($("#discount_money").val());
	var real_money = total_price - discount_money;
	$("#total_money").val(total_price);
	$("#total_money_disp").text(comma(total_price));
	$("#real_money").val(real_money);
	$("#real_money_disp").text(comma(real_money));
	$("#payment").val(real_money);
	$("#payment_display").val(real_money);
	$("#remain_money").val(0);
}

function searchUser() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var page = 1;
	var user_name = $("#user_name").val();
	if(isNull(user_name)) {
		alert(t("reservation.input.searchmomname"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			page : page,
			user_name : user_name,
			bno : bno
		},
		traditional: true,
		url: '/user/data/list',
		error: function() {
			alert(t("reservation.error.searchmom"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var totalcount = parseInt(data.user_total_count);
				var listcount = parseInt(data.list_count);
				var user_list = data.user_list;
				var contents = "";
				var more = "";
				if(!$.isEmptyObject(user_list) && user_list.length > 0) {
					contents = contents + "<colgroup>";
					contents = contents + "<col width=\"33%\" />";
					contents = contents + "<col width=\"33%\" />";
					contents = contents + "<col width=\"34%\" />";
					contents = contents + "</colgroup>";
					contents = contents + "<thead>";
					contents = contents + "<tr>";
					contents = contents + t("center.name");
					contents = contents + t("reservation.contactc");
					contents = contents + "<th scope=\"col\"></th>";
					contents = contents + "</tr>";
					contents = contents + "</thead>";
					contents = contents + "<tbody>";
					for(var i=0; i<user_list.length; i++) {
						var user = user_list[i];
						var user_no = user.no;
						var user_name = user.name;
						var user_phone = user.phone;
//						var user_jumin1 = user.jumin1;
//						var user_jumin2 = user.jumin2;
						var user_jumin1 = "";
						var user_jumin2 = "";
						var user_birth = user.birth;
						var user_job = user.job;
						var user_zipcode = user.zipcode;
						var user_address = user.address;
						var user_reservation_no = user.reservation_no;
						var jibun = "", detail = "";
						var birthy="", birthm="", birthd="";
						if(user_birth !== undefined && user_birth !== null) {
							if(user_birth.trim().length > 0) {
								try {
									var blist = user_birth.trim().split("-");
									if(blist.length == 3) {
										birthy = blist[0];
										birthm = blist[1];
										birthd = blist[2];
									}
								} catch(e) {
									;
								}
							}
						}
						if(user.adderss_jibun !== undefined && user.address_jibun !== null) {
							jibun = user.address_jibun;
						}
						if(user.address_detail !== undefined && user.address_detail !== null) {
							detail = user.address_detail;
						}
						contents = contents + "<tr>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + user_name;
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + user_phone;
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + "<input type=\"hidden\" id=\"user_name_" + user.no + "\" value=\"" + user.name + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_phone_" + user.no + "\" value=\"" + user.phone + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_birthy_" + user.no + "\" value=\"" + birthy + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_birthm_" + user.no + "\" value=\"" + birthm + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_birthd_" + user.no + "\" value=\"" + birthd + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_job_" + user.no + "\" value=\"" + user.job + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_zipcode_" + user.no + "\" value=\"" + user.zipcode + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_address_" + user.no + "\" value=\"" + user.address + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_address_jibun_" + user.no + "\" value=\"" + jibun + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_address_detail_" + user.no + "\" value=\"" + detail + "\"/>";
						contents = contents + "<button type=\"button\" class=\"btn_green1\" " +
								"onclick=\"javascript:setUserInfo('" + user_no + "');\">" + t("gongu.select") + "</button>";
						contents = contents + "</td>";
						contents = contents + "</tr>";
					}
					contents = contents + "</tbody>";
					if(totalcount > user_list.length) {
						more = more + "<a href='#' class='cbtn' onclick='javascript:moreUser(\"" + (parseInt(page)+1) + "\");'>" + t("reservation.more") + "</a>";
					}
				}
				$("#moreuser").empty();
				if(!$.isEmptyObject(user_list) && (totalcount > user_list.length)) {
					$("#moreuser").html(more);
					$("#moreuser").show();
				} else {
					$("#moreuser").hide();
				}
				$("#user_list").html(contents);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.fail.searchmom"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function moreUser(page) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var user_name = $("#user_name").val();
	if(isNull(user_name)) {
		alert(t("reservation.input.searchmomname"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			page : page,
			user_name : user_name,
			bno : bno
		},
		traditional: true,
		url: '/user/data/list',
		error: function() {
			alert(t("reservation.error.searchmom"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var totalcount = parseInt(data.user_total_count);
				var listcount = parseInt(data.list_count);
				var user_list = data.user_list;
				var contents = $("#user_list").html();
				contents = contents.replaceAll("</tbody>", "");
				var more = "";
				if(user_list.length > 0) {
					for(var i=0; i<user_list.length; i++) {
						var user = user_list[i];
						var user_no = user.no;
						var user_name = user.name;
						var user_phone = user.phone;
//						var user_jumin1 = user.jumin1;
//						var user_jumin2 = user.jumin2;
						var user_birth = user.birth;
						var user_job = user.job;
						var user_zipcode = user.zipcode;
						var user_address = user.address;
						var user_reservation_no = user.reservation_no;
						var jibun = "", detail = "";
						var birthy="", birthm="", birthd="";
						if(user_birth !== undefined && user_birth !== null) {
							if(user_birth.trim().length > 0) {
								try {
									var blist = user_birth.trim().split("-");
									if(blist.length == 3) {
										birthy = blist[0];
										birthm = blist[1];
										birthd = blist[2];
									}
								} catch(e) {
									;
								}
							}
						}
						if(user.adderss_jibun !== undefined && user.address_jibun !== null) {
							jibun = user.address_jibun;
						}
						if(user.address_detail !== undefined && user.address_detail !== null) {
							detail = counsel.address_detail;
						}
						contents = contents + "<tr>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + user_name;
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + user_phone;
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + "<input type=\"hidden\" id=\"user_name_" + user.no + "\" value=\"" + user.name + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_phone_" + user.no + "\" value=\"" + user.phone + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_birthy_" + user.no + "\" value=\"" + birthy + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_birthm_" + user.no + "\" value=\"" + birthm + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_birthd_" + user.no + "\" value=\"" + birthd + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_job_" + user.no + "\" value=\"" + user.job + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_zipcode_" + user.no + "\" value=\"" + user.zipcode + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_address_" + user.no + "\" value=\"" + user.address + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_address_jibun_" + user.no + "\" value=\"" + jibun + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"user_address_detail_" + user.no + "\" value=\"" + detail + "\"/>";
						contents = contents + "<button type=\"button\" class=\"btn_green1\" " +
								"onclick=\"javascript:setUserInfo('" + user_no + "');\">" + t("gongu.select") + "</button>";
						contents = contents + "</td>";
						contents = contents + "</tr>";
					}
					contents = contents + "</tbody>";
					if(totalcount > user_list.length) {
						more = more + "<a href='#' class='cbtn' onclick='javascript:moreUser(\"" + (parseInt(page)+1) + "\");'>" + t("reservation.more") + "</a>";
					}
				}
				$("#moreuser").empty();
				if(totalcount > (listcount * (parseInt(page) - 1) + user_list.length) ) {
					$("#moreuser").html(more);
					$("#moreuser").show();
				} else {
					$("#moreuser").hide();
				}
				$("#user_list").html(contents);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.fail.searchmom"));
					hideLoadingLayer();
				}
			}
		}
	});
}

//function jumin1(e) {
//	if(e.value.length == 6) {
//		$("#jumin2").focus();
//	}
//}
//
//function jumin2(e) {
//	if(e.value.length == 7) {
//		$("#phone").focus();
//	}
//}

function setUserInfo(user_no) {
	$("#user_no").val(user_no);
	var span = null;
	var input = null;
	$("#name").val($("#user_name_"+user_no).val());
	span = $("#birthy").next();
	input = span.children(":first");
	input.val($("#user_birthy_"+user_no).val());
	$("#birthy").val($("#user_birthy_"+user_no).val());
	span = $("#birthm").next();
	input = span.children(":first");
	input.val($("#user_birthm_"+user_no).val());
	$("#birthm").val($("#user_birthm_"+user_no).val());
	span = $("#birthd").next();
	input = span.children(":first");
	input.val($("#user_birthd_"+user_no).val());
	$("#birthd").val($("#user_birthd_"+user_no).val());
	$("#job").val($("#user_job_"+user_no).val());
	$("#phone").val($("#user_phone_"+user_no).val());
	$("#zipcode").val($("#user_zipcode_"+user_no).val());
	$("#addr").val($("#user_address_"+user_no).val());
	$("#addr_jibun").val($("#user_address_jibun_"+user_no).val());
	$("#addr2").val($("#user_address_detail_"+user_no).val());
	hideUserList();
}



function getAllPaymentForRemain(idx, p) {
	var payment = 0;
	var paylist = $("#rp_paylist").val();
	paylist = JSON.parse(paylist);
	for(var i=0; i<paylist.length; i++) {
		var oneid = paylist[i];
		if($("#rp_payment_" + oneid).is(":visible")) {
			var pval = $("#rp_payment_" + oneid).val();
			if(isNull(pval)) {
				pval = 0;
			}
			if(pval == "-") {
				continue;
			}
			var one_pay = parseInt(uncomma(pval));
			payment = payment + one_pay;
		}
	}
	return payment;
}

function setExtendDateKeyEvent(id, idx) {
	$(id).on('paste, keydown', function (e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var payment = uncomma($(id).val());
				if(payment == "" || isNull(payment)) {
					payment = 0;
				}
				if(payment == "-") {
					;
				} else {
					if($.isNumeric(payment) == false) {
						alert(t("reservation.only.payfund"));
						payment = payment.replace(/[^0-9]/g,'');
						$(id).val(comma(payment));
						return false;
					}
				}
				if(payment > 0 || payment < 0) {
					$(id).val(comma(payment));
				}
			}
		}, 100);
	});
}

function setRemainPaymentKeyEvent(id, idx) {
	$(id).on('paste, keydown', function (e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var payment = uncomma($(id).val());
				if(payment == "" || isNull(payment)) {
					payment = 0;
				}
				if(payment == "-") {
					;
				} else {
					if($.isNumeric(payment) == false) {
						alert(t("reservation.only.payfund"));
						payment = payment.replace(/[^0-9]/g,'');
						$(id).val(comma(payment));
						return false;
					}
				}
				payment = parseInt(payment, 10);
				var real_money = uncomma($("#rp_m_real_money").val());
				var p_money = uncomma($("#rp_m_payment").val());
				var p = getAllPaymentForRemain(idx, payment);
				var remain_money = parseInt(real_money) - parseInt(p) - p_money;
				if(payment > 0 || payment < 0) {
					$(id).val(comma(payment));
				}
				$("#rp_remain_money").val(comma(remain_money));
			}
		}, 100);
	});
}

function setSetupKeyEvent(id, idx) {
	$(id).on('paste, keydown', function (e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var payment = uncomma($(id).val());
				if(payment == "" || isNull(payment)) {
					payment = 0;
				}
				if(payment == "-") {
					;
				} else {
					if($.isNumeric(payment) == false) {
						alert(t("reservation.only.payfund"));
						payment = payment.replace(/[^0-9]/g,'');
						$(id).val(comma(payment));
						return false;
					}
				}
				payment = parseInt(payment, 10);
				var real_money = uncomma($("#m_real_money").val());
				var p_money = uncomma($("#m_payment").val());
				var p = getAllPayment(idx, payment);
				var remain_money = parseInt(real_money) - parseInt(p) - p_money;
				if(payment > 0 || payment < 0) {
					$(id).val(comma(payment));
				}
				$("#m_remain_money").val(comma(remain_money));
			}
		}, 100);
	});
}

function viewExtendDate(reservation_no, from_date, to_date, real_money) {
	
	var layer = $('.period-extension').html();
    co.layer(layer,function(el){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var dt = date.getDate();
		if (dt < 10) {
		  dt = '0' + dt;
		}
		if (month < 10) {
		  month = '0' + month;
		}
		var today = year + '-' + month + '-' + dt;

    	var pay_count = 0;
    	$("#e_all_payment", el).empty();
    	
    	var contents = createExtendDateContents(today, 0);
    	
    	$("#e_all_payment", el).append(contents);
    	
    	var paylist = [];
    	paylist.push(0);
    	
    	$("#e_paylist").val( JSON.stringify(paylist) );
    	$("#e_m_reservation_no").val(reservation_no);
    	$("#e_payment_0").val(0);
    	$("#e_real_money").val(real_money);
    	$(".e_real_money").html(comma(real_money) + t("balance.won"));
    	$("#e_inserttime_0").val(today);
    	$("#e_fromdate").val(from_date);
    	$("#e_todate").val(to_date);
    	$("#e_org_todate").val(to_date);
    	setExtendDateKeyEvent("#e_payment_0", 0);
    	
    	co.datepicker();
    	
        $(el).on('submit','form',function(){
        	extendDate();
            return false;
        })
    });
	
}

function viewExitConfirm(reservation_no, name, from_date, to_date) {
	var layer = $('.exit-confirm').html();
    co.layer(layer,function(el){
    	$("#reservation_no_d", el).val(reservation_no);
    	$("#name_d", el).text(name);
    	$("#period_d", el).text(from_date + " ~ " + to_date);

    	co.datepicker();
        
        $(el).on('submit','form',function(){
        	setExitConfirm();
            return false;
        })
    });
}

function setExitConfirm(){
	var name = $("#user").val();
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
			reservation_no:$("#reservation_no_d").val(),
			bno:bno,
			isetup:"9",
			name:name
		},
		traditional: true,
		url: '/reservation/confirmexit',
		error: function() {
			co.alert(t("reservation.errror"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("reservation.exitconfirm"), function(){location.reload();});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.exit"));
					hideLoadingLayer();
				}
			}
		}
		});
} 

function viewRemainPayment(reservation_no, real_money, remain_money) {
	var layer = $('.partial-payment').html();
    co.layer(layer,function(el){
        var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var dt = date.getDate();
		if (dt < 10) {
		  dt = '0' + dt;
		}
		if (month < 10) {
		  month = '0' + month;
		}
		var today = year + '-' + month + '-' + dt;
    	var pay_count = 0;
    	var contents = createRemainPaymentContents(today, 0);
    	
    	$("#rp_all_payment", el).empty();
    	$("#rp_all_payment", el).append(contents);
    	
    	var paylist = [];
    	paylist.push(0);
    	
    	$("#rp_paylist", el).val( JSON.stringify(paylist) );
    	$("#rp_m_reservation_no", el).val(reservation_no);
    	$("#rp_pretotal", el).html(comma(real_money));
    	$("#rp_preremain", el).html(comma(remain_money));
    	$("#rp_remain_money", el).val(0);
    	$("#rp_m_real_money", el).val(real_money);
    	$("#rp_payment_0", el).val(comma(remain_money));
		$("#rp_inserttime_0", el).val(today);    	

    	$("#rp_m_payment", el).val((real_money - remain_money));
    	setRemainPaymentKeyEvent("#rp_payment_0", 0);
    	
    	co.datepicker();
        $(el).on('submit','form',function(){
        	payRemain();
            return false;
        })
    });
	
}

function viewInsuracePayment(reservation_no) {
	$("#insurance_reservation_no").val(reservation_no);
	setMoneyCommaEvent("#insurance_payment");
	layer_open("insurance_payment_layer", "fade", true);
}

function setup(issetup, reservation_no, from_date, to_date, real_money, remain_money, period, pay_type, room_grade_no, room_no, pay_method) {
	if(issetup == 1) {
		co.alert(t("reservation.process.alreadyenter"));
		return false;
	}
	var layer = $('.arrival-confirmed').html();
    co.layer(layer,function(el){
    	var contents = "";
    	var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var dt = date.getDate();
		if (dt < 10) {
		  dt = '0' + dt;
		}
		if (month < 10) {
		  month = '0' + month;
		}
		var today = year + '-' + month + '-' + dt;
    	$("#all_payment").empty();
    	contents = createSetupContents(reservation_no, today, pay_type, "", 0);
    	
    	$("#all_payment").append(contents);
    	getRoomInfoByOption(1);
    	
    	contents = "<option value='----'>선택하세요.</option>";
    	$("#room_c").empty();
    	$("#room_c").append(contents);
    	
    	var paylist = [];
    	paylist.push(0);
    	$("#paylist").val( JSON.stringify(paylist) );
    	$("#m_reservation_no").val(reservation_no);
    	$("#m_issetup").val(issetup);
    	$("#m_pay_type").val(pay_type);
    	$("#m_fromdate").val(from_date);
    	$("#m_todate").val(to_date);
    	$(".m_pretotal").html(comma(real_money));
    	chainDateSetup(period);
    	//if(pay_type == 'full') {
    	if (remain_money == 0) {
    		$(".pay_type_full").show();
    		$(".pay_type_deposit").hide();
    		
    		var k_pay_method = '';
    		
    		if(pay_method == 'cash') {
    			k_pay_method = t("reservation.cashs");
    		} else if(pay_method == 'card') {
    			k_pay_method = t("reservation.cards");
    		}
    		
    		$('#full_pay_type').text(k_pay_method + t("reservation.pay.full"));
    		
    	} else {
    		$(".pay_type_full").hide();
    		$(".pay_type_deposit").show();
    		$("#m_real_money").val(real_money);
    		$("#m_preremain").html(comma(remain_money));
    		$("#payment_0").val(comma(remain_money));
    		$("#m_remain_money").val(0);
    		$("#inserttime_0").val(today);
    		setDatePicker("#inserttime_0");
    		$("#m_payment").val((real_money - remain_money));
    		setSetupKeyEvent("#payment_0", 0);
    		$('#pay_type_0', $(el)).val('1');
    	}
    	
    	$("#room_grade_c").off('change');
    	
    	$("#room_grade_c").on('change', function(){
    		var grade_no = $(this).val();
    		if(grade_no == "----") {
    			return false;
    		}
    		selectRoomGradeByGrade(grade_no);
    	});
    	
    	
        co.datepicker();
        $(el).on('submit','form',function(){
        	setupReservation();
            return false;
        })
    });
    
    setTimeout(function(){ 
    	$('#room_grade_c').val(room_grade_no);
    	$("#room_grade_c").trigger('change');
    	$("#room_c").val(room_no);
    }, 500);
}

function chainDateSetup(period) {
	$('.datepicker').each(function(eq,el){
		var target = el.tagName != 'INPUT' ? $(el).find('input') : $(el);
		var pickerOption = target.data();
		
		if (!target.hasClass('hasDatepicker')){
			
			if(target.attr('id') == "m_fromdate"){
				target.datepicker({
					monthNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
					monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
					dayNamesMin: [t("common.Sunday"),t("common.Monday"),t("common.Tuesday"),t("common.Wednesday"),t("common.Thursday"),t("common.Friday"),t("common.Saturday")],
					closeText: t("common.closes"),
					prevText: t("common.pastmonth"),
					nextText: t("common.nextmonth"),
					currentText: t("common.todays"),
					dateFormat: pickerOption.dateFormat ? pickerOption.dateFormat : 'yy-mm-dd',
					showMonthAfterYear: true,
					changeMonth: true,
					changeYear: true,
					viewMode: 'years',
					onSelect:function(date) {
						var todate = manipulateDate("d", parseInt(period) - 1, date, "-");
						$("#m_todate").val(todate);
					}  
				});
			}else{
				target.datepicker({
					monthNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
					monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
					dayNamesMin: [t("common.Sunday"),t("common.Monday"),t("common.Tuesday"),t("common.Wednesday"),t("common.Thursday"),t("common.Friday"),t("common.Saturday")],
					closeText: t("common.closes"),
					prevText: t("common.pastmonth"),
					nextText: t("common.nextmonth"),
					currentText: t("common.todays"),
					dateFormat: pickerOption.dateFormat ? pickerOption.dateFormat : 'yy-mm-dd',
					showMonthAfterYear: true,
					changeMonth: true,
					changeYear: true,
					viewMode: 'years',
					onSelect:function(date) {
					}  
				});
			}
		}
	});
}

// datapicker setting 내용 초기화로 입실일 년/월 지정불가 
/*function initSetup(period) {
//	$("#m_realmoney").on('keydown', function (e){
//		setTimeout(function (){
//			if(e.keyCode < 37 || e.keyCode > 40) {
//				var real_money = uncomma($("#m_realmoney").val());
//				if(real_money == "" || isNull(real_money)) {
//					return false;
//				}
//				if($.isNumeric(real_money) == false) {
//					alert("최종 총금액은 숫자만 입력하세요.");
//					return false;
//				}
//				$("#m_realmoney").val(comma(real_money));
//			}
//		}, 1);
//	});
	$("#m_fromdate").datepicker({
		dateFormat: "yy-mm-dd",
		onSelect:function(date, inst) {
			var todate = manipulateDate("d", parseInt(period) - 1, date, "-");
			$("#m_todate").val(todate);
		},
		monthNames: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
		showMonthAfterYear: true,
		changeMonth: true,
		changeYear: true,
		beforeShow: function() {
			setTimeout(function(){
				$('.ui-datepicker').css('z-index', 99999999999999);
			}, 0);
		}
	});
	setDatePicker("#m_todate");
}*/

function sleepReservation() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var issetup = $("#sl_issetup").val();
	if(issetup != 0) {
		co.alert(t("reservation.process.resevegiveup"));
		
		return false;
	}
	var reservation_no = $("#sl_reservation_no").val();
	var payment = parseInt(uncomma($("#sl_org_payment").val()));
	var refund = parseInt(uncomma($("#sl_refund").val()));
	if(refund > payment) {
		co.alert(t("reservation.error.refundundercontract"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			reservation_no:reservation_no,
			refund:refund,
			payment:payment,
			sleep_date:$("#sl_date").val(),
			from_date:$("#sl_org_from_date").val(),
			to_date:$("#sl_org_to_date").val(),
			bno : bno
		},
		traditional: true,
		url: '/reservation/sleep',
		error: function() {
			co.alert(t("reservation.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("reservation.process.giveups"), function(){location.reload();});
				
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.giveup"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function refundReservation(issetup, isdel, reservation_no, from_date, to_date, real_money, remain_money, option) {
	var fdate = from_date;
	var tdate = to_date;
	var checksetup = parseInt(option.checksetup);
	
	if(checksetup == 1) {
		if(parseInt(issetup) == 1) {
			alert(t("reservation.error.cansel"));
			return false;
		}
		if(parseInt(isdel) == 1) {
			alert(t("reservation.alreadycancel"));
			return false;
		}
	}
	var layer = $('.refund-payment').html();
    co.layer(layer,function(el){
        co.datepicker();
        
        if(checksetup == 1) { // 예약취소
        	$('#why', el).val('3');
        	$('#txt_why', el).text(t("reservation.cancel"));
        	
    		$("#r_rdate", el).hide();
    		$("#r_rfdate", el).show();
    		$("#r_otdate", el).hide();
    		$("#r_period", el).hide();
    		
    	} else { // 환불
    		$('#why', el).val('2');
    		$('#txt_why', el).text(t("reservation.refundss"));
    		
    		$("#r_rdate", el).show();
    		$("#r_rfdate", el).show();
    		$("#r_otdate", el).hide();
    		$("#r_period", el).show();
    		$("input[type='radio'][name='r_isout'][value='in']", el).click();
    		$("input[type='radio'][name='r_isout']", el).on("change", function(){
    			if(this.value == "in") {
    				$("#r_otdate", el).hide();
    				$("#r_rfdate", el).show();
    			} else {
    				$("#r_otdate", el).show();
    				$("#r_rfdate", el).hide();
    			}
    		});
    	}
        
        $("#r_payment", el).on('paste, keydown', function (e){
    		setTimeout(function (){
    			if(e.keyCode < 37 || e.keyCode > 40) {
    				var r_payment = $("#r_payment").val();
    				if(r_payment == "-") {
    					;
    				} else {
    					r_payment = uncomma(r_payment);
    					if(r_payment == "" || isNull(r_payment)) {
    						return false;
    					}
    					if($.isNumeric(r_payment) == false) {
    						alert(t("reservation.only.finallypay"));
    						r_payment = r_payment.replace(/[^0-9]/g,'');
    						$("#r_payment").val(comma(r_payment));
    						return false;
    					}
    					r_payment = parseInt(r_payment, 10);
    					$("#r_payment").val(comma(r_payment));
    				}
    			}
    		}, 100);
    	});
    	$("#r_issetup", el).val(issetup);
    	$("#r_reservation_no", el).val(reservation_no);
    	$("#r_pretotal", el).html(comma(real_money) + t("reservation.won"));
    	$("#r_preremain", el).html(comma(remain_money) + t("reservation.won"));
    	$("#r_realmoney", el).val(real_money);
    	$("#r_payment", el).val(comma((real_money - remain_money)));
    	$("#r_fromdate", el).text(fdate);
    	$("#r_todate", el).text(tdate);
    	
        $(el).on('submit','form',function(){
        	doRefund();
            return false;
        })
    });
}

function refundCancel() {
	$("#mask_popup3").hide();
	$("#div_loading3").hide();
}

function setupCancel() {
	$("#mask_popup").hide();
	$("#div_loading").hide();
}

function setupReservation() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var room_grade_no = $("#room_grade_c").val();
	var room_no = $("#room_c").val();
	var room_name = $("#room_c").find("option:selected").text();
	if(room_grade_no == '----') {
		co.alert(t("reservation.select.grades"));
		return false;
	}
	if(room_no == '----') {
		co.alert(t("reservation.select.rooms"));
		return false;
	}
	var rm_money = 0;
	if($("#m_remain_money").length) {
		rm_money = parseInt(uncomma($("#m_remain_money").val()));
	}
	if(rm_money != 0) {
		if(confirm(t("reservation.process.balancenotzero"))) {
			;
		} else {
			return false;
		}
	}
	var pay_type = $("#m_pay_type").val();
	var param = {
			reservation_no:$("#m_reservation_no").val(),
			issetup:$("#m_issetup").val(),
			pay_type:pay_type,
			from_date:$("#m_fromdate").val(),
			to_date:$("#m_todate").val(),
			memo:$("#m_memo").val(),
			room_grade_no:room_grade_no,
			room_no:room_no,
			room_name:room_name,
			bno : bno
	};
	if(pay_type == 'deposit') {
		var pay_count = parseInt($("#m_pay_count").val());
		pay_count = pay_count + 1;
		var paylist = $("#paylist").val();
		paylist = JSON.parse(paylist);
		for(var i=0; i<paylist.length; i++) {
			var oneid = paylist[i];
			var typeid = "pay_type_" + oneid;
			var type = $("#" + typeid).val();
			var timeid = "inserttime_" + oneid;
			var time = $("#" + timeid).val();
			var methodid = "pay_method_" + oneid;
			var method = $("#" + methodid).val();
			var paymentid = "payment_" + oneid;
			var payment = uncomma($("#" + paymentid).val());
			param[typeid] = type;
			param[timeid] = time;
			param[methodid] = method;
			param[paymentid] = payment;
		}
		param["real_money"] = uncomma($("#m_real_money").val());
		param["remain_money"] = uncomma($("#m_remain_money").val());
		param["pay_count"] = pay_count;
	}
//	real_money:uncomma($("#m_realmoney").val()),
//	payment:uncomma($("#m_payment").val()),
//	method:$("input:radio[name='m_pay_method']:checked").val(),
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: param,
		traditional: true,
		url: '/reservation/setupexe',
		error: function() {
			hideLoadingLayer();
			co.alert(t("reservation.error.enterchecks"));

			
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("reservation.process.entercheck"), function(){
					location.reload();
				});
				
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.entercheck"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function doRefund() {
	var bno = 0;
	var manager = $("#user").val();
	var date = new Date();
	var yyyy = date.getFullYear();
	var mm = String(date.getMonth() + 1); //January is 0!
	var dd = String(date.getDate());
	var HH = String(date.getHours());
	var MM = String(date.getMinutes());
	var ss = String(date.getSeconds());
	var today = yyyy + '-' + mm + '-' + dd +" "+ HH + ':' + MM + ':' + ss;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var type = parseInt($("#why").val());
	var issetup = parseInt($("#r_issetup").val());
	if(type == 2 || type == 4) {
		if(issetup == 0) {
			co.alert(t("reservation.error.refundafterenter"));
			return false;
		}
	}
	if(type == 2 || type == 4) {
		var isout = $("input[type='radio'][name='r_isout']:checked").val();
		if(isout == "in") {		//입실유지
			if(isNull($("#r_refunddate").val())) {
				co.alert(t("reservation.input.refundday"));
				return false;
			}
		} else if(isout == "out") {	//퇴실
			if(isNull($("#r_outdate").val())) {
				co.alert(t("reservation.input.exit"));
				return false;
			}
		}
	} else if(type == 3) {
		if(isNull($("#r_refunddate").val())) {
			co.alert(t("reservation.input.refundday"));
			
			return false;
		}
	}
	var payment = comma($("#r_payment").val());
	if(isNull(payment)) {
		co.alert(t("reservation.input.refund"));
		
		return false;
	}
	if( parseInt(payment) < 0 ) {
		co.alert(t("reservation.error.refundoverzero"));
		
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			type:type,
			reservation_no:$("#r_reservation_no").val(),
			payment:uncomma($("#r_payment").val()),
			real_money:$("#r_realmoney").val(),
			from_date:$("#r_fromdate").val(),
			to_date:$("#r_todate").val(),
			isout:isout,
			refund_date:$("#r_refunddate").val(),
			out_date:$("#r_outdate").val(),
			memo:$("#r_memo").val(),
			bno : bno,
			del_date:today,
			del_manager:$("#user").val()
		},
		traditional: true,
		url: '/reservation/refund',
		error: function() {
			co.alert(t("discount.error.add"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("reservation.refund.did"), function(){location.reload();});

			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20742) {
					alert(t("reservation.exitinenter"));
					hideLoadingLayer();
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.refund.cant"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function viewCalendarMode() {
	$(location).attr("href", "/reservation/calendar");
}

function viewListMode() {
	var mode = parseInt($("#mode").val());
	var filter = $("#filter").val();
	viewSearchResult(mode, "list", filter);
}

function viewChartMode() {
	var mode = parseInt($("#mode").val());
	var filter = $("#filter").val();
	viewSearchResult(mode, "chart", filter);
}

function filterReservation(filter) {
	var mode = parseInt($("#mode").val());
	var oldfilter = $("#filter").val();
	var newfilter = 0;
	if(filter == 0) {
		newfilter = 0;
	} else if(filter == 100) {
		newfilter = "1,2";
	} else if(filter == 101) {
		newfilter = "3,4,5";
	} else {
		//if(oldfilter == 0) {
			newfilter = filter;
		//} else {
		//	newfilter = oldfilter+","+filter;
		//}
	}
	$("#filter").val(newfilter);
	searchReservation();
}

function searchReservation() {
	
	if ($('#search_condition').val() == 'bydate') {
		if ($('#from_date').val() > $('#to_date').val()) {
			co.alert(t("reservation.error.dayday"));
			return;
		} 
	}
	
	var mode = parseInt($("#mode").val());
	var display = $("#display").val();
	var filter = $("#filter").val();
	viewSearchResult(mode, display, filter);
}

function viewSearchResult(mode, display, filter) {
	var param = makeSearchParam(mode, display, filter);
	if(!param) {
		return false;
	}
	if(mode == 0) {
		$(location).attr("href", "/reservation/list" + param);
	} else if(mode == 1) {
		$(location).attr("href", "/reservation/user/list" + param);
	} else if(mode == 2) {
		$(location).attr("href", "/reservation/cancel/list" + param);
	} else if(mode == 3) {
		$(location).attr("href", "/reservation/duplicate/list" + param);
	}
}

function makeSearchParam(mode, display, filter) {
	var from_date = "";
	var to_date = "";
	var room_grade_no = "";
	var user_no = 0;
	if($("#from_date").length) {
		from_date = $("#from_date").val();
	}
	if($("#to_date").length) {
		to_date = $("#to_date").val();
	}
	if($("#room_grade").length) {
		room_grade_no = $("#room_grade").val();
	}
	if($("#user_no").length) {
		user_no = parseInt($("#user_no").val());
	}
	var keyword = "";
	var condition = $("#search_condition").val();
	var param = "";
	if(condition == "bydate") {
		if(isNull(from_date)) {
			alert(t("reservation.input.searchday"));
			return false;
		}
		if(isNull(to_date)) {
			alert(t("reservation.input.searchday"));
			return false;
		}
		param = "?search_condition=bydate&from_date=" + from_date + "&to_date=" + to_date+"&room_grade_no=" + room_grade_no;
	} else if(condition == "byname") {
		keyword = $("#search_name").val();
		if(isNull(keyword)) {
			alert(t("reservation.input.momname"));
			return false;
		}
		param = "?search_condition=byname&search_field=name&search_word=" + keyword;
	} else if(condition == "bypname") {
		keyword = $("#search_pname").val();
		if(isNull(keyword)) {
			alert(t("reservation.input.guadian"));
			return false;
		}
		param = "?search_condition=bypname&search_field=pname&search_word=" + keyword;
	} else if(condition == "byphone") {
		keyword = $("#search_phone").val();
		if(isNull(keyword)) {
			alert(t("reservation.input.momcontact"));
			return false;
		}
		param = "?search_condition=byphone&search_field=phone&search_word=" + keyword;
	} else if(condition == "byduedate") {
		keyword = $("#search_due_date").val();
		if(isNull(keyword)) {
			alert(t("reservation.input.schedule"));
			return false;
		}
		param = "?search_condition=byduedate&search_field=due_date&search_word=" + keyword;
	}
	if(param != "") {
		param = param + "&display=" + display;
	} else {
		param = param + "?display=" + display;
	}
	if(user_no > 0) {
		if(param != "") {
			param = param + "&user_no=" + user_no;
		} else {
			param = param + "?user_no=" + user_no;
		}
	}
	if(param != "") {
		param = param + "&filter=" + filter;
	} else {
		param = param + "?filter=" + filter;
	}
	return param;
}

function getCancelReservationList() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var url = "/reservation/cancel/listdata";
	var room_grade_no = $("#room_grade").val();
	if(room_grade_no == "all") {
		room_grade_no = "";
	}
	var field = "", keyword = "";
	var condition = $("#search_condition").val();
	if(condition == "bydate") {
		;
	} else if(condition == "byname") {
		field = "name";
		keyword = $("#search_name").val();
	} else if(condition == "bypname") {
		field = "pname";
		keyword = $("#search_pname").val();
	} else if(condition == "byphone") {
		field = "phone";
		keyword = $("#search_phone").val();
	}
	var display = "chart";
	if($("#display").length) {
		display = $("#display").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			from_date:$("#from_date").val(),
			to_date:$("#to_date").val(),
			room_grade_no: room_grade_no,
			search_condition:$("#search_condition").val(),
			search_field:field,
			search_word:keyword,
			bno:bno,
			display:display
		},
		traditional: true,
		url: url,
		error: function() {
			alert(t("reservation.error.reservelistn"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				if(data.reservation == null ||
						data.reservation.reservation_count <= 0) {
					$("#gantt").hide();
					$("#rlist").hide();
					$("#noreservation").show();
					hideLoadingLayer();
				} else {
					$("#noreservation").hide();
					if(display == "list") {
						$("#gantt").hide();
						$("#rlist").show();
						setList(data);
					} else {
						$("#gantt").show();
						$("#rlist").hide();
						setView(data, 1);
					}
				}
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.cantreserve"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function getDuplicateReservationList() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var url = "/reservation/duplicate/listdata";
	var room_grade_no = $("#room_grade").val();
	if(room_grade_no == "all") {
		room_grade_no = "";
	}
	var display = "chart";
	if($("#display").length) {
		display = $("#display").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			from_date:$("#from_date").val(),
			to_date:$("#to_date").val(),
			room_grade_no: room_grade_no,
			bno:bno,
			display:display
		},
		traditional: true,
		url: url,
		error: function() {
			alert(t("reservation.error.reservelistn"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				if(data.reservation == null ||
						data.reservation.reservation_count <= 0) {
					$("#noreservation").show();
					$("#gantt").hide();
					$("#rlist").hide();
					hideLoadingLayer();
				} else {
					$("#noreservation").hide();
					if(display == "list") {
						$("#gantt").hide();
						$("#rlist").show();
						setList(data);
					} else {
						$("#gantt").show();
						$("#rlist").hide();
						setView(data, 5);
					}
				}
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.cantreserve"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function getReservationListMain(room_grade_no, from_date, to_date, pidx) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var issetup = 0;
	if(pidx == 2) {
		issetup = 1;
	}
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			from_date: from_date,
			to_date: to_date,
			room_grade_no: room_grade_no,
			issetup: issetup,
			bno: bno
		},
		traditional: true,
		url: '/reservation/listdata/main',
		error: function() {
			alert(t("reservation.error.reservelistn"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				setView(data, 3);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.cantreserve"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function getReservationList() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var room_grade_no = $("#room_grade").val();
	if(room_grade_no == "all") {
		room_grade_no = "";
	}
	var user_no = $("#user_no").val();
	var display = "chart";
	if($("#display").length) {
		display = $("#display").val();
	}
	var filter = 0;
	if($("#filter").length) {
		filter = $("#filter").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			from_date:$("#from_date").val(),
			to_date:$("#to_date").val(),
			room_grade_no: room_grade_no,
			user_no: user_no,
			bno: bno,
			display: display,
			filter: filter
		},
		traditional: true,
		url: '/reservation/listdata',
		error: function() {
			alert(t("reservation.error.reservelistn"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				if(data.reservation == null ||
						data.reservation.reservation_count <= 0) {
					$("#gantt").hide();
					$("#rlist").hide();
					$("#noreservation").show();
					$("#roomdashboard").hide();
					hideLoadingLayer();
				} else {
					$("#noreservation").hide();
					$("#roomdashboard").show();
					if(display == "list") {
						$("#gantt").hide();
						$("#rlist").show();
						$("#roomdashboard").hide();
						setList(data);
					} else {
						$("#gantt").show();
						$("#rlist").hide();
						$("#roomdashboard").show();
						setView(data, 2);
					}
				}
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.cantreserve"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function getMonthReservationSchedule(start, end, callback) {
	showLoadingLayer();
	var bno = 0;
	let enterPlan = $("#enterPlan").val();
	let enterConfirm = $("#enterConfirm").val();
	let exitPlan = $("#exitPlan").val();
	let exitConfirm = $("#exitConfirm").val();
	let showMonth = $("#showMonth").val();
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var from_time = start + "";
	var to_time = end + "";
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			enterPlan: enterPlan,
			enterConfirm: enterConfirm,
			exitPlan: exitPlan,
			exitConfirm: exitConfirm,
			from_time: from_time,
			to_time: to_time,
			bno:bno,
			showMonth: showMonth
		},
		traditional: true,
		url: '/reservation/calendar/month',
		error: function() {
			alert(t("reservation.error.reservelist"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				let filtering = res.filtering;
				$("input[name=enterPlan]").val(filtering.enterPlan);
				$("input[name=enterConfirm]").val(filtering.enterConfirm);
				$("input[name=exitPlan]").val(filtering.exitPlan);
				$("input[name=exitConfirm]").val(filtering.exitConfirm);
				var data = res.data;
				var events = data.events;
				callback(events);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.nolist"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function getReservationListOrderByRoom() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	
	var url = "/reservation/room/listdata";
	var room_grade_no = $("#room_grade").val();
	if(room_grade_no == "all") {
		room_grade_no = "";
	}
	var field = "", keyword = "";
	var condition = $("#search_condition").val();
	if(condition == "bydate") {
		;
	} else if(condition == "byname") {
		field = "name";
		keyword = $("#search_name").val();
	} else if(condition == "bypname") {
		field = "pname";
		keyword = $("#search_pname").val();
	} else if(condition == "byphone") {
		field = "phone";
		keyword = $("#search_phone").val();
	} else if(condition == "byduedate") {
		field = "due_date";
		keyword = $("#search_due_date").val();
	}
	var display = "chart";
	if($("#display").length) {
		display = $("#display").val();
	}
	var filter = 0;
	if($("#filter").length) {
		filter = $("#filter").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			from_date:$("#from_date").val(),
			to_date:$("#to_date").val(),
			room_grade_no:room_grade_no,
			search_condition:$("#search_condition").val(),
			search_field:field,
			search_word:keyword,
			bno:bno,
			display:display,
			filter:filter
		},
		traditional: true,
		url: url,
		error: function() {
			alert(t("reservation.error.reservelistn"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				if(data.reservation == null ||
						data.reservation.reservation_count <= 0) {
					$("#gantt").hide();
					$("#rlist").hide();
					$("#noreservation").show();
					$("#roomdashboard").hide();
					hideLoadingLayer();
				} else {
					$("#noreservation").hide();
					$("#roomdashboard").show();
					if(display == "list") {
						$("#gantt").hide();
						$("#rlist").show();
						$("#roomdashboard").show();
						setList(data);
					} else {
						$("#gantt").show();
						$("#rlist").hide();
						$("#roomdashboard").show();
						setView(data, 0);
					}
				}
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.cantreserve"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function getReservationListByGongu(code) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var display = "chart";
	if($("#display").length) {
		display = $("#display").val();
	}
	var filter = 0;
	if($("#filter").length) {
		filter = $("#filter").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			gongu_code:code,
			display:display,
			bno:bno,
			filter:filter
		},
		traditional: true,
		url: '/reservation/gongu/list',
		error: function() {
			alert(t("reservation.error.reservelistn"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				if(data.reservation == null) {
					alert(t("reservation.codea")+code+t("reservation.codeb"));
					$("#gantt").hide();
				} else {
//					$("#btn_help").show();
					$("#btn_help").hide();
					if(display == "list") {
						$("#gantt").hide();
						$("#rlist").show();
						setList(data);
					} else {
						$("#gantt").show();
						$("#rlist").hide();
						setView(data, 4);
					}
				}
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/gongu/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("gongu.cantreserve"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function deleteReservation(reservation_no) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var layer = $('.delete-reserve-confirm').html();

    co.layer(layer,function(el){
    	co.datepicker();
        $(el).on('submit','form',function(){
        	deleteReservationConfirm(reservation_no);
            return false;
        })
    });
}

function deleteReservationConfirm(reservation_no) {
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
			reservation_no:reservation_no,
			bno:bno
		},
		traditional: true,
		url: '/reservation/deleteexe',
		error: function() {
			co.alert(t("reservation.errror"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("reservation.process.del"), function(){
					$(location).attr("href", "list");
				});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
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

function plusPeriod() {
	var period = parseInt($("#display_period").val());
	period = period + 1;
	$("#display_period").val(period);
}

function minusPeriod() {
	var period = parseInt($("#display_period").val());
	if(period == 1) {
		alert(t("reservation.error.dayoverone"));
		return false;
	}
	period = period - 1;
	$("#display_period").val(period);
}

//function displayGanttSelector() {
//	var data = JSON.parse($("#gdata").val());
//	var width = parseInt(data.bwidth)*parseInt($("#display_period").val());
//	$("#"+data.sid).css({
//		"width": width+"px",
//		"height": data.bheight+"px",
//		"top": data.btop+"px",
//		"left": (data.bleft - data.margin_left)+"px",
//		"z-index":100
//	});
//	hideGanttSelector();
//	$("#"+data.sid).show();
//}

function displayGanttSelector(data, days) {
	var width = parseInt(data.bwidth)*parseInt(days) - 1;
	$("#"+data.sid).css({
		"width": width+"px",
		"height": data.bheight+"px",
		"top": data.btop+"px",
		"left": (data.bleft - data.margin_left)+"px",
		"z-index":100
	});
	$("#"+data.sid).show();
}

function viewGanttSelector(id, data) {
	var obj = $("#" + id);
	var parameters = { data:data };
	var menu = [{
			name:t("reservation.one"),
			title:t("reservation.one"),
			parameters:parameters,
			fun:function(d, event) {
				displayGanttSelector(d.parameters.data, 1);
			}
		}, {
			name:t("reservation.seven"),
			title:t("reservation.seven"),
			parameters:parameters,
			fun:function(d, event) {
				displayGanttSelector(d.parameters.data, 7);
			}
		}, {
			name:t("reservation.fifteen"),
			title:t("reservation.fifteen"),
			parameters:parameters,
			fun:function(d, event) {
				displayGanttSelector(d.parameters.data, 15);
			}
		}, {
			name:t("reservation.thirty"),
			title:t("reservation.thirty"),
			parameters:parameters,
			fun:function(d, event) {
				displayGanttSelector(d.parameters.data, 30);
			}
		}];
	var option = {
			triggerOn : 'click',
			mouseClick :'right',
			onOpen:function(data, event) { context_data = data; },
			prefix: 'area',
		};
	obj.contextMenu(menu, option);
}

function saveSubDivId(id, data) {
	sub_id_list[id] = data;
}

function saveDivBarId(data, divid) {
	var reservation_no = data.reservation_no;
	var from_date = data.from_date;
	var to_date = data.to_date;
	if(reservation_no in reservation_id_list) {
		var list = reservation_id_list[reservation_no];
		list.push(divid);
		reservation_id_list[reservation_no] = list;
	} else {
		var list = [divid];
		reservation_id_list[reservation_no] = list;
	}
	if(reservation_no in bar_from_date_list) {
		var e_from_date = bar_from_date_list[reservation_no];
		var diff = calDateRange(from_date, e_from_date);
		if(parseInt(diff) > 0) {
			bar_from_date_list[reservation_no] = from_date;
		}
	} else {
		bar_from_date_list[reservation_no] = from_date;
	}
	if(reservation_no in bar_to_date_list) {
		var e_to_date = bar_to_date_list[reservation_no];
		var diff = calDateRange(to_date, e_to_date);
		if(parseInt(diff) < 0) {
			bar_to_date_list[reservation_no] = to_date;
		}
	} else {
		bar_to_date_list[reservation_no] = to_date;
	}
}

function highlightBar(reservation_no) {
	closeContextMenu();
	if(pre_bar_id_list.length > 0) {
		for(var i=0; i<pre_bar_id_list.length; i++) {
			$("#" + pre_bar_id_list[i]).css({"border-width":"1px"});
		}
		pre_bar_id_list.length = 0;
	}
	if(reservation_no in reservation_id_list) {
		var list = reservation_id_list[reservation_no];
		for(var i=0; i<list.length; i++) {
			pre_bar_id_list.push(list[i]);
			$("#" + list[i]).css({"border-width":"2px"});
		}
	}
}

function closeContextMenu() {
	if(context_data != null) {
		$(context_data.menu.selector).contextMenu('close');
	}
}

function makeRoomInfoContents(reservation) {
	var roominfo = "";
	roominfo = roominfo + "<li><strong>[" + reservation.room_grade_name + "]";
	roominfo = roominfo + " " + reservation.room_name;
	roominfo = roominfo + "</strong> (" + reservation.fdate;
	roominfo = roominfo + " ~ " + reservation.tdate + ")</li>";
	return roominfo;
}

function setList(data) {
	
	var reservation_count = data.reservation_count;
	if(reservation_count <= 0) {
		$("#gantt").hide();
		$("#rlist").hide();
		$("#noreservation").show();
		$("#roomdashboard").hide();
		return false;
	}
	var contents = "";
	var reservation_no_list = data.reservation.reservation_no_list;
	var reservation_list = data.reservation.list;
	
	contents = contents + "<table class='table-list stripe'>";
	contents = contents + "<thead>";
	contents = contents + "<tr>";
	contents = contents + t("reservation.momnamer");
	contents = contents + t("reservation.contactr");
	contents = contents + t("reservation.schedule.natal");
	contents = contents + t("reservation.statusr");
	contents = contents + t("reservation.terms");
	contents = contents + t("reservation.roominfor");
	if($("#filter").val() == 6) {
		contents = contents + "<th scope='row' style='min-width:80px'>취소일</th>";
		contents = contents + "<th scope='row'>취소직원</th>";
		contents = contents + "<th scope='row' style='width:30%'>취소사유</th>";
	}
	contents = contents + t("reservation.detail");
	contents = contents + "</tr>";
	contents = contents + "</thead>";
	contents = contents + "<tbody>";
	
	for(var i=0; i<reservation_no_list.length; i++) {
		
		var reservation_no = reservation_no_list[i];
		var rlist = reservation_list[reservation_no];
		var reservation = rlist[0];
		if(reservation.reservation_cancel_date != null){
			var date = new Date(reservation.reservation_cancel_date);
			var year = String(date.getFullYear());
			var month = String(date.getMonth()+1);
			var day = String(date.getDate());
			reservation.reservation_cancel_date = year + "-" + month + "-" + day;	
		} else if(reservation.reservation_cancel_date == null) {
			reservation.reservation_cancel_date = "";
		}
		if(reservation.reservation_del_manager == null) {
			reservation.reservation_del_manager = "";
		}
		var roominfo = "";
		for(var k=0; k<rlist.length; k++) {
			var r = rlist[k];
			roominfo = makeRoomInfoContents(reservation);
		}
		var massage = t("reservation.before") + reservation.massage_pre_count + t("reservation.after") + reservation.massage_post_count;
		contents = contents + "<tr>";
		contents = contents + "<td><strong>" + reservation.name + "</strong></td>";
		contents = contents + "<td>" + reservation.phone + "</td>";
		contents = contents + "<td class='u-data'><strong>" + reservation.due_date + "</strong></td>";
		contents = contents + "<td><strong>" + reservation.stat + "</strong></td>";
		contents = contents + "<td>" + reservation.period + t("reservation.day");
		contents = contents + "<td><ul>" + roominfo + "</ul></td>";
		if($("#filter").val() == 6) {
			contents = contents + "<td>" + reservation.reservation_cancel_date + "</td>";
			contents = contents + "<td>" + reservation.reservation_del_manager + "</td>";
			contents = contents + "<td>" + reservation.memo + "</td>";
		}
		contents = contents + "<td><a href='/reservation/view?reservation_no=" + reservation_no + "' class='btn-middle bg-sky'><i class='icon-detail'></i><span class='text'>" + t("reservation.lookdetail") + "</span></a></td>";
		
		contents = contents + "</tr>";
	}
	contents = contents + "</table>";
	$("#rlist").html(contents);
	
	if($("#rdashboard").length) {
		var reservation = data.reservation;
	
		if(reservation.min_room_count_list != null) {
			var contents = "";
			var min_room_count_list = reservation.min_room_count_list;
	
			$("#rdashboard").empty();
			
			for(var i=0; i<min_room_count_list.length; i++) {
				var min_room_count = min_room_count_list[i];
				var status = "<li>";
				status = status + min_room_count.grade + " : <strong class=\"value\">" + min_room_count.min_count;
				status = status + "</strong></li>";
				contents = contents + status;
			}
			$("#rdashboard").append(contents);
		} else {
			$("#roomdashboard").hide();
		}
	}
	hideLoadingLayer();
}

/**
 * draw gantt chart
 * @param tdata - chart data
 * @param type - 0 : by room / 1 : by cancel / 2 : by user / 3 : by main / 4 : by gongu / 5 : by duplicate
 */
function setView(tdata, type) {
	reservation_id_list = {};
	sub_id_list = {};
	var source = getNullSource();
	var reservation = tdata.reservation;
	if(reservation != null && reservation.source != null) {
		source = reservation.source;
	}
	var showSelector = false;
	if(type == 0) {
		showSelector = true;
	}
	$("#gantt").gantt({
		source:source,
		itemsPerPage:200,
		months:[t("balance.january"), t("balance.february"), t("balance.march"), t("balance.april"), t("balance.may"), t("balance.june"), t("balance.july"), t("balance.august"), t("balance.september"), t("balance.october"), t("balance.november"), t("balance.december")],
		dow:[t("common.Sunday"), t("common.Monday"), t("common.Tuesday"), t("common.Wednesday"), t("common.Thursday"), t("common.Friday"), t("common.Saturday")],
		navigate:"scroll",//buttons or scroll
		scale:"days",//days, weeks, months
		minScale:"hours",
		maxScale:"months",
		waitText:t("gongu.wait"),
		showSelector:showSelector,
		selectorId:"selector",
		showNavi:true,
		onItemClick:function(data) { highlightBar(data.reservation_no); },
		onDateClick:function(obj, data) {  },
		onDayClick:function(obj, data) {  },
		onRemainClick:function(obj, data) {  },
		createContext:function(id, data) { saveSubDivId(id, data); },
		saveBarId:function(data, divid) { saveDivBarId(data, divid); },
		onAddClick:function (dt, rowId) { closeContextMenu(); },
		onScroll:function(data) { closeContextMenu(); },
		onRender:function () {
			var rc = 0;
			for(var i=0; i<source.length; i++) {
				var one = source[i];
				if(parseInt(one.room_no) > 0) {
					room_no_list[i] = one.room_no;
				}
				for(var k=0; k<one.values.length; k++) {
					
					var value = one.values[k];
					var id="#bar" + rc;
					
					if(value.dataObj && value.dataObj !== null && value.dataObj !== "null" && value.dataObj !== "undefined") {
						
						var reservation_no = value.dataObj.reservation_no;
						var issetup = value.dataObj.issetup;
						var isdel = value.dataObj.isdel;
						var period = value.dataObj.period;
						var pay_type = value.dataObj.pay_type;
						var from_date = value.dataObj.from_date;
						var to_date = value.dataObj.to_date;
						var real_money = value.dataObj.real_money;
						var remain_money = value.dataObj.remain_money;
						var reservation_room_no = value.dataObj.reservation_room_no;
						var room_grade_no = value.dataObj.room_grade_no;
						var room_no = value.dataObj.room_no;
						var isslice = value.dataObj.isslice;
						var inserttime = value.dataObj.inserttime;
						var contract_date = value.dataObj.contract_date;
						var name = value.dataObj.name;
						var ofdate = value.dataObj.ofdate;
						var otdate = value.dataObj.otdate;
						var pay_method = value.dataObj.pay_method;
						var parameters = {
								issetup:issetup,
								isdel:isdel,
								period:period,
								pay_type:pay_type,
								reservation_no:reservation_no,
								from_date:from_date,
								to_date:to_date,
								real_money:real_money,
								remain_money:remain_money,
								reservation_room_no:reservation_room_no,
								room_no:room_no,
								room_grade_no:room_grade_no,
								inserttime:inserttime,
								contract_date:contract_date,
								rindex:i,
								name:name,
								ofdate:ofdate,
								otdate:otdate,
								pay_method:pay_method
						};
						var menu = makeMenu(parameters);
						var option = {
								triggerOn : 'click',
								mouseClick :'right',
								onOpen:function(data, event) {
									context_data = data;
								},
								prefix:'reservation',
							};
						if(isslice == 1 && type != 3) {
							$(id).contextMenu(menu, option);
						}
						if(isslice == 1 && type == 0) {
							setDraggableNResizable(id, parameters);
						}
						$(id).data("parameters", parameters);
						$(id).css({"cursor":"pointer"});
					}
					rc = rc + 1;
				}
			}
			var subIds = $.map(sub_id_list, function(v, i){
				viewGanttSelector(i, v);
			});
			/*
			var pheight = parseInt($("#container").outerHeight());
			var cheight = parseInt($("#gantt").outerHeight());
			var newheight = pheight + cheight;
			$("#container").css("height", newheight + "px");*/
			hideLoadingLayer();
		},
		useCookie:false,
		scrollToToday:false
	});
	if($("#rdashboard").length) {
		
		if(reservation.min_room_count_list != null) {
			var contents = "";
			var min_room_count_list = reservation.min_room_count_list;
	
			$("#rdashboard").empty();
			
			for(var i=0; i<min_room_count_list.length; i++) {
				var min_room_count = min_room_count_list[i];
				var status = "<li>";
				status = status + min_room_count.grade + " : <strong class=\"value\">" + min_room_count.min_count;
				status = status + "</strong></li>";
				contents = contents + status;
			}
			$("#rdashboard").append(contents);
		} else {
			$("#roomdashboard").hide();
		}
	}
}

function makeMenu(parameters) {
	var issetup = parameters.issetup;
	var isdel = parameters.isdel;
	var r1 = {
			name:t("reservation.process.detail"),
			title:t("reservation.process.detail"),
			parameters:parameters,
			fun:function(data, event) {
				var r_no = data.parameters.reservation_no;
				viewReservation(r_no);
			}
		};
	var r2 = {
			name:t("reservation.decideenter"),
			title:t("reservation.decideenter"),
			parameters:parameters,
			fun:function(data, event) {
				setup(
						data.parameters.issetup,
						data.parameters.reservation_no,
						data.parameters.from_date,
						data.parameters.to_date,
						data.parameters.real_money,
						data.parameters.remain_money,
						data.parameters.period,
						data.parameters.pay_type,
						data.parameters.room_grade_no,
						data.parameters.room_no,
						data.parameters.pay_method
						);
			}
		};
	var r3 = {
			name:t("reservation.process.move"),
			title:t("reservation.process.move"),
			parameters:parameters,
			fun:function(data, event) {
				var r_no = data.parameters.reservation_no;
				var r_room_no = data.parameters.room_no;
				var r_reservation_room_no = data.parameters.reservation_room_no;
				var fdate = data.parameters.from_date;
				var tdate = data.parameters.to_date;
				var issetup = data.parameters.issetup;
				viewChangeRoom(r_no, r_room_no, r_reservation_room_no, fdate, tdate, issetup);
			}
		};
	var r4 = {
			name:t("reservation.edit.contractday"),
			title:t("reservation.edit.contractday"),
			parameters:parameters,
			fun:function(data, event) {
				var r_no = data.parameters.reservation_no;
				var r_contract_date = data.parameters.contract_date;
				viewChangeContract(r_no, r_contract_date);
			}
		};
	var r5 = {
			name:t("balance.extension"),
			title:t("balance.extension"),
			parameters:parameters,
			fun:function(data, event) {
				var r_no = data.parameters.reservation_no;
				var from_date = data.parameters.ofdate;
				var to_date = data.parameters.otdate;
				var real_money = data.parameters.real_money;
				viewExtendDate(r_no, from_date, to_date, real_money);
			}
		};
		
	var r6 = {  // 퇴실확정
		name:t("index.exit.confirm"),
		title:t("index.exit.confirm"),
		parameters:parameters,
		fun:function(data, event) {
			var name = data.parameters.name;
			var reservation_no = data.parameters.reservation_no;
			var from_date = data.parameters.from_date;
			var to_date = data.parameters.to_date;
			var room_no = data.parameters.room_no;
			viewExitConfirm(reservation_no, name, from_date, to_date);
		}
	};	
		
	var r = [];
	r.push(r1);
	if(isdel != 1) {
		if(issetup == 0) {  // 삭제된 예약
			r.push(r2);
		}
		if(issetup == 1) {  // 입실 확정된 예약
			r.push(r3);
			r.push(r5);
			r.push(r6);
		}
	}
	r.push(r4);
	var p1 = {
			name:t("reservation.pay.list"),
			title:t("reservation.pay.list"),
			parameters:parameters,
			fun:function(data, event) {
				var r_no = data.parameters.reservation_no;
				viewPaymentHistory(r_no);
			}
		};
	var p2 = {
			name:t("balance.paybalance"),
			title:t("balance.paybalance"),
			parameters:parameters,
			fun:function(data, event) {
				viewRemainPayment(
						data.parameters.reservation_no,
						data.parameters.real_money,
						data.parameters.remain_money
						);
			}
		};
	var p = [];
	p.push(p1);
	p.push(p2);
	/*
	if($("#use_payback").length) {
		var use_payback = parseInt($("#use_payback").val());
		if(use_payback == 1) {	// 패이백 옵션이 선택되어 있는 지점이라면...
			var pb1 = {
					name:t("reservation.process.insu"),
					title:t("reservation.process.insu"),
					parameters:parameters,
					fun:function(data, event) {
						viewInsuracePayment(data.parameters.reservation_no);
					}
			};
			p.push(pb1);
		}
	}
	*/
	var c1 = {
			name:t("balance.refund"),
			title:t("balance.refund"),
			parameters:parameters,
			fun:function(data, event) {
				var r_no = data.parameters.reservation_no;
				var option = {"why":[2,4], "checksetup":0};
				refundReservation(
						data.parameters.issetup,
						data.parameters.isdel,
						data.parameters.reservation_no,
						data.parameters.from_date,
						data.parameters.to_date,
						data.parameters.real_money,
						data.parameters.remain_money,
						option
						);
			}
		};
	var c2 = {
			name:t("reservation.cancelsss"),
			title:t("reservation.cancelsss"),
			parameters:parameters,
			fun:function(data, event) {
				var r_no = data.parameters.reservation_no;
				var option = {"why":[3], "checksetup":1};
				refundReservation(
						data.parameters.issetup,
						data.parameters.isdel,
						data.parameters.reservation_no,
						data.parameters.from_date,
						data.parameters.to_date,
						data.parameters.real_money,
						data.parameters.remain_money,
						option
						);
			}
		};
	var c3 = {
			name:t("balance.cancelcontract"),
			title:t("balance.cancelcontract"),
			parameters:parameters,
			fun:function(data, event) {
				viewSleepReservation(
						data.parameters.reservation_no,
						data.parameters.issetup,
						data.parameters.name,
						data.parameters.from_date,
						data.parameters.to_date,
						data.parameters.real_money,
						data.parameters.remain_money
						);
			}
		};
	var c4 = {
			name:t("reservation.dels"),
			title:t("reservation.dels"),
			parameters:parameters,
			fun:function(data, event) {
				var name = data.parameters.name;
				var reservation_no = data.parameters.reservation_no;
				var from_date = data.parameters.from_date;
				var to_date = data.parameters.to_date;
				var real_money = data.parameters.real_money;
				viewDeleteReservation(name, reservation_no, from_date, to_date, real_money);
			}
		};
	var c = [];
	if(isdel != 1) {
		if(issetup == 1) {
			c.push(c1);
		}
		if(issetup == 0) {
			c.push(c2);
			c.push(c3);
		}
	}
	c.push(c4);
	var rmenu = {
			name:t("reservation.reserve"),
			title:t("reservation.reserve"),
			subMenu: r
		};
	var pmenu = {
			name:t("reservation.pay"),
			title:t("reservation.pay"),
			subMenu: p
		};
	var cmenu = {
			name:t("reservation.cancels"),
			title:t("reservation.cancels"),
			subMenu: c
		};
	var menu = [];
	menu.push(rmenu);
	menu.push(pmenu);
//	if(isdel != 1) {
//		if(issetup == 0 || issetup == 1) {
//			menu.push(cmenu);
//		}
//	}
	menu.push(cmenu);
	return menu;
}

function setDraggableNResizable(id, parameters) {
	$(id).draggable({
		start : function (event, ui){
			startDrag($(this), event, ui);
		},
		stop : function (event, ui){
			stopDrag($(this), event, ui);
		}
	});
	$(id).resizable({
		handles:'e, w',
		grid:24,
		minWidth:23,
		start : function (event, ui){
			startResize($(this), event, ui);
		},
		stop : function (event, ui){
			stopResize($(this), event, ui);
		},
		resize : function (event, ui){
			duringResize($(this), event, ui);
		}
	});
}

function duringResize(obj, event, ui) {
	obj.css("top", obj.data("orgtop"));
	obj.css("height", obj.data("orgheight"));
}

function startResize(obj, event, ui) {
	obj.data("orgtop", obj.css("top"));
	obj.data("orgwidth", obj.css("width"));
	obj.data("orgheight", obj.css("height"));
}

function stopResize(obj, event, ui) {
	var orgwidth = parseInt(obj.data("orgwidth"));
	var nowwidth = parseInt(obj.css("width"));
	var h = obj.data('ui-resizable').axis;
	var direction = "to";
	if(orgwidth == nowwidth) {
		return ;
	}
	var diffwidth = parseInt(nowwidth) - parseInt(orgwidth);
	var diff = parseInt(diffwidth) / 24;
	if(h == "w") {
		direction = "from";
		diff = 0 - parseInt(diff);
	}
	resizeResizeReservation(direction, diff, obj.data("parameters"));
}

function resizeResizeReservation(direction, diff, parameters) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var reservation_no = parameters.reservation_no;
	var reservation_room_no = parameters.reservation_room_no;
	var from_date = parameters.from_date;
	var to_date = parameters.to_date;
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			reservation_no : reservation_no,
			reservation_room_no : reservation_room_no,
			from_date : from_date,
			to_date : to_date,
			direction : direction,
			diff : diff,
			bno : bno
		},
		traditional: true,
		url: '/reservation/resizeexe',
		error: function() {
			alert(t("app.error"));
			getReservationListOrderByRoom();
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				getReservationListOrderByRoom();
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.editreserve"));
					getReservationListOrderByRoom();
					hideLoadingLayer();
				}
			}
		}
	});
}

function startDrag(obj, event, ui) {
	obj.data("startx", obj.css("left").split("px")[0]);
	obj.data("starty", obj.css("top").split("px")[0]);
}

function stopDrag(obj, event, ui) {
	var left = parseInt(obj.css('left').split("px")[0]);
	var top = parseInt(obj.css('top').split("px")[0]);
	top -= top % 24;
	left -= left % 24;
	var btop = (room_no_list.length * 24) + 96;
	var bleft = $("#dataPanel").width();
	if(top < 96 || top >= btop) {
		top = parseInt(obj.data("starty"));
		left = parseInt(obj.data("startx"));
	} else if(left < 0 || left >= bleft) {
		top = parseInt(obj.data("starty"));
		left = parseInt(obj.data("startx"));
	} else {
		top = top + 2;
		left = left + 12;
	}
	obj.css('top', top);
	obj.css('left', left);
	var changex = left - parseInt(obj.data("startx"));
	var changey = top - parseInt(obj.data("starty"));
	var changetop = changey / 31;
	var changeleft = changex / 31;
	if(changetop == 0 && changeleft == 0) {
		return false;
	}
	modifyMovedReservation(changetop, changeleft, obj.data("parameters"));
}

function modifyMovedReservation(changetop, changeleft, parameters) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var org_room_no = 0, chg_room_no = 0;
	if(changetop != 0) {
		var rindex = parameters.rindex;
		org_room_no = room_no_list[rindex];
		var chgindex = rindex + Math.round(changetop);
		chg_room_no = room_no_list[chgindex];
		if((org_room_no == chg_room_no) && changeleft == 0) {
			return false;
		}
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			old_room_no : org_room_no,
			new_room_no : chg_room_no,
			changeleft : Math.round(changeleft) ,
			from_date : parameters.from_date,
			to_date : parameters.to_date,
			reservation_no : parameters.reservation_no,
			reservation_room_no : parameters.reservation_room_no,
			bno : bno
		},
		traditional: true,
		url: '/reservation/moveexe',
		error: function() {
			alert(t("app.error"));
			getReservationListOrderByRoom();
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				getReservationListOrderByRoom();
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.editreserve"));
					getReservationListOrderByRoom();
					hideLoadingLayer();
				}
			}
		}
	});
}

function getNullSource() {
	var curtime = new Date().getTime();
	var source = {
		name:t("sido.reservelist"),
		desc:t("reservation.error.noreserve"),
		values:[{
			from:curtime,
			to:curtime
		}]
	};
	
}

function chartInit() {
	$("#search_due_date").MonthPicker(monthOption);
	if($("#user_no").length) {
		var user_no = parseInt($("#user_no").val());
		if(user_no > 0) {
			$("#searchArea").hide();
			$("#userArea").show();
		} else {
			$("#searchArea").show();
			$("#userArea").hide();
		}
	}
	setDatePicker("#from_date");
	setDatePicker("#to_date");
	setDatePicker("#f_date");
	setDatePicker("#t_date");
//	setDatePicker("#m_fromdate");
//	setDatePicker("#m_todate");
	setDatePicker("#from_date_p");
	setDatePicker("#to_date_p");
	setDatePicker("#inserttime_c");
	setDatePicker("#contract_date");
	if($("#search_condition").length) {
		$("#search_condition").on("change", function(){
			var condition = $(this).val();
			setSearchCondition(condition);
		});
		var condition = $("#search_condition").val();
		setSearchCondition(condition);
		$("#search_name").on("keyup", function(e){
			if(e.keyCode == 13){
				searchReservation();
			}
		});
		$("#search_pname").on("keyup", function(e){
			if(e.keyCode == 13){
				searchReservation();
			}
		});
		$("#search_phone").on("keyup", function(e){
			if(e.keyCode == 13){
				searchReservation();
			}
		});
		$("#search_due_date").on("keyup", function(e){
			if(e.keyCode == 13){
				searchReservation();
			}
		});
	}
	$("#btn_help").on("click", function(){
		showHelpLayer();
	});
	/*
	$("#search_condition").combobox({"bcssClassName":"text", "bheight":27, "iwidth":100, "iheight":23, "ireadonly":true, "iblur":function(selected){
		var condition = selected.val();
		setSearchCondition(condition);
	}});
	*/
	
	//$("input[type='radio'], input[type='checkbox']").labelauty({ minimum_width:"100px", class:"chkradio" });
	if($("#filter").length) {
		var filter = $("#filter").val();
		if(filter != 0) {
			var flist = filter.split(",");
			for(var i=0; i<flist.length; i++) {
				var f = flist[i];
				var fid = "#filter_div_" + f;
				var tid = "#filter_td_" + f;
				if($(fid).length) {
					$(fid).css({"border-width":"2px"});
				}
				if($(tid).length) {
					$(tid).css({"font-weight":"bold","color":"#FF0000"});
				}
			}
		}
	}
}

function showHelpLayer() {
	var isshow = parseInt($("#isHelpShow").val());
	if(isshow == 0) {
		$("#help_layer").fadeIn();
		$("#isHelpShow").val(1);
	} else {
		$("#help_layer").fadeOut();
		$("#isHelpShow").val(0);
	}
}

function setSearchCondition(condition) {
	if(condition == "bydate") {
		$("#searchByDate").show();
		$("#searchByName").hide();
		$("#searchByPname").hide();
		$("#searchByPhone").hide();
		$("#searchByDueDate").hide();
	} else if(condition == "byname") {
		$("#searchByDate").hide();
		$("#searchByName").show();
		$("#searchByPname").hide();
		$("#searchByPhone").hide();
		$("#searchByDueDate").hide();
	} else if(condition == "bypname") {
		$("#searchByDate").hide();
		$("#searchByName").hide();
		$("#searchByPname").show();
		$("#searchByPhone").hide();
		$("#searchByDueDate").hide();
	} else if(condition == "byphone") {
		$("#searchByDate").hide();
		$("#searchByName").hide();
		$("#searchByPname").hide();
		$("#searchByPhone").show();
		$("#searchByDueDate").hide();
	} else if(condition == "byduedate") {
		$("#searchByDate").hide();
		$("#searchByName").hide();
		$("#searchByPname").hide();
		$("#searchByPhone").hide();
		$("#searchByDueDate").show();
	}
}

function viewCancelReservationList() {
	var from_date = "";
	var to_date = "";
	var room_grade_no = "";
	if($("#from_date").length) {
		from_date = $("#from_date").val();
	}
	if($("#to_date").length) {
		to_date = $("#to_date").val();
	}
	if($("#room_grade").length) {
		room_grade_no = $("#room_grade").val();
	}
	var url = "/reservation/cancel/list";
	var filter = 0;
	if($("#filter").length) {
		filter = $("#filter").val();
	}
	url = url + "?filter=" + filter;
	if(isNull(from_date) == false && isNull(to_date) == false) {
		url = url + "&from_date="+from_date+"&to_date="+to_date+"&room_grade_no="+room_grade_no;;
	}
	$(location).attr("href", url);
}

function viewDuplicateReservationList() {
	var from_date = "";
	var to_date = "";
	var room_grade_no = "";
	if($("#from_date").length) {
		from_date = $("#from_date").val();
	}
	if($("#to_date").length) {
		to_date = $("#to_date").val();
	}
	if($("#room_grade").length) {
		room_grade_no = $("#room_grade").val();
	}
	var url = "/reservation/duplicate/list";
	var filter = 0;
	if($("#filter").length) {
		filter = $("#filter").val();
	}
	url = url + "?filter=" + filter;
	if(isNull(from_date) == false && isNull(to_date) == false) {
		url = url + "&from_date="+from_date+"&to_date="+to_date+"&room_grade_no="+room_grade_no;;
	}
	$(location).attr("href", url);
}

function viewReservationUserList() {
	var url = "/reservation/user/list";
	var filter = 0;
	if($("#filter").length) {
		filter = $("#filter").val();
	}
	url = url + "?filter=" + filter;
	$(location).attr("href", url);
}

function viewReservationList() {
	var from_date = "";
	var to_date = "";
	var room_grade_no = "";
	if($("#from_date").length) {
		from_date = $("#from_date").val();
	}
	if($("#to_date").length) {
		to_date = $("#to_date").val();
	}
	if($("#room_grade").length) {
		room_grade_no = $("#room_grade").val();
	}
	var url = "/reservation/list";
	var filter = 0;
	if($("#filter").length) {
		filter = $("#filter").val();
	}
	url = url + "?filter=" + filter;
	if(isNull(from_date) == false && isNull(to_date) == false) {
		url = url + "&from_date="+from_date+"&to_date="+to_date+"&room_grade_no="+room_grade_no;;
	}
	$(location).attr("href", url);
}

function viewCounsel(id) {
	$("#btnOCounsel" + id).hide();
	$("#btnCCounsel" + id).show();
	$("#divCounsel" + id).show();
}

function closeCounsel(id) {
	$("#btnOCounsel" + id).show();
	$("#btnCCounsel" + id).hide();
	$("#divCounsel" + id).hide();
}

function viewMemo(id) {
	$("#btnOMemo" + id).hide();
	$("#btnCMemo" + id).show();
	$("#divMemo" + id).show();
}

function closeMemo(id) {
	$("#btnOMemo" + id).show();
	$("#btnCMemo" + id).hide();
	$("#divMemo" + id).hide();
}

function closePaymentHistory() {
	$("#mask_popup2").hide();
	$("#div_loading2").hide();
}

function viewPaymentHistory(reservation_no) {
        var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var dt = date.getDate();
		if (dt < 10) {
		  dt = '0' + dt;
		}
		if (month < 10) {
		  month = '0' + month;
		}
		var today = year + '-' + month + '-' + dt;
	
	var layer = $('.payment-history').html();
    co.layer(layer,function(el){
        co.datepicker();
        
        var bno = 0;
    	if($("#bno").length) {
    		bno = $("#bno").val();
    	}
    	
    	$.ajax({
    		type: 'get',
    		async: true,
    		dataType: 'json',
    		data: {
    			reservation_no : reservation_no,
    			bno : bno
    		},
    		traditional: true,
    		url: '/reservation/payment/list',
    		error: function() {
    			alert(t("reservation.erro.paylist"));
    			layer_close("payment_history", "fade");
    		},
    		beforeSend: function() {},
    		success: function(res) {
    			var status = res.status;
    			if(status.result == RESULT_SUCCESS) {
    				var data = res.data;
    				var payment_history = data.payment_history;
    				
    				var contents = "";
    				if(payment_history != null && payment_history.length > 0) {
    					var all_payment_money = 0;
    					for(var i=0; i<payment_history.length; i++) {
    						var payment = payment_history[i];
    						var no = payment.no;
    						var type = parseInt(payment.type);
    						var real_money = payment.real_money;
    						var payment_money = payment.payment;
    						var method = payment.method;
    						var memo = new String(payment.memo);
							if(memo == "undefined"){
								memo = "";
							}
    						var inserttime = parseInt(payment.inserttime);
							var date = new Date(inserttime);
							var year = date.getFullYear();
							var month = date.getMonth()+1;
							if(month < 10){
								month = "0" + month;
							}
							var day = date.getDate();
							if(day < 10){
								day = "0" + day;
							}
							inserttime = year + "-" + month + "-" + day;
							var insertdate = today;
    						/*var inserttime = insertdate.substring(insertdate.indexOf(" ")+1, insertdate.length);*/
    						insertdate = insertdate.substring(0, insertdate.indexOf(" "));
    						contents = contents + "<tr>";
    						contents = contents + "<td>";
    						if(type == 0) {
    							contents = contents + t("balance.reserveadd");
    						} else if(type == 1) {
    							contents = contents + t("balance.balances");
    						} else if(type == 2) {
//    							contents = contents + "일부환불";
    							contents = contents + t("balance.refund");
    						} else if(type == 3) {
    							contents = contents + t("reservation.cancelsss");
    						} else if(type == 4) {
    							contents = contents + t("reservation.refunds");
    						} else if(type == 5) {
    							contents = contents + t("balance.cancelcontract");
    						} else if(type == 6) {
    							contents = contents + t("reservation.process.giveuprefund");
    						} else if(type == 7) {
    							contents = contents + t("balance.extension");
    						}
    						contents = contents + "</td>";
    						
    						contents = contents + "<td>";
    						if(method == "cash") {
    							contents = contents + t("reservation.pay.cash");
    						} else if(method == "card") {
    							contents = contents + t("reservation.pay.card");
    						}
    						contents = contents + "</td>";
    						
    						contents = contents + "<td class=\"right\">";
    						contents = contents + comma(real_money);
    						contents = contents + "</td>";
    						
    						contents = contents + "<td class=\"right\">";
    						contents = contents + comma(payment_money);
    						contents = contents + "</td>";
    						all_payment_money += payment_money;
    						contents = contents + "<td class=\"right\">";
    						contents = contents + comma(real_money -all_payment_money);
    						contents = contents + "</td>";
    						contents = contents + "<td >";
							contents = contents + inserttime;
    						contents = contents + "</td>";
    						contents = contents + "<td class=\"left\" onclick=\"javascript:viewModifyMemo("+i+")\">";
    						contents = contents + "<div id=\"divMemo" + i + "\">";
    						contents = contents + memo;
    						contents = contents + "</div>";
    						contents = contents + "<textarea id=\"txtMemo" + i + "\" style=\"display:none;width:100%;\">";
    						contents = contents + memo;
    						contents = contents + "</textarea>";
    						contents = contents + "<input type=\"hidden\" id=\"payment_history_no_" + i + "\" value=\"" + no + "\" />";
    						contents = contents + "</td>";
    						
    						contents = contents + "</tr>";
    					}
    				}
    				$("#payment_history_list", el).html(contents);
    				
    			} else {
    				if(parseInt(status.code) == 20102) {
    					alert(t("discount.logout"));
    					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
    				} else if(parseInt(status.code) == 20104) {
    					alert(t("discount.login"));
    					$(location).attr("href", "/login/logout");
    				} else {
    					alert(t("reservation.error.paylist"));
    					layer_close("payment_history", "fade");
    				}
    			}
    		}
    	});
        
        $(el).on('submit','form',function(){
            
            return false;
        })
    });
    
}

function viewModifyMemo(idx) {
	var divId = "#divMemo" + idx;
	var txtId = "#txtMemo" + idx;
	var paymentNo = $("#payment_history_no_" + idx).val();
	$(divId).hide();
	$(txtId).unbind('blur');
	$(txtId).on('blur', function(){
		var bno = 0;
		if($("#bno").length) {
			bno = $("#bno").val();
		}
		var memo = $(this).val();
		showLoadingLayer();
		$.ajax({
			type: 'post',
			async: true,
			dataType: 'json',
			data: {
				payment_no : paymentNo,
				memo : memo,
				bno : bno
			},
			traditional: true,
			url: '/reservation/modify/payment/memo',
			error: function() {
				alert(t("reservation.error.editmemos"));
				hideLoadingLayer();
			},
			beforeSend: function() {},
			success: function(res) {
				var status = res.status;
				if(status.result == RESULT_SUCCESS) {
					$(divId).html(memo);
					$(divId).show();
					$(txtId).hide();
				} else {
					if(parseInt(status.code) == 20102) {
						alert(t("discount.logout"));
						$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
					} else if(parseInt(status.code) == 20104) {
						alert(t("discount.login"));
						$(location).attr("href", "/login/logout");
					} else {
						alert(t("reservation.error.editmemo"));
					}
				}
				hideLoadingLayer();
			}
		});
	});
	$(txtId).show();
	$(txtId).focus();
}

function dispCounsel(counsel_no) {
	layer_open("counsel_layer", "fade", true);
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
		url: '/counsel/data',
		error: function() {
			alert(t("reservation.error.counselitem"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var counsel = data.counsel;
				$("#c_pop_name").text(counsel.name);
				$("#c_pop_birth").text(counsel.birth);
				$("#c_pop_phone").text(counsel.phone);
				var address = "("+counsel.zipcode+") "+counsel.address+" "+counsel.address_detail;
				$("#c_pop_address").text(address);
				$("#c_pop_job").text(counsel.job);
				$("#c_pop_due_date").text(counsel.due_date);
				$("#c_pop_hospital").text(counsel.hospital);
				$("#c_pop_birth_count").text(counsel.birth_count);
				$("#c_pop_revisit").text(counsel.revisit);
				$("#c_pop_baby").text(counsel.baby);
				$("#c_pop_counsel").text(counsel.counsel);
				var cdate = new Date(parseInt(counsel.cdate));
				$("#c_pop_cdate").text(cdate.format("isoDate"));
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.fail.counsellist"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function searchCounsel() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var page = 1;
	var search_word = $("#svalue").val();
	if(isNull(search_word)) {
		alert(t("reservation.input.keyword"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			page : page,
			search_field : $("#field").val(),
			search_word : search_word,
			bno : bno
		},
		traditional: true,
		url: '/counsel/data/list',
		error: function() {
			alert(t("reservation.error.searchcounsel"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var totalcount = parseInt(data.counsel_total_count);
				var listcount = parseInt(data.list_count);
				var counsel_list = data.counsel_list;
				var contents = "";
				var more = "";
				if(!$.isEmptyObject(counsel_list) && counsel_list.length > 0) {
					contents = contents + "<colgroup>";
					contents = contents + "<col width=\"15%\" />";
					contents = contents + "<col width=\"20%\" />";
					contents = contents + "<col width=\"15%\" />";
					contents = contents + "<col width=\"40%\" />";
					contents = contents + "<col width=\"10%\" />";
					contents = contents + "</colgroup>";
					contents = contents + "<thead>";
					contents = contents + "<tr>";
					contents = contents + t("center.name");
					contents = contents + t("reservation.contactc");
					contents = contents + t("reservation.schedule.baby");
					contents = contents + t("reservation.counselitem");
					contents = contents + "<th scope=\"col\"></th>";
					contents = contents + "</tr>";
					contents = contents + "</thead>";
					contents = contents + "<tbody>";
					for(var i=0; i<counsel_list.length; i++) {
						var counsel = counsel_list[i];
						var counsel_no = counsel.no;
						var counsel_name = counsel.name;
						var counsel_phone = counsel.phone;
						var counsel_due_date = counsel.due_date;
						var counsel_counsel = counsel.counsel.replaceAll("\n", "<br>");
						var counsel_birth = counsel.birth;
						var jibun = "", detail = "";
						var birthy="", birthm="", birthd="";
						var rno = 0;
						if(counsel_birth.trim().length > 0) {
							try {
								var blist = counsel_birth.trim().split("-");
								if(blist.length == 3) {
									birthy = blist[0];
									birthm = blist[1];
									birthd = blist[2];
								}
							} catch(e) {
								;
							}
						}
						if(counsel.adderss_jibun !== undefined && counsel.address_jibun !== null) {
							jibun = counsel.address_jibun;
						}
						if(counsel.address_detail !== undefined && counsel.address_detail !== null) {
							detail = counsel.address_detail;
						}
						if(counsel.reservation_no !== undefined && counsel.reservation_no !== null) {
							rno = parseInt(counsel.reservation_no);
						}
						contents = contents + "<tr>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + counsel_name;
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + counsel_phone;
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + counsel_due_date;
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:left;word-break:keep-all\">";
						contents = contents + "<button id=\"btnOCounsel" + i + "\" type=\"button\" class=\"btn_gray1\" " +
								"onclick=\"javascript:dispCounsel('" + counsel_no + "');\">" + t("reservation.open") + "</button>";
						contents = contents + "<button id=\"btnCCounsel" + i + "\" type=\"button\" class=\"btn_gray1\" style=\"display:none;\" " +
						"onclick=\"javascript:closeCounsel('" + i + "');\">" + t("reservation.close") + "</button>";
						contents = contents + "<div id=\"divCounsel" + i + "\" style=\"display:none;\">";
						contents = contents + counsel_counsel;
						contents = contents + "</div>";
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + "<input type=\"hidden\" id=\"counsel_user_name_" + counsel.no + "\" value=\"" + counsel.name + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_birthy_" + counsel.no + "\" value=\"" + birthy + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_birthm_" + counsel.no + "\" value=\"" + birthm + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_birthd_" + counsel.no + "\" value=\"" + birthd + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_job_" + counsel.no + "\" value=\"" + counsel.job + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_phone1_" + counsel.no + "\" value=\"" + counsel.phone1 + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_phone2_" + counsel.no + "\" value=\"" + counsel.phone2 + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_phone3_" + counsel.no + "\" value=\"" + counsel.phone3 + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_zipcode_" + counsel.no + "\" value=\"" + counsel.zipcode + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_address_" + counsel.no + "\" value=\"" + counsel.address + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_address_jibun_" + counsel.no + "\" value=\"" + jibun + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_address_detail_" + counsel.no + "\" value=\"" + detail + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_due_date_" + counsel.no + "\" value=\"" + counsel.due_date + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_hospital_" + counsel.no + "\" value=\"" + counsel.hospital + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_birth_count_" + counsel.no + "\" value=\"" + counsel.birth_count + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_revisit_" + counsel.no + "\" value=\"" + counsel.revisit + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_baby_" + counsel.no + "\" value=\"" + counsel.baby + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_counsel_" + counsel.no + "\" value=\"" + counsel.counsel + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_rno_" + counsel.no + "\" value=\"" + rno + "\"/>";
						if(rno != 0) {
							contents = contents + t("reservation.ings");
						} else {
							contents = contents + "<button type=\"button\" class=\"btn_green1\" " +
									"onclick=\"javascript:setCounselInfo('" + counsel_no + "');\">" + t("gongu.select") + "</button>";
						}
						contents = contents + "</td>";
						contents = contents + "</tr>";
					}
					contents = contents + "</tbody>";
					if(totalcount > counsel_list.length) {
						more = more + "<a href='#' class='cbtn' onclick='javascript:moreCounsel(\"" + (parseInt(page)+1) + "\");'>" + t("reservation.more") + "</a>";
					}
				}
				$("#morecounsel").empty();
				if(!$.isEmptyObject(counsel_list) && (totalcount > counsel_list.length)) {
					$("#morecounsel").html(more);
					$("#morecounsel").show();
				} else {
					$("#morecounsel").hide();
				}
				$("#counsel_list").html(contents);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.fail.searchcounsel"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function moreCounsel(page) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var search_word = $("#svalue").val();
	if(isNull(search_word)) {
		alert(t("reservation.input.keyword"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			page : page,
			search_field : $("#field").val(),
			search_word : search_word,
			bno : bno
		},
		traditional: true,
		url: '/counsel/data/list',
		error: function() {
			alert(t("reservation.error.searchcounsel"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var totalcount = parseInt(data.counsel_total_count);
				var listcount = parseInt(data.list_count);
				var counsel_list = data.counsel_list;
				var contents = $("#counsel_list").html();
				contents = contents.replaceAll("</tbody>", "");
				var more = "";
				if(counsel_list.length > 0) {
					for(var i=0; i<counsel_list.length; i++) {
						var counsel = counsel_list[i];
						var counsel_no = counsel.no;
						var counsel_name = counsel.name;
						var counsel_phone = counsel.phone;
						var counsel_due_date = counsel.due_date;
						var counsel_counsel = counsel.counsel.replaceAll("\n", "<br>");
						var counsel_birth = counsel.birth;
						var jibun = "", detail = "";
						var birthy="", birthm="", birthd="";
						var rno = 0;
						if(counsel_birth.trim().length > 0) {
							try {
								var blist = counsel_birth.trim().split("-");
								if(blist.length == 3) {
									birthy = blist[0];
									birthm = blist[1];
									birthd = blist[2];
								}
							} catch(e) {
								;
							}
						}
						if(counsel.adderss_jibun !== undefined && counsel.address_jibun !== null) {
							jibun = counsel.address_jibun;
						}
						if(counsel.address_detail !== undefined && counsel.address_detail !== null) {
							detail = counsel.address_detail;
						}
						if(counsel.reservation_no !== undefined && counsel.reservation_no !== null) {
							rno = parseInt(counsel.reservation_no);
						}
						contents = contents + "<tr>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + counsel_name;
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + counsel_phone;
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + counsel_due_date;
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:left;word-break:keep-all\">";
						contents = contents + "<button id=\"btnOCounsel" + i + "\" type=\"button\" class=\"btn_gray1\" " +
								"onclick=\"javascript:dispCounsel('" + counsel_no + "');\">" + t("reservation.open") + "</button>";
						contents = contents + "<button id=\"btnCCounsel" + i + "\" type=\"button\" class=\"btn_gray1\" style=\"display:none;\" " +
						"onclick=\"javascript:closeCounsel('" + i + "');\">" + t("reservation.close") + "</button>";
						contents = contents + "<div id=\"divCounsel" + i + "\" style=\"display:none;\">";
						contents = contents + counsel_counsel;
						contents = contents + "</div>";
						contents = contents + "</td>";
						contents = contents + "<td style=\"text-align:center;\">";
						contents = contents + "<input type=\"hidden\" id=\"counsel_user_name_" + counsel.no + "\" value=\"" + counsel.name + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_birthy_" + counsel.no + "\" value=\"" + birthy + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_birthm_" + counsel.no + "\" value=\"" + birthm + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_birthd_" + counsel.no + "\" value=\"" + birthd + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_job_" + counsel.no + "\" value=\"" + counsel.job + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_phone1_" + counsel.no + "\" value=\"" + counsel.phone1 + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_phone2_" + counsel.no + "\" value=\"" + counsel.phone2 + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_phone3_" + counsel.no + "\" value=\"" + counsel.phone3 + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_zipcode_" + counsel.no + "\" value=\"" + counsel.zipcode + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_address_" + counsel.no + "\" value=\"" + counsel.address + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_address_jibun_" + counsel.no + "\" value=\"" + jibun + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_address_detail_" + counsel.no + "\" value=\"" + detail + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_due_date_" + counsel.no + "\" value=\"" + counsel.due_date + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_hospital_" + counsel.no + "\" value=\"" + counsel.hospital + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_birth_count_" + counsel.no + "\" value=\"" + counsel.birth_count + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_revisit_" + counsel.no + "\" value=\"" + counsel.revisit + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_baby_" + counsel.no + "\" value=\"" + counsel.baby + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_counsel_" + counsel.no + "\" value=\"" + counsel.counsel + "\"/>";
						contents = contents + "<input type=\"hidden\" id=\"counsel_rno_" + counsel.no + "\" value=\"" + rno + "\"/>";
						contents = contents + "<button type=\"button\" class=\"btn_green1\" " +
								"onclick=\"javascript:setCounselInfo('" + counsel_no + "');\">" + t("gongu.select") + "</button>";
						contents = contents + "</td>";
						contents = contents + "</tr>";
					}
					contents = contents + "</tbody>";
					if(totalcount > counsel_list.length) {
						more = more + "<a href='#' class='cbtn' onclick='javascript:moreCounsel(\"" + (parseInt(page)+1) + "\");'>" + t("reservation.more") + "</a>";
					}
				}
				$("#morecounsel").empty();
				if(totalcount > (listcount * (parseInt(page) - 1) + counsel_list.length) ) {
					$("#morecounsel").html(more);
					$("#morecounsel").show();
				} else {
					$("#morecounsel").hide();
				}
				$("#counsel_list").html(contents);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.fail.searchmom"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function setCounselInfo(counsel_no) {
	var span = null;
	var input = null;
	var rno = parseInt($("#counsel_rno_" + counsel_no).val());
	if(rno != 0) {
		alert(t("reservation.counsel.reserve"));
		return false;
	}
	$("#counsel_no").val(counsel_no);
	var counsel = $("#counsel_counsel_" + counsel_no).val();
	$("#counsel").val(counsel.replaceAll("<br>", "\n"));
	$("#name").val($("#counsel_user_name_"+counsel_no).val());
	span = $("#birthy").next();
	input = span.children(":first");
	input.val($("#counsel_birthy_"+counsel_no).val());
	$("#birthy").val($("#counsel_birthy_"+counsel_no).val());
	span = $("#birthm").next();
	input = span.children(":first");
	input.val($("#counsel_birthm_"+counsel_no).val());
	$("#birthm").val($("#counsel_birthm_"+counsel_no).val());
	span = $("#birthd").next();
	input = span.children(":first");
	input.val($("#counsel_birthd_"+counsel_no).val());
	$("#birthd").val($("#counsel_birthd_"+counsel_no).val());
	$("#job").val($("#counsel_job_"+counsel_no).val());
	$("#phone1").val($("#counsel_phone1_"+counsel_no).val());
	$("#phone2").val($("#counsel_phone2_"+counsel_no).val());
	$("#phone3").val($("#counsel_phone3_"+counsel_no).val());
	$("#zipcode").val($("#counsel_zipcode_"+counsel_no).val());
	$("#addr").val($("#counsel_address_"+counsel_no).val());
	$("#addr_jibun").val($("#counsel_address_jibun_"+counsel_no).val());
	$("#addr2").val($("#counsel_address_detail_"+counsel_no).val());
	$("#due_date").val($("#counsel_due_date_"+counsel_no).val());
	$("#from_date").val($("#counsel_due_date_"+counsel_no).val());
	$("#hospital").val($("#counsel_hospital_"+counsel_no).val());
	span = $("#birth_count").next();
	input = span.children(":first");
	input.val($("#counsel_birth_count_"+counsel_no).val());
	$("#birth_count").val($("#counsel_birth_count_"+counsel_no).val());
	span = $("#revisit").next();
	input = span.children(":first");
	input.val($("#counsel_revisit_"+counsel_no).val());
	$("#revisit").val($("#counsel_revisit_"+counsel_no).val());
	span = $("#baby").next();
	input = span.children(":first");
	input.val($("#counsel_baby_"+counsel_no).val());
	$("#baby").val($("#counsel_baby_"+counsel_no).val());
	hideCounselList();
}

function checkInputRoomChange(fd, td, nfd, ntd) {
	var fdtime = Math.round(new Date(fd).getTime()/1000);
	var tdtime = Math.round(new Date(td).getTime()/1000);
	var nfdtime = Math.round(new Date(nfd).getTime()/1000);
	var ntdtime = Math.round(new Date(ntd).getTime()/1000);
	if(nfdtime < fdtime || nfdtime > tdtime) {
		co.alert(t("reservation.moveroom") + fd + ' ~ ' + td + t("reservation.moverooma"));
		return false;
	}
	if(ntdtime < fdtime || ntdtime > tdtime) {
		co.alert(t("reservation.moveroom") + fd + ' ~ ' + td + t("reservation.moverooma"));
		return false;
	}
	if((fdtime == nfdtime) && (tdtime == ntdtime)) {
		co.alert(t("reservation.select.movedays"));
		
		return false;
	}
	return true;
}

function downloadAesthetic() {
	var check_date = $("#download_year").val() + "-" + $("#download_month").val() + "-01";
	if( isValidDate(check_date) ) {
		;
	} else {
		alert(t("reservation.input.rightday"));
		return false;
	}
	var url = "/excel/aesthetic?year="+$("#download_year").val()+"&month="+$("#download_month").val();
	$("<a>").attr("href", url).attr("target", "_blank")[0].click();
}

function changeRoom() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var reservation_no = $("#reservation_no_p").val();
	var reservation_room_no = $("#reservation_room_no_p").val();
	var room_grade = $("#room_grade_p").val();
	var t_room_no = $("#room_p").val();
	var t_from_date = $("#from_date_p").val();
	var t_to_date = $("#to_date_p").val();
	var room_no = $("#room_o").val();
	var from_date = $("#from_date_o").val();
	var to_date = $("#to_date_o").val();
	if(checkInputRoomChange(from_date, to_date, t_from_date, t_to_date) == false) {
		return ;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			reservation_no:reservation_no,
			reservation_room_no:reservation_room_no,
			room_grade:room_grade,
			t_room_no:t_room_no,
			t_from_date:t_from_date,
			t_to_date:t_to_date,
			room_no:room_no,
			from_date:from_date,
			to_date:to_date,
			bno:bno
		},
		traditional: true,
		url: '/reservation/change/room',
		error: function() {
			co.alert(t("discount.error.add"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("reservation.process.moved"), function(){location.reload();});
			
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.move"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function changeRoomCancel() {
	hideChangeRoom();
}

function changeContract() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var reservation_no = $("#reservation_no_c").val();
	var contract_date = $("#contract_date").val();
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			reservation_no:reservation_no,
			contract_date:contract_date,
			bno:bno
		},
		traditional: true,
		url: '/reservation/change/contract',
		error: function() {
			co.alert(t("reservation.errror"));
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("reservation.edit.contractdays"), function(){location.reload();});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.contractday"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function cancelContract() {
	hideChangeContract();
}

function useCodeForced() {
	alert(t("reservation.process.nocode"));
	$("#enable_code").val(1);
	$("#gongu_code").val("");
}

function addPayMethod(idx) {
	var reservation_no = parseInt($("#reservation_no").val());
	var pay_type = "";
	var pay_method = "";
	var m_pay_count = parseInt($("#m_pay_count").val());
	var pay_count = parseInt($("#pay_count").val());
	pay_count = pay_count + 1;
	m_pay_count = m_pay_count + 1;
	$("#pay_count").val(pay_count);
	$("#m_pay_count").val(m_pay_count);
	pay_count = m_pay_count;
	var paylist = $("#paylist").val();
	paylist = JSON.parse(paylist);
	paylist.push(m_pay_count);
	$("#paylist").val( JSON.stringify(paylist) );
	var today = new Date();
	var contents = "";
	if($("#m_pay_type").length) {
		pay_type = $("#m_pay_type").val();
	}
	if($("#pay_method").length) {
		pay_method = $("#pay_method").val();
	}
	contents = createSetupContents(reservation_no, today, pay_type, pay_method, pay_count);
	
	$("#all_payment").append(contents);
	$("#pay_add_" + idx).hide();
	if(paylist.length == 2) {
		var firstid = paylist[0];
		$("#pay_remove_" + firstid).show();
	}
	$("#payment_" + pay_count).on('paste, keydown', function (e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var payment = uncomma($("#payment_" + pay_count).val());
				if(payment == "" || isNull(payment)) {
					payment = 0;
				}
				if(payment == "-") {
					;
				} else {
					if($.isNumeric(payment) == false) {
						alert(t("reservation.only.realpay"));
						payment = payment.replace(/[^0-9]/g,'');
						$("#payment_" + pay_count).val(comma(payment));
						return false;
					}
				}
				payment = parseInt(payment, 10);
				var real_money = 0, p_money = 0;
				if(pay_type == "deposit") {
					real_money = uncomma($("#m_real_money").val());
					p_money = uncomma($("#m_payment").val());
				} else {
					real_money = uncomma($("#real_money").val());
				}
				var p = getAllPayment(pay_count, payment);
				var remain_money = parseInt(real_money) - parseInt(p) - p_money;
				if(payment > 0 || payment < 0) {
					$("#payment_" + pay_count).val(comma(payment));
				}
				if(pay_type == "deposit") {
					$("#m_remain_money").val(comma(remain_money));
				} else {
					$("#remain_money").val(remain_money);
					$("#remain_money_display").val(comma(remain_money));
				}
			}
		}, 100);
	});
	
	co.datepicker();
}

function removePayMethod(pay_count) {
	var reservation_no = parseInt($("#reservation_no").val());
	var m_pay_count = parseInt($("#m_pay_count").val());
	var tpayment = parseInt(uncomma($("#payment_" + pay_count).val()));
	var remain_money = parseInt(uncomma($("#remain_money").val()));
	remain_money = remain_money + tpayment;
	$("#remain_money").val(remain_money);
	$("#remain_money_display").val(comma(remain_money));
	$("#div_pay_"+pay_count).remove();
	$("#pay_count").val((pay_count-1));
//	if(reservation_no > 0) {
		var paylist = $("#paylist").val();
		paylist = JSON.parse(paylist);
		findNremove(paylist, pay_count);
		$("#paylist").val( JSON.stringify(paylist) );
		var lastid = parseInt(paylist[ (paylist.length - 1) ]);
		$("#pay_add_" + lastid).show();
		if(paylist.length > 1) {
			$("#pay_remove_" + lastid).show();
		} else if(paylist.length == 1) {
			$("#pay_remove_" + lastid).hide();
		}
//	} else {
//		$("#pay_add_" + (pay_count-1)).show();
//		if((pay_count-1) > 0) {
//			$("#pay_remove_" + (pay_count-1)).show();
//		}
//	}
		
		co.datepicker();
}

function extendDate() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var orgDate = $("#e_org_todate").val();
	var newDate = $("#e_todate").val();
	if(isValidDate(orgDate) && isValidDate(newDate)) {
		var oDate = new Date(orgDate);
		var nDate = new Date(newDate);
		if(nDate > oDate) {
			;
		} else {
			co.alert(t("reservation.error.extafterday"), function(){$("#e_todate").focus();});
			return false;
		}
	} else {
		co.alert(t("reservation.input.rightdays"), function(){$("#e_todate").focus();});
		
		
		return false;
	}
	var param = {
			reservation_no:$("#e_m_reservation_no").val(),
			real_money:$("#e_real_money").val(),
			memo:$("#e_memo").val(),
			from_date:$("#e_fromdate").val(),
			to_date:$("#e_todate").val(),
			bno:bno
	};
	var pay_count = parseInt($("#e_m_pay_count").val());
	pay_count = pay_count + 1;
	var paylist = $("#e_paylist").val();
	paylist = JSON.parse(paylist);
	for(var i=0; i<paylist.length; i++) {
		var oneid = paylist[i];
		var typeid = "pay_type_" + oneid;
		var type = $("#e_" + typeid).val();
		var timeid = "inserttime_" + oneid;
		var time = $("#e_" + timeid).val();
		var methodid = "pay_method_" + oneid;
		var method = $("#e_" + methodid).val();
		var paymentid = "payment_" + oneid;
		var payment = uncomma($("#e_" + paymentid).val());
		param[typeid] = type;
		param[timeid] = time;
		param[methodid] = method;
		param[paymentid] = payment;
	}
	param["pay_count"] = pay_count;
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: param,
		traditional: true,
		url: '/reservation/extend/date',
		error: function() {
			co.alert(t("reservation.error.extensions"));
			
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("reservation.process.extensions"), function(){location.reload();});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.extension"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function payRemain() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var rm_money = 0;
	if($("#rp_remain_money").length) {
		rm_money = parseInt(uncomma($("#rp_remain_money").val()));
	}
//	if(rm_money < 0) {
//		alert("잔액은 0원 이상이어야 합니다.");
//		return false;
//	}
	var param = {
			reservation_no:$("#rp_m_reservation_no").val(),
			memo:$("#rp_memo").val(),
			bno:bno
	};
	var pay_count = parseInt($("#rp_m_pay_count").val());
	pay_count = pay_count + 1;
	var paylist = $("#rp_paylist").val();
	paylist = JSON.parse(paylist);
	for(var i=0; i<paylist.length; i++) {
		var oneid = paylist[i];
		var typeid = "pay_type_" + oneid;
		var type = $("#rp_" + typeid).val();
		var timeid = "inserttime_" + oneid;
		var time = $("#rp_" + timeid).val();
		var methodid = "pay_method_" + oneid;
		var method = $("#rp_" + methodid).val();
		var paymentid = "payment_" + oneid;
		var payment = uncomma($("#rp_" + paymentid).val());
		param[typeid] = type;
		param[timeid] = time;
		param[methodid] = method;
		param[paymentid] = payment;
	}
	param["real_money"] = uncomma($("#rp_m_real_money").val());
	param["remain_money"] = uncomma($("#rp_remain_money").val());
	param["pay_count"] = pay_count;
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: param,
		traditional: true,
		url: '/reservation/pay/remain',
		error: function() {
			hideLoadingLayer();
			co.alert(t("reservation.error.balancepayss"));
			
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				co.alert(t("reservation.process.balancepaid"), function(){location.reload();});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.balancepay"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function payInsurance() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var param = {
			reservation_no:$("#insurance_reservation_no").val(),
			memo:$("#insurance_memo").val(),
			bno:bno,
			payment:uncomma($("#insurance_payment").val())
	};
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: param,
		traditional: true,
		url: '/pay/insurance',
		error: function() {
			alert(t("reservation.error.insu"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				alert(t("reservation.process.insued"));
				location.reload();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("reservation.error.insurance"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function addPayMethodForRemain(idx) {
	var reservation_no = parseInt($("#rp_reservation_no").val());
	var pay_type = "";
	var pay_method = "";
	var m_pay_count = parseInt($("#rp_m_pay_count").val());
	var pay_count = parseInt($("#rp_pay_count").val());
	pay_count = pay_count + 1;
	m_pay_count = m_pay_count + 1;
	$("#rp_pay_count").val(pay_count);
	$("#rp_m_pay_count").val(m_pay_count);
	pay_count = m_pay_count;
	var paylist = $("#rp_paylist").val();
	paylist = JSON.parse(paylist);
	paylist.push(m_pay_count);
	$("#rp_paylist").val( JSON.stringify(paylist) );
	let date = new Date();
	let year = date.getFullYear();
	let month = date.getMonth()+1;
	let dt = date.getDate();
	if (dt < 10) {
	  dt = '0' + dt;
	}
	if (month < 10) {
	  month = '0' + month;
	}
	let today = year + '-' + month + '-' + dt;
	var contents = createRemainPaymentContents(today, pay_count);
	
	$("#rp_all_payment").append(contents);
	
	if(paylist.length == 2) {
		var firstid = paylist[0];
		$("#rp_pay_remove_" + firstid).show();
	}
	$("#rp_pay_add_" + idx).hide();
	setRemainPaymentKeyEvent("#rp_payment_"+pay_count, pay_count);
	
	co.datepicker();
	
}

function addPayMethodForExtend(idx) {
	var reservation_no = parseInt($("#e_reservation_no").val());
	var pay_type = "";
	var pay_method = "";
	var m_pay_count = parseInt($("#e_m_pay_count").val());
	var pay_count = parseInt($("#e_pay_count").val());
	pay_count = pay_count + 1;
	m_pay_count = m_pay_count + 1;
	$("#e_pay_count").val(pay_count);
	$("#e_m_pay_count").val(m_pay_count);
	pay_count = m_pay_count;
	var paylist = $("#e_paylist").val();
	paylist = JSON.parse(paylist);
	paylist.push(m_pay_count);
	$("#e_paylist").val( JSON.stringify(paylist) );
	var today = new Date();
	var contents = createExtendDateContents(today, pay_count);

	$("#e_all_payment").append(contents);

	if(paylist.length == 2) {
		var firstid = paylist[0];
		$("#e_pay_remove_" + firstid).show();
	}
	$("#e_pay_add_" + idx).hide();
	setExtendDateKeyEvent("#e_payment_"+pay_count, pay_count);
	
	co.datepicker();
}

function removePayMethodForRemain(pay_count) {
	var reservation_no = parseInt($("#rp_reservation_no").val());
	var m_pay_count = parseInt($("#rp_m_pay_count").val());
	var tpayment = parseInt(uncomma($("#rp_payment_" + pay_count).val()));
	var remain_money = parseInt(uncomma($("#rp_remain_money").val()));
	remain_money = remain_money + tpayment;
	$("#rp_remain_money").val(remain_money);
	$("#rp_remain_money_display").val(comma(remain_money));
	$("#rp_div_pay_"+pay_count).remove();
	$("#rp_pay_count").val((pay_count-1));
	var paylist = $("#rp_paylist").val();
	paylist = JSON.parse(paylist);
	findNremove(paylist, pay_count);
	$("#rp_paylist").val( JSON.stringify(paylist) );
	var lastid = parseInt(paylist[ (paylist.length - 1) ]);
	$("#rp_pay_add_" + lastid).show();
	if(paylist.length > 1) {
		$("#rp_pay_remove_" + lastid).show();
	} else if(paylist.length == 1) {
		$("#rp_pay_remove_" + lastid).hide();
	}
	
	co.datepicker();
}

function removePayMethodForExtend(pay_count) {
	var reservation_no = parseInt($("#e_reservation_no").val());
	var m_pay_count = parseInt($("#e_m_pay_count").val());
	$("#e_div_pay_"+pay_count).remove();
	$("#e_pay_count").val((pay_count-1));
	var paylist = $("#e_paylist").val();
	paylist = JSON.parse(paylist);
	findNremove(paylist, pay_count);
	$("#e_paylist").val( JSON.stringify(paylist) );
	var lastid = parseInt(paylist[ (paylist.length - 1) ]);
	$("#e_pay_add_" + lastid).show();
	if(paylist.length > 1) {
		$("#e_pay_remove_" + lastid).show();
	} else if(paylist.length == 1) {
		$("#e_pay_remove_" + lastid).hide();
	}
	
	co.datepicker();
}

function createSetupContents(reservation_no, today, pay_type, pay_method, pay_count) {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var dt = date.getDate();
	if (dt < 10) {
	  dt = '0' + dt;
	}
	if (month < 10) {
	  month = '0' + month;
	}
	var today = year + '-' + month + '-' + dt;
	
	var disp = "";
	if(pay_count == 0) {
		disp = "none";
	}
	
	var contents = '<li class="field-row full clearfix" id="div_pay_' + pay_count+'">';
	if(reservation_no > 0 || pay_type == 'deposit') {
		contents += '<div class="field xxsmall select">';
		contents = contents + '<select class="setup_pay_type" id="pay_type_'+pay_count+'">';
		contents = contents + t("reservation.adds");
		contents = contents + t("reservation.paybalance");
		contents = contents + t("reservation.refund");
		contents = contents + t("reservation.cancelss");
		contents = contents + t("reservation.contractrefund");
		contents = contents + t("reservation.extensionterm");
		contents = contents + '</select>';
		contents += '</div>';
	}
	contents += '<div class="field xxsmall select">';
	contents = contents + '<select class="setup_pay_method" id="pay_method_'+pay_count+'">';
	if(reservation_no > 0) {
		contents = contents + t("reservation.pay.cashs");
	} else {
		if(pay_method == 'cashcard' || pay_method == "") {
			contents = contents + t("reservation.pay.cashs");
		}
	}
	contents = contents + t("reservation.pay.cards");
	contents = contents + '</select>';
	contents += '</div>';
	
	contents += '<div class="field xsmall">';
	contents = contents + '<input type="text" id="payment_'+pay_count+'" value="0" class="i-text"/>';
	contents += '</div>';
	
	if(reservation_no > 0 || pay_type == 'deposit') {
		contents += '<div class="field xsmall datepicker">';
		contents += '<input type="text" class="i-text" readonly id="inserttime_' + pay_count + '" value="'+ today +'">';
		contents += '</div>';
	}
	
	contents += '<div class="tools">';
	contents += '<a href="javascript:addPayMethod('+pay_count+');" id="rp_pay_add_'+pay_count+'" class="payment-append">';
	contents += '<i class="icon-row-append"></i>';
	contents += '<span class="text-ir">결제 추가</span>';
	contents += '</a>';
	contents += '<a href="javascript:removePayMethod('+pay_count+');" id="rp_pay_remove_'+pay_count+'" class="payment-canceled" style="display:' + disp + '">';
	contents += '<i class="icon-row-remove"></i>';
	contents += '<span class="text-ir">결제 취소</span>';
	contents += '</a>';
	contents += '</div>';
	contents += '</li>';
	
	return contents;
}

function createRemainPaymentContents(today, pay_count) {
	var contents = "";
	var disp = "";
	contents += "<li class=\"field-row full clearfix\" id='rp_div_pay_" + pay_count + "'>";
	contents += '<input type="hidden" id="rp_pay_type_' + pay_count + '" value="1"/>';
	contents += "<div class=\"field xxsmall select\">";
	contents += "<select id=\"rp_pay_method_" + pay_count + "\">";
	contents += t("reservation.pay.cashs");
	contents += t("reservation.pay.cards");
	contents += '</select>';
	contents += '</div>';
	contents += '<div class="field xxsmall">';
	contents += '<input type="text" class="i-text" id="rp_payment_' + pay_count + '">';
	contents += '</div>';
	contents += '<div class="field xsmall datepicker">';
	contents += '<input type="text" class="i-text" readonly id="rp_inserttime_' + pay_count + '" value="'+today+'">';
	contents += '</div>';
	contents += '<div class="tools">';
	contents += '<a href="javascript:addPayMethodForRemain('+pay_count+');" id="rp_pay_add_'+pay_count+'" class="payment-append">';
	contents += '<i class="icon-row-append"></i>';
	contents += '<span class="text-ir">결제 추가</span>';
	contents += '</a>';
	contents += '<a href="javascript:removePayMethodForRemain('+pay_count+');" id="rp_pay_remove_'+pay_count+'" class="payment-canceled" style="display:' + disp + '">';
	contents += '<i class="icon-row-remove"></i>';
	contents += '<span class="text-ir">결제 취소</span>';
	contents += '</a>';
	contents += '</div>';
	contents += '</li>';
	
	return contents;
}

function createExtendDateContents(today, pay_count) {
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth()+1;
	var dt = date.getDate();
	if (dt < 10) {
	  dt = '0' + dt;
	}
	if (month < 10) {
	  month = '0' + month;
	}
	var today = year + '-' + month + '-' + dt;
	
	var contents = "";
	var disp = "";
	if(pay_count == 0) {
		disp = "none";
	}
	
	contents += "<li class=\"field-row full clearfix\" id='e_div_pay_" + pay_count + "'>";
	contents += '<input type="hidden" id="e_pay_type_' + pay_count + '" value="7"/>';
	
	contents += "<div class=\"field xxsmall select\">";
	
	
	contents += "<select id=\"e_pay_method_" + pay_count + "\">";
	contents += t("reservation.pay.cashs");
	contents += t("reservation.pay.cards");
	contents += '</select>';
	contents += '</div>';
	
	contents += '<div class="field xxsmall">';
	contents += '<input type="text" class="i-text" id="e_payment_' + pay_count + '">';
	contents += '</div>';
	
	contents += '<div class="field xsmall datepicker">';
	contents += '<input type="text" class="i-text" readonly id="e_inserttime_' + pay_count + '" value="'+today+'">';
	/*contents += '<input type="text" class="i-text" readonly id="e_inserttime_' + pay_count + '" value="'+today.format("isoDate")+'">';*/
	contents += '</div>';
	
	
	contents += '<div class="tools">';
	contents += '<a href="javascript:addPayMethodForExtend('+pay_count+');" id="e_pay_add_'+pay_count+'" class="payment-append">';
	contents += '<i class="icon-row-append"></i>';
	contents += '<span class="text-ir">결제 추가</span>';
	contents += '</a>';
	contents += '<a href="javascript:removePayMethodForExtend('+pay_count+');" id="e_pay_remove_'+pay_count+'" class="payment-canceled" style="display:' + disp + '">';
	contents += '<i class="icon-row-remove"></i>';
	contents += '<span class="text-ir">결제 취소</span>';
	contents += '</a>';
	contents += '</div>';
	contents += '</li>';
	
	return contents;
}

$(function() {
	$(".tooltip").tooltipster({
		animation:'fade',
		delay:200,
		theme:'tooltipster-light',
		trigger:'click',
		side:'right',
		minWidth:200,
		interactive:true,
	});
});

function setDatePicker(a) {
	
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

function pressEnter(){
	if(window.event.keyCode == 13){
		searchReservation();
	};
}

function reservationManage(e){
	switch(e){
		case "1" : //입실확정
		setup(issetup, reservation_no, from_date, to_date, real_money, remain_money, period, pay_type, room_grade_no, room_no, pay_method);
		break;
		case "2" : //객실이동
		viewChangeRoom(reservation_no, r_room_no, r_reservation_room_no, from_date, to_date, issetup);
		break;
		case "3" : // 계약일 수정						
		viewChangeContract(reservation_no, r_contract_date);
		break;
		case "4" : // 기간 연장
		viewExtendDate(reservation_no, from_date, to_date, real_money);
		break;
		case "5" : // 퇴실 확정
		viewExitConfirm(reservation_no, name, from_date, to_date);
		break;
		case "6" : // 결제 내역
		viewPaymentHistory(reservation_no);
		break;
		case "7" : // 잔금 결제
		viewRemainPayment(reservation_no, real_money, remain_money);
		break;
		case "8" : //환불
		var option = {"why":[2], "checksetup":0};
		refundReservation(issetup, isdel, reservation_no, from_date, to_date, real_money, remain_money, option);
		break;
		case "9" : // 예약 취소
		var option = {"why":[3], "checksetup":1};
		refundReservation(issetup, isdel, reservation_no, from_date, to_date, real_money, remain_money, option);
		break;
		case "10" : // 계약 포기
		viewSleepReservation(reservation_no, issetup, name, from_date, to_date, real_money, remain_money);
		break;
		case "11" : // 예약 삭제
		viewDeleteReservation(name, reservation_no, from_date, to_date, real_money);
		break;
	}
}

function setFilterCalendar(option) {
	$("#calendar").fullCalendar('destroy');
	
	let showMonth = $("#showMonth").val();
	let year = showMonth.slice(0, 4); 
	let month = showMonth.slice(-3, -1);
	if(month.slice(0,1) == " "){
		month = month.replace(' ','0');
	}
	let date = year + '-' + month;
	
	if($('#'+option).val() =="y") {
		$('#'+option).val("n");
		$('#'+option+'Check').removeClass("icon-show-"+option);
	} else if($('#'+option).val() =="n") {
		$('#'+option).val("y");
		$('#'+option+'Check').addClass("icon-show-"+option);
	}
	
	var today = new Date(date);
	
	drawCalendar(today);
}

function addReservationFile(){
	var fieldCount = parseInt($(".ufile").size());
	var fieldNumCount = fieldCount + 1; 
	var contents = "";
	contents += "<li id='field_" + fieldNumCount+ "'><div class='field-row file-field' style='height:40px;'>";
    contents += "<div class='field'><input type='text' readonly class='i-filename'></div>";
    contents += "<label class='i-file field'><input type='file' id='file_" + fieldNumCount + "' class='ufile'><span class='text'>" + t("manage.find.file") + "</span></label>";
	contents += "<span class='tools' style='margin-left:5px;'>";
	contents += "<a href='javascript:addReservationFile();' class='file-append' id='' style='display:inline-block;'><i class='icon-row-append'></i></a>";
	contents += "<a href='javascript:removeAddReservationFile(" + fieldNumCount + ");' class='file-canceled' id='' style='display:inline-block; margin-left:4px;'><i class='icon-row-remove'></i></a>";
	contents += "</span></div></li>";
	$("#reservation_file").append(contents);
	$("#field_count").val(fieldCount + 1);
	$("#file_id_count").val(fieldNumCount + 1);
	
	$('.file-field').on('change','input:file',function(){
		var files = this.files[0];
		files = files && files.name || '';
		$(this).closest('.file-field').find('.i-filename').val(files);
	});
}

function removeReservationAgreeFile() {
	let fileName = $("#agreefilename").val();
	$("#agree-file").remove();
	var contents = "";
	contents += "<div id='agree-file'>";
	contents += "<div class='field'>";
    contents += "<input type='text' readonly class='i-filename' id='agreefilename' value=''>";
    contents += "</div>";
	contents += "<label class='i-file field'>";
	contents += "<input type='file' id='agree_file' class='agree_file'>";
	contents += "<span class='text'>" + t('manage.find.file') +"</span>";
	contents += "</label>";
	contents += "<span class='tools'>";
    contents += "<a href='javascript:removeReservationAgreeFile();' class='file-append' style='display:inline-block; margin-left:5px;'>";
	contents += "<i class='icon-row-cancel'></i>";
    contents += "</a></span></div>";
	$("#agree-file-field").append(contents);
	if($("#page").val() == "modify") {
		if(fileName != "" || fileName != undefined){
			$.ajax({
				type: 'post',
				async: true,
				dataType: 'json',
				data: {
					bno : $("#bno").val(),
					reservation_no: $("#reservation_no").val()
				},
				traditional: true,
				url: '/reservation/delreservefile',
				error: function() {
					alert(t("app.error"));
				},
				beforeSend: function() {},
				success: function(res) {
					var status = res.status;
					var data = res.data;
					if(status.result == RESULT_SUCCESS) {
						co.alert("삭제되었습니다");
						;
					} else {
						if(parseInt(status.code) == 20102) {
							alert(t("discount.logout"));
							$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/modify"));
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
	}
}

function DeleteFilePopup(type, index, filelink){
	$("#index").val(index);
	$("#type").val(type);
	$("#filelink").val(filelink);
	
	BPOPUP =  $('#reservationFileDeleteConfirm').bPopup({
		modalClose : false
	});
}

function removeReservationFile(){
	$('#reservationFileDeleteConfirm').bPopup().close();
	let index = $("#index").val();
	let type = $("#type").val();
	let filelink = $("#filelink").val();
	if(type == 0) {
		removeReservationAgreeFile();
	} else if(type == 1){
		if($("#input_"+ index).val() != undefined){
			$("#delId").val($("#input_"+e).val());
		} else{
			if(index == undefined){
			index = 0;
			}
			if($("#reservation_no").val() > 0){
				let fileName = $("#filename_"+ index).val();
				if(fileName != "" || fileName != undefined){
					removeReservationFileExe(fileName);
				}
				if($(".file-field").size() == 1){
					if(fileName != "" || fileName != undefined){
						$("#field_count").val($("#field_count").val() -1);	
						$("#field_"+ index).remove();
						addReservationFile();
					};
				}else{
					$("#field_count").val($("#field_count").val() -1);
					$("#field_"+ index).remove();
				};
			};
		}
	} else if(type == 3) {
		deleteUploadedFile(filelink);
	} 
}

function removeReservationFileExe(fileName){
	$.ajax({
			type: 'post',
			async: false,
			dataType: 'json',
			data: {
				bno : $("#bno").val(),
				filename: fileName,
				reservation_no: $("#reservation_no").val()
			},
			traditional: true,
			url: '/reservation/delreservefile',
			error: function() {
				alert(t("app.error"));
			},
			beforeSend: function() {},
			success: function(res) {
				var status = res.status;
				var data = res.data;
				if(status.result == RESULT_SUCCESS) {
					co.alert("삭제되었습니다");
				} else {
					if(parseInt(status.code) == 20102) {
						alert(t("discount.logout"));
						$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/modify"));
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
		url: '/reservation/delfile',
		error: function() {
			alert(t("app.error"));
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				$('#reservationDeleteConfirm').bPopup().close();
				co.alert(t("삭제되었습니다"), function() {$(location).attr("href", "/reservation/modify?reservation_no="+no);});
				;
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/modify"));
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
	
function deleteUploadedFile(filelink) {
	var no = $("reservation_no").val();
	var bno = $("#bno").val();
	var manager = $("#user").val();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			bno : bno,
			filelink: filelink,
			manager : manager
		},
		traditional: true,
		url: '/reservation/exitReservationConfirmDeleteFile',
		error: function() {
			alert(t("app.error"));
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				co.alert(t("삭제되었습니다"), function() {location.reload()});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/reservation/modify"));
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

function removeAddReservationFile(e){
	if($(".file-field").size() == 1){
		$("#field_count").val($("#field_count").val() -1);	
		$("#field_"+ e).remove();
		addReservationFile();
	} else {
		$("#field_count").val($("#field_count").val() -1);	
		$("#field_"+ e).remove();
	}
}	
