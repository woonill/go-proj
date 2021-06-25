
var main_menu_updated = false;
var sub_menu_updated = false;

function addRole() {
	$(location).attr("href", "/system/role/add");
}

function addView() {
	$(location).attr("href", "/system/view/add");
}

function addMenu() {
	$(location).attr("href", "/system/menu/add");
}

function modifyRole(no) {
	$(location).attr("href", "/system/role/modify?no="+no);
}

function modifyView(no) {
	$(location).attr("href", "/system/view/modify?no="+no);
}

function modifyMenu(no) {
	$(location).attr("href", "/system/menu/modify?no="+no);
}

function editMapping() {
	var no = $('#role_no').val();
	$(location).attr("href", "/system/mapping/view_modify?manager_role_no="+no);
	//getViewListData();
}

function initRoleList() {
	
}

function initViewList() {
	
}

function initMenuList() {
	$("input[type='radio'], input[type='checkbox']").labelauty({ minimum_width:"100px", class:"chkradio" });
}

function initMapping() {
	$("#role_list").selectable({
		stop: function(event, ui) { 
			$(event.target).children('.ui-selected').not(':first').removeClass('ui-selected');
			$("#role_list .ui-selected").each(function(){
				var no = $(this).data("value");
				$("#manager_role_no").val(no);
				getCurMainMenu(no);
			});
		},
	    unselected: function(){
	    	$(":not(.ui-selected)", this).each(function(){
	    		$(this).removeClass('ui-state-highlight-c').css({"color":"#696969"});
	    	});
	    },
	    selected: function(){
	    	$(".ui-selected", this).each(function(){
	    		$(this).addClass('ui-state-highlight-c').css({"color":"#FFFFFF"});
	    	});
	    }
	});
	$("#role_list_view").selectable({
		stop: function(event, ui) { 
			$(event.target).children('.ui-selected').not(':first').removeClass('ui-selected');
			$("#role_list_view .ui-selected").each(function(){
				var no = $(this).data("value");
				$("#manager_role_no").val(no);
				$("#edit_mapping").show();
				getRoleView(no);
			});
		},
	    unselected: function(){
	    	$(":not(.ui-selected)", this).each(function(){
	    		$(this).removeClass('ui-state-highlight-c').css({"color":"#696969"});
	    	});
	    },
	    selected: function(){
	    	$(".ui-selected", this).each(function(){
	    		$(this).addClass('ui-state-highlight-c').css({"color":"#FFFFFF"});
	    	});
	    }
	});
	$("#role_list li").hover(
		function () {
			$(this).addClass('ui-state-hover');
		}, 
		function () {
			$(this).removeClass('ui-state-hover');
		}
	);
	$("#role_list_view li").hover(
		function () {
			$(this).addClass('ui-state-hover');
		}, 
		function () {
			$(this).removeClass('ui-state-hover');
		}
	);
	$("input[type='radio'], input[type='checkbox']").labelauty({ minimum_width:"50px", class:"chkradio" });
	$("#viewdiv").css({"min-height":($("#roletd").css("height"))});
	$("#view_layer_a").text(t("system.save"));
	$("#view_layer_a").on("click", function(){
		saveViewMappingExe();
	});
}

function initAddRole() {
	$("input[type='radio'], input[type='checkbox']").labelauty({ minimum_width:"100px", class:"chkradio" });
}

function initModifyRole() {
	$("input[type='radio'], input[type='checkbox']").labelauty({ minimum_width:"100px", class:"chkradio" });
}

function checkRoleInput() {
	if(isNull($("#role").val())) {
		co.alert(t("system.input.roles"), function(){$("#role").focus();});
		return false;
	}
	if(isNull($("#name").val())) {
		co.alert(t("system.input.explains"), function(){$("#name").focus();});
		return false;
	}
	return true;
}

function checkViewInput() {
	if(isNull($("#view_view").val())) {
		co.alert(t("system.input.views"), function(){$("#view_view").focus();});
		
		return false;
	}
	return true;
}

