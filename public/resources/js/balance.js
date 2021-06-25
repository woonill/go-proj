
var cChart = null;
var mChart = null;
var clabel = null;
var mlabel = null;
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

function initInventoryBalance() {
	$("#from_date").MonthPicker(monthOption);
	$("#to_date").MonthPicker(monthOption);
	setTimeout(function(){
		getInventoryBalanceStat();
	}, 1);
}

function initAestheticBalance() {
	$("#from_date").MonthPicker(monthOption);
	$("#to_date").MonthPicker(monthOption);
	setTimeout(function(){
		getAestheticBalanceStat();
	}, 1);
}

function initMain() {
	$("#from_date").MonthPicker(monthOption);
	$("#to_date").MonthPicker(monthOption);
	setTimeout(function(){
		getMainBalanceStat();
	}, 1);
}

function initDeposit() {
	$("#from_date").MonthPicker(monthOption);
	$("#to_date").MonthPicker(monthOption);
	$("#span_total_p").html(comma($("#total_p").val()));
	$("#span_total_r").html(comma($("#total_r").val()));
}

function init() {
	$("#from_date").MonthPicker(monthOption);
	$("#to_date").MonthPicker(monthOption);

	$("#base_count").on('keydown', function (e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var basecount = uncomma($("#base_count").val());
				if(basecount == "" || isNull(basecount)) {
					basecount = 0;
				}
				if($.isNumeric(basecount) == false) {
					alert(t("balance.reservenumber"));
					$(id).val("");
					return false;
				}
				if(parseInt(basecount) > 0) {
					$("#base_count").val(comma(basecount));
				}
			}
		}, 1);
	});
	
	$("#base_money").on('keydown', function (e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var basemoney = uncomma($("#base_money").val());
				if(basemoney == "" || isNull(basemoney)) {
					basemoney = 0;
				}
				if($.isNumeric(basemoney) == false) {
					alert(t("balance.reservenumber"));
					$(id).val("");
					return false;
				}
				if(parseInt(basemoney) > 0) {
					$("#base_money").val(comma(basemoney));
				}
			}
		}, 1);
	});
	
	setTimeout(function(){
		getShopPointData();
		getBalanceStatData();
	}, 1);
}

function getMainBalanceStat() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var rseries1 = t("balance.depositmoney");
	var rseries2 = t("balance.withdmoney");
	var rseries3 = t("balance.difference");
	var imseries1 = t("balance.enterwithdmoney");
	var imseries2 = t("balance.release.deposit");
	var imseries3 = t("balance.difference");
	var sseries1 = t("balance.spendmoney");
	var aseries1 = t("balance.downpaymoney");
	$("#chartR").show();
	$("#chartIM").show();
	$("#chartS").show();
	$("#chartA").show();
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
				                   {label:rseries3}
								];
				var imseriesList = [
				                   {label:imseries1},
				                   {label:imseries2},
				                   {label:imseries3}
								];
				var sseriesList = [
									{label:sseries1}
								];
				var aseriesList = [
									{label:aseries1}
								];
				var roption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},seriesColors:["#66CDAA", "#FF6347", "#1E90FF"]};
				var rChart = drawGraph("chartR", t("balance.statementlist"), rbalance, rseriesList, rlabel, 0, roption);
				var imoption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},seriesColors:["#FF6347", "#66CDAA", "#1E90FF"],negativeSeriesColors:["#1E90FF"]};
				var imChart = drawGraph("chartIM", t("balance.amountware"), imbalance, imseriesList, imlabel, 0, imoption);
				var soption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},seriesColors:["#FF6347"]};
				var sChart = drawGraph("chartS", t("balance.monthly.spendlist"), sbalance, sseriesList, slabel, 0, soption);
				var aoption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},seriesColors:["#66CDAA"]};
				var aChart = drawGraph("chartA", t("balance.monthly.contractlist"), abalance, aseriesList, alabel, 0, aoption);
				$("#chartR").bind(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = rlabel[(idx-1)];
							if(seriesIndex == 0 || seriesIndex == 1) {
								viewStatDetailForMain(seriesIndex, month);
							}
						}
					);
				$("#chartIM").bind(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = rlabel[(idx-1)];
							if(seriesIndex == 0 || seriesIndex == 1) {
								var i = seriesIndex + 2;
								viewStatDetailForMain(i, month);
							}
						}
					);
				$("#chartS").bind(
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
				$("#chartA").bind(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = rlabel[(idx-1)];
							if(seriesIndex == 0 || seriesIndex == 1) {
								var i = seriesIndex + 6;
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

function getInventoryBalanceStat() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var imseries1 = t("balance.entermoney");
	var imseries2 = t("balance.release.money");
	var sseries1 = t("balance.spendmoney");
	var iaseries1 = t("balance.enteramount");
	var iaseries2 = t("balance.release.amount");
	var iaseries3 = t("balance.consume");
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
		url: '/balance/inventory/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var imoney = data.inventory_money;
				var spend = data.spend;
				var iamount = data.inventory_amount;
				var imlabel = imoney.label;
				var slabel = spend.label;
				var ialabel = iamount.label;
				var imbalance = imoney.balance;
				var sbalance = spend.balance;
				var iabalance = iamount.balance;
				var imseriesList = [
									{label:imseries1},
									{label:imseries2}
								];
				var sseriesList = [
									{label:sseries1}
								];
				var iaseriesList = [
									{label:iaseries1},
									{label:iaseries2},
									{label:iaseries3}
								];
				var imoption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},seriesColors:["#FF6347", "#66CDAA"]};
				var imChart = drawGraph("chartIM", t("balance.monthlyware"), imbalance, imseriesList, imlabel, 0, imoption);
				var soption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},seriesColors:["#FF6347"]};
				var sChart = drawGraph("chartS", t("balance.monthlyspendlist"), sbalance, sseriesList, slabel, 0, soption);
				var iaoption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},seriesColors:["#66CDAA", "#FF6347", "#1E90FF"]};
				var iaChart = drawGraph("chartIA", t("balance.monthlywarelist"), iabalance, iaseriesList, ialabel, 0, iaoption);
				$("#chartS").bind(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = slabel[(idx-1)];
							viewSpendDetail(month);
						}
					);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/balance/spend"));
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

