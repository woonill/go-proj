var addrPrefix = "";

function setPrefix(prefix) {
	addrPrefix = prefix;
}

function getAddress() {
	$("#mask_popup").show();
	$("#div_loading").show();
}

function searchAddressCancel() {
	$("#mask_popup").hide();
	$("#div_loading").hide();
}

function selectAddress(zipcode, address) {
	$("#"+addrPrefix+"zipcode").val(zipcode);
	$("#"+addrPrefix+"addr").val(address);
	$("#mask_popup").hide();
	$("#div_loading").hide();
}

function searchAddress() {
	var offset = 0;
	var row_count = 50;
	var type = $("#type").val();
	var keyword = $("#keyword").val();
	if(isNull(keyword)) {
		alert(t("address.name"));
		return false;
	}
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			offset : offset,
			row_count : row_count,
			type : type,
			keyword : $("#keyword").val()
		},
		traditional: true,
		url: '/address/search',
		error: function() {
			alert(t("address.cantsearch"));
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var totalcount = data.totalcount;
				var addresslist = data.addresslist;
				var contents = "";
				var more = "";
				if(addresslist.length > 0) {
					for(var i=0; i<addresslist.length; i++) {
						var zipcode = addresslist[i].zipcode;
						var address;
						if(type == "old") {
							address = addresslist[i].old_address;
						} else {
							address = addresslist[i].new_address;
						}
						address = address.replace(/\n/g, "").replace(/\r/g, "");
						contents = contents + "<tr>";
						contents = contents + "<td>";
						contents = contents + "(" + zipcode + ") ";
						contents = contents + address;
						contents = contents + "</td>";
						contents = contents + "<td><button type=\"button\" class=\"btn_gray1\" onclick=\"javascript:selectAddress('" +
												zipcode + "', '"+address+"');\">" + t("gongu.select") + "</button></td>";
						contents = contents + "</tr>";
					}
					if(totalcount > row_count) {
						more = more + "<button type='button' class='btn_gray1' onclick='javascript:moreAddress(\"0\");'>" + t("reservation.more") + "</button>";
					} else {
						$("#more").hide();
					}
				}
				$("#address").html(contents);
				if(totalcount > row_count) {
					$("#more").html(more);
					$("#more").show();
				}
			} else {
				alert(t("address.fail"));
			}
		}
	});
}

function moreAddress(o) {
	var offset = parseInt(o);
	var row_count = 50;
	var keyword = $("#keyword").val();
	if(isNull(keyword)) {
		alert(t("address.name"));
		return false;
	}
	$.ajax({
		type: 'post',
		async: true,
		dataType: 'json',
		data: {
			offset : offset + row_count,
			row_count : row_count,
			type : $("#type").val(),
			keyword : $("#keyword").val()
		},
		traditional: true,
		url: '/address/search',
		error: function() {
			alert(t("address.cantsearch"));
		},
		beforeSend: function() {},
		success: function(res) {
			var status = res.status;
			if(status.result == RESULT_SUCCESS) {
				var data = res.data;
				var totalcount = data.totalcount;
				var addresslist = data.addresslist;
				var contents = $("#address").html();
				var more = "";
				if(addresslist.length > 0) {
					for(var i=0; i<addresslist.length; i++) {
						var zipcode = addresslist[i].zipcode;
						var address;
						if(type == "old") {
							address = addresslist[i].old_address;
						} else {
							address = addresslist[i].new_address;
						}
						address = address.replace(/\n/g, "").replace(/\r/g, "");
						contents = contents + "<tr>";
						contents = contents + "<td>";
						contents = contents + "(" + zipcode + ") ";
						contents = contents + address;
						contents = contents + "</td>";
						contents = contents + "<td><button type=\"button\" class=\"btn_gray1\" onclick=\"javascript:selectAddress('" +
												zipcode + "', '"+address+"');\">" + t("gongu.select") + "</button></td>";
						contents = contents + "</tr>";
					}
					if(totalcount > row_count) {
						more = more + "<button type='button' class='btn_gray1' onclick='javascript:moreAddress(\"" + offset + row_count + "\");'>" + t("reservation.more") + "</button>";
					} else {
						$("#more").hide();
					}
				}
				$("#address").html(contents);
				if(totalcount > (offset + row_count)) {
					$("#more").html(more);
					$("#more").show();
				}
			} else {
				alert(t("address.fail"));
			}
		}
	});
}