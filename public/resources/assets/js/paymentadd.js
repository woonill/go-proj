$( document ).ready(function() {
	$("input:radio[name=category]").click(function(){
		if($("input:radio[id=category_1]:checked").val()!='on'){
			$("#category2_1").css("display","none");
		}else{
			$("#category2_1").css("display","block");
		};
		
		if($("input:radio[id=category_2]:checked").val()=='on'){
			$("#category2_2").css("display","block");
		}else{
			$("#category2_2").css("display","none");
		};
		
		if($("input:radio[id=category_3]:checked").val()=='on'){
			$("#category2_3").css("display","block");
		}else{
			$("#category2_3").css("display","none");
		};
		
		if($("input:radio[id=category_4]:checked").val()=='on'){
    	    $("#category2_4").css("display","block");
		}else{
			$("#category2_4").css("display","none");
		};
	});
	
});