function getAestheticBalanceStat() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var cseries1 = t("balance.ticketingcase");
	var mseries1 = t("balance.downpaymoney");
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
		url: '/balance/aesthetic/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var count = data.count;
				var money = data.money;
				var clabel = count.label;
				var cbalance = count.balance;
				var mlabel = money.label;
				var mbalance = money.balance;
				var cbalance1 = cbalance[0];	// 예약 건수
				var mbalance1 = mbalance[0];	// 전체 계약 금액
				var cseriesList = [
									{label:cseries1}
								];
				var mseriesList = [
									{label:mseries1}
								];
				var coption = {pointLabels:{show: true,edgeTolerance: -5,hideZeros: false},};
				var cChart = drawGraph("chartC", t("balance.monthly.ticketing"), [cbalance1], cseriesList, clabel, 0, coption);
				var moption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},};
				var mChart = drawGraph("chartM", t("balance.monthly.contract"), [mbalance1], mseriesList, mlabel, 0, moption);
				$("#chartC").bind(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = clabel[(idx-1)];
							viewAestheticDetail(month);
						}
					);
				$("#chartM").bind(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = mlabel[(idx-1)];
							viewAestheticDetail(month);
						}
					);
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/balance/aesthetic"));
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
				location.reload();
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

function getBalaceSetting() {
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
		url: '/balance/setting',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var setting = data.balance_setting;
				$("#base_count").val(setting.base_count);
				$("#base_money").val(setting.base_money);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/balance/main"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("balance.cantbaseinfo"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function getShopPointData() {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	var isshop = parseInt($("#isshop").val());
	var sseries1 = t("balance.allpoint");
	var sseries2 = t("balance.usepoint");
	var sseries3 = t("balance.restpoint");
	showLoadingLayer();
	if(isshop == 1) {
		$("#chartS").show();
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
			url: '/balance/shop/point/data',
			error: function() {
				alert(t("app.error"));
				hideLoadingLayer();
			},
			beforeSend: function() {},
			success: function(res) {
				var status = res.status;
				var data = res.data;
				if(status.result == RESULT_SUCCESS) {
					if(data.point != null && !$.isEmptyObject(data.point)) {
						var point = data.point;
						var sbalance = point.balance;
						var slabel = point.label;
						var sbalance1 = sbalance[0];	// 총포인트
						var sbalance2 = sbalance[1];	// 사용포인트
//						var sbalance3 = sbalance[2];	// 잔여포인트
						var sseriesList = [
											{label:sseries1},
											{label:sseries2}
										];
						var sbalanceD = [
						                 sbalance1,
						                 sbalance2
						                 ];
						var doption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},};
						var dChart = drawGraph("chartS", t("balance.monthlypoint"), sbalanceD, sseriesList, slabel, 0, doption);
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
	} else {
		$("#chartS").hide();
	}
}

function getBalanceStatData() {
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
				var rChart = drawGraph("chartR", "", [rbalance1, rbalance2, rbalance3, rbalance4, rbalance5], rseriesList, rlabel, uncomma($("#base_count").val()), roption);
				var woption = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: true},seriesColors:["#66CDAA", "#228B22", "#FF6347"],stackSeries:true};
				var wChart = drawGraph("chartW", t("balance.weeklyreserve"), [wbalance1, wbalance3, wbalance2], wseriesList, wlabel, 0, woption);
				
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
				
				$("#chartR").bind(
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
				$("#chartP").bind(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = plabel[(idx-1)];
							viewBalanceDetail(month);
						}
					);
				$("#chartD").bind(
						'jqplotDataClick',
						function (ev, seriesIndex, pointIndex, data) {
							var idx = data[0];
							var month = plabel[(idx-1)];
							viewBalanceDetail(month);
						}
					);
				$("#chartW").bind(
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

function viewBalanceMain() {
	var from_date = $("#from_date").val();
	var to_date = $("#to_date").val();
	var url = "./main?from_date="+from_date+"&to_date="+to_date;
	$(location).attr("href", url);
}

function viewBalanceInventory() {
	var from_date = $("#from_date").val();
	var to_date = $("#to_date").val();
	var url = "./inventory?from_date="+from_date+"&to_date="+to_date;
	$(location).attr("href", url);
}

function viewBalanceAesthetic() {
	var from_date = $("#from_date").val();
	var to_date = $("#to_date").val();
	var url = "./aesthetic?from_date="+from_date+"&to_date="+to_date;
	$(location).attr("href", url);
}

function viewBalanceDeposit() {
	var from_date = $("#from_date").val();
	var to_date = $("#to_date").val();
	var url = "./deposit?from_date="+from_date+"&to_date="+to_date;
	$(location).attr("href", url);
}

function viewBalanceStat() {
	var from_date = $("#from_date").val();
	var to_date = $("#to_date").val();
	var url = "./reservation?from_date="+from_date+"&to_date="+to_date;
	$(location).attr("href", url);
}

function viewReservation(no) {
	if(no > 0) {
		$(location).attr("href", "/reservation/view?reservation_no="+no);
	}
}

function viewStatDetailForAesthetic(idx, detail_list) {
	if(detail_list != null && detail_list != "null" && detail_list.length > 0) {
		var contents = "";
		for(var i=0; i<detail_list.length; i++) {
			var detail = detail_list[i];
			var method = parseInt(detail.method);
			var p = t("reservation.cashs");
			if(method == 1) {
				p = t("reservation.cards");
			}
			contents = contents + "<tr>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + (detail_list.length - i);
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.name;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.phone;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.program;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + p;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + comma(detail.real_money);
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.contract_date;
			contents = contents + "</td>";
			contents = contents + "</tr>";
		}
		$("#aesthetic_list").html(contents);
		hideLoadingLayer();
		layer_open("aesthetic_layer", "fade", true);
	}
}

function viewStatDetailForSpend(idx, detail_list) {
	if(detail_list != null && detail_list != "null" && detail_list.length > 0) {
		var contents = "";
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
			contents = contents + "<tr>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + (detail_list.length - i);
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:left;vertical-align:middle;'>";
			contents = contents + detail.spend;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.manager;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + p;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + item;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + comma(detail.money);
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.spendtime;
			contents = contents + "</td>";
			contents = contents + "</tr>";
		}
		if(idx == 2) {
			$("#spend_title").html(t("balance.spendlist"));
		} else if(idx == 3) {
			$("#spend_title").html(t("balance.spendlist"));
		}
		$("#spend_list").html(contents);
		hideLoadingLayer();
		layer_open("spend_layer", "fade", true);
	}
}

