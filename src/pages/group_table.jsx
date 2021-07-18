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


function RangeTimelineText(props) {
  let rtext = "(" + props.name + ")" + props.from + " ~ " + props.to + "";
  rtext = props.mergeCount > 6 ? rtext : rtext.substring(0, 10);
  return (
    <div>
      <p>{rtext}</p>
    </div>
  );
}

function scheduleDetailURL(no) {
    return "/reservation/view?reservation_no="+no
}


function OverrideTimline(dataList) {
  return (
    <div>
      {
        dataList.map((eventObj)=>{
          return (
          <p>
              <span
                onClick={(e) => window.location.href=scheduleDetailURL(eventObj.no)}>
                  {eventObj.name+"," + eventObj.from + " ~ " + eventObj.source.to + ""}
              </span>          
          </p>
          )
        })
      }
  </div>
  )
}

//중첩구간에대한 View 생성함수
function gridChartCompRender(eventObj, mergeCount) {

  //처음 바차트
   let midNode = eventObj["midNode"]
   let lastNode = eventObj["lastNode"]

  let sfirstTime = eventObj["from"];
  let endLastTime = midNode["from"]

  let fRange = moment(endLastTime).diff(sfirstTime, "days") + 1;

  //중첩구간 중첩구간
  // (처음시간에 toDate - 두번째시간에 fromDate)
  let seFirstTime = midNode["from"];
  let seLastTime = midNode["to"];

  //처음시작점과 끝나는 점에서의 최종 날짜 간격
  let srRange = moment(seLastTime).diff(seFirstTime, "days") ;

  let fWidth = mergeCount * (fRange / mergeCount);
  let ssMerge = mergeCount * (srRange / mergeCount);

  //앞에두개에서 나믄 부분이 세번째 바에길이
  let trLen = mergeCount - (fWidth + ssMerge);

  let overTimeArray = [];

  overTimeArray.push(eventObj)

  eventObj.subList.forEach((e)=>{
    overTimeArray.push(e)
  })

  let overrideTimeline = OverrideTimline(overTimeArray)


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
              mergeCount={fRange}
              name={eventObj.name}
              from={eventObj.from}
              to={eventObj.source.to}
            />
          </SchedulerBarButton>
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
          <SchedulerBarButton
            colData={lastNode}
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "green",
              borderStyle: "none",
            }}
          >
            <RangeTimelineText
              mergeCount={trLen}
              name={lastNode.name}
              from={lastNode.from}
              to={lastNode.to}
            />
          </SchedulerBarButton>
      </div>
    </div>
  );
}

