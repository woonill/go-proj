import React, { useState, useContext,useRef } from "react";
import { Table, Button, Popover } from "antd";

//import moment from "moment";
import Moment from "moment";
import { extendMoment } from "moment-range";
import { toChartData } from "./general_chart_data";
import { newMouseRightMenu } from "../components/pmenu/menu_compos";
import { v4 as uuidv4 } from "uuid";
import { ReversionCancelPopup } from "./chart_view_modal";
import { newPopupWrapper } from "../components/popup";
import { GantchartContext } from "./chart_view_context";

const moment = extendMoment(Moment);

// function isDebugger() {
//   return "dev" == process.env.NODE_ENV;
// }

function buildEvent(allEvents, i) {

  if (allEvents.length === i) {
    return null;
  }

  let colData = allEvents[i];


  let event = {
    from: colData.from,
    to: colData.to,
    source: colData,
    next: null,
  };

  let returnVal = {    
    event:event,
    index:i
  }


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


function toRangeText(from,to) {

  let rtext = "" + from + " ~ " + to + ""
//  console.log("rtext length",rtext.length)
  rtext = rtext.length > 10 ? rtext.substring(0,5) : rtext

  return (
    <div>
    <p>{rtext}</p>
  </div>
  )
}

function newGridChartComp(menuClickHandler) {

  return function (eventObj, mergeCount) {

//    console.log("mergcount",mergeCount)
    //처음 바차트 
    let sfirstTime = eventObj["from"];
    let endLastTime = eventObj.next.source["from"];
    let fRange = moment(endLastTime).diff(sfirstTime, "days") + 1;

    //중첩구간 중첩구간 
    // (처음시간에 toDate - 두번째시간에 fromDate)
    let seFirstTime = eventObj.next.source["from"];
    let seLastTime = eventObj.source["to"];
    //처음시작점과 끝나는 점에서의 최종 날짜 간격
    let srRange = moment(seLastTime).diff(seFirstTime, "days") + 1; 

    let fWidth = (mergeCount*(fRange/mergeCount));
    let ssMerge = (mergeCount * (srRange/mergeCount))


    //앞에두개에서 나믄 부분이 세번째 바에길이 
    let trLen = mergeCount - (fWidth + ssMerge)
    let tfMerge = trLen;

    let fReversionTime = toRangeText(eventObj.from,eventObj.source.to)
    // let fReversionTime = (
    //   <div>
    //     <p>{"" + eventObj.from + " ~ " + eventObj.source.to + ""}</p>
    //   </div>
    // );

    let overrideTimeline = 
    (
      <div>
        <p>{"" + eventObj.from + " ~ " + eventObj.source.to + ""}</p>
        <p>{"" + eventObj.next.from + " ~ " + eventObj.to + ""}</p>
      </div>
    );

    let sfReversionTime = toRangeText(eventObj.next.from,eventObj.next.source.to)
    // (
    //   <div>
    //     <p>{"" + eventObj.next.from + " ~ " + eventObj.next.source.to + ""}</p>
    //   </div>
    // );

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div
          style={{
            //        width: fWidth,
            flex: fWidth,
            borderColor: "red",
            borderBottomStyle: "solid",
            borderTopStyle: "solid",
            borderLeftStyle: "solid",
            height: "100%",
          }}
        >
          {/* <PopupSchedulerItem fReversionTime={fReversionTime} text="1 구간" /> */}
          <DefaultSchedulerBar
            colData={eventObj}
            reversionTime={fReversionTime}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "red",
              borderStyle: "none",
            }}
          />
        </div>
        <div
          style={{
            flex: ssMerge,
            // opacity: 0.3,
            borderTopStyle: "solid",
            borderTopColor: "red",
            borderRightColor: "red",
            borderLeftColor: "green",
            //          borderLeftWidth:2,
            borderLeftStyle: "solid",
            borderBottomStyle: "solid",
            borderBottomColor: "green",
            //        borderStyle: "solid",
          }}
        >
          <Popover content={overrideTimeline} title="중첩구간">
            <Button
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "red",
                borderStyle: "none",
              }}
            >
              중첩 구간
            </Button>
          </Popover>
        </div>
        <div
          style={{
            borderBottomStyle: "solid",
            borderTopStyle: "solid",
            borderRightStyle: "solid",
            borderRightColor: "green",
            borderTopColor: "green",
            borderLeftColor: "green",
            borderBottomColor: "green",
            flex: tfMerge,
          }}
        >
          <DefaultSchedulerBar
            colData={eventObj}
            reversionTime={sfReversionTime}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "green",
              borderStyle: "none",
            }}
          />
        </div>
      </div>
    );
  };
}


