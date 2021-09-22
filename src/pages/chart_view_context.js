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

    if(isPermissCustom(currentEvent.source)) {
      childrenList.push(currentEvent)
    }
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
    isSameDayOfNext:false,
    isSameDayOfPre:false,
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
    return range.contains(cdate,{ exclusive:true });
}


// function countReservationState(eventObj) {
//   return !eventObj.isMove && eventObj.source.last
// }

function countReservationSourceState(source) {
  return !isMove(source)&& source.last
}


function isValidCountReport(eventObj, from, to, ctimeFormatStr) {
  return isValidSourceCountReport(eventObj.source,from,to,ctimeFormatStr)
 
  // if(ctimeFormatStr === from || ctimeFormatStr === to) {
  //   if(countReservationSourceState(eventObj.source)){
  //     return true;
  //   }
  // }
  
  // let ctime = moment(ctimeFormatStr);

  // return (inDurationVal2(moment(from), moment(to), ctime))
  //           && countReservationSourceState(eventObj.source)

}

function isValidSourceCountReport(source, from, to, ctimeFormatStr) {
 
  if(ctimeFormatStr === from || ctimeFormatStr === to) {
    if(countReservationSourceState(source)){
      return true;
    }
  }
  
  let ctime = moment(ctimeFormatStr);

  return (inDurationVal2(moment(from), moment(to), ctime))
            && countReservationSourceState(source)

}



function countRangeRoom(eventObj, ctimeFormatStr) {

    let count = 0;

    //root eventObj 에 포함되였으면 return 한다 
    if (isValidCountReport(eventObj, eventObj.from, eventObj.to, ctimeFormatStr)) {

      // if(ctimeFormatStr === "2021-08-28") {
      //   console.log("0828-data",eventObj.no,ctimeFormatStr)
      // }
      count = 1;
    }

    //false 인 상태면 subList 를 돌면서 체크한다 
    //줃첩곤강이 있으므로 도든 sublist 를 다 처리해야한다 

    if (eventObj.subList.length > 0) {

      for (let i = 0; i < eventObj.subList.length; i++) {
        let cuo = eventObj.subList[i];
        if (isValidCountReport(cuo, cuo.from, cuo.to, ctimeFormatStr)) {
          
          // if(ctimeFormatStr === "2021-08-28") {
          //   console.log("0828-data",cuo.no)
          // }
          count=count+1
        }
      }
    }
  // if(ctimeFormatStr === "2021-08-28") {
  //   console.log("0828-data",list)
  // }
  return count;
}



function buildMidNode(eventObj) {

  let lastTo = eventObj.next.to;
  let midTo = eventObj.to ;
  if(moment(lastTo).isBefore(eventObj.to)) {
    lastTo = eventObj.to;
    midTo = eventObj.next.to
  }

  return  {
    from: eventObj.next.from,
    to: midTo,
  }
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

    let lastTo = eventObj.next.to;
    let midTo = eventObj.to ;
    if(moment(lastTo).isBefore(eventObj.to)) {
      lastTo = eventObj.to;
      midTo = eventObj.next.to
    }

    let midEventObj = {
      from: eventObj.next.from,
      to: midTo,
    }


    let lastEventObj = {
      no:eventObj.next.no,
      from: midTo,
      to: lastTo,
      name: eventObj.next.name,
      source: eventObj.next.source
    }

    eventObj["midNode"] = midEventObj
    eventObj["lastNode"] = lastEventObj


    eventObj.lastTo = lastTo

  } else if (subNodeSize > 1) {

    //sub list 가 두개 이상일경우 중간가구간과 마지막 구간을 계산한다 

    // let _lastEventObj = subList[subNodeSize - 1] //마지막 eventobj
    // let _slastEventObj = subList[subNodeSize - 2] //마지막 두번째 eventObj

    const colDataArraySort = (a, b) => {
      const value1 = a["to"];
      const value2 = b["to"];
      return Date.parse(value2) - Date.parse(value1)
    }

    let copyStore = [].concat(subList)
    copyStore.sort(colDataArraySort)

    // console.log("CopyStore",copyStore)
    let _lastEventObj = copyStore[0] //마지막 eventobj
    let _slastEventObj = copyStore[1] //마지막 두번째 eventObj

//    console.log("TheLast objectEvent",_lastEventObj)


    //중간구간 시작은 eventObj 의 다음시작붙어  끝나는 시간은 마지막 두번째껏에 끝나는 시간으로 잡는다 
    let midEventObj = {
      from: eventObj.next.from,
      to: _slastEventObj.to,
    }

    //마감 막대기는 마지막 두번째 끝나는 시간붙어 마지막 데이터의 끝나는 시간으로 잡는다 
    let lastEventObj = {
      no:_lastEventObj.no,
      from: _slastEventObj.to,
      to: _lastEventObj.to,
      name: _lastEventObj.name,
      source: _lastEventObj.source
    }

    eventObj["midNode"] = midEventObj
    eventObj["lastNode"] = lastEventObj
    eventObj.lastTo = lastEventObj.to;  //merge count 를 계산하기위해 모든 eventObj 에 실질쩍으로 끝나는 시간을 잡는다 

    // if(_lastEventObj.no === 8029) {
    //   console.log("Event",eventObj)
    // }
  }
  else {
    eventObj.lastTo = eventObj.to //sublist 가 없으면 자신에 to = lastTo 가된다 
  }
  return eventObj;
}