function viewStatDetailForInventory(idx, detail_list) {
	if(detail_list != null && detail_list != "null" && detail_list.length > 0) {
		var contents = "";
		for(var i=0; i<detail_list.length; i++) {
			var detail = detail_list[i];
			contents = contents + "<tr>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + (detail_list.length - i);
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.name;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.standard;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + comma(detail.amount);
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + comma(detail.price);
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + comma(detail.total_money);
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.manager;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.stock_date;
			contents = contents + "</td>";
			contents = contents + "</tr>";
		}
		if(idx == 2) {
			$("#inventory_title").html(t("balance.enterwarelist"));
		} else if(idx == 3) {
			$("#inventory_title").html(t("balance.release.list"));
		}
		$("#inventory_list").html(contents);
		hideLoadingLayer();
		layer_open("inventory_layer", "fade", true);
	}
}

function viewStatDetailForReservation(detail_list) {
	if(detail_list != null && detail_list != "null" && detail_list.length > 0) {
		var contents = "";
		for(var i=0; i<detail_list.length; i++) {
			var detail = detail_list[i];
			var reservation_no = detail.no;
			var payment_history = detail.payment_history;
			contents = contents + "<tr style='cursor:hand;cursor:pointer;' onclick='javascript:viewReservation(\"" + reservation_no + "\");'>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + (detail_list.length - i);
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.name;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
			contents = contents + detail.phone;
			contents = contents + "</td>";
			contents = contents + "<td style='text-align:center;vertical-align:middle;'>";
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
				var insertdate = date.format("isoDateTime2");
				contents = contents + "<tr>";
				contents = contents + "<td style='text-align:center;border:0px;'>";
				contents = contents + type;
				contents = contents + "</td>";
				contents = contents + "<td style='text-align:center;border:0px;'>";
				contents = contents + method;
				contents = contents + "</td>";
				contents = contents + "<td style='text-align:center;border:0px;width:100px;'>";
				contents = contents + comma(payment.payment);
				contents = contents + "</td>";
				contents = contents + "<td style='text-align:center;border:0px;'>";
				contents = contents + insertdate;
				contents = contents + "</td>";
				contents = contents + "</tr>";
			}
			contents = contents + "</table>";
			contents = contents + "</td>";
			contents = contents + "</tr>";
		}
		$("#detail_list").html(contents);
		hideLoadingLayer();
		layer_open("detail_layer", "fade", true);
	}
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
					viewStatDetailForReservation(detail_list);
				} else if(sindex == 2 || sindex == 3) {
					viewStatDetailForInventory(sindex, detail_list);
				} else if(sindex == 4 || sindex == 5) {
					viewStatDetailForSpend(sindex, detail_list);
				} else if(sindex == 6) {
					viewStatDetailForAesthetic(sindex, detail_list);
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

function viewStatDetail(sindex, month, week) {
	viewStatDetailWithOption(sindex, month, week, null);
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
				var title = "", titleMoney = "", ofield = "";
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
					title = "";
					titleMoney = t("balance.downpay");
					ofield = "payment";
				} else if(sindex == 6) {
					title = "";
					titleMoney = t("balance.refunds");
					ofield = "payment";
				}
				var titleId = "#detail_title";
				var listId = "#detail_list";
				var layerId = "detail_layer";
				var titleMoneyId = "#title_money";
				var titleOrderId = "#title_order";
				var colspan = 6;
				if(sindex == 4 || sindex == 7) {	// 상담일
					titleId = "#detail_c_title";
					listId = "#detail_c_list";
					layerId = "detail_c_layer";
					colspan = 5;
				} else {
					if($(titleMoneyId).length) {
						var c = "&nbsp;"+titleMoney;
						var sobj = null;
						if($(titleOrderId).length) {
							sobj = $(titleOrderId).prop("outerHTML");
							c = c + sobj;
						} else {
							c = c + "&nbsp;<span id='title_order'>";
							c = c + "&nbsp;<span id='order_"+ofield+"_asc' style='display:none;'>▲</span>";
							c = c + "&nbsp;<span id='order_"+ofield+"_desc' style='display:none;'>▼</span>";
							c = c + "&nbsp;</span>";
						}
						$(titleMoneyId).html(c);
						$(titleMoneyId).off("click").on("click", function(){
							orderStatDetail(ofield);
						});
					}
				}
				$(titleId).html(title);
				var detail_list = data.detail_list;
				var contents = "";
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
							} else {
								curstatus = t("balance.cancelcontract");
							}
						}
						if(sindex == 4 || sindex == 7) {	// 상담일
							try {
								reservation_no = parseInt(detail.reservation_no);
							} catch(exception) {
								reservation_no = 0;
							}
						} else if(sindex == 0 || sindex == 5) {
							money = detail.payment;
						} else if(sindex == 3 || sindex == 6) {
							money = detail.payment;
							money = 0 - money;
						} else if(sindex == 1) {
							money = detail.payment;
						} else if(sindex == 2) {
							money = detail.remain_money;
						}
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
					}
				} else {
					contents = contents + "<tr>";
					contents = contents + "<td style='text-align:center;' colspan='"+colspan+"'>대상 목록이 존재하지 않습니다.</td>";
					contents = contents + "</tr>";
				}
				$(listId).html(contents);
				hideLoadingLayer();
				layer_open(layerId, "fade", true);
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

