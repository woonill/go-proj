import React, { useState, useContext, useEffect, useMemo } from "react";
import { Table, Button, Popover } from "antd";

import Moment from "moment";
import { extendMoment } from "moment-range";
import { newMouseRightMenu } from "../components/pmenu/menu_compos";
import { v4 as uuidv4 } from "uuid";
import { ReversionCancelPopup } from "./chart_view_modal";
import { PopupView } from "../components/popup";
import { GantchartContext, toChartData } from "./chart_view_context";

const moment = extendMoment(Moment);

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

// //구간 text view 생성함수 20220-01-02 ~ 2020-01-20
// function toRangeText(name, from, to) {
//   let rtext = "(" + name + ")" + from + " ~ " + to + "";
//   //  console.log("rtext length",rtext.length)
//   rtext = rtext.length > 20 ? rtext.substring(0, 5) : rtext;

//   return (
//     <div>
//       <p>{rtext}</p>
//     </div>
//   );
// }

// function OverTimeline(eventObj) {
//   return (
//     <div>
//       <p>{"" + eventObj.from + " ~ " + eventObj.source.to + ""}</p>
//       <p>{"" + eventObj.next.from + " ~ " + eventObj.to + ""}</p>
//     </div>
//   );
// }

function RangeTimelineText(props) {
  let rtext = "(" + props.name + ")" + props.from + " ~ " + props.to + "";
  rtext = rtext.length > 20 ? rtext.substring(0, 7) : rtext;
  return (
    <div>
      <p>{rtext}</p>
    </div>
  );
}

//중첩구간에대한 View 생성함수
function gridChartCompRender(eventObj, mergeCount) {
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

  let fWidth = mergeCount * (fRange / mergeCount);
  let ssMerge = mergeCount * (srRange / mergeCount);

  //앞에두개에서 나믄 부분이 세번째 바에길이
  let trLen = mergeCount - (fWidth + ssMerge);
//  let tfMerge = trLen;

  // let fReversionTime = toRangeText(
  //   eventObj.source.name,
  //   eventObj.from,
  //   eventObj.source.to
  // );

  let overrideTimeline = (
    <div>
      <p>{"" + eventObj.from + " ~ " + eventObj.source.to + ""}</p>
      <p>{"" + eventObj.next.from + " ~ " + eventObj.to + ""}</p>
    </div>
  );

  // let sfReversionTime = toRangeText(
  //   eventObj.next.from,
  //   eventObj.next.source.to
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
          // reversionTime={fReversionTime}
        >
          <SchedulerBarButton
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "red",
              borderStyle: "none",
            }}
            colData={eventObj}
          >
            <RangeTimelineText
              name={eventObj.source.name}
              from={eventObj.from}
              to={eventObj.source.to}
            />
          </SchedulerBarButton>
        </DefaultSchedulerBar>
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
          flex: trLen,
        }}
      >
        <DefaultSchedulerBar colData={eventObj}>
          <SchedulerBarButton
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "green",
              borderStyle: "none",
            }}
            colData={eventObj}
          >
            <RangeTimelineText
              name={eventObj.source.name}
              from={eventObj.next.from}
              to={eventObj.next.source.to}
            />
          </SchedulerBarButton>
        </DefaultSchedulerBar>
      </div>
    </div>
  );
}

function SchedulerBarButton(props) {
  const { groupState } = useContext(GantchartContext);
  const [bcState, updateBgColor] = useState("black");

  let dataSource = props.colData.source;
  let groupKey = dataSource.group;
  let isGroupping = groupKey !== undefined;

  const onDoubleClickHandler = function (e) {
    //    console.log("data", props.colData);
    window.location.href =
      "/reservation/view?reservation_no=" + props.colData.source.no;
  };

  useEffect(() => {
    if (isGroupping) {
      //이동흔적이 있으면
      //예약이동시 처리 부분
      return function () {
        //release function from context parameter
      };
    }
  });

  let groupStateVal = groupState[groupKey];

  let mouseOverEventHandler = (e) => {
    //        console.log("reset bgcolor red")
    if (isGroupping) {
      updateBgColor("red");
    }
  };

  let mouseOutEventHandler = (e) => {
    //      console.log("reset bgcolor move")
    //      box.current.style.backgroundColor = "black"
    if (isGroupping) {
      updateBgColor("black");
    }
  };

  return (
    <div style={{ width: "100%", padding: "1px", backgroundColor: bcState }}>
      <Button
        type="primary"
        style={props.style}
        onDoubleClick={onDoubleClickHandler}
        onMouseOver={mouseOverEventHandler}
        onMouseOut={mouseOutEventHandler}
      >
        {/* {props.reversionTime} */}
        {props.children}
      </Button>
    </div>
  );
}

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