function SchedulerBarButton(props) {

  const box = useRef(0);
  const { groupState, eventDispach } = useContext(GantchartContext);

  let dataSource = props.colData.source;
  let groupKey = dataSource.group;
  let isGroupping = groupKey !== undefined;


  if(!isGroupping) {


    return (
      <div 
      style={{width:"100%",padding:"1px",backgroundColor:"black"}} 
      >  
        <Button
          type="primary"
          style={props.style}
  //        onClick={(e)=> box.current.style.backgroundColor = "red"}
          // onMouseOver={mouseOverEventHandler}
          // onMouseMove={mouseMoveEventHandler}
        >
          {props.reversionTime}
        </Button>
       </div>
    )
  

  }

  let groupStateVal = groupState[groupKey]

  let mouseOverEventHandler = (e) => {
//       if (groupState[groupKey] === "normal") {
//         eventDispach({ type: "ChartBarMouseOn", groupId: groupKey });
//       } else {
// //        console.log("is normal state of group", groupKey);
//       }
        console.log("reset bgcolor",groupStateVal)
        box.current.style.backgroundColor = "red"
  };


  let mouseMoveEventHandler = (e) => {
      console.log("reset bgcolor move")
      box.current.style.backgroundColor = "black"

//       if (groupState[groupKey] === "active") {
//         eventDispach({ type: "ChartBarMouseMove", groupId: groupKey });
//       } else {
// //        console.log("is normal state of group", groupKey);
//       }
  };

 
  return (
    <div 
    ref={box}
    style={{width:"100%",padding:"1px",backgroundColor:"black"}} 
    onMouseOver = {mouseOverEventHandler}
    onBlur={mouseMoveEventHandler}
    >

      <Button
        type="primary"
        style={props.style}
//        onClick={(e)=> box.current.style.backgroundColor = "red"}
        // onMouseOver={mouseOverEventHandler}
        // onMouseMove={mouseMoveEventHandler}
      >
        {props.reversionTime}
      </Button>
     </div>
  )

}

function DefaultSchedulerBar(props) {

  const {eventDispach } = useContext(GantchartContext);


  let fArray = [
    { text: "상세보기", data: { popupView: "1-1" } },
    { text: "객실이동", data: { popupView: "1-2" } },
    { text: "기간연장", data: { popupView: "1-3" } },
    { text: "퇴실확정", data: { popupView: "1-4" } },
    { text: "계약일수정", data: { popupView: "1-5" } },
  ];

  let sArray = [
    { text: "결제내역", data: { popupView: "2-1" } },
    { text: "잠감결제", data: { popupView: "2-2" } },
  ];

  let tArray = [
    { text: "환불", data: { popupView: "3-1" } },
    { text: "에약삭제", data: { popupView: "3-2" } },
  ];

  let MouseRightMenuComp = newMouseRightMenu(fArray, sArray, tArray);

  return (
    <MouseRightMenuComp
      // handleClick={props.itemOnClick}
      handleClick={(e, d) => {
        eventDispach({ type: "ShowPopup" });
      }}
      menuId={uuidv4()}
    >
      <SchedulerBarButton 
        style={props.style} 
        colData={props.colData}
        reversionTime={props.reversionTime}
        />
    </MouseRightMenuComp>
  );
}

