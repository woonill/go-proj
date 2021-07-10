import { createContext } from 'react'

import Moment from "moment";
import { extendMoment } from "moment-range";
const moment = extendMoment(Moment);

function buildEvent(allEvents, i) {
  if (allEvents.length === i) {
    return null;
  }

  let colData = allEvents[i];

  let event = {
    from: colData.from,
    to: colData.to,
    name:colData.name,
    source: colData,
    next: null,
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

    if (isDurationVal(colData, moment(nextEvent.from))) {
      event.to = nextEvent.to;
      event.next = nextEvent;
      returnVal.index = nextEventVal.index;
    }
  }

  return returnVal;
}


//구간에 있는지 확인 함수
function isDurationVal(currentObj, cTime) {
  //    console.log(currentObj["to"])
  let fTime = moment(currentObj["from"]);
  //  let lTime = moment(currentObj["to"]).add(1, "minutes");
  let lTime = moment(currentObj["to"]);

  const range = moment.range(fTime, lTime);
  return range.contains(cTime);

  // let cunixt = cTime.unix()
  // let res  = cunixt >= fTime.unix() && cunixt <= lTime.unix()
  //let cstr = cTime.format("YYYY");
  // if( cstr === "2020"){
  //   console.log("date",cTime.format("YYYY-MM-DD"),currentObj,res)
  // }
  //  return res;

  //  return cTime.isAfter(fTime) && cTime.isBefore(lTime)
}



function wrapReangeObj(rangeObj,mom) {

  let year = mom.year();
  let month = mom.month()+1

  if(rangeObj[year] === undefined) {

    let fmObj={}
    fmObj[month] = mom.format("YYYY-MM")

    rangeObj[year] = {      
      y:""+year,
      mObj:fmObj
    }
    return rangeObj;

  }else{
    let fmObj = rangeObj[year].mObj
    let m = fmObj[month]
    if(m === undefined) {
      fmObj[month] = mom.format("YYYY-MM")
    }
    return rangeObj
  }
}

function toChartData(dataList) {

  let totalCount = {
    "room-grade-1":{},
    "room-grade-3":{}
  };

  let roomDataMap = {}
  let rangeObj = {}

  dataList.forEach(element => {


    if(element.no === 445){ //테스트환경의 이상한데이터 이 부분은 디비에서 지우기로한다 
      //잠시 테스트를 위해 추가한 부분 
      return
    }


    let fmf = moment(element.fromDate)
    let emf = moment(element.toDate);
    rangeObj = wrapReangeObj(rangeObj,fmf)
    rangeObj = wrapReangeObj(rangeObj,emf)


    const id = element.roomGradeNo;
    const roomGradeTotalObj = totalCount["room-grade-"+id]
    if(roomGradeTotalObj !== undefined) { //골드 팬트하우스 빼고 다른방은 패스 

        let dueDateObj = roomGradeTotalObj[element.dueDate]
        if(dueDateObj !== undefined) {
          dueDateObj = 0
        }

        dueDateObj = dueDateObj+1;
        roomGradeTotalObj[element.dueDate] = dueDateObj //count 를 하나추가하고 update 한다
    }

    let roomKey = newRoomNo(element)
    let roomReport = roomDataMap[roomKey]
    if(roomReport === undefined) {
      
      roomReport = {
        el:element,
        roomDataArray:[]
      }
      roomDataMap[roomKey] = roomReport
    }

    roomReport.roomDataArray.push(toRoomData(element))

  });


  const list = [];

  //from 필드로 sorting 하여 빠른 from 날짜를 앞으로 이동시킨다 
  const colDataArraySort = (a, b) => {
      var value1 = a["from"];
      var value2 = b["from"];
      return Date.parse(value1) - Date.parse(value2);
  }

  Object.keys(rangeObj).sort((a,b) => {
    return a - b
  })
  //end sorting 

  const keys = Object.keys(roomDataMap)
  keys.forEach((e)=>{

    let wrapper = roomDataMap[e];
    const colDataArray = wrapper.roomDataArray
    colDataArray.sort(colDataArraySort)


    let eventObjList= []

    for (let i = 0; i < colDataArray.length; i++) {
      let eventObjWrapper = buildEvent(colDataArray, i);
      i = eventObjWrapper.index;
  
      let eventObj = eventObjWrapper.event;
      eventObjList.push(eventObj)
    }


    list.push({
      key: e,
      name: wrapper.el.rgName+","+wrapper.el.roomName,
      colDataArray: colDataArray,
      eventObjList:eventObjList,
    });


  })

//  const skeys = Object.keys(rangeObj);

  let data =  {
    list:list,
    range:rangeObj
  }

  return data;
}

function newRoomNo(record) {
  return record.rgName+"-"+record.room;
}


function toRoomData(record){

  return {
    key:""+record.no,
    no:record.no,
    from:record.fromDate,
    to:record.toDate,
    name:record.name
  }
}




// function toRoomGradeReportFragment(record){
//   return {
//     key: record.no,
//     dataVal: "10",
//     // whenDay:i+5,
//     // month:"4",
//     // name: i+"a-total",  
//   }
// }



function doHttpGet(uri,params,fn) {


    let query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&'); 
//    let url = '/ajax/api/tableDataList?' + query;
    let url = uri+"?"+query;

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
          let data = resMessage.data.dataList;
 //         eventDispacher({type:"OnLoadCompletedResList",dataList:data})
          fn(data)
        }).catch(e=>{
          console.log("error",e)
        }) 

}


function emitHttpEvent(event) {

    if(event.type === "FetchTableDataList") {
        doHttpGet("/ajax/api/tableDataList",event.params,event.resultHandler)
    }
}



export const GantchartContext = createContext()
export const ServerEventContext = createContext()


const _Right_Popup_fArray = [
  { text: "상세보기", data: { popupView: "1-1" } },
  { text: "객실이동", data: { popupView: "1-2" } },
  { text: "기간연장", data: { popupView: "1-3" } },
  { text: "퇴실확정", data: { popupView: "1-4" } },
  { text: "계약일수정", data: { popupView: "1-5" } },
];

const _Right_Popup_sArray = [
  { text: "결제내역", data: { popupView: "2-1" } },
  { text: "잠감결제", data: { popupView: "2-2" } },
];

const _Right_Popup_tArray = [
  { text: "환불", data: { popupView: "3-1" } },
  { text: "에약삭제", data: { popupView: "3-2" } },
];



const GlobalProps ={
  RightMenuProps:{
    RightPopupFArray:_Right_Popup_fArray,
    RightPopupSArray:_Right_Popup_sArray,
    RightPopupTArray:_Right_Popup_tArray  
  }
}

export {
    emitHttpEvent,toChartData,GlobalProps
}