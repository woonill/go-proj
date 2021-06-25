$(function() {
	$("#menu_room").on("click", function(e) {
		$(location).attr("href", "/room/main");
	});
	$("#menu_interest").on("click", function(e) {
		$(location).attr("href", "/interest/main");
	});
	$("#menu_discount").on("click", function(e) {
		$(location).attr("href", "/discount/main");
	});
	$("#menu_gongu").on("click", function(e) {
		$(location).attr("href", "/gongu/main");
	});
	$("#menu_mgr").on("click", function(e) {
		$(location).attr("href", "/mgr/list");
	});
	$("#menu_aesthetic").on("click", function(e) {
		$(location).attr("href", "/aesthetic/list");
	});
	$("#menu_aesthetic_schedule").on("click", function(e) {
		$(location).attr("href", "/aesthetic/main");
	});
	$("#menu_aesthetic_ticket").on("click", function(e) {
		$(location).attr("href", "/aesthetic/ticket/list");
	});
	$("#menu_balance_main").on("click", function(e) {
		$(location).attr("href", "/balance/main");
	});
	$("#menu_balance_reservation").on("click", function(e) {
		$(location).attr("href", "/balance/reservation");
	});
	$("#menu_balance_deposit").on("click", function(e) {
		$(location).attr("href", "/balance/deposit");
	});
	$("#menu_balance_aesthetic").on("click", function(e) {
		$(location).attr("href", "/balance/aesthetic");
	});
	$("#menu_balance_inventory").on("click", function(e) {
		$(location).attr("href", "/balance/inventory");
	});
	$("#menu_inventory_main").on("click", function(e) {
		$(location).attr("href", "/inventory/list");
	});
	$("#menu_inventory_spend").on("click", function(e) {
		$(location).attr("href", "/inventory/spend/list");
	});
	$("#menu_inventory_payment").on("click", function(e) {
		$(location).attr("href", "/inventory/payment/list");
	});
	$("#menu_reservation_list").on("click", function(e) {
		$(location).attr("href", "/reservation/list");
	});
	$("#menu_user_list").on("click", function(e) {
		$(location).attr("href", "/user/list");
	});
	$("#menu_system_role").on("click", function(e) {
		$(location).attr("href", "/system/role/list");
	});
	$("#menu_system_view").on("click", function(e) {
		$(location).attr("href", "/system/view/list");
	});
	$("#menu_system_menu").on("click", function(e) {
		$(location).attr("href", "/system/menu/list");
	});
	$("#menu_system_mapping").on("click", function(e) {
		$(location).attr("href", "/system/mapping/main");
	});
});