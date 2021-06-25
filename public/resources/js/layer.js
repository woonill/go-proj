function layer_close(el, effect) {
	var temp = $('#' + el);
//	var bg = temp.prev().hasClass('bg');    //dimmed 레이어를 감지하기 위한 boolean 변수
	var pop = $('#' + el + "_pop");
	//'bg' 클래스가 존재하면 레이어를 사라지게 한다.
	var bg = true;
	if(bg){
		if(effect == "show") {
//			$('.layer').hide();
			pop.hide();
		} else {
//			$('.layer').fadeOut();
			pop.fadeOut();
		}
	}else{
		if(effect == "show") {
			temp.hide();
		} else {
			temp.fadeOut();
		}
	}
}

function layer_open(el, effect, ev){
	var temp = $('#' + el);
//	var bg = temp.prev().hasClass('bg');    //dimmed 레이어를 감지하기 위한 boolean 변수
	var pop = $('#' + el + "_pop");
	//'bg' 클래스가 존재하면 레이어가 나타나고 배경은 dimmed 된다.
	var bg = true;
	if(bg){
		if(effect == "show") {
//			$('.layer').show();
			pop.show();
		} else {
//			$('.layer').fadeIn();
			pop.fadeIn();
		}
	}else{
		if(effect == "show") {
			temp.show();
		} else {
			temp.fadeIn();
		}
	}
	//	화면의 중앙에 레이어를 띄운다.
	if (temp.outerHeight() < $(document).height() ) temp.css('margin-top', '-'+temp.outerHeight()/2+'px');
	else temp.css('top', '0px');
	if (temp.outerWidth() < $(document).width() ) temp.css('margin-left', '-'+temp.outerWidth()/2+'px');
	else temp.css('left', '0px');

	temp.find('a.cbtn').click(function(e){
		//'bg' 클래스가 존재하면 레이어를 사라지게 한다.
		if(bg){
			if(effect == "show") {
//				$('.layer').hide();
				pop.hide();
			} else {
//				$('.layer').fadeOut();
				pop.fadeOut();
			}
		}else{
			if(effect == "show") {
				temp.hide();
			} else {
				temp.fadeOut();
			}
		}
		e.preventDefault();
	});
	if(ev) {
		$('.layer .bg').click(function(e){  //배경을 클릭하면 레이어를 사라지게 하는 이벤트 핸들러
			if(effect == "show") {
				$('.layer').hide();
			} else {
				$('.layer').fadeOut();
			}
			e.preventDefault();
		});
	}
}