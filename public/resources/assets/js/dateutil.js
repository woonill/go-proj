/**
 * 두 날짜의 차이를 일자로 구한다.(조회 종료일 - 조회 시작일)
 *
 * @see http://okky.kr/article/36515
 * @param val1 - 조회 시작일(날짜 ex.2002-01-01)
 * @param val2 - 조회 종료일(날짜 ex.2002-01-01)
 * @return 기간에 해당하는 일자
 */
function calDateRange(val1, val2)
{
	var FORMAT = "-";

	// FORMAT을 포함한 길이 체크
	if (val1.length != 10 || val2.length != 10)
		return null;

	// FORMAT이 있는지 체크
	if (val1.indexOf(FORMAT) < 0 || val2.indexOf(FORMAT) < 0)
		return null;

	// 년도, 월, 일로 분리
	var start_dt = val1.split(FORMAT);
	var end_dt = val2.split(FORMAT);

	// 월 - 1(자바스크립트는 월이 0부터 시작하기 때문에...)
	// Number()를 이용하여 08, 09월을 10진수로 인식하게 함.
	start_dt[1] = (Number(start_dt[1]) - 1) + "";
	end_dt[1] = (Number(end_dt[1]) - 1) + "";

	var from_dt = new Date(start_dt[0], start_dt[1], start_dt[2]);
	var to_dt = new Date(end_dt[0], end_dt[1], end_dt[2]);

	return (to_dt.getTime() - from_dt.getTime()) / 1000 / 60 / 60 / 24;
}

/**
 * 주어진 날짜에 정해진 기간을 더한 Date Object를 반환한다.
 * @param date Date Object.
 * @param interval 더하는 기간의 양식. year, quarter, month, week, day, hour, minute, second.
 * @param units 더하는 기간.
 * @returns {Date}
 */
function dateAdd(date, interval, units) {
	var ret = new Date(date); //don't change original date
	switch(interval.toLowerCase()) {
	case 'year'   :  ret.setFullYear(ret.getFullYear() + units);  break;
	case 'quarter':  ret.setMonth(ret.getMonth() + 3*units);  break;
	case 'month'  :  ret.setMonth(ret.getMonth() + units);  break;
	case 'week'   :  ret.setDate(ret.getDate() + 7*units);  break;
	case 'day'    :  ret.setDate(ret.getDate() + units);  break;
	case 'hour'   :  ret.setTime(ret.getTime() + units*3600000);  break;
	case 'minute' :  ret.setTime(ret.getTime() + units*60000);  break;
	case 'second' :  ret.setTime(ret.getTime() + units*1000);  break;
	default       :  ret = undefined;  break;
	}
	return ret;
}

/* ----------------------------------------------------------------------------
 * 특정 날짜에 대해 지정한 값만큼 가감(+-)한 날짜를 반환
 *

 * 입력 파라미터 -----
 * pInterval : "yyyy" 는 연도 가감, "m" 은 월 가감, "d" 는 일 가감
 * pAddVal  : 가감 하고자 하는 값 (정수형)
 * pYyyymmdd : 가감의 기준이 되는 날짜
 * pDelimiter : pYyyymmdd 값에 사용된 구분자를 설정 (없으면 "" 입력)

 *
 * 반환값 ----
 * yyyymmdd 또는 함수 입력시 지정된 구분자를 가지는 yyyy?mm?dd 값
 *
 * 사용예 ---
 * 2008-01-01 에 3 일 더하기 ==> addDate("d", 3, "2008-08-01", "-");
 * 20080301 에 8 개월 더하기 ==> addDate("m", 8, "20080301", "");
 --------------------------------------------------------------------------- */
function manipulateDate(pInterval, pAddVal, pYyyymmdd, pDelimiter) {
	var yyyy;
	var mm;
	var dd;
	var cDate;
	var oDate;
	var cYear, cMonth, cDay;

	if (pDelimiter != "") {
		pYyyymmdd = pYyyymmdd.replace(eval("/\\" + pDelimiter + "/g"), "");
	}

	yyyy = pYyyymmdd.substr(0, 4);
	mm  = pYyyymmdd.substr(4, 2);
	dd  = pYyyymmdd.substr(6, 2);

	if (pInterval == "yyyy") {
		yyyy = (yyyy * 1) + (pAddVal * 1);
	} else if (pInterval == "m") {
		mm  = (mm * 1) + (pAddVal * 1);
	} else if (pInterval == "d") {
		dd  = (dd * 1) + (pAddVal * 1);
	}

	cDate = new Date(yyyy, mm - 1, dd) // 12월, 31일을 초과하는 입력값에 대해 자동으로 계산된 날짜가 만들어짐.
	cYear = cDate.getFullYear();
	cMonth = cDate.getMonth() + 1;
	cDay = cDate.getDate();

	cMonth = cMonth < 10 ? "0" + cMonth : cMonth;
	cDay = cDay < 10 ? "0" + cDay : cDay;

	if (pDelimiter != "") {
		return cYear + pDelimiter + cMonth + pDelimiter + cDay;
	} else {
		return cYear + cMonth + cDay;
	}
}

/**
 * 주어진 날짜 문자열이 YYYY-MM-DD 형식인지 확인한다.
 * @param dateString 
 */
function isValidDate(dateString) {
	var regEx = /^\d{4}-\d{2}-\d{2}$/;
	if(!dateString.match(regEx)) {
		return false;  // Invalid format
	}
	var d;
	if(!((d = new Date(dateString))|0)) {
		return false; // Invalid date (or this could be epoch)
	}
	return d.toISOString().slice(0,10) == dateString;
}

/**
 * toDate와 fromDate의 유효성을 검증한다.
 * @param fromDate
 * @param toDate
 * @returns 0 - 동일한 날짜(또는 시간) / 1 - toDate가 fromDate 이후의 날짜(또는 시간) / -1 - toDate가 fromDate 이전의 날짜(또는 시간)
 */
function isValidDateRange(fromDate, toDate) {
	var fdate = Date.parse(fromDate);
	var tdate = Date.parse(toDate);
	var result = tdate - fdate;
	if(result == 0) {
		return 0;
	} else if(result > 0) {
		return 1;
	} else {
		return -1;
	}
}