function checkMenuInput() {
	if(isNull($("#menu_name").val())) {
		co.alert(t("system.input.menus"), function(){$("#menu_name").focus();});
		return false;
	}
	if(isNull($("#menu_link").val())) {
		co.alert(t("system.input.links"), function(){$("#menu_link").focus();});
		
		return false;
	}
	return true;
}

function setMainMenuEvent() {
	$("#all_main_menu li").off("click");
	$("#all_main_menu li").removeClass("ui-state-highlight-c").css({"color":"#696969"});
	$("#cur_main_menu li").on("click", function(){
		$("#cur_main_menu .ui-state-highlight-c").removeClass("ui-state-highlight-c").css({"color":"#696969"});
		$("#cur_main_menu .ui-state-highlight-c").removeClass('ui-state-hover');
		$(this).addClass('ui-state-highlight-c').css({"color":"#FFFFFF"});
		$("#all_sub_menu").empty();
		$("#cur_sub_menu").empty();
		var no = $(this).attr("no");
		var openwindow = $(this).attr("openwindow");
		var isshow = $(this).attr("isshow");
		var onlyroot = $(this).attr("onlyroot");
		var hassub = parseInt($(this).attr("hassub"));
		if(hassub == 1) {
			$("#cur_sub_menu_option").hide();
			getCurSubMenu(no);
		}
		$("#cm_no").val(no);
		$("input:radio[name='cm_openwindow'][value='"+openwindow+"']").prop("checked", true);
		$("input:radio[name='cm_onlyroot'][value='"+onlyroot+"']").prop("checked", true);
		$("input:radio[name='cm_hassub'][value='"+hassub+"']").prop("checked", true);
		$("input:radio[name='cm_isshow'][value='"+isshow+"']").prop("checked", true);
		$("#cur_main_menu_option").show();
	});
	$("#all_main_menu li").hover(
		function () {
			$(this).addClass('ui-state-hover');
		}, 
		function () {
			$(this).removeClass('ui-state-hover');
		}
	);
	$("#cur_main_menu li").hover(
		function () {
			$(this).addClass('ui-state-hover');
		}, 
		function () {
			$(this).removeClass('ui-state-hover');
		}
	);
}

function setSubMenuEvent() {
	$("#all_sub_menu li").off("click");
	$("#all_sub_menu li").removeClass("ui-state-highlight-c").css({"color":"#696969"});
	$("#cur_sub_menu li").on("click", function(){
		$("#cur_sub_menu .ui-state-highlight-c").removeClass("ui-state-highlight-c").css({"color":"#696969"});
		$("#cur_sub_menu .ui-state-highlight-c").removeClass('ui-state-hover');
		$(this).addClass('ui-state-highlight-c').css({"color":"#FFFFFF"});
		var no = $(this).attr("no");
		var openwindow = $(this).attr("openwindow");
		var isshow = $(this).attr("isshow");
		var onlyroot = $(this).attr("onlyroot");
		$("#cs_no").val(no);
		$("input:radio[name='cs_openwindow'][value='"+openwindow+"']").prop("checked", true);
		$("input:radio[name='cs_onlyroot'][value='"+onlyroot+"']").prop("checked", true);
		$("input:radio[name='cs_isshow'][value='"+isshow+"']").prop("checked", true);
		$("#cur_sub_menu_option").show();
	});
	$("#all_sub_menu li").hover(
		function () {
			$(this).addClass('ui-state-hover');
		}, 
		function () {
			$(this).removeClass('ui-state-hover');
		}
	);
	$("#cur_sub_menu li").hover(
		function () {
			$(this).addClass('ui-state-hover');
		}, 
		function () {
			$(this).removeClass('ui-state-hover');
		}
	);
}

