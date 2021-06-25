/**
 * constant
 */
var RESULT_SUCCESS = "S";
var RESULT_FAIL = "F";
var RESULT_OK = "OK";
var RESULT_VALID_CODE = 1001;
var RESULT_PERSON_LIMIT = 1002;
var RESULT_DATE_OVER = 1003;
var RESULT_ROOM_PERMISSION = 1004;

var slider = [], co = [], fn = [];
// document size type
co.getdoc = (function(){
	var body = $('body');
	switch (body.css('z-index')){
		case '1' : if (co.device != 'pc'){co.device = 'pc';co.respond = true;}break;
		case '2' : if (co.device != 'tb'){co.device = 'tb';co.respond = true;}break;
	}
});
co.layer = function(el, callback){
	var el = $(el),
		data = el.data(),
		titleClass = el.attr('title') ? '' : 'none';

	return el.dialog({
		'resizable': false,
		'draggable': false,
		'height': 'auto',
		'width': (data.width ? data.width : 800),
		'minHeight': 0,
		'modal': true,
		'classes': {
			'ui-dialog': 'ui-layer',
			'ui-dialog-title': titleClass
		},
		'closeText': t("common.closes"),
		'focus': function(event, ui) { 
			$(this).attr('tabindex','-1').trigger('focus'); 
		},
		'open': function() {
			var layer = $(this);
			$(this).on('click','.btn-dialog-no',function(){
				layer.dialog('close');
				return false;
			});
			callback && typeof(callback) == 'function' && callback(this);
		},
		'close' : function(){
			$(this).remove();
		}
	})
};
co.download = function(el, callback){
	return $(el).dialog({
		'resizable': false,
		'draggable': false,
		'height': 'auto',
		'width': 300,
		'minHeight': 0,
		'modal': true,
		'classes': {'ui-dialog': 'ui-confirm download'},
		'closeText': t("common.closes"),
		'close' : function(){
			$(this).remove();
		},
		'buttons': [
			{
				'text': t("reservation.cancels"),
				'icon': 'icon-dialog-no',
				'class': 'btn-dialog-no',
				'click': function() {
					$(this).dialog('close');
				}
			},{
				'text': t("common.download"),
				'icon': 'icon-dialog-yes',
				'class': 'btn-dialog-yes',
				'click': function() {
					$(this).dialog('close');
					callback && typeof(callback) == 'function' && callback();
				}
			},
		]
	});
}
co.dialogMessage = function(message){
	return $('<div class="ui-confirm-content"><div class="inner">'+message+'</div></div>').dialog({
		'resizable': false,
		'draggable': false,
		'height': 'auto',
		'width': 300,
		'minHeight': 0,
		'modal': true,
		'classes': {'ui-dialog': 'ui-confirm'},
		'closeText': t("common.closes"),
		'close' : function(){
			$(this).remove();
		}
	});
}
co.alert = function(message, callback){
	$('<div class="ui-confirm-content"><div class="inner">'+message+'</div></div>').dialog({
		'resizable': false,
		'draggable': false,
		'height': 'auto',
		'width': 300,
		'minHeight': 0,
		'modal': true,
		'classes': {'ui-dialog': 'ui-confirm'},
		'closeText': t("common.closes"),
		'close' : function(){
			$(this).remove();
			callback && typeof(callback) == 'function' && callback();
		},
		'buttons': [
			{
				'text': t("common.confirm"),
				'icon': 'icon-dialog-yes',
				'class': 'btn-dialog-yes',
				'click': function() {
					$(this).dialog('close');
					
				}
				
			}
		]
	});
	
	//co.dialogMessage(message).dialog('option',);
}
co.confirm = function(message, callback){
	co.dialogMessage(message).dialog('option','buttons', [
		{
			'text': t("common.confirm"),
			'icon': 'icon-dialog-yes',
			'class': 'btn-dialog-yes',
			'click': function() {
				$(this).dialog('close');
				callback && typeof(callback) == 'function' && callback();
			}
		},{
			'text': t("reservation.cancels"),
			'icon': 'icon-dialog-no',
			'class': 'btn-dialog-no',
			'click': function() {
				$(this).dialog('close');
			}
		}
	]);
}
co.clickTooltip = function(){
	$(document).on('click','[data-click-tooltip]',function(){
		var tooltip = $(this);
		tooltip.attr('title', '');
		$(this).tooltip({
			position: { my: "center top", at: "center bottom+5" },
			show: false,
			close : function(e) {
				$(e.target).tooltip('destroy').removeAttr('title');
			},
			content: function() {
				var el = $(this);
				return el.data('click-tooltip');
			}
		}).trigger('mouseenter');
		return false;
	});
}
co.focusField = function(){
	$('.field').on('focusin','input',function(){
		$(this).parents('.field').addClass('active');
	});
	$('.field').on('focusout','input',function(){
		$(this).parents('.field').removeClass('active');
	});
	$('.file-field').on('change','input:file',function(){
		var a = $(this).closest('.file-field').find('.i-filename').val();
		var files = this.files[0];
		files = files && files.name || '';
		$(this).closest('.file-field').find('.i-filename').val(files);
	});
}
co.datepicker = function(){
	$('.datepicker').each(function(eq,el){
		var target = el.tagName != 'INPUT' ? $(el).find('input') : $(el);
		var pickerOption = target.data();
		if (!target.hasClass('hasDatepicker')){
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
				onSelect: function(date, e){
					var el = $(this),
						data = el.data();
					if (data.bridge){
						var sibling = $('[data-bridge='+data.bridge+']').not('[data-type='+data.type+']'),
							response = sibling.data('type') == 'start' ? 'maxDate' : 'minDate';
						el.parent().trigger('focusin');
						setTimeout(function(){
							sibling.datepicker('option', response, date);
						},100);
					}
					
					el.trigger('change');
					
				}  
			});
			(function(el, date){
				var data = el.data();
				if (date !== '' && data.bridge){
					var sibling = $('[data-bridge='+data.bridge+']').not('[data-type='+data.type+']'),
						response = sibling.data('type') == 'start' ? 'maxDate' : 'minDate';
					el.parent().trigger('focusin');
					setTimeout(function(){
						sibling.datepicker('option', response, date);
					},100);
				}
			})(target, target.val());

			if (pickerOption.minDate){
				pickerOption.minDate = pickerOption.minDate == 'today' ? new Date() : new Date(pickerOption.minDate);
				target.datepicker('option', 'minDate', pickerOption.minDate);
			}
			if (pickerOption.maxDate){
				pickerOption.maxDate = pickerOption.maxDate == 'today' ? new Date() : new Date(pickerOption.maxDate);
				target.datepicker('option', 'maxDate', pickerOption.maxDate);
			}
		}
	});
}
co.monthpicker = function(){
	$('.monthpicker').each(function(eq,el){
		var target = el.tagName != 'INPUT' ? $(el).find('input') : $(el);
		var pickerOption = target.data();
		if (!target.hasClass('hasMonthpicker')){
			target.addClass('hasMonthpicker').MonthPicker({
				Button: false,
				MonthFormat : pickerOption.dateFormat ? pickerOption.dateFormat : 'yy-mm',
			}).on('change',function(){
				var el = $(this),
					data = el.data();
				if (data.bridge){
					var sibling = $('[data-bridge='+data.bridge+']').not('[data-type='+data.type+']'),
						response = sibling.data('type') == 'start' ? 'MaxMonth' : 'MinMonth';
					el.parent().trigger('focusin');
					setTimeout(function(){
						sibling.MonthPicker('option', response, el.val());
					},100);
				}
			});
		}
		
		if (pickerOption.minDate){
			pickerOption.minDate = pickerOption.minDate == 'today' ? new Date() : new Date(pickerOption.minDate);
			target.MonthPicker('option', 'MinMonth', pickerOption.minDate);
		}
		if (pickerOption.maxDate){
			pickerOption.maxDate = pickerOption.maxDate == 'today' ? new Date() : new Date(pickerOption.maxDate);
			target.MonthPicker('option', 'MaxMonth', pickerOption.maxDate);
		}
	});
}
co.selectTeb = function(){
	$('[data-select-tab]').each(function(eq,el){
		var el = $(el),
			tabkey = el.data('select-tab');
		el.off().on('change',function(){
			var tabvalue = $(this).find(':checked').attr('value');
			var tabfield = $('[data-'+tabkey+'="'+tabvalue+'"]');
			tabfield.addClass('active').find('input, select, button').prop('disabled', false);
			tabfield.siblings('[data-'+tabkey+']').removeClass('active').find('input, select, button').prop('disabled', true);
		}).trigger('change');
	});
}
co.contentTab = function(){
	var wrap = $('.content-tab-area'),
		menu = wrap.find('.tab-menu').find('li'),
		list = wrap.find('.tab-panel');
	menu.on('click','a',function(){
		var el = $(this);
		if (el.data('role') != 'link'){
			var parent = el.closest('li'),
				index = parent.index();
			parent.addClass('active').siblings('.active').removeClass('active');
			list.eq(index).addClass('active').siblings('.active').removeClass('active');
			return false;
		}
	});
	if (!menu.filter('.active').length){
		menu.eq(0).find('a').data('role') != 'link' && menu.eq(0).find('a').trigger('click');
	} else {
		menu.filter('.active').find('a').data('role') != 'link'&& menu.filter('.active').find('a').trigger('click');
	}
}
co.contentDepth = function(){
	var wrap = $('.content-depth-panel'),
		opener = wrap.find('.btn-opener'),
		closer = wrap.find('.btn-closer');
	opener.on('click',function(){
		var box = $(this).closest('.content-depth-panel'),
			parent = box.children('.parent-content'),
			child = box.find('.child-content');
		parent.removeClass('active');
		child.addClass('active');
		return false;
	});
	closer.on('click',function(){
		var box = $(this).closest('.content-depth-panel'),
			parent = box.children('.parent-content'),
			child = box.find('.child-content');
		parent.addClass('active');
		child.removeClass('active');
		return false;
	});
	closer.trigger('click');
}
co.checkbox = function(){
	$('input:checkbox[data-role="all"]').closest('table').on('change','input:checkbox',function(){
        var checkbox = $(this),
            table = checkbox.closest('table'),
            listcheckbox = table.find('tbody').find('input:checkbox');
        if (checkbox.data('role') == 'all'){
            listcheckbox.prop('checked',checkbox.is(':checked'));
        } else {
            table.find('input[data-role="all"]').prop('checked',listcheckbox.length == listcheckbox.filter(':checked').length);
        }
    });
}
co.init = function(){
	co.getdoc();
	co.focusField();
	co.clickTooltip();
	co.datepicker();
	co.monthpicker();
	co.selectTeb();
	co.contentTab();
	co.contentDepth();
	co.checkbox();
	var ieOldVer = $('#ie-version');
	if (ieOldVer.length){
		ieOldVer.on('click','.version-close',function(){
			ieOldVer.remove();
		});
	}
};
co.reszieEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
co.resize = function(){
	if (co.respond){
	}
};
$(function(){
	co.init();
	if (fn.init) fn.init();
	$(window).on(co.reszieEvent, function() {
		co.getdoc();
		co.resize();
		if (fn.resize) fn.resize();
		co.respond = false;
	});
});


