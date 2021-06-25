function initKorea() {
	var option = {
			"labelLoc":labelLoc,
			"clickType":"link",
			"clickUrl":"/center/detail",
			"displayLabels":true,
	};
	var menu = $("#menu").val();
	var jsonpath = $("#jsonpath").val();
	drawMap(jsonpath, option);
	
	
}