function choosherRenderFunc(scheduleRender, newGridChartRender) {

  return function (record, dateFormat) {

    let colArray = record["colDataArray"];
    let momentDate = moment(dateFormat);

//    let qIndex = -1;

    for (let i = 0; i < colArray.length; i++) {

//      if(i > qIndex) {

        let eventObjWrapper = buildEvent(colArray, i);

        i = eventObjWrapper.index

        let eventObj = eventObjWrapper.event;
  
        if (isDurationVal(eventObj, momentDate)) {
          // console.log("from",eventObj["from"],eventObj["to"],momentDate.format("YYYY-MM-DD"))
          // console.log("inDuration")
          let lastTime = moment(eventObj["to"]);
          if (lastTime.isSame(momentDate)) {
  
            let mergeCount = calcuRangeDays(eventObj);
            if (eventObj.next != null) {
              return {
                children: newGridChartRender(eventObj, mergeCount), //newGridChart(eventObj, mergeCount),
                props: {
                  colSpan: mergeCount,
                  rowSpan: 1,
                },
              };
            }
  
            let cTag = scheduleRender(eventObj);
            return {
              children: cTag,
              props: {
                colSpan: mergeCount,
                rowSpan: 1,
              },
            };
          } else {
            return {
              children: "",
              props: {
                colSpan: 0,
                rowSpan: 1,
              },
            };
          }
//        }
  


      }

    }

    return {
      children: "",
      props: {
        colSpan: 1,
        rowSpan: 1,
      },
    };
  };
}

function newTotalFragment(record, key, month, day) {
  //  console.log(record);

  let colDataArray = record["colDataArray"];
  let dataOfMonth = colDataArray[day];
  if (dataOfMonth != null) {
    return (
      <div style={{ width: "100%" }}>
        <span>{dataOfMonth.dataVal}</span>
      </div>
    );
  }
}

function newColumnRender(updateViewState) {
  let itemClickHandler = (e, data) => {
    //    console.log("event",e,data)
    updateViewState(true);
  };

  const schedulerRenderFunc = (eventObj) => {
    let reversionTime = (
      <div>
        <p>{"" + eventObj.from + " ~ " + eventObj.to + ""}</p>
      </div>
    );

    return (
      <DefaultSchedulerBar
        colData={eventObj}
        itemOnClick={itemClickHandler}
        reversionTime={reversionTime}
        style={{ width: "100%" }}
      />
    );
  };

  //  let newGridChartRender = newGridChart(eventObj, mergeCount)
  let newGridChartRender = newGridChartComp(itemClickHandler);

  let columnRender = choosherRenderFunc(
    schedulerRenderFunc,
    newGridChartRender
  );

  return function (sdate, theKey, startIndex = 1) {

    let mo = moment(sdate);
    let mLen = mo.daysInMonth(); //특정 달에서 가지고 있는 날짜 수량 30， 31, 28 등으로 표현
    let fMonthData = [];

    for (let i = startIndex; i <= mLen; i++) {

      let calDay = moment();
      calDay.year(mo.year);
      calDay.month(mo.month());
      calDay.date(i);

      let reDate = calDay.format("YYYY-MM-DD");
//      console.log("calday",calDay.format("YYYY-MM-DD"))
      let model = {
        title: i,
        width: 35,
        height: 20,
        dataIndex: "colDataArray",
        key: theKey + "-" + i,
        render: function (text, record, index) {
          let recKey = record["key"];
          let sKey = recKey.toString();
          if (
            sKey === "totallReport:0" ||
            sKey === "totallReport:1" ||
            sKey === "totallReport:2"
          ) {
            return newTotalFragment(record, sKey, mo.month(), i);
          }

          return columnRender(record, reDate);
        },
      };

      fMonthData.push(model);
    }
    return fMonthData;
  };
}

//구간에 있는지 확인 함수
function isDurationVal(currentObj, cTime) {
  //    console.log(currentObj["to"])
  let fTime = moment(currentObj["from"]);
//  let lTime = moment(currentObj["to"]).add(1, "minutes");
  let lTime = moment(currentObj["to"]);


  const range = moment.range(fTime, lTime);
//  return range.contains(cTime, { exclusive: false });
  return range.contains(cTime);

}

//끝나는 날과 시작날 사이 날자 계산
function calcuRangeDays(currentObj) {
  let fTime = moment(currentObj["from"]);
  let lTime = moment(currentObj["to"]);
  return lTime.diff(fTime, "days") + 1;
}