function viewSpendDetail(month) {
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
			month:month,
			type:0,
			bno:bno
		},
		traditional: true,
		url: '/balance/inventory/detail/data',
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
				if(detail_list != null) {
					var contents = "";
					if(detail_list.length > 0) {
						for(var i=0; i<detail_list.length; i++) {
							var detail = detail_list[i];
							contents = contents + "<tr>";
							contents = contents + "<td style='text-align:center;'>" +(detail_list.length - i)+ "</td>";
							contents = contents + "<td>" +detail.spend+ "</td>";
							contents = contents + "<td style='text-align:center;'>" +comma(detail.money)+ "</td>";
							contents = contents + "<td style='text-align:center;'>" +detail.spendtime+ "</td>";
							contents = contents + "<td style='text-align:center;'>" +detail.manager+ "</td>";
							contents = contents + "</tr>";
						}
					} else {
						contents = contents + "<tr>";
						contents = contents + "<td style='text-align:center;' colspan='5'>";
						contents = contents + t("balance.nospend");
						contents = contents + "</td>";
						contents = contents + "</tr>";
					}
					$("#spend_title").text(month+t("balance.monthlyspend"));
					$("#spend_list").html(contents);
					layer_open("spend_layer", "fade", true);
				}
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/balance/inventory"));
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