const MouseRightMenuComp = newMouseRightMenu(
  _Right_Popup_fArray,
  _Right_Popup_sArray,
  _Right_Popup_tArray
);

function DefaultSchedulerBar(props) {
  const { eventDispach } = useContext(GantchartContext);
  return (
    <MouseRightMenuComp
      handleClick={(e, d) => {
        eventDispach({ type: "ShowPopup" });
      }}
      menuId={uuidv4()}
    >
      {/* <SchedulerBarButton
        style={props.style}
        colData={props.colData}
        // reversionTime={props.reversionTime}
      >
          {props.children}
      </SchedulerBarButton> */}
      {props.children}
    </MouseRightMenuComp>
  );
}



function tableColumnRender(record, currentDayFormate) {
  
  let eventObjectList = record["eventObjList"];

  let currentDay = moment(currentDayFormate)

  let currentEventObj = null;
  for (let i = 0; i < eventObjectList.length; i++) {
    let eventObj = eventObjectList[i];
    if (isDurationVal(eventObj, currentDay)) {
      currentEventObj =eventObj
        break;
    }
  }

  if(currentEventObj != null){

    let lastTime = moment(currentEventObj["to"]);
    if (lastTime.isSame(currentDay)) {

       let mergeCount = calcuRangeDays(currentEventObj);
       if (currentEventObj.next != null) {
         return {
           children: gridChartCompRender(currentEventObj, mergeCount), //newGridChart(eventObj, mergeCount),
            props: {
             colSpan: mergeCount,
             rowSpan: 1,
           },
         };
       }
       return {
         children: <DefaultSchedulerLine eventObj={currentEventObj}/>,
         props: {
           colSpan: mergeCount,
           rowSpan: 1,
         },
       };
     } 
     else {
       return {
         children: "",
         props: {
           colSpan: 0,
           rowSpan: 1,
         },
       };
     }

  }

 
  return {
    children: "em",
    props: {
      colSpan: 1,
      rowSpan: 1,
    },
  };
}