function addRoleExe() {
	if(checkRoleInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			role : $("#role").val(),
			name : $("#name").val(),
			isroot : $("input:radio[name='isroot']:checked").val()
		},
		traditional: true,
		url: '/system/role/addexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				//alert(t("system.added"));
				
				co.alert(t("system.added"), function(){$(location).attr("href", "/system/role/list");});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("system.error.add"));
				}
			}
			
		}
	});
}

function modifyRoleExe(no) {
	if(checkRoleInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			no : no,
			role : $("#role").val(),
			name : $("#name").val(),
			isroot : $("input:radio[name='isroot']:checked").val()
		},
		traditional: true,
		url: '/system/role/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				co.alert(t("system.edited"), function(){$(location).attr("href", "/system/role/list");});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			
		}
	});
}

function addViewExe() {
	if(checkViewInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			view : $("#view_view").val(),
			main : $("#main_menu").val(),
			sub : $("#sub_menu").val()
		},
		traditional: true,
		url: '/system/view/addexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				co.alert(t("system.added"), function(){$(location).attr("href", "/system/view/list");});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("system.error.add"));
				}
			}
			
		}
	});
}

function modifyViewExe() {
	if(checkViewInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			no : $("#view_no").val(),
			view : $("#view_view").val(),
			main : $("#main_menu").val(),
			sub : $("#sub_menu").val()
		},
		traditional: true,
		url: '/system/view/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				co.alert(t("system.edited"), function(){$(location).attr("href", "/system/view/list");});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			
		}
	});
}

function deleteViewExe(no) {
	
	co.confirm(t("discount.realdel"),function(){
		showLoadingLayer();
		$.ajax({
			type: 'post',
			async: true,
			dataType: 'json',
			data: {
				no : no
			},
			traditional: true,
			url: '/system/view/deleteexe',
			error: function() {
				alert(t("app.error"));
				hideLoadingLayer();
			},
			beforeSend: function() {},
			success: function(res) {
				hideLoadingLayer();
				var status = res.status;
				var data = res.data;
				if(status.result == RESULT_SUCCESS) {
					
					co.alert(t("app.del"), function(){$(location).attr("href", "/system/view/list");});
				} else {
					if(parseInt(status.code) == 20102) {
						alert(t("discount.logout"));
						$(location).attr("href", "/login/logout?sa=1");
					} else {
						alert(t("interest.error"));
					}
				}
				
			}
		});
	});
	
}

function addMenuExe() {
	if(checkMenuInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			name : $("#menu_name").val(),
			link : $("#menu_link").val(),
			depth : $("input:radio[name='menu_depth']:checked").val()
		},
		traditional: true,
		url: '/system/menu/addexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				co.alert(t("system.added"), function(){$(location).attr("href", "/system/menu/list");});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("system.error.add"));
				}
			}
			
		}
	});
}

function modifyMenuExe() {
	if(checkMenuInput() == false) {
		return false;
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			no : $("#menu_no").val(),
			name : $("#menu_name").val(),
			link : $("#menu_link").val(),
			depth : $("input:radio[name='menu_depth']:checked").val()
		},
		traditional: true,
		url: '/system/menu/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				co.alert(t("system.edited"), function(){$(location).attr("href", "/system/menu/list");});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			
		}
	});
}

function deleteMenuExe(no) {
	co.confirm(t("discount.realdel"),function(){
		showLoadingLayer();
		$.ajax({
			type: 'post',
			async: true,
			dataType: 'json',
			data: {
				no : no
			},
			traditional: true,
			url: '/system/menu/deleteexe',
			error: function() {
				alert(t("app.error"));
				hideLoadingLayer();
			},
			beforeSend: function() {},
			success: function(res) {
				hideLoadingLayer();
				var status = res.status;
				var data = res.data;
				if(status.result == RESULT_SUCCESS) {
					co.alert(t("app.del"), function(){$(location).attr("href", "/system/menu/list");});
				} else {
					if(parseInt(status.code) == 20102) {
						alert(t("discount.logout"));
						$(location).attr("href", "/login/logout?sa=1");
					} else {
						alert(t("interest.error"));
					}
				}
				
			}
		});
	});
	
}

