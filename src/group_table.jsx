import { Table, Button, Popover, } from "antd";

//import moment from "moment";
import Moment from "moment";
import { extendMoment } from "moment-range";
import newTotalData from "./general_chart_data";
import NewMenu,{MouseRightMenu} from "./components/pmenu/menu_compos";
//import SimpleMenu from './components/pmenu/SampleMenu'
import { v4 as uuidv4 } from 'uuid';


import React from "react";

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

  let nextIndex = i + 1;
  let nextEvent = buildEvent(allEvents, nextIndex);
  if (nextEvent != null) {
    //다음 event 에 startTime 이 지금에 start,end 사이에 있으면
    //중첩 된 것으로 판단하며 to 를 next event 의 to 로 데체한다
    //next 에 nextEvent 를 셋팅한다

    if (isDurationVal(colData, moment(nextEvent.from))) {
      event.to = nextEvent.to;
      event.next = nextEvent;
    }
  }
  return event;
}


function SchedulerItem(props) {

    return <NewMenu 
      style={{
      width: "100%",
      height: "100%",
      backgroundColor: "red",
      borderStyle: "none",
    }}
    text={props.text}
    fReversionTime={props.fReversionTime}
    ></NewMenu>
}


function newGridChart(eventObj, mergeCount) {
  let sfirstTime = eventObj["from"];
  let sfLastTime = eventObj.next.source["to"];

  let seFirstTime = eventObj.next["from"];
  let seLastTime = eventObj.source["to"];

  let fRange = moment(seLastTime).diff(sfirstTime, "days") + 1;
  //    let sRange = moment(sfLastTime).diff(seFirstTime, "days") + 1; //끝점 - 겹치는시작점

  let trRange = moment(sfLastTime).diff(sfirstTime, "days") + 1; //처음시작점과 끝나는 점에서의 최종 날짜 간격

  //  console.log("trRange:"+trRange)

  // let fWidth = ((fRange / trRange) * 100).toFixed(0) + "%";
  // let sMerge = (((trRange - sRange) / trRange) * 100).toFixed(0) + "%";
  //  console.log("fWidth percent:"+fWidth+"  marginLeft:"+sMerge)

  let fWidth = trRange - fRange;
  let ssMerge = moment(seFirstTime).diff(seLastTime, "days") + 1;
  let tfMerge = trRange - (fWidth + ssMerge);

  let fReversionTime = (
    <div>
      <p>{"" + eventObj.from + " ~ " + eventObj.source.to + ""}</p>
    </div>
  );

  let overrideTimeline = (
    <div>
      <p>{"" + eventObj.from + " ~ " + eventObj.source.to + ""}</p>
      <p>{"" + eventObj.next.from + " ~ " + eventObj.next.source.to + ""}</p>
    </div>
  );

  let sfReversionTime = (
    <div>
      <p>{"" + eventObj.next.from + " ~ " + eventObj.next.source.to + ""}</p>
    </div>
  );

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
        <SchedulerItem fReversionTime={fReversionTime} text="1 구간" />
        {/* <Popover content={fReversionTime} title="예약시간">
            <Button
              style={{ width: "100%", height: "100%", backgroundColor: "red",borderStyle:"none" }}
            >
              1 구간
            </Button>
          </Popover> */}
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
        <Popover content={sfReversionTime} title="예약시간">
          <Button
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "green",
              borderStyle: "none",
            }}
          >
            3 구간
          </Button>
        </Popover>
      </div>
    </div>
  );
}


function DefaultSchedulerBar(props) {

  const onClick = (e,data) => {
    console.log("menu on click")
    console.log(e,data)
  }

  return (
    <MouseRightMenu handleClick={onClick} menuId={uuidv4()}>
        <Button type="primary" style={{ width: "100%" }}>
          EventTime-2
        </Button>
      </MouseRightMenu>
  )

  // return (
  //   <SimpleMenu menuId={"sample-id-00000001230000123"}>
  //        <Button type="primary" style={{ width: "100%" }}>
  //          EventTime-2
  //        </Button>
  //   </SimpleMenu>
  // )

  // return (
  //     <SubRightMenu>
  //         <Button type="primary" style={{ width: "100%" }}>
  //           EventTime-2
  //         </Button>
  //     </SubRightMenu>
  // )
}