function viewAestheticDetail(month) {
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
			month:month,
			type:0,
			bno:bno
		},
		traditional: true,
		url: '/balance/aesthetic/detail/data',
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
				if(detail_list != null) {
					var contents = "";
					if(detail_list.length > 0) {
						for(var i=0; i<detail_list.length; i++) {
							var detail = detail_list[i];
							contents = contents + "<tr>";
							contents = contents + "<td style='text-align:center;'>" +(detail_list.length - i)+ "</td>";
							contents = contents + "<td style='text-align:center;'>" +detail.name+ "</td>";
							contents = contents + "<td style='text-align:center;'>" +detail.phone+ "</td>";
							contents = contents + "<td style='text-align:center;'>" +detail.program_name+ "</td>";
							contents = contents + "<td style='text-align:center;'>" +detail.program_count+ "</td>";
							contents = contents + "<td style='text-align:center;'>" +comma(detail.payment)+ "</td>";
							contents = contents + "</tr>";
						}
					} else {
						contents = contents + "<tr>";
						contents = contents + "<td style='text-align:center;' colspan='6'>";
						contents = contents + t("balance.noticketing");
						contents = contents + "</td>";
						contents = contents + "</tr>";
					}
					$("#aesthetic_title").text(month+t("balance.monthlyticketing"));
					$("#aesthetic_list").html(contents);
					layer_open("aesthetic_layer", "fade", true);
				}
				hideLoadingLayer();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/balance/aesthetic"));
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