function getCurMainMenu(no) {
	showLoadingLayer();
	$("#manager_role_no").val(no);
	$('a', $('#role_' + no).parent().parent()).removeClass('active');
	$('#role_' + no).addClass('active');
	
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			manager_role_no : no,
			depth : 0
		},
		traditional: true,
		url: '/system/menu/list/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var allmenu = data.all_menu_list;
				var curmenu = data.cur_menu_list;
				$("#all_main_menu").empty();
				$("#cur_main_menu").empty();
				$("#all_sub_menu").empty();
				$("#cur_sub_menu").empty();
				$("#cur_main_menu_option").hide();
				$("#cur_sub_menu_option").hide();
				for(var i=0; i<allmenu.length; i++) {
					var menu = allmenu[i];
					var li = '<li menu_list_no="' + menu.no + '"><a href="javascript:acticeMainMenu(\'' + menu.no + '\');" class="anchor" menu_list_no="' + menu.no + '">' + menu.name + '</a></li>';
					
					$("#all_main_menu").append(li);
				}
				for(var i=0; i<curmenu.length; i++) {
					var menu = curmenu[i];
					var li = $(document.createElement("li"))
								.attr({
									"no":menu.no,
									"openwindow":menu.openwindow,
									"isshow":menu.isshow,
									"manager_role_no":menu.manager_role_no,
									"onlyroot":menu.onlyroot,
									"hassub":menu.hassub
								})
					;
					
					var a =	$(document.createElement("a"))
								.attr({
									"no":menu.no,
									"openwindow":menu.openwindow,
									"isshow":menu.isshow,
									"manager_role_no":menu.manager_role_no,
									"onlyroot":menu.onlyroot,
									"hassub":menu.hassub,
									"href":'javascript:acticeMainMenu(' + menu.no +')'
								})
								.addClass("anchor")
								.text(menu.name)
								;
					
					$(li).append(a);
					$("#cur_main_menu").append(li);
				}
				$("#all_main_menu").sortable({
					connectWith:"#cur_main_menu"
				}).disableSelection();
				$("#cur_main_menu").sortable({
					connectWith:"#all_main_menu",
					update:function(event, ui) {
						main_menu_updated = !ui.sender;
					},
					stop:function(event, ui) {
						if(main_menu_updated) {
							setMainMenuEvent();
							changeMenuNOrder(0);
							main_menu_updated = false;
						}
						$("#cur_main_menu_option").hide();
					},
					receive:function(event, ui) {
						var obj = $(ui.item);
						addMenuMapping(obj, 0);
						$("#cur_main_menu_option").hide();
					}
				}).disableSelection();
				setMainMenuEvent();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("system.error.menus"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function getCurSubMenu(no) {
	$("#manager_role_menu_no").val(no);
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			manager_role_menu_no : no,
			depth : 1
		},
		traditional: true,
		url: '/system/menu/list/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var allmenu = data.all_menu_list;
				var curmenu = data.cur_menu_list;
				$("#all_sub_menu").empty();
				$("#cur_sub_menu").empty();
				$("#cur_sub_menu_option").hide();
				for(var i=0; i<allmenu.length; i++) {
					var menu = allmenu[i];
					
					var li = '<li menu_list_no="' + menu.no + '"><a href="javascript:acticeSubMenu(\'' + menu.no + '\');" class="anchor" menu_list_no="' + menu.no + '">' + menu.name + '</a></li>';
					
					$("#all_sub_menu").append(li);
				}
				for(var i=0; i<curmenu.length; i++) {
					var menu = curmenu[i];

					var li = $(document.createElement("li"))
					.attr({
						"no":menu.no,
						"openwindow":menu.openwindow,
						"isshow":menu.isshow,
						"manager_role_no":menu.manager_role_no,
						"onlyroot":menu.onlyroot
					});
					
					var a =	$(document.createElement("a"))
					.attr({
						"no":menu.no,
						"openwindow":menu.openwindow,
						"isshow":menu.isshow,
						"manager_role_no":menu.manager_role_no,
						"onlyroot":menu.onlyroot,
						"href":'javascript:acticeSubMenu(' + menu.no +')'
					})
					.addClass("anchor")
					.text(menu.name)
					;
					
					$(li).append(a);
					$("#cur_sub_menu").append(li);
				}
				$("#all_sub_menu").sortable({
					connectWith:"#cur_sub_menu"
				}).disableSelection();
				$("#cur_sub_menu").sortable({
					connectWith:"#all_sub_menu",
					update:function(event, ui) {
						sub_menu_updated = !ui.sender;
					},
					stop:function(event, ui) {
						if(sub_menu_updated) {
							setSubMenuEvent();
							changeMenuNOrder(1);
							sub_menu_updated = false;
						}
						$("#cur_sub_menu_option").hide();
					},
					receive:function(event, ui) {
						var obj = $(ui.item);
						addMenuMapping(obj, 1);
						$("#cur_sub_menu_option").hide();
					}
				}).disableSelection();
				setSubMenuEvent();
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("system.error.menus"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function saveMenuStatus(depth) {
	var no=0, openwindow=0, hassub=0, isshow=0, onlyroot=0;
	if(depth == 0) {
		no = $("#cm_no").val();
		openwindow = $("input:radio[name='cm_openwindow']:checked").val();
		onlyroot = $("input:radio[name='cm_onlyroot']:checked").val();
		isshow = $("input:radio[name='cm_isshow']:checked").val();
		hassub = $("input:radio[name='cm_hassub']:checked").val();
	} else if(depth == 1) {
		no = $("#cs_no").val();
		openwindow = $("input:radio[name='cs_openwindow']:checked").val();
		onlyroot = $("input:radio[name='cs_onlyroot']:checked").val();
		isshow = $("input:radio[name='cs_isshow']:checked").val();
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			no : no,
			openwindow : openwindow,
			hassub : hassub,
			isshow : isshow,
			onlyroot : onlyroot,
			depth : depth
		},
		traditional: true,
		url: '/system/mapping/save/status',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				co.alert(t("system.edited"), function(){location.reload();});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			
		}
	});
}

