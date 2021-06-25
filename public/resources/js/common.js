
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

/**
 * http://programmingsummaries.tistory.com/239
 * @param string
 * @returns {Number}
 */
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

String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
}

String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/gi, "");
}

Array.prototype.removeElement = function(index) {
	this.splice(index, 1);
	return this;
};

if (!String.prototype.format) {
	String.prototype.format = function() {
		var str = this.toString();
		if (!arguments.length)
			return str;
		var args = typeof arguments[0],
		args = (("string" == args || "number" == args) ? arguments : arguments[0]);
		for (arg in args)
			str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
		return str;
	}
}

//function comma(str) {
//	str = String(str);
//	return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');

//function uncomma(str) {
//	str = String(str);
//	return str.replace(/[^\d]+/g, '');
//}

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

function inputNumberFormat(obj) {
	obj.value = comma(uncomma(obj.value));
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

function getCenterList(object) {
	object.empty();
//	object.append("<option value='-100'>----</option>");
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
					if(i==0){
						contents = "<option value='" + center.no + "'>" + center.name + "</option>";
					}else{
						contents = "<option value='" + center.no + "'>" + center.name + "</option>";	
					}
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
				location.reload();
			} else {
				alert(t("common.cantchangebranch"));
				hideLoadingLayer();
			}
		}
	});
}

function changeBranch() {
	$("#m_centerList").combobox({
		"iwidth":200,
		"scss":{"margin":"0 auto 8px", "display":"block", "text-align":"center"},
		"ireadonly":false,
		"iblur":selectMCenter,
		"bcssClassName":"text",
		"bheight":27,
		"iheight":23,
	});
	$("#m_branchList").combobox({
		"iwidth":200,
		"scss":{"margin":"0 auto 8px", "display":"block", "text-align":"center"},
		"ireadonly":false,
		"bcssClassName":"text",
		"bheight":27,
		"iheight":23,
	});
	getCenterList($("#m_centerList"));
	layer_open("branch_layer", "fade", true);
}

function selectMCenter() {
	var span = $("#m_branchList").next();
	var input = span.children(":first");
	input.val("");
	getBranchList($("#m_centerList"), $("#m_branchList"));
}

function closeBranchWindow() {
	$("#mask_popup_branch").hide();
	$("#div_loading_branch").hide();
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

function setNumberEvent(id) {
	$(id).on('keydown', function (e){
		setTimeout(function (){
			var value = $(id).val();
			if(value == "" || value.length == 0) {
				return false;
			}
			if($.isNumeric(value) == false) {
				alert(t("common.inputnum"));
				value = value.replace(/[^0-9]/g,'');
				$(id).val(value);
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
						alert(t("reservation.only.fund"));
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

function setDatePicker(id) {
	setDatePickerWithOption(id, null);
}

function setDatePickerWithOption(id, option) {
	if($(id).length) {
		$(id).datepicker({
			dateFormat: "yy-mm-dd",
			beforeShow: function() {
		        setTimeout(function(){
		            $('.ui-datepicker').css('z-index', 99999999999999);
		        }, 0);
		    }
		});
		if(option != null) {
			$(id).datepicker("option", option);
		}
	}
}

function setMonthPicker(id, option) {
	if($(id).length) {
		$(id).datepicker({
			changeMonth: true,
			changeYear: true,
			dateFormat: "yy-mm",
			onClose: function() {
				var iMonth = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
				var iYear = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
				$(this).datepicker('setDate', new Date(iYear, iMonth, 1)).trigger("change");
			},
			beforeShow: function() {
				setTimeout(function(){
					$('.ui-datepicker').css('z-index', 99999999999999);
				}, 0);
				var selDate = $(this).val();
				if (selDate.length > 0) {
					var iYear = selDate.substring(0, 4);
					var iMonth = selDate.substring(5, 7);
					$(this).datepicker('option', 'defaultDate', new Date(iYear, iMonth-1, 1));
					$(this).datepicker('setDate', new Date(iYear, iMonth-1, 1));
				}
			}
		});
		if(option != null) {
			$(id).datepicker("option", option);
		}
	}
}

function showLoadingLayer() {
	$("#mask_loading_popup").show();
	$("#div_loading_popup").show();
}

function hideLoadingLayer() {
	$("#mask_loading_popup").hide();
	$("#div_loading_popup").hide();
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

function setSelectValue(id, value, text) {
	var span = $(id).next();
	var input = span.children(":first");
	input.val(text);
	$(id).val(value);
}

