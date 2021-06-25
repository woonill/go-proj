/**
 * 
 */

$( document ).ready(function() {
	$('a', $('#nav')).each(function( index ) {
		if ($(this).text() == t("balance.calc") ) {
			$(this).parent().addClass("active");
		}
	});
	
});
function getMainBalanceStat() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var rseries1 = t("balance.depositmoney");
	var rseries2 = t("balance.withdmoney");
	var rseries3 = t("balance.difference");
	var sseries1 = t("balance.spendmoney");

	$("#chartR").show();
	$("#chartS").show();
	
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			from_date : $("#from_date").val(),
			to_date : $("#to_date").val(),
			bno : bno
		},
		traditional: true,
		url: '/balance/main/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var reservation = data.reservation;
				var inventory = data.inventory.money;
				var spend = data.spend;
				var aesthetic = data.aesthetic;
				var rlabel = reservation.label;
				var imlabel = inventory.label;
				var slabel = spend.label;
				var alabel = aesthetic.label;
				var rbalance = reservation.balance;
				var imbalance = inventory.balance;
				var sbalance = spend.balance;
				var abalance = aesthetic.balance;
				var rseriesList = [
				                   {label:rseries1},
				                   {label:rseries2},
				                   {label:rseries3},
				                   
								];

				var sseriesList = [
									{label:sseries1}
								];

				var roption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},seriesColors:["#66CDAA", "#FF6347", "#1E90FF"]};
				var rChart = drawGraph("chartR", "[예약] 월별 입/출금 현황", rbalance, rseriesList, rlabel, 0, roption);
				var soption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},seriesColors:["#FF6347"]};
				var sChart = drawGraph("chartS", t("balance.monthly.spendlist"), sbalance, sseriesList, slabel, 0, soption);
				
				$("#chartR").off('jqplotDataClick');
				$("#chartR").on(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = rlabel[(idx-1)];
							if(seriesIndex == 0 || seriesIndex == 1) {
								viewStatDetailForMain(seriesIndex, month);
							}
						}
					);
				$("#chartS").off('jqplotDataClick');
				$("#chartS").on(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = rlabel[(idx-1)];
							if(seriesIndex == 0 || seriesIndex == 1) {
								var i = seriesIndex + 4;
								viewStatDetailForMain(i, month);
							}
						}
					);
				
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/balance/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("balance.nocalc"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function viewStatDetailForMain(sindex, month) {
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
			ismain:1,
			type:sindex,
			month:month,
			bno:bno
		},
		traditional: true,
		url: '/balance/detail/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var detail_list = data.detail_list;
				if(sindex == 0 || sindex == 1) {
					viewStatDetailForReservation(sindex, month, detail_list);
				
				} else if(sindex == 4 || sindex == 5) {
					viewStatDetailForSpend(sindex, month, detail_list);
				}
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/balance/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("balance.nocalc"));
				}
			}
		}
	});
}

function viewStatDetailForReservation(sindex, month, detail_list) {
	
	if (sindex == 0) {
		$('#payment_title').text(t("balance.deposit"));
	} else {
		$('#payment_title').text(t("balance.withdrawal"));
	}
	
	$('#payment_date').text(month);
	
	$('#payment_tbody').empty();
	
	if(detail_list != null && detail_list != "null" && detail_list.length > 0) {
		for(var i=0; i<detail_list.length; i++) {
			var detail = detail_list[i];
			var reservation_no = detail.no;
			var payment_history = detail.payment_history;
			
			var contents = "<tr onclick='javascript:viewReservationNewWindow(\"" + reservation_no + "\");' class='balancePopup'>";
			
			contents = contents + '<td class="col num">';
			contents = contents + (detail_list.length - i);
			contents = contents + "</td>";
			contents = contents + "<td class='col name'>";
			contents = contents + detail.name;
			contents = contents + "</td>";
			contents = contents + "<td class='col tel'>";
			contents = contents + detail.phone;
			contents = contents + "</td>";
			contents = contents + "<td class='col period'>";
			contents = contents + detail.from_date + " ~ " + detail.to_date;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + "<table>";
			for(var k=0; k<payment_history.length; k++) {
				var payment = payment_history[k];
				var type = "", method = "";
				if(payment.type == 0) {
					type = t("balance.reserveadd");
				} else if(payment.type == 1) {
					type = t("balance.paybalance");
				} else if(payment.type == 2) {
					type = t("balance.refund");
				} else if(payment.type == 3) {
					type = t("reservation.cancelsss");
				} else if(payment.type == 4) {
					type = t("balance.refund");
				} else if(payment.type == 5) {
					type = t("balance.cancelcontract");
				} else if(payment.type == 6) {
					type = t("reservation.process.giveuprefund");
				} else if(payment.type == 7) {
					type = t("balance.extension");
				}
				if(payment.method == "cash") {
					method = t("reservation.cashs");
				} else if(payment.method == "card") {
					method = t("reservation.cards");
				} else if(payment.method == "cashcard") {
					method = t("balance.cashcard");
				}
				var date = new Date(parseInt(payment.inserttime));
				var insertdate = date.format("isoDate");
				contents = contents + "<tr>";
				contents = contents + "<td class='col history'>";
				contents = contents + type;
				contents = contents + "</td>";
				contents = contents + "<td class='col type'>";
				contents = contents + method;
				contents = contents + "</td>";
				contents = contents + "<td class='col value'>";
				contents = contents + comma(payment.payment);
				contents = contents + "</td>";
				contents = contents + "<td class='col payment-date'>";
				contents = contents + insertdate;
				contents = contents + "</td>";
				contents = contents + "</tr>";
			}
			contents = contents + "<table></td>";
            
			contents = contents + "</tr>";
			
			$('#payment_tbody').append(contents);
		}
	}
	
	hideLoadingLayer();
	
	co.reservePayment = function(){
        var layer = $('.reserve-payment').html();
        co.layer(layer);
    }
    co.reservePayment();
}