function changeMenuNOrder(depth) {
	var manager_role_no = $("#manager_role_no").val();
	var manager_role_menu_no = $("#manager_role_menu_no").val();
	var items = null;
	if(depth == 0) {
		items = $("#cur_main_menu").sortable("toArray", {attribute:"no"});
	} else if(depth == 1) {
		items = $("#cur_sub_menu").sortable("toArray", {attribute:"no"});
	}
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			manager_role_no : manager_role_no,
			manager_role_menu_no : manager_role_menu_no,
			no_list : items,
			depth : depth
		},
		traditional: true,
		url: '/system/mapping/menu/modifyexe',
		error: function() {
			$("#all_main_menu").sortable("cancel");
			$("#cur_main_menu").sortable("cancel");
			$("#all_sub_menu").sortable("cancel");
			$("#cur_sub_menu").sortable("cancel");
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				;
			} else {
				$("#all_main_menu").sortable("cancel");
				$("#cur_main_menu").sortable("cancel");
				$("#all_sub_menu").sortable("cancel");
				$("#cur_sub_menu").sortable("cancel");
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("system.error.menu"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function addMenuMapping(obj, depth) {
	var manager_role_no = $("#manager_role_no").val();
	var manager_role_menu_no = $("#manager_role_menu_no").val();
	var menu_list_no = obj.attr("menu_list_no");
	var openid = "s_openwindow";
	var onlyid = "s_onlyroot";
	var showid = "";
	var subid = "";
	if(depth == 0) {
		openid = "m_openwindow";
		onlyid = "m_onlyroot";
		showid = "m_isshow";
		subid = "m_hassub";
	}
	var openwindow = "", onlyroot = "", isshow = "", hassub = "";
	openwindow = $("input:radio[name='"+openid+"']:checked").val();
	onlyroot = $("input:radio[name='"+onlyid+"']:checked").val();
	isshow = $("input:radio[name='"+showid+"']:checked").val();
	hassub = $("input:radio[name='"+subid+"']:checked").val();
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			manager_role_no : manager_role_no,
			manager_role_menu_no : manager_role_menu_no,
			menu_list_no : menu_list_no,
			openwindow : openwindow,
			hassub : hassub,
			isshow : isshow,
			onlyroot : onlyroot,
			depth : depth
		},
		traditional: true,
		url: '/system/mapping/addexe',
		error: function() {
			$("#all_main_menu").sortable("cancel");
			$("#cur_main_menu").sortable("cancel");
			$("#all_sub_menu").sortable("cancel");
			$("#cur_sub_menu").sortable("cancel");
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var no = data.no;
				var attr = null;
				if(depth == 0) {
					attr = {"no": no, "openwindow":openwindow, "onlyroot":onlyroot, "isshow":isshow, "hassub":hassub};
					setMainMenuEvent();
				} else if(depth == 1) {
					attr = {"no": no, "openwindow":openwindow, "onlyroot":onlyroot};
					setSubMenuEvent();
				}
				obj.attr(attr);
				changeMenuNOrder(depth);
			} else {
				$("#all_main_menu").sortable("cancel");
				$("#cur_main_menu").sortable("cancel");
				$("#all_sub_menu").sortable("cancel");
				$("#cur_sub_menu").sortable("cancel");
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("system.error.menu"));
				}
			}
			hideLoadingLayer();
			getCurMainMenu($("#manager_role_no").val());
		}
	});
}