function toChartData(dataList) {



  let roomDataMap = {}

  let earliestDate = null;
  let latestDate = null;

  dataList.forEach(element => {

    let fmf = moment(element.fromDate)
    let emf = moment(element.toDate);

    //---------------------------- 최초와 최후의 날짜를 찾아서 그리드에서 앞으로 6일 뒤로 6일로 해서 여백을 최소화하는데 사용
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
    
    let prevEvent=null;

    const loopLen = colDataArray.length;
    for (let i = 0; i < loopLen; i++) {
      //root eventObj tree  구조형성 , 여기에서 만들어지는건 상호중복되지 않는것이다 
      let eventObjWrapper = buildEvent(colDataArray, i);
      i = eventObjWrapper.index; //중복된구간을 읽은것많금 뛰어넘는다 

      let eventObj = eventObjWrapper.event;
      eventObj = rebuildEventObj(eventObj)

      // if(prevEvent !== null && prevEvent.no === 7802) {
      //     console.log("State",prevEvent.to,eventObj,prevEvent.to === eventObj.from)
      // }

      if(prevEvent != null)  {

        if(prevEvent.to === eventObj.from) {
          prevEvent.isSameDayOfNext= true
          eventObj.isSameDayOfPre = true;
        }
      }


      eventObjList.push(eventObj)

      //전 이벤트에 부여한다 다음 event 에서 둘이 붙어 있는지를 검증할때 사용 
      prevEvent = eventObj;

    }

    let roomNo = null;
    if(wrapper.el !== null) {
      roomNo = wrapper.el.room
    }
    // else{
    //   console.log(wrapper)
    // }

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


function safeGetObjVal(obj,field,initFunc) {

  if(obj[field] === undefined) {

    if(initFunc !== undefined) {
      obj[field] = initFunc()
//      return obj;
    }else{
      obj[field] = {}
//      return obj;
    }
  }
  return obj[field]
}

function allOfBabyCountingVal() {


  let babyCounter = {}
  const initFunc = ()=>{
    return 0;
  }

  return function(cDate,eventObj) {

    let babyCount = safeGetObjVal(babyCounter,cDate,initFunc);
    let eventList = toInRangedList(eventObj,cDate)

//    console.log(babyCount)
    let sumVal = 0;
    eventList.forEach((el)=>{
      sumVal = sumVal+el.source.baby
    })

    // if(cDate === "2021-08-28") {
    //   console.log("2021-08-28 value",sumVal)
    // }
    babyCounter[cDate] = babyCount+sumVal
    return babyCounter
  }
}


function allOfRoomCountingVal() {

  let roomGraceReport ={}


  return function(cDate,eventObj) {

//    let roomReport = roomGraceReport[eventObj.source.roomLevel]
    let roomReport = roomGraceReport[eventObj.source.roomGradeNo]

    if (roomReport === undefined) {
      roomReport = {
        name: eventObj.source.rgName,
        dataList: {}
      }
      roomGraceReport[eventObj.source.roomGradeNo] = roomReport;
    }

    let countVal = roomReport.dataList[cDate];
    if (countVal === undefined) {
      countVal = 0;  //1으로 초기화 밑에서 체크기준에 따라 추가 
      roomReport.dataList[cDate] = countVal;
    }

    let newCount = countRangeRoom(eventObj, cDate)
    if (newCount > 0) {
      roomReport.dataList[cDate] = countVal + newCount;
    }
    return roomGraceReport;
  }
}



function toInRangedList(eventObj, ctimeFormatStr) {


  let eventList = []
  //root eventObj 에 포함되였으면 return 한다 
  if (isValidCountReport(eventObj, eventObj.from, eventObj.to, ctimeFormatStr)) {
    eventList.push(eventObj)
  }

  if (eventObj.subList.length > 0) {

    for (let i = 0; i < eventObj.subList.length; i++) {
      let cuo = eventObj.subList[i];
      if (isValidCountReport(cuo, cuo.from, cuo.to, ctimeFormatStr)) {
        eventList.push(cuo)
      }
    }
  }
  return eventList;
}


// const groupBy = function(xs, key) {
//   return xs.reduce(function(rv, x) {
//     (rv[x[key]] = rv[x[key]] || []).push(x);
//     return rv;
//   }, {});
// };

function buildReportDataList(eventObjList,dateList) {

  
  let totalCount = {};

  const babyCouter = allOfBabyCountingVal();
  const roomReportingCounter = allOfRoomCountingVal();

  eventObjList.forEach((e)=>{

//    let roomNo = e.roomNo;
    let dataList = e.eventObjList

    dataList.forEach((eventObj)=>{

      // let dateList = rangeOfDates(eventObj.from, eventObj.lastTo)

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


function filterEventObjectList(eventObjList,filter) {


  for(let i = 0;i<eventObjList.length;i++) {

    let e = eventObjList[i]

    if(filter(e)) {
      // console.log("Return Vale-1",e)
      return e
    }

    if(e.subList !== undefined && e.subList.length > 0) {
      let ele = filterEventObjectList(e.subList,filter)
      if(ele !== null) {
        // console.log("Return Vale-2",ele)
        return ele
      }
    }  
  }
  return null;
}


export const GantchartContext = createContext()
//export const ServerEventContext = createContext()


const GlobalProps = {


  SetupPayTypeList:[
    {type:"0",name:"예약추가"},
    {type:"1",name:"잔금결제"},
    {type:"2",name:"환불"},
    {type:"3",name:"예약취소"},
    {type:"6",name:"계약포기(환불)"},
    {type:"7",name:"기간연장"},
  ],
  getSetupPayType:function(typeCode){
    const array =  this.SetupPayTypeList.filter((e)=>{
      return parseInt(e.type) === typeCode
    })
    return array.length >0 ? array[0]:null
  },
  getDefaultSetupPayType:function() {
    return this.SetupPayTypeList[1]
  },
  ExtendDateTypeCode:function(){
    return this.SetupPayTypeList[5]
  },
  BalancePayTypeCode:function() {
    return this.SetupPayTypeList[1];
  },
  getPayMethodOfCode:function(code){

    return this.PayMethodList.filter((e)=>{
      return e.type ===code
    })[0]
  },
  PayMethodList: [
    { type: "cash", name: "현금" },
    { type: "card", name: "카드" },
    { type: "cashcard", name: "현금 + 카드" },
  
  ],
  PayTypeList:[
    {type:"full",name:"완납"},
    {type:"deposit",name:"계약금선납"},
  ],
  RoomStateList:[
    {type:"in",name:"입실유지"},
    {type:"out",name:"퇴실"},
  ],
  // RightMenuProps: {
  //   RightPopupFArray: _Right_Popup_fArray,
  //   RightPopupSArray: _Right_Popup_sArray,
  //   RightPopupTArray: _Right_Popup_tArray
  // }
}



function isPermissCustom(source) {
  return (ReservStateChecker.isPreInFull(source)
          || ReservStateChecker.isPreInDespi(source))

          || (
            ReservStateChecker.isCheckInDespi(source)
              || ReservStateChecker.isCheckinFull(source)
          )

}


export const ReservStateChecker = (() => {

  return {
    isNotFullyPaied:function(sourceObj){
      return ReservStateChecker.isPreInDespi(sourceObj) || ReservStateChecker.isCheckInDespi(sourceObj)
    },
    isConfirmReserv:isPermissCustom,
    isConfirmCheckin:function(e) {
      return this.isCheckInDespi(e)
              || this.isCheckinFull(e)
    },
    isPreInDespi:function(sourceObj) { //입실예정(미남)
      return sourceObj.delState === 0 
          && sourceObj.inState === 0
          && sourceObj.remainMoney > 0
    },
    isPreInFull:function(sourceObj) { //입실예정 (완납)
      return sourceObj.delState === 0 
          && sourceObj.inState === 0
          && sourceObj.remainMoney <= 0
    },
    isCheckInDespi:function(sourceObj) { //입실확정(미납)
      return sourceObj.delState === 0 
          && sourceObj.inState === 1
          && sourceObj.remainMoney > 0
    },
    isCheckinFull:function(sourceObj) { //입실확정(완납)
      return sourceObj.delState === 0 
          && sourceObj.inState === 1
          && sourceObj.remainMoney <= 0
    },
    isMoveRoom:function(sourceObj) { //객실이동
      return sourceObj.delState === 0 && sourceObj.inState === 1
    },
    isDrop:function(sourceObj) {//계약포기
      return sourceObj.delState === 0 && sourceObj.inState === 2
    },
    isCancel:function(sourceObj) {//예약취소
      return sourceObj.delState === 1 && sourceObj.inState === 0 
    },
    isExitRoom:function(sourceObj) { //퇴실

      if(sourceObj.delState === 2) { //임시추가 , 디비상태보고 사적으로 판단한거임 확인되지 않음 2021.08.12
        return true;
      }

      return sourceObj.inState === 9 && sourceObj.delState === 0 
    },
    isRevisit:function(sourceObj) { //재방문
      return sourceObj.revisit
    },

  }
})()


export {
  //emitHttpEvent, 
  toChartData,filterEventObjectList, GlobalProps,buildReportDataList,rangeOfDates,inDurationVal2,isValidSourceCountReport
}