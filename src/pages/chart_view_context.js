import { createContext } from 'react'

import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);


const colDataArraySort = (a, b) => {
  var value1 = a["from"];
  var value2 = b["from"];
  return Date.parse(value1) - Date.parse(value2);
}


function rangeOfDates(startDate, endDate) {
  let dates = [];

  let currDate = moment(startDate).startOf('day');
  let lastDate = moment(endDate).startOf('day');

  while (currDate.add(1, 'days').diff(lastDate) < 0) {
    //      console.log(currDate.toDate());
    dates.push(currDate.clone().format("YYYY-MM-DD"));
  }
  return dates;
};


//root eventObj 에서 next 를 다시 list 로 컨버팅 
function toEventObjChildrenList(eventObj) {

  if (eventObj.next === null) {
    return []
  }

  let childrenList = []

  let currentEvent = eventObj.next
  while (true) {
    if (currentEvent === null) {
      break;
    }
    childrenList.push(currentEvent)

    currentEvent = currentEvent.next
  }

  childrenList.sort((e, p) => Date.parse(e.to) - Date.parse(p.to))

  return childrenList;
}


function isMove(source) {
  return source.isMove === 1;
}

function buildEvent(allEvents, i) {

  if (allEvents.length === i) {
    return null;
  }

  let colData = allEvents[i];

  let event = {
    from: colData.from,
    to: colData.to,
    name: colData.name,
    no: colData.no,
    source: colData,
    next: null,
    isTouch: false,
    isMove: isMove(colData)
  };

  let returnVal = {
    event: event,
    index: i,
  };

  let nextIndex = i + 1;
  let nextEventVal = buildEvent(allEvents, nextIndex);
  if (nextEventVal != null) {

    //다음 event 에 startTime 이 지금에 start,end 사이에 있으면
    //중첩 된 것으로 판단하며 to 를 next event 의 to 로 데체한다
    //next 에 nextEvent 를 셋팅한다

    let nextEvent = nextEventVal.event;
    if (isDurationVal(colData, nextEvent)) {
      //      event.to = nextEvent.to;
      event.next = nextEvent;
      returnVal.index = nextEventVal.index;
    } else {
      //중복아니면 
      let nmoment = moment(nextEvent.from)
      if (nmoment.isSame(moment(event.to))) {
        event.isTouch = true;
      }
    }
  }

  return returnVal;
}


//구간에 있는지 확인 함수
function isDurationVal(currentObj, nextEvent) {

  let cTime = moment(nextEvent.from)

  //    console.log(currentObj["to"])
  let fTime = moment(currentObj["from"]);
  //  let lTime = moment(currentObj["to"]).add(1, "minutes");
  let lTime = moment(currentObj["to"]);

  const range = moment.range(fTime, lTime);
  let rangeVal = range.contains(cTime, { exclusive: true });
  //  return range.contains(cTime,{ exclusive:true });


  if (!rangeVal) {
    //from,to 가 똑같게 겹치는건 특수처리 , 같은방에 같은 날자로 설정하면 중복되여서 rendering이 밀리는 경우대비
    return fTime.isSame(cTime) && lTime.isSame(moment(nextEvent.to))
  }

  return rangeVal

}


//구간에 있는지 확인 함수
function inDurationVal2(from, to, cdate) {
  const range = moment.range(from, to);
  let rangeVal = range.contains(cdate, { exclusive: true });
  //  return range.contains(cTime,{ exclusive:true });
  return rangeVal

}

function isValidCountReport(eventObj, from, to, ctime) {

  return (inDurationVal2(from, to, ctime)   && eventObj.source.last)

}

