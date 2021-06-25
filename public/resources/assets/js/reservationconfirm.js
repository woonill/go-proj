$(window).on("beforeunload", function(){
	if($("#exitPage").val() != 0){
		deleteReservationTempFile();
	}
});

function deleteReservationTempFile(){
	var bno = $("#bno").val();
	var manager = $("#user").val();
	$.ajax({
		type: 'POST',
		async: true,
		dataType: 'json',
		traditional: true,
		data: {
			bno : bno,
			manager : manager
		},
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