function viewStatDetailForSpend(idx, month, detail_list) {
	$('#spend_date').text(month);
	
	$('#spend_tbody').empty();
	if(detail_list != null && detail_list != "null" && detail_list.length > 0) {
		
		for(var i=0; i<detail_list.length; i++) {
			var detail = detail_list[i];
			var type = parseInt(detail.type);
			var itype = parseInt(detail.inventory_type);
			var p = t("reservation.cashs");
			if(type == 1) {
				p = t("reservation.cards");
			}
			var item = "";
			if(itype == 2) {
				item = t("balance.equip");
			} else if(itype == 3) {
				item = t("balance.expense");
			} else if(itype == 1000) {
				item = t("balance.etc");
			}
			
			var contents = "<tr>";
			contents = contents + "<td class='col num'>";
			contents = contents + (detail_list.length - i);
			contents = contents + "</td>";
			contents = contents + "<td class='col subject'>";
			contents = contents + detail.spend;
			contents = contents + "</td>";
			contents = contents + "<td class='col name'>";
			contents = contents + detail.manager;
			contents = contents + "</td>";
			contents = contents + "<td class='col type'>";
			contents = contents + p;
			contents = contents + "</td>";
			contents = contents + "<td class='col type'>";
			contents = contents + item;
			contents = contents + "</td>";
			contents = contents + "<td class='col value'>";
			contents = contents + comma(detail.money);
			contents = contents + "</td>";
			contents = contents + "<td class='col payment-date'>";
			contents = contents + detail.spendtime;
			contents = contents + "</td>";
			contents = contents + "</tr>";
			
			$('#spend_tbody').append(contents);
		}
		
		
			
	}
	
	hideLoadingLayer();
	
	co.reservePayment = function(){
        var layer = $('.expenditure-payment').html();
        co.layer(layer);
    }
    co.reservePayment();
}