function choosherRenderFunc(record, dateFormat) {
  let colArray = record["colDataArray"];
  let momentDate = moment(dateFormat);

  for (let i = 0; i < colArray.length; i++) {
    //        let currentObj = colArray[i]
    let eventObj = buildEvent(colArray, i);
    if (isDurationVal(eventObj, momentDate)) {
      let lastTime = moment(eventObj["to"]);
      if (lastTime.isSame(momentDate)) {
        //        console.log("start same event:" + lastTime.format("YYYY-MM-DD"));

        let mergeCount = calcuRangeDays(eventObj);
        if (eventObj.next != null) {
          return {
            children: newGridChart(eventObj, mergeCount),
            props: {
              colSpan: mergeCount,
              rowSpan: 1,
            },
          };
        }

        let reversionTime = (
          <div>
            <p>{"" + eventObj.from + " ~ " + eventObj.to + ""}</p>
          </div>
        );

        let cTag = (
          // <Popover content={reversionTime} title="예약시간">
          //   <Button type="primary" style={{ width: "100%" }}>
          //     EventTime-2
          //   </Button>
          // </Popover>
          <DefaultSchedulerBar></DefaultSchedulerBar>

        );
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

function newMonthColumn(sdate, theKey, startIndex = 1) {
  let mo = moment(sdate);
  let mLen = mo.daysInMonth(); //특정 달에서 가지고 있는 날짜 수량 30， 31, 28 등으로 표현
  //    console.log(mo.daysInMonth())
  //    let startDate = moment(sdate).subtract(sdays, "days")//.format("DD-MM-YYYY");

  //  let monthNumber = mo.month() + 1; //어느 월인지 리턴
  //  console.log("monthNum:"+monthNumber)

  let fMonthData = [];

  for (let i = startIndex; i <= mLen; i++) {
    let calDay = moment();
    calDay.year(mo.year);
    calDay.month(mo.month());
    calDay.date(i);

    let reDate = calDay.format("YYYY-MM-DD");
    let model = {
      title: i,
      width: 35,
      height: 20,
      dataIndex: "colDataArray",
      key: theKey + "-" + i,
      render: function (text, record, index) {
        let recKey = record["key"];
        let sKey = recKey.toString();
//        console.log(sKey);
        //          if(sKey.indexOf("total") > 0) {
        if (
          sKey === "totallReport:0" ||
          sKey === "totallReport:1" ||
          sKey === "totallReport:2"
        ) {
          return newTotalFragment(record, sKey, mo.month(), i);
        }

        return choosherRenderFunc(record, reDate);
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
  let lTime = moment(currentObj["to"]).add(1, "minutes");

  const range = moment.range(fTime, lTime);
  return range.contains(cTime, { exclusive: false });
}

//끝나는 날과 시작날 사이 날자 계산
function calcuRangeDays(currentObj) {
  let fTime = moment(currentObj["from"]);
  let lTime = moment(currentObj["to"]);
  return lTime.diff(fTime, "days") + 1;
}


function newColumnHeader() {
  //    let builderFunc = newColumnRenderBuilder();

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
      children: [
        {
          title: "4월",
          key: "fmonth",
          //          dataIndex:"colDataArray",
          children: newMonthColumn("2021-04-01", "fmonth"),
        },
        {
          title: "5월",
          dataIndex: "companyAddress",
          key: "ffmonth",
          children: newMonthColumn("2021-05-30", 1),
        },
      ],
    },
  ];

  return columns;
}

export default function GroupTable() {
  const data = [];

  data.push({
    key: "totallReport:" + 0,
    name: "Total-" + 0,
    //      apriReport: fDataArray,
    colDataArray: newTotalData(),
  });

  data.push({
    key: "totallReport:" + 1,
    name: "Total-" + 0,
    //      apriReport: fDataArray,
    colDataArray: newTotalData(),
  });

  data.push({
    key: "totallReport:" + 2,
    name: "Total-" + 0,
    //      apriReport: fDataArray,
    colDataArray: newTotalData(),
  });

  // data.push(newTotalData())
  // data.push(newTotalData())

  let fDataArray = [];

  fDataArray.push({
    //19까지 데이터
    key: "0-20210401",
    from: "2021-04-01",
    to: "2021-04-10",
    name: 0 + "앞 data",
  });

  fDataArray.push({
    //19 뒤로 오는거
    key: "0-1-20210407",
    from: "2021-04-7",
    to: "2021-04-18",
    name: 0 + "앞 data",
  });

  fDataArray.push({
    //19 뒤로 오는거
    key: "0-1-20210507",
    from: "2021-04-22",
    to: "2021-05-01",
    name: 0 + "앞 5 data",
  });

  fDataArray.push({
    //19 뒤로 오는거
    key: "0-1-20210507",
    from: "2021-05-7",
    to: "2021-05-15",
    name: 0 + "앞 5 data",
  });

  fDataArray.push({
    //19 뒤로 오는거
    key: "0-1-20210510",
    from: "2021-05-10",
    to: "2021-05-30",
    name: 0 + "앞 5 data",
  });

  data.push({
    key: 0,
    name: "Room-" + 0,
    //      apriReport: fDataArray,
    colDataArray: fDataArray,
  });

  for (let i = 1; i <= 10; i++) {
    let colDataArray = [];

    let colData = {
      //19까지 데이터
      key: "20210401",
      from: "2021-04-01",
      to: "2021-04-10",
      name: i + "앞 data",
    };

    let colData2 = {
      //19 뒤로 오는거
      key: "20210415",
      from: "2021-04-15",
      to: "2021-04-30",
      name: i + "앞 data",
    };

    let colData3 = {
      //19 뒤로 오는거
      key: "20210501",
      from: "2021-05-01",
      to: "2021-05-15",
      name: i + "앞 data",
    };

    let colData4 = {
      //19 뒤로 오는거
      key: "20210501",
      from: "2021-05-17",
      to: "2021-05-27",
      name: i + "앞 data",
    };

    colDataArray.push(colData);
    colDataArray.push(colData2);
    colDataArray.push(colData3);
    colDataArray.push(colData4);

    let obData = {
      key: i,
      name: "Room-" + i,
      //        apriReport: colDataArray,
      //      marthReport:colDataArray,
      colDataArray: colDataArray,
    };

    data.push(obData);
  }

  let columns = newColumnHeader();

  return (
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
    </div>
  );
}

export { GroupTable };