function validReportCounting(eventObj, ctimeFormatStr) {

  let ctime = moment(ctimeFormatStr);


  //eventObj 에 있는 전체구간에 포함되였을때 
  if (inDurationVal2(eventObj.from, eventObj.lastTo, ctime)) {

    //root eventObj 에 포함되였으면 return 한다 
    if (isValidCountReport(eventObj, eventObj.from, eventObj.to, ctime)) {
      return true;
    }

    //false 인 상태면 subList 를 돌면서 체크한다 
    //줃첩곤강이 있으므로 도든 sublist 를 다 처리해야한다 

    if (eventObj.subList.length > 0) {

      for (let i = 0; i < eventObj.subList.length; i++) {

        let cuo = eventObj.subList[i];
        if (isValidCountReport(cuo, cuo.from, cuo.to, ctime)) {
          return true;
        }
      }
    }
  }

  return false;
}


/**
 * 
 * 기초 eventObj 를  중복구간과 마감구간을 재조합해서 리턴한다 
 * @param {*} eventObj 기초 오브젝트 , 트리가 형성된 상태 
 * @returns 
 */
function rebuildEventObj(eventObj) {

  let subList = toEventObjChildrenList(eventObj)
  eventObj["subList"] = subList;

  let subNodeSize = subList.length;
  if (subNodeSize === 1) {

    let midEventObj = {
      from: eventObj.next.from,
      to: eventObj.next.to,
    }

    let lastEventObj = {
      from: eventObj.to,
      to: eventObj.next.to,
      name: eventObj.next.name,
      source: eventObj.next.source
    }

    eventObj["midNode"] = midEventObj
    eventObj["lastNode"] = lastEventObj


    eventObj.lastTo = eventObj.next.to

  } else if (subNodeSize > 1) {

    //sub list 가 두개 이상일경우 중간가구간과 마지막 구간을 계산한다 

    let _lastEventObj = subList[subNodeSize - 1] //마지막 eventobj
    let _slastEventObj = subList[subNodeSize - 2] //마지막 두번째 eventObj

    //중간구간 시작은 eventObj 의 다음시작붙어  끝나는 시간은 마지막 두번째껏에 끝나는 시간으로 잡는다 
    let midEventObj = {
      from: eventObj.next.from,
      to: _slastEventObj.to,
    }

    //마감 막대기는 마지막 두번째 끝나는 시간붙어 마지막 데이터의 끝나는 시간으로 잡는다 
    let lastEventObj = {
      from: _slastEventObj.to,
      to: _lastEventObj.to,
      name: _lastEventObj.name,
      source: _lastEventObj.source
    }

    eventObj["midNode"] = midEventObj
    eventObj["lastNode"] = lastEventObj
    eventObj.lastTo = lastEventObj.to;  //merge count 를 계산하기위해 모든 eventObj 에 실질쩍으로 끝나는 시간을 잡는다 

  }
  else {
    eventObj.lastTo = eventObj.to //sublist 가 없으면 자신에 to = lastTo 가된다 
  }
  return eventObj;
}


function newBabyCounter() {

  let bReport = {}


  let babyCountintFunc = function (eventObj,ctimeFormatStr) {

    
    let ctime = moment(ctimeFormatStr);

    let count = 0;
    //eventObj 에 있는 전체구간에 포함되였을때 
    if (inDurationVal2(eventObj.from, eventObj.lastTo, ctime)) {

      //root eventObj 에 포함되였으면 return 한다 
      if (isValidCountReport(eventObj, eventObj.from, eventObj.to, ctime)) {
        count = count+eventObj.source.baby;
      }

      //false 인 상태면 subList 를 돌면서 체크한다 
      //줃첩곤강이 있으므로 도든 sublist 를 다 처리해야한다 

      if (eventObj.subList.length > 0) {

        for (let i = 0; i < eventObj.subList.length; i++) {

          let cuo = eventObj.subList[i];
          if (isValidCountReport(cuo, cuo.from, cuo.to, ctime)) {
            count = count+cuo.source.baby;
          }
        }
      }
    }
    return count;
  }

  return function (eventObj, dateFormate) {

    let count = bReport[dateFormate];
    if (count === undefined) {
      count=0;
      bReport[dateFormate] = count;
    }

    const babyCount = babyCountintFunc(eventObj,dateFormate)
    bReport[dateFormate] = count+babyCount
    return bReport;

  }
}


