/**
 * 
 */
var appCounsel = new Object();

appCounsel.viewCounsel = function(no) {
	var url = "/app/view?consult_no=" + no;
	$(location).attr("href", url);
}

appCounsel.confirmCounsel = function() {
	var layer = $('.reserve-confirm').html();
	
    co.layer(layer,function(el){
        $(el).on('click','.btn-reserve-confirm',function(){
        	appCounsel.updateCounselExe();
        	$(this).closest('.ui-dialog-content').dialog('close');
            
        })
        $(el).on('click','.btn-reserve-modify',function(){
        	$(this).closest('.ui-dialog-content').dialog('close');
        	appCounsel.changeCounsel()
        });
    });
}

appCounsel.changeCounsel = function() {
	var layer = $('.reserve-modify').html();
    co.layer(layer,function(el){
        co.datepicker();
        
        $('#cDate', el).val($('#date').val());
        $('#cTime', el).val($('#time').val());
        
        $(el).on('submit','form',function(){
        	$('#date').val($('#cDate').val());
        	$('#time').val($('#cTime').val());
        	appCounsel.updateCounselExe();
            $(this).closest('.ui-dialog-content').dialog('close');
            return false;
        })
    });
}

appCounsel.updateCounselExe = function() {
	
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			bno : $('#bno').val()
			, consult_no : $('#consult_no').val()
			, date : $('#date').val()
			, time : $('#time').val()
		},
		traditional: true,
		url: '/app/updateExe',
		error: function() {
			co.alert( t("common.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				hideLoadingLayer();
				if($('#status').val() == '1') {
					co.alert(t("app.change"), function(){location.reload()});
				} else {
					co.alert(t("app.decide"), function(){location.reload()});
				}
				
				
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/login?uri=" + encodeURI("/counsel/list"));
				} else if(parseInt(status.code) == 20104) {
					alert(t("discount.login"));
					$(location).attr("href", "/login/logout");
				} else {
					alert(t("app.cantadd"));
					hideLoadingLayer();
				}
			}
		}
	});
}

appCounsel.deleteCounselExe = function() {
	co.confirm(t("app.delete"),function(){
		$.ajax({
			type: 'post',
			async: true,
			dataType: 'json',
			data: {
				bno : $('#bno').val()
				, consult_no : $('#consult_no').val()
			},
			traditional: true,
			url: '/app/deleteExe',
			error: function() {
				hideLoadingLayer();
				co.alert(t("app.error"));
			},
			beforeSend: function() {},
			success: function(res) {
				var status = res.status;
				if(status.result == RESULT_SUCCESS) {
					hideLoadingLayer();
					co.alert(t("app.del"), function(){ location.href="/app/list"});
					
					
					
				} else {
					if(parseInt(status.code) == 20102) {
						alert(t("discount.logout"));
						$(location).attr("href", "/login/login?uri=" + encodeURI("/counsel/list"));
					} else if(parseInt(status.code) == 20104) {
						alert(t("discount.login"));
						$(location).attr("href", "/login/logout");
					} else {
						alert(t("app.cantadd"));
						hideLoadingLayer();
					}
				}
			}
		});
	});
	
}