function saveBalanceSetting() {
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
			base_count : uncomma($("#base_count").val()),
			base_money : uncomma($("#base_money").val()),
			bno : bno
		},
		traditional: true,
		url: '/balance/modify/setting',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				getBalanceStatData();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/balance/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("balance.cantcorrection"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function getBalanceStatData(p) {
	var bno = 0;
	
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	
	
	var rseries1 = t("center.reservecase");
	var rseries2 = t("balance.enterschedule");
	var rseries3 = t("balance.entercase");
	var rseries4 = t("balance.cancelcase");
	var rseries5 = t("balance.counselcase");
	var pseries1 = t("balance.realmoney");
	var pseries2 = t("balance.payschedule");
	var pseries3 = t("balance.downpay");
	var pseries4 = t("balance.paybalance");
	var pseries5 = t("balance.cancelrefund");
	var pseries6 = t("balance.endterefund");
	var pseries7 = t("balance.cancelcontract");
	var pseries8 = t("balance.extension");
	var wseries1 = t("center.reservecase");
	var wseries2 = t("balance.cancelcase");
	var wseries3 = t("balance.counselcase");
	showLoadingLayer();
	
	$("#chartR").empty();
	$("#chartP").empty();
	$("#chartD").empty();
	$("#chartW").empty();
	
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			from_date : $("#from_date").val(),
			to_date : $("#to_date").val(),
			bno : bno,
			isshop : isshop
		},
		traditional: true,
		url: '/balance/stat/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var showIdx = 0;
			
			if(p == 0) {
				$(".tab-panel").addClass('active');
			} else {
				
				$('.tab-panel').each(function(index){
					if($(this).hasClass('active')) {
						showIdx = index;
						
					}
				});
				
				$('.tab-panel').each(function(index){
					if(!$(this).hasClass('active')) {
						$(".tab-panel").addClass('active');
					}
				});
				
				
			}
			
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var reservation = data.reservation;
				var payment = data.payment;
				var week = data.week_list;
				var rlabel = reservation.label;
				var rbalance = reservation.balance;
				var plabel = payment.label;
				var pbalance = payment.balance;
				var wlabel = week.label;
				var wbalance = week.balance;
				var weeklist = week.week_list;
				var rbalance1 = rbalance[0];	// 예약 건수
				var rbalance2 = rbalance[1];	// 입실 예정
				var rbalance3 = rbalance[2];	// 입실 건수
				var rbalance4 = rbalance[3];	// 취소 건수
				var rbalance5 = rbalance[4];	// 상담 건수
				var pbalance1 = pbalance[0];	// 전체 결제 금액
				var pbalance2 = pbalance[1];	// 결제 예정 금액
				var pbalance3 = pbalance[2];	// 계약금
				var pbalance4 = pbalance[3];	// 잔금결제
				var pbalance8 = pbalance[7];	// 기간연장
				var pbalance5 = pbalance[4];	// 취소후환불
				var pbalance6 = pbalance[5];	// 입실후환불
				var pbalance7 = pbalance[6];	// 계약포기
				var wbalance1 = wbalance[0];	// 예약 건수
				var wbalance2 = wbalance[1];	// 취소 건수
				var wbalance3 = wbalance[2];	// 상담 건수
				var pbalanceD = [
				                 pbalance3,
				                 pbalance4,
				                 pbalance8,
				                 pbalance5,
				                 pbalance6,
				                 pbalance7
				                 ];
				var rseriesList = [
									{label:rseries1},
									{label:rseries2},
									{label:rseries3},
									{label:rseries4},
									{label:rseries5}
								];
				var pseriesList = [
									{label:pseries1},
									{label:pseries2}
								];
				var dseriesList = [
									{label:pseries3},
									{label:pseries4},
									{label:pseries8},
									{label:pseries5},
									{label:pseries6},
									{label:pseries7}
				                   ];
				var wseriesList = [
				                   	{label:wseries1},
				                   	{label:wseries3},
				                   	{label:wseries2}
				                   ];
				var roption = {pointLabels:{show: true,edgeTolerance: -5,hideZeros: true},seriesColors:["#66CDAA", "#FFA500", "#1E90FF", "#FF6347", "#228B22"]};
				var rChart = drawGraph("chartR", t("balance.nolist"), [rbalance1, rbalance2, rbalance3, rbalance4, rbalance5], rseriesList, rlabel, uncomma($("#base_count").val()), roption);
				var poption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: true}, seriesColors:["#66CDAA", "#1E90FF"]};
				var pChart = drawGraph("chartP", t("balance.monthlypay"), [pbalance1, pbalance2], pseriesList, plabel, uncomma($("#base_money").val()), poption);
				var daxes = {
						yaxis: {
							renderer: $.jqplot.CategoryAxisRenderer,
							tickRenderer:$.jqplot.CanvasAxisTickRenderer,
							labelRenderer: $.jqplot.CanvasAxisLabelRenderer,
							ticks: plabel,
							tickOptions: {
								angle: -30
							}
						},
						xaxis: {
							tickOptions: {
								formatString: "%'d"
							}
						}
				};
				var doption = {pointLabels:{show: true,edgeTolerance: -200,hideZeros: false}, seriesColors:["#66CDAA", "#1E90FF", "#2F4F4F", "#FF6347", "#FFA500", "#FF7F50"], barDirection:"horizontal", axes:daxes};
				var dChart = drawGraph("chartD", t("balance.monthlypaydetail"), pbalanceD, dseriesList, plabel, 0, doption);
				var woption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: true},seriesColors:["#66CDAA", "#228B22", "#FF6347"],stackSeries:true};
				var wChart = drawGraph("chartW", t("balance.weeklyreserve"), [wbalance1, wbalance3, wbalance2], wseriesList, wlabel, 0, woption);
				
				$("#chartR").off('jqplotDataClick');
				$("#chartR").on(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = rlabel[(idx-1)];
							viewBalanceDetail(month);
							$("#sindex").val(seriesIndex);
							$("#month").val(month);
							$("#week").val("");
							$("#order").val(0);
							$("#field").val("");
							viewStatDetail(seriesIndex, month, "");
						}
					);
				
				$("#chartP").off('jqplotDataClick');
				$("#chartP").on(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = plabel[(idx-1)];
							viewBalanceDetail(month);
						}
					);
				
				$("#chartD").off('jqplotDataClick');
				$("#chartD").on(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = plabel[(idx-1)];
							viewBalanceDetail(month);
						}
					);
				
				$("#chartW").off('jqplotDataClick');
				$("#chartW").on(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var week = weeklist[(idx-1)];
							var type = 5;
							if(seriesIndex == 0) {
								type = 5;	// reservation list by week.
							} else if(seriesIndex == 2) {
								type = 6;	// cancel reservation list by week.
							} else if(seriesIndex == 1) {
								type = 7;	// counsel list by week.
							}
							$("#sindex").val(type);
							$("#month").val("");
							$("#week").val(week);
							$("#order").val(0);
							$("#field").val("");
							viewStatDetail(type, "", week);
						}
					);
				$("#chartW .jqplot-series-1").css("color", "#FFFFFF");
				$("#chartW .jqplot-series-2").css("color", "#FFFFFF");
				
				if(p == 0) {
					$('.tab-panel').each(function(index){
						if(index > 0) {
							$(this).removeClass('active');
						}
					});
				} else {
					
					$('.tab-panel').each(function(index){
						
						
						
						if(showIdx != index) {
							$(this).removeClass('active');
						}
					});
				}
				

				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/balance/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("balance.nocalc"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function viewBalanceDetail() {
	var today = new Date();
	var year = today.getFullYear();
	var month = today.getMonth();
	var strDate = '';
	
	month = month + 1;
	
	if (month < 10) {
		strDate = year + '-0' + month; 
	} else {
		strDate = year + '-' + month;
	}
	
	viewBalanceDetailExe(strDate);
	$('#cal_detail').val(strDate);
}

function viewBalanceDetailExe(month) {

	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	//$("#reservation").hide();
	//$("#reservation").empty();
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			search_field : $("#search_field").val(),
			month:month,
			bno:bno
		},
		traditional: true,
		url: '/balance/reservation/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			$('#moneyChart').empty();
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var count = data.count;
				var reservation_money = data.reservation_money;
				var paid_reservation_list = null;
				var paid_payment = null;
				var planned_reservation_list = null;
				var planned_payment = null;
				if(data.paid_reservation_list != null &&
						data.paid_reservation_list.reservation_list != null &&
						data.paid_reservation_list.payment != null) {
					paid_reservation_list = data.paid_reservation_list.reservation_list;
					paid_payment = data.paid_reservation_list.payment;
				}
				if(data.planned_reservation_list != null &&
						data.planned_reservation_list.reservation_list != null &&
						data.planned_reservation_list.payment != null) {
					planned_reservation_list = data.planned_reservation_list.reservation_list;
					planned_payment = data.planned_reservation_list.payment;
				}
				var paidReservationElem = null;
				var plannedReservationElem = null;
				var sdate = month.split("-");
				var syear = sdate[0];
				var smonth = sdate[1];
				var type = 0;
				//var detailElem = createDetailElem(syear, smonth, count);
				
				$('#sta_detail1').text(comma(count.rcount) + t("balance.case")); // 예약건수
				$('#sta_detail2').text(comma(count.rplanned) + t("balance.case")); // 입실예정건수
				$('#sta_detail3').text(comma(count.renterance) + t("balance.case")); // 입실건수
				$('#sta_detail4').text(comma(count.real_payment) + t("balance.won")); // 결제금액
				$('#sta_detail5').text(comma(count.planned_payment) + t("balance.won")); // 결제예정
				$('#sta_detail6').text(comma((count.real_payment + count.planned_payment)) + t("balance.won")); // 총금액
				
				
				
				if(reservation_money.balance != null && reservation_money.label != null) {
					var labelList = [
					                 {label:syear+t("common.year")+smonth+t("common.month")}
					                 ];
					var option = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},};
					
					
					var chart = drawGraph("moneyChart", "", [reservation_money.balance], labelList, reservation_money.label, 0, option);
				}
				
				for(var i=1; i<=6; i++) {
					$('#btn_DetailSub' + i).prop('disabled', true);
					$('#btn_DetailSub' + i).off('click');
				}
				
				var today = new Date();
				var dd = String(today.getDate()).padStart(2, '0');
				var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
				var yyyy = today.getFullYear();
				
				var svalue = parseInt(syear+''+smonth);
				var nvalue = parseInt(yyyy+''+mm)
				
				if(paid_reservation_list != null) {
					
					if (svalue <= nvalue) {
						for(var i=1; i<=5; i++) {
							$('#btn_DetailSub' + i).prop('disabled', false);
						}
						
						$('#btn_DetailSub1').on('click', function(){
							type = 0;
							paidReservationElem = createPaidReservationElem(type, syear, smonth, paid_reservation_list, paid_payment);
						});
						
						
						$('#btn_DetailSub2').on('click', function(){
							type = 1;
							paidReservationElem = createPaidReservationElem(type, syear, smonth, paid_reservation_list, paid_payment);
						});
						
						
						$('#btn_DetailSub3').on('click', function(){
							type = 3;
							paidReservationElem = createPaidReservationElem(type, syear, smonth, paid_reservation_list, paid_payment);
						});
						
						
						$('#btn_DetailSub4').on('click', function(){
							type = 2;
							paidReservationElem = createPaidReservationElem(type, syear, smonth, paid_reservation_list, paid_payment);
						});
						
						
						$('#btn_DetailSub5').on('click', function(){
							type = 5;
							paidReservationElem = createPaidReservationElem(type, syear, smonth, paid_reservation_list, paid_payment);
						});
					}
					
					
					
				}
				
				if (planned_reservation_list != null) {
					if (svalue >= nvalue) {
						$('#btn_DetailSub6').prop('disabled', false);
						$('#btn_DetailSub6').on('click', function(){
							
							paidReservationElem = createPlannedReservationElem(syear, smonth, planned_reservation_list, planned_payment);
						});
					}
				}
				
				
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/balance/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("balance.nocalc"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function createPaidReservationElem(ptype, syear, smonth, reservation_list, payment) {
	var detail_title = "";
	if(ptype == 0) {
		detail_title = t("balance.downpay");
	} else if(ptype == 1) {
		detail_title = t("balance.paybalance");
	} else if(ptype == 3) {
		detail_title = t("balance.cancelrefund");
	} else if(ptype == 2) {
		detail_title = t("balance.endterefund");
	} else if(ptype == 5) {
		detail_title = t("balance.cancelcontract");
	}
	var contents = "";
	contents += '<div class="layer-payment-history" data-width="950">';
	contents += '<input type="hidden" id="ispaid' + ptype + '" value="1"/>';
	contents += '<h1 class="title">';
	contents += detail_title;
	contents += '<small class="date">' + syear + t("balance.years") + smonth +t("balance.month");
	contents += '</h1>';
	contents += '<table class="payment-history-head">';
	contents += '<thead>';
	contents += '<tr>';
	contents += '<th scope="row" class="col num">No</th>';
	contents += t("balance.entername");
	contents += t("balance.term");
	contents += t("balance.amountmoney");
	contents += t("balance.enterinfo");
	contents += '</thead>';
	contents += '</table>';
	contents += '<div class="payment-history-body">';
	contents += '<table class="payment-history-list">';
	contents += '<tbody>';
	
	var rowcount = 0;
	for(var i=0; i<reservation_list.length; i++) {
		var tempcontents = "", pcontents = "";
		var r = reservation_list[i];
		var rpay = payment[r.no];
		var ispay = 0;
		for(var k=0; k<rpay.length; k++) {
			var p = rpay[k];
			var cdate = new Date(parseInt(p.paytime));
			var paytime;
			var paymoney = 0;
			var type = parseInt(p.paytype);
			var method = p.paymethod;
			var typeStr = "";
			if(ptype == 0 || ptype == 1 || ptype == 3) {
				if(ptype != type) {
					continue;
				}
			} else {
				if(ptype == 2) {
					if(type == 2 || type == 4) {
						;
					} else {
						continue;
					}
				} else if(ptype == 5) {
					if(type == 5 || type == 6) {
						;
					} else {
						continue;
					}
				}
			}
			if(type == 0) {
				typeStr = t("balance.reserveadd");
			} else if(type == 1) {
				typeStr = t("balance.balancepaid");
			} else if(type == 2) {
//				typeStr = "일부환불";
				typeStr = t("balance.refund");
			} else if(type == 3) {
				typeStr = t("reservation.cancelsss");
			} else if(type == 4) {
				typeStr = t("reservation.refunds");
			} else if(type == 5) {
				typeStr = t("balance.cancelcontract");
			} else if(type == 6) {
				typeStr = t("reservation.process.giveuprefund");
			} else if(type == 7) {
				typeStr = t("balance.extension");
			}
			if(method == "cash") {
				method = t("reservation.cashs");
			} else {
				method = t("reservation.cards");
			}
			paymoney = p.paymoney;
			paytime = cdate.format("isoDate");
			pcontents = pcontents + "<tr style='width:100%;border:0px;'>";
			pcontents = pcontents + "<td style='width:20%;border:0px;text-align:center;'>";
			pcontents = pcontents + typeStr;
			pcontents = pcontents + "</td>";
			pcontents = pcontents + "<td style='width:20%;border:0px;text-align:center;'>";
			pcontents = pcontents + method;
			pcontents = pcontents + "</td>";
			pcontents = pcontents + "<td style='width:20%;border:0px;text-align:center;'>";
			pcontents = pcontents + comma(paymoney);
			pcontents = pcontents + "</td>";
			pcontents = pcontents + "<td style='width:40%;border:0px;text-align:center;'>";
			pcontents = pcontents + paytime;
			pcontents = pcontents + "</td>";
			pcontents = pcontents + "</tr>";
			ispay = 1;
		}
		if(ispay == 1) {
			rowcount = rowcount + 1;
			tempcontents = tempcontents + "<tr>";
			tempcontents = tempcontents + '<td class="col num">';
			tempcontents = tempcontents + rowcount;
			tempcontents = tempcontents + '</td>';
			tempcontents = tempcontents + '<td class="col num">';
			tempcontents = tempcontents + r.name;
			tempcontents = tempcontents + '</td>';
			tempcontents = tempcontents + '<td class="col period">';
			tempcontents = tempcontents + r.from_date + " ~ " + r.to_date;
			tempcontents = tempcontents + '</td>';
			tempcontents = tempcontents + '<td class="col partial">';
			tempcontents = tempcontents + comma(r.real_money);
			tempcontents = tempcontents + "</td>";
			tempcontents = tempcontents + '<td class="col state">';
			tempcontents = tempcontents + "<table style='width:100%;border:0px;vertical-align:middle;text-align:center;'>";
			tempcontents = tempcontents + pcontents;
			tempcontents = tempcontents + "</table>";
			tempcontents = tempcontents + "</td>";
			tempcontents = tempcontents + "</tr>";
			contents = contents + tempcontents;
		}
	}
	if(rowcount == 0) {
		contents = contents + "<tr style='border-top:1px solid #C0C0C0;'>";
		contents = contents + "<td style='width:100%;border:0px;text-align:center;vertical-align:middle;' colspan='5'>";
		contents = contents + smonth + t("balance.monthlyenterlist");
		contents = contents + "</td>";
		contents = contents + "</tr>";
	}
	contents += '</tbody>';
	contents += '</table>';
	contents += '</div>';
	contents += '<div class="ui-dialog-buttonpane right">';
	contents += '<button class="btn-dialog-no">';
	contents += '<i class="icon-dialog-no"></i>';
	contents += t("balance.close");
	contents += '</button>';
	contents += '</div>';
	contents += '</div>';
	
	
	
    co.layer(contents);
}

function createPlannedReservationElem(syear, smonth, reservation_list, payment) {
	
	var contents = "";
	contents += '<div class="layer-payment-history" data-width="950">';
	contents += '<input type="hidden" id="isplanned" value="1"/>';
	contents += '<h1 class="title">';
	contents += t("balance.enterschedulelists");
	contents += '<small class="date">' + syear + t("balance.years") + smonth +t("balance.month");
	contents += '</h1>';
	contents += '<table class="payment-history-head">';
	contents += '<thead>';
	contents += '<tr>';
	contents += '<th scope="row" class="col num">No</th>';
	contents += t("balance.entername");
	contents += t("balance.term");
	contents += t("balance.amountmoney");
	contents += t("balance.balance");
	contents += t("balance.pastpay");
	contents += '</thead>';
	contents += '</table>';
	contents += '<div class="payment-history-body">';
	contents += '<table class="payment-history-list">';
	contents += '<tbody>';
	for(var i=0; i<reservation_list.length; i++) {
		var r = reservation_list[i];
		var rpay = payment[r.no];
		contents = contents + "<tr>";
		contents = contents + "<td class='col num'>";
		contents = contents + (reservation_list.length - i);
		contents = contents + "</td>";
		contents = contents + "<td class='col name'>";
		contents = contents + r.name;
		contents = contents + "</td>";
		contents = contents + "<td class='col period'>";
		contents = contents + r.from_date + " ~ " + r.to_date;
		contents = contents + "</td>";
		contents = contents + "<td class='col value'>";
		contents = contents + comma(r.real_money);
		contents = contents + "</td>";
		contents = contents + "<td class='col partial'>";
		contents = contents + comma(r.remain_money);
		contents = contents + "</td>";
		contents = contents + "<td class='col state'>";
		contents = contents + "<table style='width:100%;border:0px;vertical-align:middle;text-align:center;'>";
		for(var k=0; k<rpay.length; k++) {
			var p = rpay[k];
			var cdate = new Date(parseInt(p.paytime));
			var paytime;
			var paymoney = 0;
			var type = parseInt(p.paytype);
			var method = p.paymethod;
			var typeStr = "";
			if(method == "cash") {
				method = t("reservation.cashs");
			} else {
				method = t("reservation.cards");
			}
			paymoney = p.paymoney;
			paytime = cdate.format("isoDate");
			contents = contents + "<tr style='width:100%;border:0px;'>";
			contents = contents + "<td style='width:25%;border:0px;text-align:center;'>";
			contents = contents + method;
			contents = contents + "</td>";
			contents = contents + "<td style='width:25%;border:0px;text-align:center;'>";
			contents = contents + comma(paymoney);
			contents = contents + "</td>";
			contents = contents + "<td style='width:50%;border:0px;text-align:center;'>";
			contents = contents + paytime;
			contents = contents + "</td>";
			contents = contents + "</tr>";
		}
		contents = contents + "</table>";
		contents = contents + "</td>";
		contents = contents + "</tr>";
	}
	contents += '</tbody>';
	contents += '</table>';
	contents += '</div>';
	contents += '<div class="ui-dialog-buttonpane right">';
	contents += '<button class="btn-dialog-no">';
	contents += '<i class="icon-dialog-no"></i>';
	contents += t("balance.close");
	contents += '</button>';
	contents += '</div>';
	contents += '</div>';
	
	co.layer(contents);
}

function viewReservation(no) {
	if(no > 0) {
		$(location).attr("href", "/reservation/view?reservation_no="+no);
	}
}

function orderStatDetail(field) {
	var sindex = $("#sindex").val();
	var month = $("#month").val();
	var week = $("#week").val();
	var order = parseInt($("#order").val());
	if(order == 0) {
		order = 1;
	} else if(order == 1) {
		order = 2;
	} else if(order == 2) {
		order = 1;
	}
	var ascId = "#order_";
	var descId = "#order_";
	$("[id*=order_]").hide();
	if(sindex == 4 || sindex == 7) {
		ascId = ascId + "c_";
		descId = descId + "c_";
	}
	ascId = ascId + field + "_asc";
	descId = descId + field + "_desc";
	if(order == 1) {
		$(ascId).show();
		$(descId).hide();
	} else if(order == 2) {
		$(ascId).hide();
		$(descId).show();
	} else {
		$(ascId).hide();
		$(descId).hide();
	}
	$("#order").val(order);
	$("#field").val(field);
	viewStatDetailWithOption(sindex, month, week, {"order":1});
}

function viewStatDetail(sindex, month, week) {
	viewStatDetailWithOption(sindex, month, week, null);
}

function viewReservationNewWindow(no) {
	if(no > 0) {
		window.open("/reservation/view?reservation_no="+no);
	}
}

function viewcounselNewWindow(no) {
	if(no > 0) {
		window.open("/counsel/view?counsel_no="+no);
	}
}

function viewStatDetailWithOption(sindex, month, week, option) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var order = $("#order").val();
	var field = $("#field").val();
	if(option == null || (("order" in option) && option["order"] != 1) ) {
		$("[id*=order_]").hide();
	}
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
			type:sindex,
			month:month,
			week:week,
			order:order,
			field:field,
			bno:bno
		},
		traditional: true,
		url: '/balance/detail/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			
			
			if(status.result == RESULT_SUCCESS) {
				var title = "", titleMoney = "", ofield = "", viewDate="";
				if (month != null && month != '') {
					var sdate = month.split("-");
					viewDate = sdate[0] + t("balance.years") + sdate[1] + t("common.Monday");
				} else if (week != null && week != '') {
					viewDate = week.substring(0, 4) + t("balance.years") + week.substring(4) + t("balance.week");
				}
				if(sindex == 0) {
					title = t("balance.reservelist");
					titleMoney = t("balance.downpay");
					ofield = "payment";
					
				} else if(sindex == 1) {
					title = t("balance.enterschedulelist");
					titleMoney = t("balance.paymoney");
					ofield = "payment";
				} else if(sindex == 2) {
					title = t("balance.enterlist");
					titleMoney = t("balance.balances");
					ofield = "remain_money";
				} else if(sindex == 3) {
					title = t("balance.cancellist");
					titleMoney = t("balance.refunds");
					ofield = "payment";
				} else if(sindex == 4) {
					title = t("balance.counsellist");
				} else if(sindex == 5) {
					title = t("balance.reservelist");
					titleMoney = t("balance.downpay");
					ofield = "payment";
				} else if(sindex == 6) {
					title = t("balance.cancellist");
					titleMoney = t("balance.refunds");
					ofield = "payment";
				} else if (sindex == 7) {
					title = t("balance.counsellist");
				}
				var detail_list = data.detail_list;
				var contents = "";
				if (sindex == 3 || sindex == 6){
					contents += '<div class="layer-payment-history" data-width="1200">';	
				} else {
					contents += '<div class="layer-payment-history" data-width="850">';
				}
				contents += '<h1 class="title">';
				contents += '<span>' + title + '</span>';
				contents += '<small class="date">' + viewDate +'</small>';
				contents += '</h1>';
				contents += '<table class="payment-history-head">';
				contents += '<thead>';
				contents += '<tr>';
				contents += '<th scope="row" class="col num">No</th>';
				if(sindex == 4 || sindex == 7) {	// 상담일
					contents += t("balance.momname");
					contents += t("balance.contact");
					contents += t("balance.counselday");
					contents += '</thead>';
					contents += '</table>';
					contents += '<div class="payment-history-body">';
					contents += '<table class="payment-history-list">';
					contents += '<tbody>';
				} else if(sindex ==3 || sindex == 6){
					contents += t("balance.momnames");
					contents += t("balance.contactc");
					contents += t("balance.contract");
					contents += t("balance.amountmoney");
					contents += '<th scope="row" class="col partial">' + titleMoney + '</th>';
					contents += t("balance.term");
					contents += t("balance.stat");
					contents += '<th class="col state">취소사유</th>';
					contents += '</thead>';
					contents += '</table>';
					contents += '<div class="payment-history-body">';
					contents += '<table class="payment-history-list">';
					contents += '<tbody>';
				} else {
					contents += t("balance.momnames");
					contents += t("balance.contactc");
					contents += t("balance.contract");
					contents += t("balance.amountmoney");
					contents += '<th scope="row" class="col partial">' + titleMoney + '</th>';
					contents += t("balance.term");
					contents += t("balance.stat");
					contents += '</thead>';
					contents += '</table>';
					contents += '<div class="payment-history-body">';
					contents += '<table class="payment-history-list">';
					contents += '<tbody>';
				}
				if(detail_list != null && detail_list != "null" && detail_list.length > 0) {
					for(var i=0; i<detail_list.length; i++) {
						var detail = detail_list[i];
						var isdel = parseInt(detail.isdel);
						var issetup = parseInt(detail.issetup);
						var curstatus = "";
						var reservation_no = detail.no;
						var money = 0;
						if(isdel == 1) {
							curstatus = t("reservation.cancelsss");
						} else {
							if(issetup == 0) {
								curstatus = t("balance.enterschedule");
							} else if(issetup == 1) {
								curstatus = t("balance.enter");
							} else if(issetup == 9) {
							curstatus = t("index.exit.confirm");
							} else {
								curstatus = t("balance.cancelcontract");
							}
						}
						if(sindex == 0 || sindex == 5) {
							money = detail.payment;
						} else if(sindex == 3 || sindex == 6) {
							money = detail.payment;
							money = 0 - money;
						} else if(sindex == 1) {
							money = detail.payment;
						} else if(sindex == 2) {
							money = detail.remain_money;
						}
						if(sindex == 4 || sindex == 7) {	// 상담일
							var rno = 0;
							try {
								rno = parseInt(detail.no);
							} catch(exception) { }
							var url = 'javascript:void();';
							if(rno > 0) {
								url = "/counsel/view?counsel_no="+rno;
							} 
							contents += '<tr onClick="javascript:viewcounselNewWindow(' + rno + ')" class="balancePopup">';
							contents += '<td class="col num">' + (detail_list.length - i) +'</td>';
							contents += '<td class="col name wide"><a href="' + url +'" target="counsel">' + detail.name + '</a></td>';
							contents += '<td class="col tel wide">' + detail.phone + '</td>';
							contents += '<td class="col date wide">';
							var d = new Date(parseInt(detail.cdate));
							contents += d.format("isoDate");
							contents += '</td></tr>';
							contents += '<tr onClick="javascript:viewcounselNewWindow(' + rno + ')" class="child balancePopup">';
							contents += '<td colspan="4">' + detail.counsel + '</td>';
						} else {
							var url = "/reservation/view?reservation_no="+detail.no;
							
							/*contents += '<tr>';*/
							contents += "<tr onclick='javascript:viewReservationNewWindow(\"" + detail.no + "\");' class='balancePopup'>";
							
							contents += '<td class="col num">' + (detail_list.length - i) +'</td>';
							
							/*contents += '<td class="col name"><a href="' + url +'" target="reservation">' + detail.name + '</a></td>';*/
							contents += '<td class="col name">' + detail.name + '</td>';
							
							contents += '<td class="col tel">' + detail.phone + '</td>';
							contents += '<td class="col date">';
							contents += detail.contract_date;
							contents += '</td>';
							contents += '<td class="col value">' + comma(detail.real_money) + '</td>';
							contents += '<td class="col partial">' + comma(money) + '</td>';
							contents += '<td class="col period">' + detail.from_date + " ~ " + detail.to_date + '</td>';
							contents += '<td class="col state" style="width:100px;">' + curstatus +'</td>';
							if(sindex == 3 || sindex == 6){
								contents += '<td>' + detail.memo + '</td>'	
							}
						}
						contents += '</tr>';
						
						/*
						contents = contents + "<tr style='cursor:hand;cursor:pointer;' onclick='javascript:viewReservation(\"" + reservation_no + "\");'>";
						contents = contents + "<td style='text-align:center;'>";
						contents = contents + (detail_list.length - i);
						contents = contents + "</td>";
						contents = contents + "<td style='text-align:center;'>";
						contents = contents + detail.name;
						contents = contents + "</td>";
						contents = contents + "<td style='text-align:center;'>";
						contents = contents + detail.phone;
						contents = contents + "</td>";
						contents = contents + "<td style='text-align:center;'>";
						if(sindex == 4 || sindex == 7) {	// 상담일
							var d = new Date(parseInt(detail.cdate));
							contents = contents + d.format("isoDate");
						} else {
							contents = contents + detail.contract_date;
						}
						contents = contents + "</td>";
						if(sindex == 4 || sindex == 7) {	// 상담일
							contents = contents + "<td style='text-align:left;'>";
							contents = contents + detail.counsel;
							contents = contents + "</td>";
						} else {
							contents = contents + "<td style='text-align:center;'>";
							contents = contents + comma(detail.real_money);
							contents = contents + "</td>";
							contents = contents + "<td style='text-align:center;'>";
							contents = contents + comma(money);
							contents = contents + "</td>";
							contents = contents + "<td style='text-align:center;'>";
							contents = contents + detail.from_date + " ~ " + detail.to_date;
							contents = contents + "</td>";
						}
						contents = contents + "<td style='text-align:center;'>";
						if(sindex == 4 || sindex == 7) {	// 상담일
							var rno = 0;
							try {
								rno = parseInt(detail.reservation_no);
							} catch(exception) { }
							if(rno > 0) {
								var url = "/reservation/view?reservation_no="+rno;
								contents = contents + t("balance.reservationlist");
							}
						} else {
							contents = contents + curstatus;
						}
						contents = contents + "</td>";
						contents = contents + "</tr>";
						*/
					}
				} else {
					var colspan = '8';
					if(sindex == 4 || sindex == 7) {
						colspan = '4';
					}
					contents = contents + "<tr>";
					contents = contents + "<td style='text-align:center;' colspan='"+colspan+"'>대상 목록이 존재하지 않습니다.</td>";
					contents = contents + "</tr>";
				}
				
				contents += '</tbody>';
				contents += '</table>';
				contents += '</div>';
				contents += '<div class="ui-dialog-buttonpane right">';
				contents += '<button class="btn-dialog-no">';
				contents += '<i class="icon-dialog-no"></i>';
				contents += t("balance.close");
				contents += '</button>';
				contents += '</div>';
				contents += '</div>';
				
				hideLoadingLayer();
				co.layer(contents);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/balance/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("balance.nocalc"));
					hideLoadingLayer();
				}
			}
		}
	});
}

function moveSubPage(url) {
	let from_date = $("#from_date").val();
	let to_date = $("#to_date").val();
	let combinedUrl = url + "?from_date=" + from_date + "&to_date=" + to_date;
	$(location).attr("href", combinedUrl);
}