function toChartData(dataList) {

  /*

  {
    roomGradeLevel: {
      name:팬트하우스,골드 둘중하나로 밖힘 
      dataList:{
        "2021-01-02":1
      },
    }
  }
  */



  let roomDataMap = {}
//  let rangeObj = {}

  let earliestDate = null;
  let latestDate = null;

  dataList.forEach(element => {

    let fmf = moment(element.fromDate)
    let emf = moment(element.toDate);

    //---------------------------- 최초 와 최후의 날짜를 찾아서 그리드에서 앞으로 6일 뒤로 6일로 해서 여백을 최소화하는데 사용
    //맨 처음시작되는 날짜를 찾는다 
    if(earliestDate == null || fmf.isBefore(earliestDate)) {
        earliestDate = fmf;
    }

    //최후 끝나는 날자를 찾는다 
    if(latestDate == null || emf.isAfter(latestDate)) {
      latestDate = emf;
    }


    let roomKey = newRoomNo(element)
    let roomReport = roomDataMap[roomKey]
    if (roomReport === undefined) {

      roomReport = {
        el: element,
        roomDataArray: []
      }
      roomDataMap[roomKey] = roomReport
    }

    roomReport.roomDataArray.push(toRoomData(element))

  });



  const list = [];

  const keys = Object.keys(roomDataMap)
  
  keys.forEach((e) => {

    let wrapper = roomDataMap[e];
    const colDataArray = wrapper.roomDataArray
    colDataArray.sort(colDataArraySort)

    let eventObjList = []

    for (let i = 0; i < colDataArray.length; i++) {
      //root eventObj tree  구조형성 , 여기에서 만들어지는건 상호중복되지 않는것이다 
      let eventObjWrapper = buildEvent(colDataArray, i);
      i = eventObjWrapper.index; //중복된구간을 읽은것많금 뛰어넘는다 

      let eventObj = eventObjWrapper.event;
      eventObj = rebuildEventObj(eventObj)
      eventObjList.push(eventObj)
    }

    let roomNo = null;
    if(wrapper.el !== null) {
      roomNo = wrapper.el.room
    }else{
      console.log(wrapper)
    }

    list.push({
      roomNo:roomNo,
      eventObjList: eventObjList,
    });
  })


  return {
    list: list,
    stObj:{
      sDate :earliestDate,
      eDate : latestDate,
    }
  }
}


function allOfBabyCountingVal() {


  let babyCounter = newBabyCounter()
  let _babyTotalCount = null;

  return function(cDate,eventObj) {

    let babyReport = babyCounter(eventObj,cDate);
    _babyTotalCount = babyReport;
    return _babyTotalCount;
  }
}


function allOfRoomCountingVal() {

  let roomGraceReport ={}


  return function(cDate,eventObj) {

    let roomReport = roomGraceReport[eventObj.source.roomLevel]
    if (roomReport === undefined) {
      roomReport = {
        name: eventObj.source.rgName,
        dataList: {}
      }
      roomGraceReport[eventObj.source.roomLevel] = roomReport;
    }

    let countVal = roomReport.dataList[cDate];
    if (countVal === undefined) {
      countVal = 0;  //0으로 초기화 밑에서 체크기준에 따라 추가 
      roomReport.dataList[cDate] = countVal;
    }

    if (validReportCounting(eventObj, cDate)) {
      roomReport.dataList[cDate] = countVal + 1;
    }
    return roomGraceReport;
  }
}


// const groupBy = function(xs, key) {
//   return xs.reduce(function(rv, x) {
//     (rv[x[key]] = rv[x[key]] || []).push(x);
//     return rv;
//   }, {});
// };