function getRoleView(no) {
	showLoadingLayer();
	$('#role_no').val(no);
	
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			manager_role_no : no
		},
		traditional: true,
		url: '/system/mapping/list/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var view_list = data.view_list;
				var objViewDiv = $("#viewdiv");
				objViewDiv.empty();
				var mapping_no_map = {};
				for(var i=0; i<view_list.length; i++) {
					var view = view_list[i];
					
					var objView = '<li><span class="page">' + view.view + '</span></li>';
					
					objViewDiv.append(objView);
					mapping_no_map[view.manager_role_view_no] = 1;
				}
				$("#mapping_no_map").val(JSON.stringify(mapping_no_map));
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("system.error.map"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function getViewListData() {
	var manager_role_no = $("#manager_role_no").val();
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			manager_role_no : manager_role_no
		},
		traditional: true,
		url: '/system/view/list/data',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var view_list = data.view_list;
				$("#view_layer_list").empty();
				var contents = "";
				var mapping_no_map = JSON.parse($("#mapping_no_map").val());
				for(var i=0; i<view_list.length; i++) {
					var view = view_list[i];
					var checked = "";
					if(view.no in mapping_no_map) {
						checked = "checked=checked";
					}
					if(i % 2 == 0) {
						contents = contents + "<tr>";
					}
					contents = contents + "<td style='text-align:left;'>";
					contents = contents + "<ul style='display:table;'><li style='display:table-row;'>";
					contents = contents + "<input type='checkbox' name='s_view_no' value='"+view.no+"' "+checked+"/>";
					contents = contents + "</li></ul></td><td style='text-align:left;width:300px;margin-left:5px;'>";
					contents = contents + view.view;
					contents = contents + "</td>";
					if(i % 2 == 1) {
						contents = contents + "</tr>";
					}
				}
				if(view_list.length % 2 == 1) {
					contents = contents + "<td></td><td></td></tr>";
				}
				$("#view_layer_list").html(contents);
				$("input[name='s_view_no']:checkbox").labelauty({ minimum_width:"20px", class:"chkradio", label:false });
				layer_open("view_layer", "fade", true);
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("system.error.map"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function saveViewMappingExe() {
	var manager_role_no = $("#manager_role_no").val();
	var no_list = [];
	$("input[name=s_view_no]:checkbox:checked").each(function (){
		no_list.push($(this).val());
	});
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			manager_role_no : manager_role_no,
			no_list : no_list
		},
		traditional: true,
		url: '/system/mapping/view/modifyexe',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				co.alert(t("system.saved"), function(){$(location).attr("href", "/system/mapping/main?manager_role_no=" + manager_role_no);});
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("system.error.save"));
				}
			}
			
		}
	});
}