function tableColumnRender2(record, currentDay) {
  let colArray = record["colDataArray"];
  let momentDate = moment(currentDay);

  for (let i = 0; i < colArray.length; i++) {
    let eventObjWrapper = buildEvent(colArray, i);
    i = eventObjWrapper.index;

    let eventObj = eventObjWrapper.event;

    let isTrue = isDurationVal(eventObj, momentDate);
    if (isTrue) {

      let lastTime = moment(eventObj["to"]);
      if (lastTime.isSame(momentDate)) {
        let mergeCount = calcuRangeDays(eventObj);
        if (eventObj.next != null) {
          return {
            children: gridChartCompRender(eventObj, mergeCount), //newGridChart(eventObj, mergeCount),
            props: {
              colSpan: mergeCount,
              rowSpan: 1,
            },
          };
        }
        return {
          children: <DefaultSchedulerLine eventObj={eventObj}/>,
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
    }
  }

  return {
    children: "",
    props: {
      colSpan: 1,
      rowSpan: 1,
    },
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

function DefaultSchedulerLine(props) {

  let eventObj = props.eventObj;
  return (
    <DefaultSchedulerBar colData={props.eventObj} style={{ width: "100%" }}>
    <SchedulerBarButton
      style={{
        width: "100%",
      }}
      colData={props.eventObj}
    >
      <RangeTimelineText
        name={eventObj.source.name}
        from={eventObj.from}
        to={eventObj.to}
      />
    </SchedulerBarButton>
  </DefaultSchedulerBar>
  )
}

function newColumnRender(sdate, startIndex = 1) {
  let mo = moment(sdate);
  let mLen = mo.daysInMonth(); //특정 달에서 가지고 있는 날짜 수량 30， 31, 28 등으로 표현
  let fMonthData = [];


//  let calDay = mo;

  for (let i = startIndex; i <= mLen; i++) {

    let calDay = moment();
    calDay.year(mo.year());
    calDay.month(mo.month());
    calDay.date(i);
//     console.log("calday",calDay.format("YYYY-MM-DD"))
    let model = {
      title: i,
      width: 35,
      height: 15,
      dataIndex: "eventObjList",
      key: sdate + "-" + i,
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

//        console.log("EventObjectList",record,"date",calDay.format("YYYY-MM-DD"))
        return tableColumnRender(record, calDay.format("YYYY-MM-DD"));
        // tableColumnRender(record, reDate);
        // return (<div>test bar char</div>)
      },
    };

    fMonthData.push(model);
  }
  return fMonthData;
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

//끝나는 날과 시작날 사이 날자 계산
function calcuRangeDays(currentObj) {
  let fTime = moment(currentObj["from"]);
  let lTime = moment(currentObj["to"]);
  return lTime.diff(fTime, "days") + 1;
}

function newColumnHeader(searchRange) {
  let columns = [
    {
      dataIndex: "name",
      key: "name",
      width: 200,
      height: 30,
      fixed: "left",
    },
  ];

  //  console.log("SearchRange",searchRange)
  let ykey = "";
  let childrenCompos = [];

  for (const key in searchRange) {
    ykey = ykey + key + "~";

    let value = searchRange[key];
    const monthObj = value.mObj;

    for (const mkey in monthObj) {
      let mvalue = monthObj[mkey];
      let el = {
        title: key + "-" + mkey,
        key: mkey,
        // dataIndex:"colDataArray",
        children: newColumnRender(mvalue),
      };
      childrenCompos.push(el);
    }

    columns.push({
      title: key,
      key: "year",
      children: childrenCompos,
    });
  }

  return columns;
}

function SubViewComponent(props) {
  return <ReversionCancelPopup />;
}

function newViewEventObserver(listener) {
  return function (e) {
    listener.forEach((fallback) => {
      fallback(e);
    });
  };
}

function ChartTableView(props) {
  let chartData = toChartData(props.dataList);
  let data = chartData.list;
  let searchRange = chartData.range;
  let columns = newColumnHeader(searchRange);

  let TableComponent = React.memo(
    (props) => {
      console.log("render table2");

      return (
        <Table
          rowKey="key"
          scroll={{ y: 1100 }}
          columns={props.columns}
          dataSource={props.data}
          bordered
          pagination={false}
          size="middle"
        />
      );
    },
    (prevProps, nextProps) => {
      console.log("update state");
      return prevProps.data.length !== nextProps.data.length;
    }
  );

  // return TableComponent;

  return <TableComponent data={data} columns={columns} />;
}

function newInPopupView(listeners) {
  return function (props) {
    //parent 에서 공유 state 를 사용하면 팝업이뜰때마다 전체가 다시 랜들링이 되기때문에
    //이건 내부에 state 를 가지고가야한다

    let [showPopupState, setShowPopup] = useState(false);
    listeners.push(function (e) {
      //      console.log("recived message",e)

      if (e.type === "ShowPopup") {
        setShowPopup(true);
        return;
      }

      if (e.type === "ClosePopup") {
        setShowPopup(false);
        return;
      }
    });

    return (
      <PopupView
        onOk={(e) => {
          setShowPopup(false);
        }}
        visible={showPopupState}
        handleCancel={(e) => {
          setShowPopup(false);
        }}
      >
        <SubViewComponent />
      </PopupView>
    );
  };
}

export default function GroupTable(props) {
  // const chartData = useMemo(()=>{
  //   console.log("update chartdata")
  //   return toChartData(props.dataList)
  // },[props.dataList])

  let groupState = {};
  let listeners = [];

  // data.forEach((value) => {
  //   value.colDataArray.forEach((v2) => {
  //     if (v2.group !== undefined) {
  //       let gropuId = groupState[v2.group];
  //       if (gropuId === undefined || gropuId === null) {
  //         groupState[v2.group] = "normal";
  //       }
  //     }
  //   });
  // });

  let InPopupView = newInPopupView(listeners);
  let eventDispach = newViewEventObserver(listeners);

  return (
    <GantchartContext.Provider value={{ eventDispach, groupState, listeners }}>
      <div style={{ padding: 10 }}>
        {/* <Table
          rowKey="key"
          scroll={{ y: 1100 }}
          columns={columns}
          dataSource={data}
          bordered
          pagination={false}
          size="middle"
        /> */}
        <ChartTableView dataList={props.dataList} />
        <InPopupView>
          <SubViewComponent />
        </InPopupView>
      </div>
    </GantchartContext.Provider>
  );
}

export { GroupTable };
