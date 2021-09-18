import React, { useState, useContext, useEffect, } from "react";
import { Table, Modal, Popover, Select } from "antd";

//import styles  from './ChartView.module.scss'

import Moment from "moment";
import { extendMoment } from "moment-range";
import { newMouseRightMenu } from "../components/pmenu/menu_compos";
import { v4 as uuidv4 } from "uuid";
import {
  ReversionCancelPopup,
  MoveRoomForm,
  YenzangForm,
  UpdateDueDateForm,
  FinaceListView,
  BalanceView,
  RefundForm,
  CancelContractForm,
  ReservationConfirmForm,
  DelteReservationForm,
} from "./chart_view_modal";

import {
  toChartData,
  filterEventObjectList,
  inDurationVal2,
  GantchartContext,
  buildReportDataList,
  ReservStateChecker,
} from "./chart_view_context";

import { ServerEventContext } from "../server_event_context.js";

const moment = extendMoment(Moment);
const { Option } = Select;

function RangeTimelineText(props) {
  let fontColor = props.color === undefined ? "black" : props.color;
  let rtext = props.name;

  if (props.mergeCount > 2) {
    rtext =
      rtext +
      "(" +
      moment(props.from).format("MM-DD") +
      " ~ " +
      moment(props.to).format("MM-DD") +
      ")";
  }

  const eventObj = props.eventObj;

  if (eventObj.subList === undefined || eventObj.subList.length < 1) {
    const str = newStatustext(eventObj.source);
    if (str.length > 0) {
      rtext = rtext + "," + str;
    }
  }

  return (
    <span
      style={{
        // width:"100%",height:"100%",
        // display:"flex",
        // flex:1,
        // backgroundColor:"red",
        textAlign: "center",
        overflow: "hidden",
        color: fontColor,
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      }}
    >
      {rtext}
    </span>
  );
}

//height fix for bug 2021.9.13
function newSchButtonStyle(source, merge = 1) {
  let bgColor = newSchButtonBGColorOfRGB(source);
  let fontColor = newSchButtonFontColor(source);

  if (
    // ReservStateChecker.isPreInDespi(source) ||
    // ReservStateChecker.isCheckInDespi(source)
    ReservStateChecker.isPreInFull(source) ||
    ReservStateChecker.isCheckinFull(source)
  ) {
    return {
      borderStyle: "solid",
      borderWidth: "3px",
      borderColor: `rgb(${bgColor})`,
      borderRadius: "4px",
      textAlign: "center",
      // width:"100%",
      height: "32px",
      display: "flex",
      flex: merge,
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      color: `rgb(${fontColor})`,
    };
  }

  return {
    cursor: "pointer",
    bodyStyle: "solid",
    borderRadius: "4px",
    borderWith: "3px",
    backgroundColor: `rgb(${bgColor})`,
    textAlign: "center",
    color: `rgb(${fontColor})`,
    display: "flex",
    flex: merge,
    height: "32px",
    alignItems: "center",
    justifyContent: "center",
    // minWidth: "31px",
    // width: "100%",
    // height: "100%",
    // padding:"1px",
  };
}

function scheduleDetailURL(no) {
  return "/reservation/view?reservation_no=" + no;
}