function SchedulerBarButton(props) {

  const { eventDispach } = useContext(GantchartContext);

  const { groupState } = useContext(GantchartContext);
  const [bcState, updateBgColor] = useState("black");

  let dataSource = props.colData.source;
  let isGroupping = dataSource.isMove === 1; //이동했는 여부 

  // const onDoubleClickHandler = function (e) {
  //   //    console.log("data", props.colData);
  //   window.location.href =scheduleDetailURL(props.colData.source.no);
  // };

  // if(isGroupping) {
  //   console.log("Moved EventObj",props.colData)
  // }

  useEffect(() => {
    if (isGroupping) {
      //이동흔적이 있으면
      //예약이동시 처리 부분

      let groupStateVal = groupState[dataSource.no]; //no 는 똑같은 값이므로 이걸로 group key 표시 

      const bgStateDisapcher = (e)=>{
//        console.log("updateColor",e.bgColor,dataSource)
        updateBgColor(e.bgColor);
      }

      groupStateVal.push(bgStateDisapcher)

      return function () {
        console.log("clear groupStateVal function")
//        groupStateVal.remove(bgStateDisapcher)
      };
    }
  },[groupState,dataSource,isGroupping]);


  let mouseOverEventHandler = (e) => {
    //        console.log("reset bgcolor red")
    if (isGroupping) {
//      updateBgColor("red");
      let groupStateVal = groupState[props.colData.source.no]; //no 같은 값이므로 group key 표시 
      groupStateVal.forEach((fallback)=>{
        fallback({bgColor:"yellow"})
      })
    }
  };

  let mouseOutEventHandler = (e) => {

    if (isGroupping) {

      let groupStateVal = groupState[props.colData.source.no]; //no 는 똑같은 값이므로 이걸로 group key 표시 
      groupStateVal.forEach((fallback)=>{
        fallback({bgColor:"black"})
      })

    }
  };

  return (
    <MouseRightMenuComp
      handleClick={(e, d) => {
        eventDispach({ type: "onClickRightMenu",data:d,eventObj:props.colData});
      }}
      menuId={uuidv4()}
    >
            {/* {props.children} */}
      <div style={{ width: "100%", padding: "2px", backgroundColor: bcState }}>
      <Button
        type="primary"
        style={props.style}
//        onDoubleClick={onDoubleClickHandler}
        onMouseOver={mouseOverEventHandler}
        onMouseOut={mouseOutEventHandler}
      >
        {props.children}
      </Button>
    </div>

    </MouseRightMenuComp>
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



    let lastTime = moment(currentEventObj["lastTo"]);
    if (lastTime.isSame(currentDay)) {

       let mergeCount = calcuRangeDays(currentEventObj);
       if(currentEventObj.isTouch) { 
         //next 에는 포함이되여있지 않고 하지만 다음에 오는것이 접전이라면 
        //merge 를 그전칸으로 쫇힌다 
         mergeCount = mergeCount-0.01
       }
      //  if(currentEventObj.name === "조수진") {
      //   console.log("jinxiuzhen",currentDay,currentEventObj,mergeCount)
      // }

       if (currentEventObj.subList.length >= 1) {
         return {
           children: gridChartCompRender(currentEventObj, mergeCount), //newGridChart(eventObj, mergeCount),
            props: {
             colSpan: mergeCount,
             rowSpan: 1,
           },
         };
       }
       return {
         children: <DefaultSchedulerLine eventObj={currentEventObj} mergeCount={mergeCount}/>,
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
    children: "",
    props: {
      colSpan: 1,
      rowSpan: 1,
    },
  };
}




function newTotalFragment(record,date) {

  let colDataArray = record["colDataArray"];
  let dataOfMonth = colDataArray[date];
//  console.log("date",dataOfMonth)
  if (dataOfMonth !== undefined) {
    return (
      <div style={{ width: "100%" }}>
        <span>{dataOfMonth}</span>
      </div>
    );
  }
}

function DefaultSchedulerLine(props) {

  let eventObj = props.eventObj;
  return (
    // <DefaultSchedulerBar colData={props.eventObj} style={{ width: "100%" }}>
    <SchedulerBarButton
      style={{
        width: "100%",
      }}
      colData={props.eventObj}
    >
      <RangeTimelineText
        mergeCount={props.mergeCount}
        name={eventObj.name}
        from={eventObj.from}
        to={eventObj.to}
      />
    </SchedulerBarButton>
  // </DefaultSchedulerBar>
  )
}

function newColumnRender(sdate, startIndex = 1) {
  let mo = moment(sdate);
  let mLen = mo.daysInMonth(); //특정 달에서 가지고 있는 날짜 수량 30， 31, 28 등으로 표현
  let fMonthData = [];


  for (let i = startIndex; i <= mLen; i++) {

    let calDay = moment();
    calDay.year(mo.year());
    calDay.month(mo.month());
    calDay.date(i);

    let model = {
      title: i,
      width: 35,
      height: 15,
      dataIndex: "eventObjList",
      key: sdate + "-" + i,
      render: function (text, record, index) {

        if(record["key"] ==="report") {
          return newTotalFragment(record,calDay.format("YYYY-MM-DD"));
        }
        return tableColumnRender(record, calDay.format("YYYY-MM-DD"));
      },
    };

    fMonthData.push(model);
  }
  return fMonthData;
}

//구간에 있는지 확인 함수
function isDurationVal(currentObj, cTime) {

  let fTime = moment(currentObj["from"]);
  let lTime = moment(currentObj["lastTo"]); //see-> chart_view_context.js 에서 데이터구조

  const range = moment.range(fTime, lTime);
  return range.contains(cTime,{ exclusive:false });
}

//끝나는 날과 시작날 사이 날자 계산
function calcuRangeDays(currentObj) {
  let fTime = moment(currentObj["from"]);
  let lTime = moment(currentObj["lastTo"]);
  return lTime.diff(fTime, "days") +1 ;
}

function newColumnHeader(searchRange) {


//  console.log("SRamge",searchRange)

  let columns = [
    {
      dataIndex: "name",
      key: "name",
      width: 200,
      height: 30,
      fixed: "left",
    },
  ];

  let ykey = "";

  for (const key in searchRange) {

    let childrenCompos = [];

    ykey = ykey + key + "~";

    let value = searchRange[key];
    const monthObj = value.mObj;

    for (const mkey in monthObj) {
      let mvalue = monthObj[mkey];

      let el = {
        title: key + "-" + mkey,
        key: mvalue,
        // dataIndex:"colDataArray",
        children: newColumnRender(mvalue),
      };
      childrenCompos.push(el);
    }


    columns.push({
      title: key,
      key: ykey,
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

  let totlaReportMap = chartData["totalReport"];

  let babyReport = totlaReportMap["baby"]
  let roomGradeReport = totlaReportMap["roomGrade"]

  Object.keys(roomGradeReport).reverse().forEach((key)=>{
    let totalReport = roomGradeReport[key]
    data.unshift({
      key:"report",
      name:totalReport.name,
      colDataArray:totalReport.dataList
    })
  })

  data.unshift({
    key:"report",
    name:"신생아",
    colDataArray:babyReport,
  })


    // list.push({
    //   key: e,
    //   roomLevel:wrapper.el.roomLevel,
    //   name: wrapper.el.rgName+","+wrapper.el.roomName,
    //   eventObjList:eventObjList,
    // });


  let TableComponent = React.memo(
    (props) => {
      
//      console.log("render table2",props.columns);

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

      if(e.type==="onClickRightMenu") {
         console.log("onClickRightMenu",e)

          if(e.data.popupView === "1-1") {
            window.location.href = scheduleDetailURL(e.eventObj.no)
            return;
          }
        // setShowPopup(true);
        return;
      }

      if (e.type === "ShowPopup") {
        console.log("ShowPopup",e)
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

//  let chartData = toChartData(props.dataList);

  let groupState = {};
  let listeners = [];

  props.dataList.forEach((value) => {

    if(value.isMove === 1) {

      let groupVals = groupState[value.no];
      if (groupVals === undefined || groupVals === null) {
        groupState[value.no] = [];
      }
    }
  });

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