function getMenuListDataAll(main, sub) {
	showLoadingLayer();
	$.ajax({
		type: 'get',
		async: true,
		dataType: 'json',
		data: {
		},
		traditional: true,
		url: '/system/menu/list/data/all',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				var main_menu_list = data.main_menu_list;
				var sub_menu_list = data.sub_menu_list;
				var contents = "";
				for(var i=0; i<main_menu_list.length; i++) {
					contents = "<option value='" + main_menu_list[i].no + "'>" + main_menu_list[i].name + "</option>";
					$("#main_menu").append(contents);
				}
				for(var i=0; i<sub_menu_list.length; i++) {
					contents = "<option value='" + sub_menu_list[i].no + "'>" + sub_menu_list[i].name + "</option>";
					$("#sub_menu").append(contents);
				}
				if(main > 0) {
					$("#main_menu").val(main);
				}
				if(sub > 0) {
					$("#sub_menu").val(sub);
				}
				//$("#main_menu").combobox({"bcssClassName":"text", "bheight":27, "iwidth":150, "iheight":23, "ireadonly":true, });
				//$("#sub_menu").combobox({"bcssClassName":"text", "bheight":27, "iwidth":150, "iheight":23, "ireadonly":true, });
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("system.error.menuss"));
				}
			}
			hideLoadingLayer();
		}
	});
}

function acticeMainMenu(no) {
	$('a', $('#all_main_menu')).removeClass('active');
	$('a', $('#cur_main_menu')).removeClass('active');
	
	$('a[menu_list_no=' + no + ']', $('#all_main_menu')).addClass('active');
	$('a[no=' + no + ']', $('#cur_main_menu')).addClass('active');
}

function acticeSubMenu(no) {
	$('a', $('#all_sub_menu')).removeClass('active');
	$('a', $('#cur_sub_menu')).removeClass('active');
	
	$('a[menu_list_no=' + no + ']', $('#all_sub_menu')).addClass('active');
	$('a[no=' + no + ']', $('#cur_sub_menu')).addClass('active');
}

function deleteRole(no, role, name, isroot){
	
	var layer = $('.deleteRole_Confirm').html();
	
	co.layer(layer,function(el){
		$("#delete_name").html(name);
		$("#delete_role").html(role);
		
		if(isroot == 1){
			$("#delete_isroot").html("최고관리자");	
		}else{
			$("#delete_isroot").html("일반");
		}
		
		$(el).on('submit','form',function(){
        	deleteRoleExe(no);
            return false;
        })
    });
}

function deleteRoleExe(no) {
	showLoadingLayer();
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			manager_no : no,
		},
		traditional: true,
		url: '/system/role/del',
		error: function() {
			alert(t("app.error"));
			hideLoadingLayer();
		},
		beforeSend: function() {},
		success: function(res) {
			hideLoadingLayer();
			var status = res.status;
			var data = res.data;
			if(status.result == RESULT_SUCCESS) {
				co.alert(t("system.edited"), function(){$(location).attr("href", "/system/role/list");});
				
			} else {
				if(parseInt(status.code) == 20102) {
					alert(t("discount.logout"));
					$(location).attr("href", "/login/logout?sa=1");
				} else {
					alert(t("inventory.error.cantcorrect"));
				}
			}
			
		}
	});
}