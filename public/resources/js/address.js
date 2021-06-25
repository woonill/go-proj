//우편번호 찾기 화면을 넣을 element
var element_layer = null;
var use_bcode = false;

$(function() {
	element_layer = document.getElementById('address_layer');
});

function closeDaumPostcode() {
	// iframe을 넣은 element를 안보이게 한다.
	element_layer.style.display = 'none';
}

function execDaumPostcode3(zipcode, address) {
	use_bcode = true;
	executePostcode(zipcode, address);
}

function execDaumPostcode2(zipcode, address) {
	use_bcode = false;
	executePostcode(zipcode, address);
}

//function sample2_execDaumPostcode() {
function execDaumPostcode() {
	use_bcode = false;
	executePostcode("zipcode", "addr");
}

function executePostcode(zipcode, address) {
	daum.postcode.load(function(){
		new daum.Postcode({
			autoMapping: false,
			oncomplete: function(data) {
				// 검색결과 항목을 클릭했을때 실행할 코드를 작성하는 부분.
	
				// comment at 2016.07.28
//				// 각 주소의 노출 규칙에 따라 주소를 조합한다.
//				// 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
//				var fullAddr = data.address; // 최종 주소 변수
//				var extraAddr = ''; // 조합형 주소 변수
//	
//				// 기본 주소가 도로명 타입일때 조합한다.
//				if(data.addressType === 'R'){
//					//법정동명이 있을 경우 추가한다.
//					if(data.bname !== ''){
//						extraAddr += data.bname;
//					}
//					// 건물명이 있을 경우 추가한다.
//					if(data.buildingName !== ''){
//						extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
//					}
//					// 조합형주소의 유무에 따라 양쪽에 괄호를 추가하여 최종 주소를 만든다.
//					fullAddr += (extraAddr !== '' ? ' ('+ extraAddr +')' : '');
//				}
//	
//				// 우편번호와 주소 정보를 해당 필드에 넣는다.
//				//document.getElementById('sample2_postcode').value = data.zonecode; //5자리 새우편번호 사용
//				//document.getElementById('sample2_address').value = fullAddr;
//				//document.getElementById('sample2_addressEnglish').value = data.addressEnglish;
//				document.getElementById(zipcode).value = data.zonecode;
//				document.getElementById(address).value = fullAddr;
				
				// 도로명 주소의 노출 규칙에 따라 주소를 조합한다.
	            // 내려오는 변수가 값이 없는 경우엔 공백('')값을 가지므로, 이를 참고하여 분기 한다.
	            var fullRoadAddr = data.roadAddress; // 도로명 주소 변수
	            var extraRoadAddr = ''; // 도로명 조합형 주소 변수
	            // 법정동명이 있을 경우 추가한다. (법정리는 제외)
	            // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
	            if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
	                extraRoadAddr += data.bname;
	            }
	            // 건물명이 있고, 공동주택일 경우 추가한다.
	            if(data.buildingName !== '' && data.apartment === 'Y'){
	               extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
	            }
	            // 도로명, 지번 조합형 주소가 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
	            if(extraRoadAddr !== ''){
	                extraRoadAddr = ' (' + extraRoadAddr + ')';
	            }
	            // 도로명, 지번 주소의 유무에 따라 해당 조합형 주소를 추가한다.
	            if(fullRoadAddr !== ''){
	                fullRoadAddr += extraRoadAddr;
	            }
	            document.getElementById(zipcode).value = data.zonecode;
	            document.getElementById(address).value = fullRoadAddr;
	            document.getElementById(address+"_jibun").value = data.jibunAddress;
//	            try {
//	            	console.log("data : " + JSON.stringify(data));
//	            	console.log("fullRoadAddr : " + fullRoadAddr);
//	            	console.log("address : " + document.getElementById(address).value);
//	            } catch(exception) {
//	            	;
//	            }
				
				var codeObj = document.getElementById("bcode");
				if(document.body.contains(codeObj)) {
					if(use_bcode == true) {
						codeObj.value = data.bcode;
					}
				}
	
				// iframe을 넣은 element를 안보이게 한다.
				// (autoClose:false 기능을 이용한다면, 아래 코드를 제거해야 화면에서 사라지지 않는다.)
				element_layer.style.display = 'none';
			},
			width : '100%',
			height : '100%'
		}).embed(element_layer);
	});

	// iframe을 넣은 element를 보이게 한다.
	element_layer.style.display = 'block';

	// iframe을 넣은 element의 위치를 화면의 가운데로 이동시킨다.
	initLayerPosition();
}

// 브라우저의 크기 변경에 따라 레이어를 가운데로 이동시키고자 하실때에는
// resize이벤트나, orientationchange이벤트를 이용하여 값이 변경될때마다 아래 함수를 실행 시켜 주시거나,
// 직접 element_layer의 top,left값을 수정해 주시면 됩니다.
function initLayerPosition(){
	var width = 300; //우편번호서비스가 들어갈 element의 width
	var height = 460; //우편번호서비스가 들어갈 element의 height
	var borderWidth = 5; //샘플에서 사용하는 border의 두께

	// 위에서 선언한 값들을 실제 element에 넣는다.
	element_layer.style.width = width + 'px';
	element_layer.style.height = height + 'px';
	element_layer.style.border = borderWidth + 'px solid';
	// 실행되는 순간의 화면 너비와 높이 값을 가져와서 중앙에 뜰 수 있도록 위치를 계산한다.
	element_layer.style.left = (((window.innerWidth || document.documentElement.clientWidth) - width)/2 - borderWidth) + 'px';
	element_layer.style.top = (((window.innerHeight || document.documentElement.clientHeight) - height)/2 - borderWidth) + 'px';
}