function viewBalanceDetail(month) {
	var bno = 0;
	if($("#bno").length) {
		bno = $("#bno").val();
	}
	$("#reservation").hide();
	$("#reservation").empty();
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
				var detailElem = createDetailElem(syear, smonth, count);
				$("#reservation").append(detailElem);
				if(paid_reservation_list != null) {
					type = 0;
					paidReservationElem = createPaidReservationElem(type, smonth, paid_reservation_list, paid_payment);
					$("#reservation").append(paidReservationElem);
					type = 1;
					paidReservationElem = createPaidReservationElem(type, smonth, paid_reservation_list, paid_payment);
					$("#reservation").append(paidReservationElem);
					type = 3;
					paidReservationElem = createPaidReservationElem(type, smonth, paid_reservation_list, paid_payment);
					$("#reservation").append(paidReservationElem);
					type = 2;
					paidReservationElem = createPaidReservationElem(type, smonth, paid_reservation_list, paid_payment);
					$("#reservation").append(paidReservationElem);
					type = 5;
					paidReservationElem = createPaidReservationElem(type, smonth, paid_reservation_list, paid_payment);
					$("#reservation").append(paidReservationElem);
				}
				if(planned_reservation_list != null) {
					plannedReservationElem = createPlannedReservationElem(smonth, planned_reservation_list, planned_payment);
					$("#reservation").append(plannedReservationElem);
				}
				$("#reservation").show();
				if(reservation_money.balance != null && reservation_money.label != null) {
					var labelList = [
					                 {label:syear+t("balance.years")+smonth+t("common.Monday")}
					                 ];
					var option = {pointLabels:{show: true,edgeTolerance: -10,hideZeros: false},};
					var chart = drawGraph("moneyChart", "", [reservation_money.balance], labelList, reservation_money.label, 0, option);
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

function showPaidReservation(ptype) {
	$("#paidup" + ptype).show();
	$("#paiddown" + ptype).hide();
//	$("#paidtable" + ptype).slideDown();
	$("#paidtable" + ptype).show();
	$("#ispaid" + ptype).val(1);
}

function hidePaidReservation(ptype) {
	$("#paidup" + ptype).hide();
	$("#paiddown" + ptype).show();
//	$("#paidtable" + ptype).slideUp();
	$("#paidtable" + ptype).hide();
	$("#ispaid" + ptype).val(0);
}

function showPlannedReservation() {
	$("#plannedup").show();
	$("#planneddown").hide();
//	$("#plannedtable").slideDown();
	$("#plannedtable").show();
	$("#isplanned").val(1);
}

function hidePlannedReservation() {
	$("#plannedup").hide();
	$("#planneddown").show();
//	$("#plannedtable").slideUp();
	$("#plannedtable").hide();
	$("#isplanned").val(0);
}

function displayPaid(ptype) {
	var is = parseInt($("#ispaid" + ptype).val());
	if(is == 0) {
		showPaidReservation(ptype);
	} else {
		hidePaidReservation(ptype);
	}
}

function displayPlanned() {
	var is = parseInt($("#isplanned").val());
	if(is == 0) {
		showPlannedReservation();
	} else {
		hidePlannedReservation();
	}
}

function createDetailElem(syear, smonth, count) {
	var obj = $(document.createElement("div")).css({"width":"100%", "height":"200px"});
	var countElem = createCountElem(syear, smonth, count);
	var moneyElem = createMoneyElem();
	obj.append(countElem);
	obj.append(moneyElem);
	return obj;
}

function createMoneyElem() {
	var obj = $(document.createElement("div")).attr({"id":"moneyChart"}).css({"width":"550px", "height":"200px", "float":"left", "margin-left":"10px"});
	return obj;
}

function createCountElem(syear, smonth, count) {
	var contents = "";
	contents = contents + "<div class='fn-gantt'>";
	contents = contents + "<div class='fn-content' style='margin:10px;'>";
	contents = contents + "<table style='border:0px;'>";
	contents = contents + "<tr style='width:100%;border:0px'>";
	contents = contents + "<td style='width:40%;border:0px;height:100px;text-align:center;vertical-align:middle'>";
	contents = contents + "<span style='font-weight:bold;font-size:22pt;'>";
	contents = contents + syear + t("balance.year");
	contents = contents + "</span>";
	contents = contents + "<br/>";
	contents = contents + "<span style='font-weight:bold;font-size:40pt;'>";
	contents = contents + smonth + t("common.Monday");
	contents = contents + "</span>";
	contents = contents + "</td>";
	contents = contents + "<td style='width:60%;border:0px;height:100px;text-align:left;vertical-align:middle'>";
	contents = contents + "<span style='font-weight:bold;font-size:14pt;'>";
	contents = contents + t("balance.reservation") + comma(count.rcount) + t("balance.case");
	contents = contents + "</span>";
	contents = contents + "<br/>";
	contents = contents + "<span style='font-weight:bold;font-size:14pt;'>";
	contents = contents + t("balance.enterschedules") + comma(count.rplanned) + t("balance.case");
	contents = contents + "</span>";
	contents = contents + "<br/>";
	contents = contents + "<span style='font-weight:bold;font-size:14pt;'>";
	contents = contents + t("balance.enters") + comma(count.renterance) + t("balance.case");
	contents = contents + "</span>";
	contents = contents + "<br/>";
	contents = contents + "<span style='font-weight:bold;font-size:14pt;'>";
	contents = contents + t("balance.pay") + comma(count.real_payment) + t("balance.won");
	contents = contents + "</span>";
	contents = contents + "<br/>";
	contents = contents + "<span style='font-weight:bold;font-size:14pt;'>";
	contents = contents + t("balance.payschedules") + comma(count.planned_payment) + t("balance.won");
	contents = contents + "</span>";
	contents = contents + "<br/>";
	contents = contents + "<span style='font-weight:bold;font-size:14pt;'>";
	contents = contents + t("balance.amount") + comma((count.real_payment + count.planned_payment)) + t("balance.won");
	contents = contents + "</span>";
	contents = contents + "</td>";
	contents = contents + "</tr>";
	contents = contents + "</table>";
	contents = contents + "</div>";
	contents = contents + "</div>";
	var obj = $(document.createElement("div")).addClass("dashboard2").css({"width":"400px", "height":"200px", "float":"left"});
	obj.html(contents);
	return obj;
}

function createPaidReservationElem(ptype, smonth, reservation_list, payment) {
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
	var obj = $(document.createElement("div")).addClass("dashboard2").css({"margin-top":"10px"});
	var contents = "";
	contents = contents + "<div class='fn-gantt' style='width:100%;'>";
	contents = contents + "<div class='fn-content' style='margin:10px;'>";
	contents = contents + "<table style='width:98%;border:0px;'>";
	contents = contents + "<tr style='border:0px;cursor:pointer' onclick='javascript:displayPaid(\"" + ptype + "\");'>";
	contents = contents + "<td style='border:0px;width:50%;text-align:left;font-weight:bold;font-size:14pt;'>" + smonth + "월 [" + detail_title + "] 결제 목록</td>";
	contents = contents + "<td style='border:0px;width:50%;text-align:right;'>";
	contents = contents + "<input type='hidden' id='ispaid" + ptype + "' value='0'/>";
	contents = contents + "<img id='paidup" + ptype + "' src='/resources/images/up.jpg' style='border:0px;text-align:right;vertical-align:middle;display:none;'/>";
	contents = contents + "<img id='paiddown" + ptype + "' src='/resources/images/down.jpg' style='border:0px;text-align:right;vertical-align:middle;'/>";
	contents = contents + "</td>";
	contents = contents + "</tr>";
	contents = contents + "</table>";
	contents = contents + "<table id='paidtable" + ptype + "' style='margin-top:20px;width:98%;border:0px;display:none;'>";
	contents = contents + "<tr style='border:0px;'>";
	contents = contents + "<td style='width:9%;border:0px;text-align:center;font-weight:bold;'>No.</td>";
	contents = contents + "<td style='width:10%;border:0px;text-align:center;font-weight:bold;'>예약자</td>";
	contents = contents + "<td style='width:20%;border:0px;text-align:center;font-weight:bold;'>기간</td>";
	contents = contents + "<td style='width:15%;border:0px;text-align:center;font-weight:bold;'>총금액</td>"
	contents = contents + "<td style='width:46%;border:0px;text-align:center;font-weight:bold;'>결제정보</td>";;
	contents = contents + "</tr>";
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
			paytime = cdate.format("isoDateTime2");
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
			tempcontents = tempcontents + "<tr style='border-top:1px solid #C0C0C0;'>";
			tempcontents = tempcontents + "<td style='border:0px;text-align:center;vertical-align:middle;'>";
			tempcontents = tempcontents + rowcount;
			tempcontents = tempcontents + "</td>";
			tempcontents = tempcontents + "<td style='border:0px;text-align:center;vertical-align:middle;'>";
			tempcontents = tempcontents + r.name;
			tempcontents = tempcontents + "</td>";
			tempcontents = tempcontents + "<td style='border:0px;text-align:center;vertical-align:middle;'>";
			tempcontents = tempcontents + r.from_date + " ~ " + r.to_date;
			tempcontents = tempcontents + "</td>";
			tempcontents = tempcontents + "<td style='border:0px;text-align:center;vertical-align:middle;'>";
			tempcontents = tempcontents + comma(r.real_money);
			tempcontents = tempcontents + "</td>";
			tempcontents = tempcontents + "<td style='border:0px;text-align:center;vertical-align:middle;'>";
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
	contents = contents + "<tr style='border:0px;cursor:pointer' onclick='javascript:displayPaid(\"" + ptype + "\");'>";
	contents = contents + "<td colspan='4' style='width:100%;border:0px;text-align:right;vertical-align:middle;'>";
	contents = contents + "<img id='paidup2" + ptype + "' src='/resources/images/up.jpg' style='border:0px;text-align:right;vertical-align:middle;'/>";
	contents = contents + "</td>";
	contents = contents + "</tr>";
	contents = contents + "</table>";
	contents = contents + "</div>";
	contents = contents + "</div>";
	obj.html(contents);
	$("#paidup" + ptype).on("click", function(e){
		e.stopPropagation();
		hidePaidReservation(ptype);
	});
	$("#paidup2" + ptype).on("click", function(e){
		e.stopPropagation();
		hidePaidReservation(ptype);
	});
	$("#paiddown" + ptype).on("click", function(e){
		e.stopPropagation();
		showPaidReservation(ptype);
	});
	return obj;
}

function createPlannedReservationElem(smonth, reservation_list, payment) {
	var obj = $(document.createElement("div")).addClass("dashboard2").css({"margin-top":"10px"});
	var contents = "";
	contents = contents + "<div class='fn-gantt' style='width:100%;'>";
	contents = contents + "<div class='fn-content' style='margin:10px;'>";
	contents = contents + "<table style='width:98%;border:0px;'>";
	contents = contents + "<tr style='border:0px;cursor:pointer;' onclick='javascript:displayPlanned();'>";
	contents = contents + "<td style='border:0px;width:50%;text-align:left;font-weight:bold;font-size:14pt;'>" + smonth + "월 입실(결제)예정 목록</td>";
	contents = contents + "<td style='border:0px;width:50%;text-align:right;'>";
	contents = contents + "<input type='hidden' id='isplanned' value='0'/>";
	contents = contents + "<img id='plannedup' src='/resources/images/up.jpg' style='border:0px;text-align:right;vertical-align:middle;display:none;'/>";
	contents = contents + "<img id='planneddown' src='/resources/images/down.jpg' style='border:0px;text-align:right;vertical-align:middle;'/>";
	contents = contents + "</td>";
	contents = contents + "</tr>";
	contents = contents + "</table>";
	contents = contents + "<table id='plannedtable' style='margin-top:20px;width:98%;border:0px;display:none;'>";
	contents = contents + "<tr style='border:0px;'>";
	contents = contents + "<td style='width:9%;border:0px;text-align:center;font-weight:bold;'>No.</td>"
	contents = contents + "<td style='width:10%;border:0px;text-align:center;font-weight:bold;'>예약자</td>";
	contents = contents + "<td style='width:20%;border:0px;text-align:center;font-weight:bold;'>기간</td>";
	contents = contents + "<td style='width:13%;border:0px;text-align:center;font-weight:bold;'>총금액</td>"
	contents = contents + "<td style='width:13%;border:0px;text-align:center;font-weight:bold;'>잔금</td>"
	contents = contents + "<td style='width:35%;border:0px;text-align:center;font-weight:bold;'>과거 결제정보</td>";;
	contents = contents + "</tr>";
	for(var i=0; i<reservation_list.length; i++) {
		var r = reservation_list[i];
		var rpay = payment[r.no];
		contents = contents + "<tr style='border-top:1px solid #C0C0C0;'>";
		contents = contents + "<td style='border:0px;text-align:center;vertical-align:middle;'>";
		contents = contents + (reservation_list.length - i);
		contents = contents + "</td>";
		contents = contents + "<td style='border:0px;text-align:center;vertical-align:middle;'>";
		contents = contents + r.name;
		contents = contents + "</td>";
		contents = contents + "<td style='border:0px;text-align:center;vertical-align:middle;'>";
		contents = contents + r.from_date + " ~ " + r.to_date;
		contents = contents + "</td>";
		contents = contents + "<td style='border:0px;text-align:center;vertical-align:middle;'>";
		contents = contents + comma(r.real_money);
		contents = contents + "</td>";
		contents = contents + "<td style='border:0px;text-align:center;vertical-align:middle;'>";
		contents = contents + comma(r.remain_money);
		contents = contents + "</td>";
		contents = contents + "<td style='border:0px;text-align:center;vertical-align:middle;'>";
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
			paytime = cdate.format("isoDateTime2");
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
	contents = contents + "<tr style='border:0px;cursor:pointer;' onclick='javascript:displayPlanned();'>";
	contents = contents + "<td colspan='5' style='width:100%;border:0px;text-align:right;vertical-align:middle;'>";
	contents = contents + "<img id='plannedup2' src='/resources/images/up.jpg' style='border:0px;text-align:right;vertical-align:middle;'/>";
	contents = contents + "</td>";
	contents = contents + "</tr>";
	contents = contents + "</table>";
	contents = contents + "</div>";
	contents = contents + "</div>";
	obj.html(contents);
	$("#plannedup").on("click", function(e){
		e.stopPropagation();
		hidePlannedReservation();
	});
	$("#plannedup2").on("click", function(e){
		e.stopPropagation();
		hidePlannedReservation();
	});
	$("#planneddown").on("click", function(e){
		e.stopPropagation();
		showPlannedReservation();
	});
	return obj;
}