/**
 * check if value is null
 * @param value
 * @returns if value is null - true
 */
function isNull(value) {
	if(isEmpty(value)) {
		return true;
	}
	if(isBlank(value)) {
		return true;
	}
	return false;
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

//콤마찍기
function comma(str) {
	str = String(str);
	var minus = str.substring(0, 1);
	str = str.replace(/[^\d]+/g, '');
	str = str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
	if(minus == "-") str = "-"+str;
	return str;
}

//콤마풀기
function uncomma(str) {
	str = String(str);
//	var minus = str.substring(0, 1);
//	str = str.replace(/[^\d]+/g, '');
	str = str.replace(/\,/g,"");
//	if(minus == "-") str = "-"+str;
	return str;
}

function showLoadingLayer() {
	$("#mask_loading_popup").show();
	$("#div_loading_popup").show();
}

function hideLoadingLayer() {
	$("#mask_loading_popup").hide();
	$("#div_loading_popup").hide();
}

function setPhoneEvent(id) {
	$(id).on('keydown', function (e){
		setTimeout(function (){
			var phone = $(id).val();
			if(phone == "" || phone.length == 0) {
				return false;
			}
			if($.isNumeric(phone) == false) {
				alert(t("common.phoneisnum"));
				phone = phone.replace(/[^0-9]/g,'');
				$(id).val(phone);
				return false;
			}
			if(phone.length > 4) {
				alert(t("common.contactfour"));
				phone = phone.substr(0, 4);
				$(id).val(phone);
				return false;
			}
		}, 100);
	});
}

function setMoneyCommaEvent(id) {
	$(id).on('keydown', function (e){
		setTimeout(function (){
			if(e.keyCode < 37 || e.keyCode > 40) {
				var money = uncomma($(id).val());
				if(money == "" || isNull(money)) {
					money = 0;
				}
				if(money == '-') {
					;
				} else {
					var m = money;
					var c = money.toString().charAt(0);
					if(c == '-') {
						m = money.substr(1);
					}
					if($.isNumeric(m) == false) {
						co.alert(t("common.moneyisnum"), function(){$(id).focus();});
						m = m.replace(/[^0-9]/g,'');
						if(m == "" || isNull(m)) {
							m = 0;
						}
						if(c == '-') {
							m = c+m;
						}
						$(id).val(comma(money));
						return false;
					}
				}
				if(money != '-') {
					money = parseInt(money, 10);
					if(money != NaN && money != 0) {
						$(id).val(comma(money));
					}
				}
			}
		}, 100);
	});
}

function setNumberEvent(id, field) {
	$(id).on('keydown', function (e){
		setTimeout(function (){
			var value = $(id).val();
			if(value == "" || value.length == 0) {
				return false;
			}
			if($.isNumeric(value) == false) {
				if( field == "" || field == null || field == undefined || ( field != null && typeof field == "object" && !Object.keys(field).length ) ){
					co.alert(t("common.onlynum"), function(){$(id).focus();});
				} else {
					co.alert('<p>' + field + t("common.inputnumonly"), function(){$(id).focus();});	
				}
				
				value = value.replace(/[^0-9]/g,'');
				$(id).val(value);
				return false;
			}
		}, 100);
	});
}

function getByteLength(string) {
	var stringByteLength = (function(s,b,i,c){
	    for(b=i=0;c=s.charCodeAt(i++);b+=c>>11?3:c>>7?2:1);
	    return b
	})(string);
	return stringByteLength;
}

function cutString(string, limit) {
	var cut = "";
	var length = 0;
	for(var b=0,i=0,c='';c=string.charCodeAt(i); i++) {
		b = c>>11?3:c>>7?2:1;
		if( (length+b) > limit ) {
			break;
		}
		length = length + b;
		cut = cut + string.charAt(i);
	}
	return cut;
}

function setSelectValue(id, value, text) {
	var span = $(id).next();
	var input = span.children(":first");
	input.val(text);
	$(id).val(value);
}

function findNremove(arr, val) {
	var j = 0;
	for (var i = 0, l = arr.length; i < l; i++) {
		if (arr[i] != val) {
			arr[j++] = arr[i];
		}
	}
	arr.length = j;
}

$.extend({
	redirectPost: function(location, args) {
		var form = '';
		$.each( args, function( key, value ) {
			form += '<input type="hidden" name="'+key+'" value="'+value+'">';
		});
		$('<form action="'+location+'" method="POST">'+form+'</form>').appendTo('body').submit();
	}
});

function changeBranch() {
	var layer = $('.change-branch').html();
    co.layer(layer,function(el){
    	
    	$('#m_centerList', el).on('change', function(){
			getBranchList($("#m_centerList"), $("#m_branchList"));
    	});
    	getCenterList($("#m_centerList"));
    	
    	 $(el).on('submit','form',function(){
    		 doChangeBranch();
             $(this).closest('.ui-dialog-content').dialog('close');
             return false;
         })
    });
}

function getCenterList(object) {
	object.empty();
	object.append("<option value='-100'>----</option>");
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
		},
		traditional: true,
		url: '/center/list/alldata',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var contents = "";
				var count = data.center_total_count;
				var centerList = data.center_list;
				for(var i=0; i<centerList.length; i++) {
					var center = centerList[i]
					contents = "<option value='" + center.no + "'>" + center.name + "</option>";
					object.append(contents);
				}
				hideLoadingLayer();
			} else {
				alert(t("common.cantpostnatallist"));
				hideLoadingLayer();
			}
		}
	});
}