function OverrideTimline(dataList) {
  return (
    <div>
      {dataList.map((eventObj) => {
        let bgColor = ReservStateChecker.isNotFullyPaied(eventObj.source)
          ? "red"
          : "black";
        return (
          <div
            style={{
              borderBottom: "0.5px",
              borderStyle: "solid",
              cursor: "pointer",
            }}
          >
            <span
              style={{ textAlign: "center", color: bgColor }}
              onClick={(e) =>
                (window.location.href = scheduleDetailURL(eventObj.no))
              }
            >
              {eventObj.name +
                "," +
                eventObj.from +
                " ~ " +
                eventObj.source.to +
                ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function newOverrideRangeTitle(dataList, ssMerge) {
  if (ssMerge < 2) {
    return "중첩구간";
  } else if (ssMerge < 7) {
    let text;
    for (let i = 0; i < dataList.length; i++) {
      let eventObj = dataList[i];
      if (i > 0) {
        text = text + "," + eventObj.name;
      } else text = eventObj.name;
    }
    return text;
  } else {
    let text;
    for (let i = 0; i < dataList.length; i++) {
      let eventObj = dataList[i];
      if (i > 0) {
        text = text + "," + eventObj.name;
      } else {
        text = eventObj.name;
      }
    }

    let _from = dataList[0].from;
    let _to = dataList[dataList.length - 1].to;
    text =
      text +
      " " +
      moment(_from).format("MM-DD") +
      "~" +
      moment(_to).format("MM-DD");
    return text;
  }
}

function newSchButtonFontColor(sourceObj) {
  //상태 체크가 바뀐듯한데 .. 조금더 체크하자
  if (ReservStateChecker.isPreInFull(sourceObj)) {
    return "74,130,61";
  }
  if (ReservStateChecker.isPreInDespi(sourceObj)) {
    return "102,102,102";
  }

  if (ReservStateChecker.isCheckinFull(sourceObj)) {
    //    return "196,122,204";
    return "196,122,204";
  }
  if (ReservStateChecker.isCheckInDespi(sourceObj)) {
    return "255,255,255";
  }

  return "255,255,255";
}

function newSchButtonBGColorOfRGB(sourceObj) {
  // if(sourceObj.name === "조수진") {
  //   console.log("ZhaoShuZhen",sourceObj)
  // }

  let colorValue = "40,40,40";
  if (ReservStateChecker.isExitRoom(sourceObj)) {
    return "230,230,230";
  } else if (ReservStateChecker.isDrop(sourceObj)) {
    return "255,137,128";
  } else if (ReservStateChecker.isCancel(sourceObj)) {
    //    return "125,125,125";
    return "230,230,230";
  } else if (
    ReservStateChecker.isPreInDespi(sourceObj) ||
    ReservStateChecker.isPreInFull(sourceObj)
  ) {
    return "187,216,108";
  } else if (
    ReservStateChecker.isCheckInDespi(sourceObj) ||
    ReservStateChecker.isCheckinFull(sourceObj)
  ) {
    return "187,131,202";
  }

  console.log("No have color state", sourceObj);
  return colorValue;
}

function newStatustext(sourceObj) {
  if (ReservStateChecker.isPreInDespi(sourceObj)) {
    return "입실예정-잔금미납";
  } else if (ReservStateChecker.isPreInFull(sourceObj)) {
    return "입실예정-잔금완납";
  } else if (ReservStateChecker.isCheckInDespi(sourceObj)) {
    return "입실확정-잔금미납";
  } else if (ReservStateChecker.isCheckinFull(sourceObj)) {
    return "입실확정-잔금완납";
  } else if (ReservStateChecker.isCancel(sourceObj)) {
    return "예약취소";
  } else if (ReservStateChecker.isDrop(sourceObj)) {
    return "계약포기";
  }

  return "퇴실";
}

function OverrideComp(props) {
  return (
    <div style={{ flex: props.width, textAlign: "center", cursor: "pointer" }}>
      <Popover content={props.content} title="중첩구간" trigger="click">
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#c6a38b",
            borderStyle: "solid",
            borderRadius: "4px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ textAlign: "center" }}>{props.title}</span>
        </div>
      </Popover>
    </div>
  );
}

//중첩구간에대한 View 생성함수
function gridChartCompRender(eventObj, mergeCount) {
  //처음 바차트
  let midNode = eventObj["midNode"];
  let lastNode = eventObj["lastNode"];

  let sfirstTime = eventObj["from"];
  let endLastTime = midNode["from"];

  let fRange = moment(endLastTime).diff(sfirstTime, "days") + 1;

  //중첩구간 중첩구간
  // (처음시간에 toDate - 두번째시간에 fromDate)
  let seFirstTime = midNode["from"];
  let seLastTime = midNode["to"];

  //처음시작점과 끝나는 점에서의 최종 날짜 간격
  let srRange = moment(seLastTime).diff(seFirstTime, "days");

  let fWidth = mergeCount * (fRange / mergeCount);
  let ssMerge = mergeCount * (srRange / mergeCount);

  //앞에두개에서 나믄 부분이 세번째 바에길이
  let trLen = mergeCount - (fWidth + ssMerge);

  let overTimeArray = [];

  overTimeArray.push(eventObj);

  eventObj.subList.forEach((e) => {
    overTimeArray.push(e);
  });

  let overrideTimeline = OverrideTimline(overTimeArray);
  let overrideTimeTitle = newOverrideRangeTitle(overTimeArray, srRange);

  // if(8029 === eventObj.no) {
  //   console.log("EventObj",eventObj)
  // }

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        flexDirection: "row",
        // justifyContent:"center"
      }}
    >
      <div style={newSchButtonStyle(eventObj.source, fWidth)}>
        <SchedulerBarButton
          buttonStyle={{ width: "100%", height: "100%", cursor: "pointer" }}
          mergeCount={fWidth}
          colData={eventObj}
        />
      </div>
      <OverrideComp
        width={ssMerge}
        title={overrideTimeTitle}
        content={overrideTimeline}
      />
      {/* <div style={{ flex: ssMerge,textAlign:"center"}}>
        <Popover content={overrideTimeline} title="중첩구간">
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#c6a38b",
              borderStyle: "solid",
              borderRadius: "4px",
              color: "white",
              display:"flex",
              alignItems:"center",
              justifyContent:"center",
            }}
          >
            <span style={{textAlign:"center"}}>{overrideTimeTitle}</span>
          </div>
        </Popover>
      </div> */}
      <div style={newSchButtonStyle(lastNode.source, trLen)}>
        <SchedulerBarButton mergeCount={1} colData={lastNode} />
      </div>
    </div>
  );
}

const MouseRightMenuFunc = (function () {
  const _Right_Popup_fArray = [
    { text: "상세보기", key: "1", data: { popupView: "1-1" } },
    {
      text: "객실이동",
      key: "2",
      data: {
        popupView: "1-2",
        title: "객실이동",
        size: { width: 530, height: "auto" },
      },
    },
    {
      text: "기간연장",
      key: "3",
      data: {
        popupView: "1-3",
        title: "기간연장",
        size: { width: 610, height: "auto" },
      },
    },
    {
      text: "퇴실확정",
      key: "4",
      data: {
        popupView: "1-4",
        title: "퇴실확정",
        size: { width: 610, height: "auto" },
      },
    },
    {
      text: "계약일수정",
      key: "5",
      data: {
        popupView: "1-5",
        title: "계약일수정",
        size: { width: 530, height: "auto" },
      },
    },
    {
      text: "입실확정",
      key: "6",
      data: {
        popupView: "1-6",
        title: "입실확정",
        size: { width: 800, height: "auto" },
      },
    },
  ];

  const _Right_Popup_sArray = [
    {
      key: "7",
      text: "결제내역",
      data: {
        popupView: "2-1",
        title: "결제내역",
        size: { width: 800, height: "auto" },
      },
    },
    {
      key: "8",
      text: "잔금결제",
      data: {
        popupView: "2-2",
        title: "잔금결제",
        size: { width: 700, height: "auto" },
      },
    },
  ];

  const _Right_Popup_tArray = [
    {
      key: "9",
      text: "환불",
      data: {
        popupView: "3-1",
        title: "환불",
        size: { width: 610, height: "auto" },
      },
    },
    {
      key: "10",
      text: "예약삭제",
      data: {
        popupView: "3-2",
        title: "예약삭제",
        size: { width: 610, height: "auto" },
      },
    },
    {
      key: "11",
      text: "예약취소",
      data: {
        popupView: "3-3",
        title: "예약취소",
        size: { width: 610, height: "auto" },
      },
    },
    {
      key: "12",
      text: "계약포기",
      data: {
        popupView: "3-4",
        title: "계약포기",
        size: { width: 530, height: "auto" },
      },
    },
  ];

  let fMouseArray = {
    f: ["1", "2", "3", "4", "5"],
    s: ["7", "8"],
    t: ["9", "10"],
  };
  let sMouseArray = {
    f: ["1", "5", "6"],
    s: ["7", "8"],
    t: ["11", "12", "10"],
  };
  //  let tMouseArray = { f: ["1", "5"], s: ["7", "8"], t: ["10"] };
  let tMouseArray = { f: ["1", "5"], s: ["7", "8"], t: ["10"] };

  const filterFunc = (tList) => {
    return (e) => {
      for (let i = 0; i < tList.length; i++) {
        const fEle = tList[i];
        if (fEle === e.key) {
          return true;
        }
      }
      return false;
    };
  };

  const fComp = newMouseRightMenu(
    _Right_Popup_fArray.filter(filterFunc(fMouseArray.f)),
    _Right_Popup_sArray.filter(filterFunc(fMouseArray.s)),
    _Right_Popup_tArray.filter(filterFunc(fMouseArray.t))
  );

  const sComp = newMouseRightMenu(
    _Right_Popup_fArray.filter(filterFunc(sMouseArray.f)),
    _Right_Popup_sArray.filter(filterFunc(sMouseArray.s)),
    _Right_Popup_tArray.filter(filterFunc(sMouseArray.t))
  );

  const tComp = newMouseRightMenu(
    _Right_Popup_fArray.filter(filterFunc(tMouseArray.f)),
    _Right_Popup_sArray.filter(filterFunc(tMouseArray.s)),
    _Right_Popup_tArray.filter(filterFunc(tMouseArray.t))
  );

  return function (source) {

    if(ReservStateChecker.isCheckinFull(source)
      || ReservStateChecker.isCheckInDespi(source)) {

        return fComp;
    }

    if (ReservStateChecker.isPreInDespi(source)
        || ReservStateChecker.isPreInFull(source)) {
      return sComp;
    }

    //    console.log("source",source)
    return tComp;
  };
})();

function SchedulerBarButton(props) {
  const { eventDispach } = useContext(GantchartContext);

 // const { groupState } = useContext(GantchartContext);
//  const [bcState, updateBgColor] = useState("green");
  const eventObj = props.colData;
  let dataSource = props.colData.source;
//  let isGroupping = dataSource.isMove === 1; //이동했는 여부

  //잠시 안 사용함
  /*
  useEffect(() => {
    if (isGroupping) {
      //이동흔적이 있으면
      //예약이동시 처리 부분
      let groupStateVal = groupState[dataSource.no]; //no 는 똑같은 값이므로 이걸로 group key 표시
      if (groupStateVal !== undefined && groupStateVal !== null) {
        const bgStateDisapcher = (e) => {
          updateBgColor(e.bgColor);
        };
        groupStateVal.push(bgStateDisapcher);
      }
    }
  }, [groupState, dataSource, isGroupping]);

  let mouseOverEventHandler = (e) => {
    //        console.log("reset bgcolor red")
    if (isGroupping) {
      //      updateBgColor("red");
      let groupStateVal = groupState[props.colData.source.no]; //no 같은 값이므로 group key 표시
      if (groupStateVal !== undefined) {
        groupStateVal.forEach((fallback) => {
          fallback({ bgColor: "yellow" });
        });
      }
    }
  };

  let mouseOutEventHandler = (e) => {
    if (isGroupping) {
      let groupStateVal = groupState[props.colData.source.no]; //no 는 똑같은 값이므로 이걸로 group key 표시
      groupStateVal.forEach((fallback) => {
        fallback({ bgColor: "green" });
      });
    }
  };
  */

  //    const buttonStyle = newSchButtonStyle(props.colData.source,props.fWidth);
  // let bgColor = newSchButtonBGColorOfRGB(props.colData.source);
  let fontColor = newSchButtonFontColor(props.colData.source);
  const MouseRightMenuComp = MouseRightMenuFunc(dataSource);

  // if (props.colData.no === 7927) {
  //   console.log("ColData", props.colData);
  // }

  return (
    <MouseRightMenuComp
      handleClick={(e, d) => {
        eventDispach({
          type: "onClickRightMenu",
          data: d,
          eventObj: props.colData,
        });
      }}
      menuId={uuidv4()}
    >
      <div
        style={props.buttonStyle}
        // onMouseOver={mouseOverEventHandler}
        // onMouseOut={mouseOutEventHandler}
      >
        {/* {props.children} */}
        <RangeTimelineText
          color={fontColor}
          eventObj={eventObj}
          mergeCount={props.mergeCount}
          name={eventObj.name}
          from={eventObj.from}
          to={eventObj.source.to}
        />
      </div>

      {/* </div> */}
    </MouseRightMenuComp>
  );
}

function tableColumnRender(record, currentDayFormate) {
  let eventObjectList = record["eventObjList"];

  let currentDay = moment(currentDayFormate);

  let currentEventObj = null;
  for (let i = 0; i < eventObjectList.length; i++) {
    let eventObj = eventObjectList[i];
    if (isDurationVal(eventObj, currentDay)) {
      currentEventObj = eventObj;
      break;
    }
  }

  if (currentEventObj != null) {
    let lastTime = moment(currentEventObj["lastTo"]);
    if (lastTime.isSame(currentDay)) {
      let mergeCount = calcuRangeDays(currentEventObj);
      if (currentEventObj.isTouch) {
        //next 에는 포함이되여있지않고 하지만 다음에 오는것이 접전이라면
        //merge 를 그전칸으로 쫇힌다
        mergeCount = mergeCount - 0.01;
      }

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
        children: (
          <DefaultSchedulerLine
            eventObj={currentEventObj}
            mergeCount={mergeCount}
          />
        ),
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

  return {
    children: "",
    props: {
      colSpan: 1,
      rowSpan: 1,
    },
  };
}

function newTotalFragment(record, date) {
  let colDataArray = record["colDataArray"];
  let dataOfMonth = colDataArray[date];
  if (dataOfMonth !== undefined) {
    if (record["rtype"] !== undefined) {
      const roomSize = record["roomSize"];
      dataOfMonth = roomSize - dataOfMonth;
      dataOfMonth = dataOfMonth <= 0 ? 0 : dataOfMonth; //중첩구간으로 마이너스가 나오는경우는 0으로 처리
    }

    return (
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#e9edcc",
          borderStyle: "solid",
          borderColor: "#b5b5b5",
          borderRadius: "4px",
          borderWidth: "1px",
          color: "black",
          // marginLeft:"1px",
          // marginRight:"1px",
          // top:"-4px",
          // left:"4px",
          // width:"30px",
          // height:"30px",
        }}
      >
        {/* <span style={{ textAlign: "center" }}>{dataOfMonth}</span> */}
        {dataOfMonth}
      </div>
    );
  }
}

function DefaultSchedulerLine(props) {
  let eventObj = props.eventObj;
  const bStyle = newSchButtonStyle(eventObj.source);

  return (
    // <div style={bStyle}>
    //   <SchedulerBarButton colData={props.eventObj} mergeCount={props.mergeCount}/>
    // </div>
    <SchedulerBarButton
      buttonStyle={bStyle}
      colData={props.eventObj}
      mergeCount={props.mergeCount}
    />
  );
}

const weeklyMap = {
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
  0: "일",
};

// const isFamilyDay = (day) => day === 6 || day === 0

const weeklyTextTag = (day, text) => {
  switch (day) {
    case 6:
      return <span style={{ color: "blue", textAlign: "center" }}>{text}</span>;
    case 0:
      return <span style={{ color: "red", textAlign: "center" }}>{text}</span>;
    default:
      return <span style={{ textAlign: "center" }}>{text}</span>;
  }
};

function newColumnRender(sdate, start, end) {
  let mo = moment(sdate);
  //  let mLen = mo.daysInMonth(); //특정 달에서 가지고 있는 날짜 수량 30， 31, 28 등으로 표현
  let fMonthData = [];

  for (let i = start; i <= end; i++) {
    let calDay = moment();
    calDay.year(mo.year());
    calDay.month(mo.month());
    calDay.date(i);

    const titleText = i <= 9 ? "0" + i : i;
    const cDay = calDay.day();
    // const titleText = ""+i ;
    const weeklyText = weeklyMap[cDay];

    let bgColor = "";
    if (moment().isSame(calDay)) {
      bgColor = "#fff5e1";
    }

    const titleTag = (
      <div
        // id={"id-dhl" + i}
        // className="fn-label iw-mTrigger"
        style={{
          backgroundColor: bgColor,
          textAlign: "center",
        }}
      >
        {weeklyTextTag(cDay, titleText)}
        <br />
        {weeklyTextTag(cDay, weeklyText)}
      </div>
    );

    //이부분에 넓이도 x 축 scrol에 영향을 준다 x축에 차지않게 그릴려고하며
    let model = {
      title: titleTag,
      width: 40,
      height: 15,
      className: "header-style",
      dataIndex: "eventObjList",
      key: sdate + "-" + i,
      render: function (text, record, index) {
        if (record["key"].startsWith("report")) {
          return newTotalFragment(record, calDay.format("YYYY-MM-DD"));
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
  return range.contains(cTime, { exclusive: false });
}

//끝나는 날과 시작날 사이 날자 계산
function calcuRangeDays(currentObj) {
  let fTime = moment(currentObj["from"]);
  let lTime = moment(currentObj["lastTo"]);
  return lTime.diff(fTime, "days") + 1;
}

function newColumnHeader(stObj, fallback) {
  // const sDate = moment(stObj.sDate)//.subtract(1, "days");
  // //월 header 부분에서 10월1까지만 오면 다음라인으로 바꾸어지는 현상을 막기위해서
  // const eDate = moment(stObj.eDate).add(1,"day");

  const sDate = stObj.sDate;
  const eDate = stObj.eDate;

  let dateStart = sDate.clone();
  let dateEnd = eDate.clone();

  let yearObj = {};
  yearObj[dateStart.year()] = [];

  while (dateEnd > dateStart || dateStart.format("M") === dateEnd.format("M")) {
    let curYearOfMonth = yearObj[dateStart.year()];

    if (curYearOfMonth === undefined) {
      //새로운 년도로 넘어가면 값이없을거며 새로 추가해줘야한다
      curYearOfMonth = [];
      let newYear = dateStart.year();
      yearObj[newYear] = curYearOfMonth;
    }

    curYearOfMonth.push({
      mKey: dateStart.format("M"),
      mObj: dateStart.format("YYYY-MM"),
    });
    dateStart.add(1, "month");
  }

  const sDateStr = sDate.format("YYYY-MM");
  const eDateStr = eDate.format("YYYY-MM");
  const today = moment();
  let columns = [
    {
      dataIndex: "name",
      key: "name",
      width: 200,
      height: 15,
      className: "sum-header", //세라인과 table x 설정이 충돌이 난다 조심해서 사용
      title: () => {
        return (
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="정렬"
            onChange={(v) => {
              fallback(v);
            }}
          >
            <Option value="1">호실명</Option>
            <Option value="0">등급</Option>
          </Select>
        );
      },
      fixed: "left",
      render: function (text, record, index) {
        if (index === 1 || index === 2) {
          let roomSplit = text.split(",");
          let countTextArray = roomSplit[1].split(":");
          return (
            <div
              style={{
                display: "flex",
                flex: 1,
                fontSize: "15px",
              }}
            >
              <span style={{ width: "50%", textAlign: "left" }}>
                {roomSplit[0]}
              </span>
              <div style={{ display: "flex", flex: 1 }}>
                <span>{countTextArray[0]}</span>
                <span>:</span>
                <span>{countTextArray[1]}</span>
              </div>
            </div>
          );
        }

        if (index > 2) {
          let rData = record.eventObjList;

          let dR = filterEventObjectList(rData, (e) => {
            const state =
              inDurationVal2(e.from, e.to, today) &&
              ReservStateChecker.isConfirmCheckin(e.source);
            if (state) {
              return true;
            }
            return false;
          });

          let roomSplit = text.split(",");
          return (
            <div
              style={{
                display: "flex",
                flex: 1,
                fontSize: "15px",
              }}
            >
              <span style={{ width: "50%", textAlign: "left" }}>
                {roomSplit[0]}
              </span>
              <div style={{ display: "flex", flex: 1 }}>
                <span> {roomSplit[1]}</span>
                <span
                  style={{
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    width: "60px",
                  }}
                >
                  {dR !== null && "[" + dR.name + "]"}
                </span>
              </div>
            </div>
          );
        }

        return text;
      },
    },
  ];

  let ykey = "";

  for (const key in yearObj) {
    //    let childrenCompos = [];

    ykey = ykey + key + "~";

    let value = yearObj[key];
    for (let i = 0; i < value.length; i++) {
      const monthObj = value[i];
      const mkey = monthObj.mKey;
      const mvalue = monthObj.mObj;

      let startIndex = 1;
      let endIndex = moment(mvalue).daysInMonth();

      if (mvalue === sDateStr) {
        startIndex = sDate.date();
        endIndex = sDate.daysInMonth();
      }

      if (mvalue === eDateStr) {
        startIndex = 1;
        endIndex = eDate.date();
      }

      // const monthTag = <div style={{height:"100%",textAlign:"center",display:"flex",flex:1}}>{key + "-" + mkey}</div>
      const monthTag = (
        <div style={{ textAlign: "center" }}>{key + "-" + mkey}</div>
      );

      let el = {
        title: monthTag,
        key: mvalue,
        with: 100,
        height: 16,
        // className:'column-header-white',
        children: newColumnRender(mvalue, startIndex, endIndex),
      };
      columns.push(el);
    }
  }

  return columns;
}

function newViewEventObserver(listener) {
  return function (e) {
    listener.forEach((fallback) => {
      fallback(e);
    });
  };
}

//통계데이터를 room별로 바꾸는 함수
function buildTableDataList(roomList, eventObjList) {
  let selector = (roomNo) => {
    for (let i = 0; i < eventObjList.length; i++) {
      const eventObjWrapper = eventObjList[i];
      if (eventObjWrapper.roomNo === roomNo) {
        return eventObjWrapper;
      }
    }
    return null;
  };

  let eList = [];

  for (let i = 0; i < roomList.length; i++) {
    let room = roomList[i];
    let eventObjWarraper = selector(room.no);

    const key = room.gradeName + "-" + room.name;
    const columnName = room.gradeName + "," + room.name;
    // const eventList =
    //   eventObjWarraper == null ? [] : eventObjWarraper.eventObjList;
    const eventList =
      eventObjWarraper == null ? [] : eventObjWarraper.eventObjList;

    eList.push({
      key: key,
      name: columnName,
      roomLevel: room.level,
      eventObjList: eventList,
    });
  }
  return eList;
}

const roomLevelGroupBy = function (roomList) {
  //  console.log("RoomList",roomList)

  let obj = {};
  for (let i = 0; i < roomList.length; i++) {
    const room = roomList[i];
    const key = room["gradeNo"];
    let roomLevel = obj[key];
    if (roomLevel === undefined) {
      roomLevel = {
        name: room["gradeName"],
        roomList: [],
      };
      obj[key] = roomLevel;
    }
    roomLevel["roomList"].push(room);
  }
  return obj;
};

/**
 * @param {date|moment} start The start date
 * @param {date|moment} end The end date
 * @param {string} type The range type. eg: 'days', 'hours' etc
 */
function getRange(startDate, endDate, type) {
  let fromDate = moment(startDate);
  let toDate = moment(endDate);
  let diff = toDate.diff(fromDate, type);
  let range = [];
  for (let i = 0; i < diff; i++) {
    range.push(moment(startDate).add(i, type));
  }
  return range;
}

function buildReportData(dataList, roomList, stObj, query) {
  //  console.log("QueryObjc", query);

  if (query !== undefined && query !== null && query.type === "range") {
    // let from = moment(query.condition["from"]);
    // let to = moment(query.condition["to"]);

    //Logic for getting rest of the dates between two dates("FromDate" to "EndDate")
    

    return (data) => {


      let colDate = newReportDateRange(stObj)

      let totalReportMap = buildReportDataList(dataList, colDate);
      let babyReport = totalReportMap["baby"];
      let roomGradeReport = totalReportMap["roomGrade"];
      const roomLevelGroup = roomLevelGroupBy(roomList);
  
      const resBabyCount = {};
  
      colDate.forEach((e) => {
        const babyCount = babyReport[e];
        resBabyCount[e] = babyCount === undefined ? 0 : babyCount;
      });


      const pData = [].concat(data);
      //      console.log("RoomLevelGroup",roomLevelGroup)

      Object.keys(roomLevelGroup)
        .reverse()
        .forEach((key, i) => {
          const roomGroupInfo = roomLevelGroup[key];
          const roomLeng = roomGroupInfo.roomList.length;
          const name = roomGroupInfo.name + ",총객실수:" + roomLeng;

          let totalReport = roomGradeReport[key];
          let reportDataList = [];

          if (totalReport !== undefined && totalReport !== null) {
            reportDataList = totalReport.dataList;
          }

          let colDataArray = {};
          colDate.forEach((me) => {
            const dateStrVal = reportDataList[me];
            //그날에 데이터를 못찾으면 전체 룸 개수로한다 
            colDataArray[me] = dateStrVal === undefined ? roomLeng : dateStrVal;
          });

          pData.unshift({
            key: "report" + i,
            rtype: "room",
            roomNo:key,
            roomName:roomGroupInfo.name,
            roomSize: roomLeng,
            name: name,
            colDataArray: colDataArray,
          });
        });

      pData.unshift({
        key: "report",
        name: "신생아",
        colDataArray: resBabyCount,
        render: (text, record) => {
          return <div>header{record}</div>;
        },
      });

      return pData;
    };
  }

  return (data) => {
    return data;
  };
}



//Table Header 날짜를 만드는  from - to 구간을 만드는 함수 
function newSearchDateRange(stObj,query) {

  let eDate = moment(stObj.eDate);

  let qeDate = moment(query.param.to);
  if(qeDate.isAfter(eDate)) {
    eDate = qeDate;
  }

  let sDate = moment(stObj.sDate);
  //월 header 부분에서 10월1까지만 오면 다음라인으로 바꾸어지는 현상을 막기위해서
  let qsDate = moment(query.param.from)
  if(qsDate.isBefore(sDate)){
    sDate = qsDate;
  }
  if (eDate.day() === 1) {
    eDate = eDate.add(1, "day");
  }
  return  {
    sDate: sDate,
    eDate: eDate,
  };
}

function newReportDateRange(stObj) {
  let from = stObj.sDate;
  //getRange에서 마지막날을 포함하지 않으므로 하루를 더 추가해서 date를 만든다
  let to = moment(stObj.eDate).add(1, "day").format("YYYY-MM-DD");
  //Logic for getting rest of the dates between two dates("FromDate" to "EndDate")
  return getRange(from, to, "days").map((e) => {
    return e.format("YYYY-MM-DD");
  });
}

const roomNumberSortFunc = (a, b) => {
  //level이 작은것을 앞으로
  // if(a.level !== b.level) {
  //   return a.level - b.level;
  // }

  //호실이름 202호 에서 202만가져와서 비교
  let aname = a.name;
  let bname = b.name;
  let aroomNum = aname.substring(0, aname.length - 1);
  let broomNum = bname.substring(0, bname.length - 1);
  return aroomNum - broomNum;
};

function ChartTableView(props) {
  const roomList = props.roomList;
  let chartData = toChartData(props.dataList);
  const query = props.query;

//  console.log("query",query)

  const [dataSource, chartUpdater] = useState([]);

  const stObj = newSearchDateRange(chartData.stObj,query)
  
  const reportColumnFunc = buildReportData(
    chartData.list,
    roomList,
    stObj,
    query
  );
//  console.log("Update",dataSource)

  // useEffect(()=>{
  //   console.log("update",dataSource.length)
  //   let co = buildTableDataList(roomList, chartData.list);
  //   chartUpdater(co)
  // },[props.dataList.length])


  let columns = newColumnHeader(stObj, (type) => {
    if (type === "1") {
      const newRoomList = [].concat(roomList);
      newRoomList.sort(roomNumberSortFunc);
      const resList = buildTableDataList(newRoomList, chartData.list);
      let data = reportColumnFunc(resList);
      chartUpdater(data)
//      chartUpdater(resList);
    } else {
      const resList = buildTableDataList(roomList, chartData.list);
      let data = reportColumnFunc(resList);
      chartUpdater(data)
//      chartUpdater(resList);
    }
  });


  useEffect(()=> {


    // console.log("update",dataSource.length)


    let co = buildTableDataList(roomList, chartData.list);
    let data = reportColumnFunc(co);
    chartUpdater(data)

    if (query !== undefined 
          && query !== null 
          && query.type === "range"
          ) { 
          
    // console.log("update table 2")


      return () => {
        const rList = data.filter((re)=>{
          return re.rtype !== undefined && re.rtype === "room"
        })
        props.dispach({
          type:"TotalDataList",
          dataList:rList
        })
      }
    }
  },[props.dataList])


  console.log("Start render table",dataSource.length)

  return (
    <Table
      rowKey="data-table"
      scroll={{ y: 700 }}
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={false}
      size="small"
    />
  );
}

const closeSvg = (
  <div style={{ width: "100%", height: "100%" }}>
    <svg
      t="1630420386684"
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2421"
      width="15"
      height="15"
    >
      <path
        d="M595.549 512.5l344.35-344.347c23.211-23.212 23.211-60.84 0-84.053-23.212-23.208-60.841-23.208-84.05 0L511.5 428.45 171.802 88.753c-22.932-22.935-60.116-22.935-83.048 0-22.935 22.933-22.935 60.117 0 83.05L428.45 511.5 84.101 855.849c-23.211 23.21-23.211 60.84 0 84.049 23.212 23.211 60.841 23.211 84.05 0l344.35-344.35 338.822 338.823c22.933 22.935 60.116 22.935 83.048 0 22.935-22.933 22.935-60.117 0-83.048L595.549 512.5z"
        p-id="2422"
      ></path>
    </svg>
  </div>
);

//---------------------------------------------- popup context --------------------------------------------------

const defaultObj = {
  pageIndex: "0-0",
  title: "Popup",
  reload: 0,
  size: { width: 700, height: 500 },
};

const MessageTag = "메시지";
const SuccessMessageText = "성공적으로 완료되였습니다";
const ErrorMessageText = "오류가 발생 했습니다";

function newInPopupView(listeners, emitHttpEvent, parentDispach) {
  return function (props) {
    //parent 에서 공유 state 를 사용하면 팝업이뜰때마다 전체가 다시 랜들링이 되기때문에
    //이건 내부에 state 를 가지고가야한다
    let [showPopupState, setShowPopup] = useState(defaultObj);
    //    const [confirmLoading, setConfirmLoading] = React.useState(false);

    if (showPopupState.reload === 1) {
      parentDispach({ type: "Reload" });
      return <div>Reloading.....</div>;
    }

    listeners.push(function (e) {
      if (e.type === "onClickRightMenu") {
        if (e.data.popupView === "1-1") {
          window.location.href = scheduleDetailURL(e.eventObj.no);
          return;
        } else {

//          console.log("Event", e);
          setShowPopup({
            pageIndex: e.data.popupView,
            title: e.data.title,
            eventObj: e.eventObj,
            size: e.data.size,
          });
          return;
        }
      }

      if (e.type === "ClosePopup") {
        setShowPopup(defaultObj);
        return;
      }
    });

    const eventUpdate = function (sEvent) {
      if (sEvent.type !== "Cancel") {
        // console.log("event", sEvent);
        let respo = emitHttpEvent(sEvent);

        respo.subscribe(
          (next) => {
            Modal.info({
              title: MessageTag,
              content: (
                <div>
                  <p>{SuccessMessageText}</p>
                </div>
              ),
              onOk() {
                setShowPopup({
                  ...defaultObj,
                  reload: 1,
                });
              },
            });
          },
          (error) => {
            //            console.log(error)
            Modal.error({
              title: MessageTag,
              content: (
                <div>
                  <p>{ErrorMessageText}</p>
                </div>
              ),
            });
          }
        );
      } else {
        //        console.log("cancel popup");
        setShowPopup(defaultObj);
      }
    };

    //    const roomDataMap = groupBy(props.roomList,"level")
    const roomDataMap = roomLevelGroupBy(props.roomList);

    return (
      <Modal
        width={showPopupState.size.width}
        heigt={showPopupState.size.heigt}
        bodyStyle={{ padding: 0, overflow: "hidden" }}
        title={showPopupState.title}
        visible={showPopupState.pageIndex !== defaultObj.pageIndex}
        onOk={(e2) => {
          setShowPopup(defaultObj);
        }}
        onCancel={(e) => {
          setShowPopup(defaultObj);
        }}
        okButtonProps={{ disabled: true, visible: false }}
        cancelButtonProps={{ disabled: true, visible: false }}
        footer={null}
        destroyOnClose
        closeIcon={closeSvg}
      >
        <SubViewComponent
          pageIndex={showPopupState.pageIndex}
          eventObj={showPopupState.eventObj}
          roomList={props.roomList}
          dispach={eventUpdate}
          loadData={emitHttpEvent}
          roomMap={roomDataMap}
        />

        {/* </PopupView> */}
      </Modal>
    );
  };
}

function SubViewComponent(props) {
  //  console.log("Popup props:",props)

  if ("1-2" === props.pageIndex) {
    return (
      <MoveRoomForm
        {...props}
        // loadData={emitHttpEvent}
        // roomMap={roomDataMap}
      />
    );
  }

  if ("1-3" === props.pageIndex) {
    return <YenzangForm {...props} />;
  }

  if ("1-4" === props.pageIndex) {
    return <ReversionCancelPopup {...props} />;
  }

  if ("1-5" === props.pageIndex) {
    return <UpdateDueDateForm {...props} />;
  }

  if ("1-6" === props.pageIndex) {
    return <ReservationConfirmForm {...props} />;
  }

  if ("2-1" === props.pageIndex) {
    return <FinaceListView {...props} />;
  }
  if ("2-2" === props.pageIndex) {
    return <BalanceView {...props} />;
  }

  if ("3-1" === props.pageIndex) {
    return <RefundForm {...props} type={2} />;
  }

  if ("3-3" === props.pageIndex) {
    return <RefundForm {...props} type={3} />;
  }

  if ("3-2" === props.pageIndex) {
    return <DelteReservationForm {...props} />;
  }

  if ("3-4" === props.pageIndex) {
    return <CancelContractForm {...props} />;
  }

  return <div>error.....</div>;
}

export default function GroupTable(props) {
//  console.log("Query",props.query)
  // console.log("DataList",props.dataList)

  let { serverEventEmmiter } = useContext(ServerEventContext);

  let groupState = {};
  let listeners = [];

  props.dataList.forEach((value) => {
    if (value.isMove === 1) {
      let groupVals = groupState[value.no];
      if (groupVals === undefined || groupVals === null) {
        groupState[value.no] = [];
      }
    }
  });

  const parentDispach = (e) => {
    if (e.type === "Reload") {
      const newEvent = {
        type: "LoadReservationList",
        request: props.query,
      };
      props.dispach(newEvent);
      return       
    }

    props.dispach(e)
  };

  let InPopupView = newInPopupView(
    listeners,
    serverEventEmmiter,
    parentDispach
  );
  let eventDispach = newViewEventObserver(listeners);

  return (
    <GantchartContext.Provider value={{ eventDispach, groupState, listeners }}>
      <div style={{ padding: 10 }}>
        <ChartTableView
          dispach={parentDispach}
          dataList={props.dataList}
          roomList={props.roomList}
          query={props.query}
        />
        {/* <div style={{height:"50px",backgroundColor:"`rgb(245,245,245)`"}}></div> */}
        <InPopupView roomList={props.roomList}>
          <SubViewComponent />
        </InPopupView>
      </div>
    </GantchartContext.Provider>
  );
}

export { GroupTable };