function newColumnHeader(popupViewState,searchRange) {

  let ColumnRenderFunc = newColumnRender(popupViewState);

  let childrenCompos = searchRange.map((e)=>{
    let mon = moment(e)
    let sTitle = (mon.month()+1)+"월"
    let smonth = mon.format("YYYY-MM-DD");
    return  {
        title: sTitle,
//        key: "fmonth",
        //          dataIndex:"colDataArray",
        children: ColumnRenderFunc(smonth, "fmonth"),
      }
  })

  console.log("Column children comps",childrenCompos)

  const columns = [
    {
      dataIndex: "name",
      key: "name",
      width: 200,
      height: 30,
      fixed: "left",
    },
    {
      title: "2021",
      key: "year",
      children: childrenCompos,
    },
  ];

  return columns;
}

function SubViewComponent(showPopupState) {
  return <ReversionCancelPopup></ReversionCancelPopup>;
}

function newViewEventObserver(updatePopupState, groupState, groupStateUpdater) {


  return function (e) {
    if (e.type === "ShowPopup") {
      updatePopupState(true);
      return;
    }

    if (e.type === "ClosePopup") {
      updatePopupState(false);
      return;
    }

    if (e.type === "ChartBarMouseOn") {
      console.log("ChartBarMouseOn now");
      let groupVal = groupState[e.groupId];
      if (groupVal === "active") {
        console.log("isActive");
        return;
      }
      groupStateUpdater((prevState) => ({
        ...prevState,
        [e.groupId]: "active",
      }));
      return;
    }
    if (e.type === "ChartBarMouseMove") {

      let groupVal = groupState[e.groupId];
      if (groupVal === "normal") {
        console.log("isNormal");
        return;
      }
//      console.log("groupVal", groupVal, e.groupId);
      groupStateUpdater((prevState) => ({
        ...prevState,
        [e.groupId]: "normal",
      }));
      return;
    }
    if (e.type === "updateChartBarGroupView") {
      console.log("updateChartBarGroupView");
      return;
    }
    console.log("return now");
  };
}



export default function GroupTable(props) {

//  console.log("chart data list",props.dataList)

  let chartData = toChartData(props.dataList)
  let data  = chartData.list
  let searchRange = chartData.range;
//  console.log(searchRange)


  let [showPopupState, setShowPopup] = useState(false);
  let columns = newColumnHeader(setShowPopup,searchRange);


  let groupEle = {};

  data.forEach((value) => {
    value.colDataArray.forEach((v2) => {
      if (v2.group !== undefined) {
//        console.log("group value", v2.group, v2.key);
        let gropuId = groupEle[v2.group];
        if (gropuId === undefined || gropuId === null) {
          groupEle[v2.group] = "normal";
        }
      }
    });
  });


  const [groupState, barGroupState] = useState(() => {
    return groupEle;
  });

  //  console.log("Init GroupState val",groupState)

  let handleOk = (e) => {
    console.log("hadleOk now");
    setShowPopup(false);
  };

  let eventDispach = newViewEventObserver(
    setShowPopup,
    groupState,
    barGroupState
  );

  let PopupViewWrapper = newPopupWrapper(showPopupState, handleOk);

  return (
    <GantchartContext.Provider
      value={{ showPopupState, eventDispach, groupState }}
    >
      <div style={{ padding: 10 }}>
        <Table
          scroll={{ y: 1100 }}
          columns={columns}
          dataSource={data}
          bordered
          pagination={false}
          size="middle"
          
          //        scroll={{ x: 'calc(700px + 50%)', y: 240 }}
          //        scroll={{ x: 'calc(700px + 50%)', y: 120 }}
          //      title={newHeaderView}
          //      footer={() => "Footer"}
        />
        <PopupViewWrapper
          visible={showPopupState}
          handleCancel={(e) => {
            setShowPopup(false);
          }}
        >
          {SubViewComponent(showPopupState)}
        </PopupViewWrapper>
      </div>
    </GantchartContext.Provider>
  );
}

export { GroupTable };