function getBranchList(cobj, object) {
	var no = parseInt(cobj.val());
	if(no == -100) {
		return false;
	}
	object.empty();
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
		},
		traditional: true,
		url: '/branch/list/alldata',
		data: {
			care_center_no : no
		},
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var contents = "";
				var count = data.branch_total_count;
				var branchList = data.branch_list;
				for(var i=0; i<branchList.length; i++) {
					var branch = branchList[i]
					contents = "<option value='" + branch.no + "'>" + branch.name + "</option>";
					object.append(contents);
				}
				hideLoadingLayer();
			} else {
				alert(t("center.nobranchlist"));
				hideLoadingLayer();
			}
		}
	});
}

function doChangeBranch() {
	var careCenterNo = parseInt($("#m_centerList").val());
	var branchNo = parseInt($("#m_branchList").val());
	let loc = document.location.pathname;
	if(careCenterNo < 1) {
		alert(t("common.selectpostnatal"));
		return false;
	}
	if(branchNo < 1) {
		alert(t("common.selectbranch"));
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
		},
		traditional: true,
		url: '/branch/change',
		data: {
			care_center_no : careCenterNo,
			branch_no : branchNo
		},
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
				location.href = loc;
			} else {
				alert(t("common.cantchangebranch"));
				hideLoadingLayer();
			}
		}
	});
}