function buildReportDataList(eventObjList,roomList) {

  let totalCount = {};

  const babyCouter = allOfBabyCountingVal();
  const roomReportingCounter = allOfRoomCountingVal();

  eventObjList.forEach((e)=>{

//    let roomNo = e.roomNo;
    let eventObjectList = e.eventObjList

    eventObjectList.forEach((eventObj)=>{

      let dateList = rangeOfDates(eventObj.from, eventObj.lastTo)

      dateList.forEach((cDate) => {
        totalCount["baby"] = babyCouter(cDate,eventObj);
        totalCount["roomGrade"] = roomReportingCounter(cDate,eventObj);
      })
    })
  })


  return totalCount
}


function newRoomNo(record) {
  return record.rgName + "-" + record.room;
}


function toRoomData(record) {

  record["from"] = record.fromDate;
  record["to"] = record.toDate;
  return record;

}



function toUrl(uri,params) {

  if(params === null) {
    return uri;
  }

  let query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
  //    let url = '/ajax/api/tableDataList?' + query;
  return uri + "?" + query;

}

function doHttpGet(uri, params, fn) {

//  console.log("call http request now")

  const url = toUrl(uri,params)

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    mode: 'cors',
    cache: 'default'
  })
    .then(res => {
      return res.json()
    }).then((resMessage) => {
      let data = resMessage.data;
      //         eventDispacher({type:"OnLoadCompletedResList",dataList:data})
      fn(data)
    }).catch(e => {
      console.log("error", e)
    })

}

function doHttpPost(uri, params, fn) {

  //  console.log("call http request now")
  
    let formData = new FormData()
    Object.keys(params).forEach((k)=>{
      formData.append(k,params[k])
    })


    fetch(uri, {
      method: 'POST',
      body:formData,
      // headers: {
      //   'Content-Type': 'application/json;charset=UTF-8'
      // },
      mode: 'cors',
      cache: 'default'
    })
      .then(res => {
        return res.json()
      }).then((resMessage) => {
        let data = resMessage.data;
        //         eventDispacher({type:"OnLoadCompletedResList",dataList:data})
        fn(data)
      }).catch(e => {
        console.log("error", e)
      })
  
  }


function emitHttpEvent(event) {

  if (event.type === "FetchTableDataList") {
    doHttpGet("/ajax/api/tableDataList", event.params, event.resultHandler)
    return
  }

  if (event.type === "FetchRoomList") {
    doHttpGet("/ajax/api/roomList", null, event.resultHandler)
    return 
  }

  if(event.type === "FetchPaymentHistorylist") {
//    http://testg.tosky.co.kr/reservation/payment/list?reservation_no=7740&bno=3
    doHttpGet("/reservation/payment/list",event.params,event.resultHandler)
    return;
  }


  if (event.type === "PostChangeRoom") {
    doHttpPost("/ajax/api/postChangeRoom",event.params,event.resultHandler)
    return;

  }



}



export const GantchartContext = createContext()
export const ServerEventContext = createContext()


const _Right_Popup_fArray = [
  { text: "상세보기", data: { popupView: "1-1" } },
  { text: "객실이동", data: { popupView: "1-2",title:"객실이동" } },
  { text: "기간연장", data: { popupView: "1-3",title:"기간연장" } },
  { text: "퇴실확정", data: { popupView: "1-4",title:"퇴실확정" } },
  { text: "계약일수정", data: { popupView: "1-5",title:"계약일수정" } },
];

const _Right_Popup_sArray = [
  { text: "결제내역", data: { popupView: "2-1",title:"결제내역" } },
  { text: "잔금결제", data: { popupView: "2-2",title:"잔금결제" } },
];

const _Right_Popup_tArray = [
  { text: "환불", data: { popupView: "3-1",title:"환불" } },
  { text: "에약삭제", data: { popupView: "3-2",title:"에약삭제" } },
];


const GlobalProps = {
  RightMenuProps: {
    RightPopupFArray: _Right_Popup_fArray,
    RightPopupSArray: _Right_Popup_sArray,
    RightPopupTArray: _Right_Popup_tArray
  }
}

export {
  emitHttpEvent, toChartData, GlobalProps,buildReportDataList
}