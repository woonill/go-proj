import React, { useState, useEffect, useContext } from "react";

import { Button, DatePicker, Menu, Select, Input, Dropdown,Empty,Spin,Alert } from "antd";

import style from "./ChartView.module.scss";

import {
  ReservStateChecker,
  rangeOfDates,
  isValidSourceCountReport,
} from "./chart_view_context";
import { ServerEventContext } from "../server_event_context.js";

import { ActionButtonGroupView } from "./chart_view_modal";

import moment from "moment";
import { ChartDataView } from "./table_data";
import { GroupTable } from "./group_table";
import { SearchOutlined } from "@ant-design/icons";
import { Modal } from "antd";

//import { of } from "rxjs";
const { Option } = Select;

const { RangePicker } = DatePicker;

function SearchConditionChoosherView(props) {
  let rangeView = (
    <RangePicker
      defaultValue={props.dateRange}
      format={props.dateFormat}
      //   value={hackValue || value}
      //   disabledDate={disabledDate}
      onCalendarChange={(val) => {
        //console.log("range date",val)
        props.setValue(val);
      }}
      //onChange={val => console.log("change date",val)}
      //onOpenChange={onOpenChange}
    />
  );

  switch (props.selectedValue) {
    case "0":
      return rangeView;
    case "1":
      return (
        <Input
          placeholder="산모이름"
          style={{ marginLeft: 1, width: 255 }}
          onChange={props.setValue}
        />
      );
    case "2":
      return (
        <Input
          placeholder="산모주소"
          style={{ marginLeft: 1, width: 255 }}
          onChange={props.setValue}
        />
      );

    case "3":
      return (
        <Input
          placeholder="보호자이름"
          style={{ marginLeft: 1, width: 255 }}
          onChange={props.setValue}
        />
      );

    case "4":
      return (
        <Input
          placeholder="YYYY-MM-DD"
          style={{ marginLeft: 1, width: 255 }}
          onChange={props.setValue}
        />
      );

    default:
      return rangeView;
  }
}

//상위 검색조건 선택뷰
function HeaderView(props) {
  let [selectedValue, setSelectValue] = useState("0");

  let dateFormat = "YYYY-MM-DD";
  let [dateRangeVals, updateDateRange] = useState(() => {
    let cDate = defaultSearchDateOfRange();
    let startDate = cDate.sDate;
    let endDate = cDate.eDate;
    return [startDate, endDate];
  });

  let handleSelectChange = (item) => {
    setSelectValue(item);
  };

  let textVal;

  function updateVal(c) {
    if (selectedValue === "0") {
      //date range 로 처리  [moment,moment]  array 로 온다
      updateDateRange(c);
    } else {
      c.preventDefault();
      textVal = c.target.value;
    }
  }

  function searchReservations(event) {
    let params = {};
    let searchType;

    if (selectedValue === "0") {
      let startDate = dateRangeVals[0].format("YYYY-MM-DD");
      let endDate = dateRangeVals[1].format("YYYY-MM-DD");

      searchType = "range";
      params["from"] = startDate;
      params["to"] = endDate;
    } else if (selectedValue === "1") {
      params["uname"] = textVal;
    } else if (selectedValue === "2") {
      params["uaddr"] = textVal;
    } else if (selectedValue === "3") {
      params["pname"] = textVal;
    } else if (selectedValue === "4") {
      params["due-data"] = textVal;
    } else {
      props.eventObserver({
        type: "ShowErrorMessage",
        errorMessage: "no specfic of condition type:" + selectedValue,
      });
      return;
    }

  //   props.emitHttpEvent({
  //     type: "FetchTableDataList",
  //     params: params,
  //     resultHandler: function (data) {
  //       const sParam = {
  //         type: searchType,
  //         condition: params,
  //       };
  //       props.eventObserver({
  //         type: "OnLoadCompletedResList",
  //         data: data,
  //         eParam: sParam,
  //       });
  //     },
  //   });

  const reqEvent =  {
    type:searchType,
    param:params
  }


    props.emitHttpEvent({
      type: "LoadReservationList",
      request: reqEvent,
    })
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        padding: 10,
        // borderBottom: "1px solid #dbdbdb",
      }}
    >
      <div style={{ fontSize: 20 }}>예약관리</div>

      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            marginRight: 10,
            justifyContent: "center",
            height: "100%",
          }}
        >
          {props.totalReportText}
        </div>
        <Select
          defaultValue="기간"
          onChange={handleSelectChange}
          style={{ width: 120 }}
        >
          <Option value="0">기간</Option>
          <Option value="1">산모이름</Option>
          <Option value="2">산모주소</Option>
          <Option value="3">보호자</Option>
          <Option value="4">예정일</Option>
        </Select>
        <div style={{ width: 1 }} />
        <SearchConditionChoosherView
          selectedValue={selectedValue}
          setValue={updateVal}
          dateRange={dateRangeVals}
          dateFormat={dateFormat}
        />
        <div style={{ width: 1 }} />
        <Button icon={<SearchOutlined />} onClick={searchReservations}>
          검색
        </Button>
      </div>
    </div>
  );
}


function SearchConditionView(props) {
  let [showPopup, updateShowPopup] = useState(false);

  return (
    <div>
      <ActionBunttonGroupView
        {...props}
        downloadExcel={(e) => {
//          console.log("call now");
          updateShowPopup(true);
        }}
      />
      <DownloadExcelPopup
        showPopup={showPopup}
        onOk={(e) => {
//          console.log("onOk");
          updateShowPopup(false);
        }}
        onCancel={(e) => {
          updateShowPopup(false);
        }}
      />
    </div>
  );
}

function ActionBunttonGroupView(props) {
  let eventObserver = props.eventObserver;
  let dataShowName = props.displayState === 0 ? "목록" : "차트";

  const menu = (
    <Menu>
      <Menu.Item>
        <span
          onClick={(e) => {
            eventObserver({ type: "filter-0" });
          }}
        >
          전체보기
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={(e) => {
            eventObserver({ type: "filter-1" });
          }}
        >
          입실예정(잔금미납)
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={(e) => {
            eventObserver({ type: "filter-2" });
          }}
        >
          입실예정(잔금완납)
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={(e) => {
            eventObserver({ type: "filter-3" });
          }}
        >
          입실완료(잔금미납)
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={(e) => {
            eventObserver({ type: "filter-4" });
          }}
        >
          입실완료(잔금완납)
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={(e) => {
            eventObserver({ type: "filter-5" });
          }}
        >
          입실완료(객실이동)
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={(e) => {
            eventObserver({ type: "filter-6" });
          }}
        >
          계약포기
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={(e) => {
            eventObserver({ type: "filter-7" });
          }}
        >
          취소
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={(e) => {
            eventObserver({ type: "filter-8" });
          }}
        >
          재방문
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={(e) => {
            eventObserver({ type: "filter-9" });
          }}
        >
          퇴실
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div
      style={{ display: "flex", justifyContent: "space-between"}}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <i className="icon-dialog-no"></i>

        <button
          className={style.actionButton}
          onClick={(e) => {
            eventObserver({ type: "filter-1" });
          }}
        >
          입실예정(미납)
        </button>
        <li>
          <div className={style.actionButton2}>
            <i className="icon_dialog_yes"></i>
            <span
              className={style.text}
              onClick={(e) => {
                eventObserver({ type: "filter-2" });
              }}
            >
              입실예정(완납)
            </span>
          </div>
        </li>

        {/* <li>
          <div className={style.actionButton3}>
            <span
              className={style.text}
              onClick={(e) => {
                window.location.href = "/reservation/calendar";
              }}
            >
              입퇴실 달력
            </span>
          </div>
        </li> */}

        <button
          className={style.showGridButton}
          onClick={(e) => {
            props.eventObserver({
              type: "DataViewUpdate",
              currentDisplayState: props.displayState,
            });
          }}
        >
          {dataShowName}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 10,
        }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <Dropdown overlay={menu} placement="bottomLeft">
            <button className={style.serachActionButton} type="button">
              필터적용
            </button>
          </Dropdown>

          <button
            className={style.excelExportActionButton}
            type="button"
            onClick={props.downloadExcel}
          >
            엑셀 다운로드
          </button>
        </div>
      </div>
    </div>
  );
}

//let allReservationList = [];

function newEventDispach(setChartViewState, updateTableDataList,allReservationFunc) {
  return function (e) {
    let allReservationList = allReservationFunc()
    console.log("Filter all",allReservationList)
    if (e.type === "DataViewUpdate") {
      let chartViewState = e.currentDisplayState;
      if (chartViewState === 0) {
        setChartViewState(1);
      } else {
        setChartViewState(0);
      }
    } 
    // else if (e.type === "OnLoadCompletedResList") {
    //   allReservationList = e.data.dataList;
    //   updateTableDataList(allReservationList, e.eParam);
    // } 
    else if (e.type === "filter-0") {
      updateTableDataList(allReservationList);
    } else if (e.type === "filter-1") {
      let list = allReservationList.filter((e) => {
        return ReservStateChecker.isPreInDespi(e);
      });
      console.log("Filter-1",list)
      updateTableDataList(list);
    } else if (e.type === "filter-2") {
      let list = allReservationList.filter((e) => {
        return ReservStateChecker.isPreInFull(e);
      });
      updateTableDataList(list);
    } else if (e.type === "filter-3") {
      let list = allReservationList.filter((e) => {
        return ReservStateChecker.isCheckInDespi(e);
      });
      updateTableDataList(list);
    } else if (e.type === "filter-4") {
      let list = allReservationList.filter((e) => {
        return ReservStateChecker.isCheckinFull(e);
      });
      updateTableDataList(list);
    } else if (e.type === "filter-5") {
      let list = allReservationList.filter((e) => {
        return ReservStateChecker.isMoveRoom(e);
      });
      updateTableDataList(list);
    } else if (e.type === "filter-6") {
      let list = allReservationList.filter((e) => {
        return ReservStateChecker.isDrop(e);
      });
      updateTableDataList(list);
    } else if (e.type === "filter-7") {
      let list = allReservationList.filter((e) => {
        return ReservStateChecker.isCancel(e);
      });
      updateTableDataList(list);
    } else if (e.type === "filter-8") {
      let list = allReservationList.filter((e) => {
        return ReservStateChecker.isRevisit(e);
      });
      updateTableDataList(list);
    } else if (e.type === "filter-9") {
      let list = allReservationList.filter(ReservStateChecker.isExitRoom);
      updateTableDataList(list);
    }
  };
}

// function ChartDataViewWrapper(props) {

//   let chartData = toChartData(props.dataList);
//   console.log("ChartData",chartData)

//   return (
//     <GroupTable
//       dispach={props.dispach}
//       dataList={props.dataList}
//       roomList={props.roomList}
//       chartData={chartData}
//       query={props.query}
//     />
//   );
// }



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

function ListView(props) {

  const dataList = props.dataList;


  // if(props.reservationObj.query !== undefined) {
  // }

  if (dataList.length < 1) {
    return <Empty/>
  }

  if (props.viewState === 0) {

    // return (
    //   <ChartDataViewWrapper
    //     roomList={props.roomList}
    //     dispach={props.dispach}
    //     dataList={dataList}
    //     query={props.query}
    //   />
    //   let chartData = toChartData(props.dataList);
    //   console.log("ChartData",chartData)    
      return (
        <GroupTable
          dispach={props.dispach}
          dataList={dataList}
          roomList={props.roomList}
          // chartData={chartData}
          query={props.query}
        />
      );
  }
  return <ChartDataView dataList={dataList} />;
}

function ReportTextInfo(props) {
  let [robj, updater] = useState([]);

  useEffect(() => {
//    console.log("Query",props.query)
    if (props.dataList.length > 0
        && (props.query !== undefined && props.query.type === "range")
      ) {

      let roomReport = {};
      let query = props.query;
      let dateList = rangeOfDates(query.param["from"], query.param["to"]);

      props.dataList.forEach((sourceObj) => {

        let reDataRepo = roomReport[sourceObj.roomGradeNo];
        if (reDataRepo === undefined) {
          reDataRepo = {};
          roomReport[sourceObj.roomGradeNo] = reDataRepo;
        }

        dateList.forEach((cDate) => {
          let countVal = reDataRepo[cDate];
          if (countVal === undefined) {
            countVal = 0; //1 로 초기화 밑에서 체크기준에 따라 추가
            reDataRepo[cDate] = countVal;
          } else {

            if(ReservStateChecker.isConfirmReserv(sourceObj) && isValidSourceCountReport(
              sourceObj,
              sourceObj.fromDate,
              sourceObj.toDate,
              cDate)){

              reDataRepo[cDate] = countVal + 1;
            }
          }
        });
      });

//      const roomGradeGroup = groupBy(props.roomList, "gradeNo");
      const roomGradeGroup = roomLevelGroupBy(props.roomList)
  //    console.log(roomGradeGroup,roomGradeGroup2)
      // console.log(roomGradeGroup)
      // console.log("ReportData",roomReport)

      const reduceFn = (e, dataObj) => {
        const roomInfo = roomGradeGroup[e]
        const totalSize = roomInfo.roomList.length;
        let mVal = totalSize;
        const rObj = dataObj[e];

        if (rObj === undefined) {
          return totalSize;
        }

        Object.keys(rObj).forEach((k) => {
          let dv = totalSize - rObj[k];
          if (dv < mVal) {
            mVal = dv;
          }
        });

        return mVal <=0 ? 0 : mVal;
      };

      let roomGradeKeys = Object.keys(roomGradeGroup)
      // console.log("Keys",roomGradeKeys)

      let newInfoList = []
      roomGradeKeys.forEach((skey) => {
        const roomInfo = roomGradeGroup[skey]
        const rData =  reduceFn(skey, roomReport)
        // tmin: reduceFn(roomGradeKeys[1], roomReport),
//        console.log(roomInfo.name,rData)
        newInfoList.push({
          name:roomInfo.name,
          qty:rData
        })
      })

      updater(newInfoList);
    }
  }, [props.dataList]);

  if(props.query !== null && props.query.type === "range") {

    return (
      <span>
        최소 예약 가능 객실수 {
          robj.map((e,i)=>{
            let txt =  "";
            if(i > 0) {
              txt = "/ "+txt
            }
            return txt+e.name+" : "+e.qty
          })
        }
      </span>  
    )
  }

  return <div></div>
  
}

function DownloadExcelPopup(props) {
  let { serverEventEmmiter } = useContext(ServerEventContext);

  const disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  };

  let month = moment();

  const okHandler = (e) => {

    // console.log("CurrentDate", month.format("YYYY-MM"));
    // console.log("FormatMonth,", month.format("MM"));

    const monthStr = month.format("MM");

    let param = {
      year: month.year(),
      month:monthStr,
    };

//    console.log("Param", param);

    const resObs = serverEventEmmiter({
      type: "DownloadExcel",
      params: param,
    });

    resObs.subscribe(
      (next) => {

        let filename = next.headers
          .get("Content-Disposition")
          .split("filename=")[1];

        filename = filename.substring(1, filename.length - 1);

        next.blob().then((data) => {
          const url = window.URL.createObjectURL(data);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", filename);
          document.body.appendChild(link);
          link.click();
        }).then((e)=>{

          props.onCancel()
        })



      },
      (error) => {
//        console.log("Error", error);
        Modal.error({
          title: "메시지",
          content: (
            <div>
              <p>{error}</p>
            </div>
          ),
        });
      }
    );
  };

  return (
    <Modal
      width={350}
      heigt={"auto"}
      // bodyStyle={{ margin: 0, padding: 0 }}
      title={"엑셀 다운로드"}
      visible={props.showPopup}
      onOk={props.onOk}
      onCancel={props.onCancel}
      okButtonProps={{ disabled: true, visible: false }}
      cancelButtonProps={{ disabled: true, visible: false }}
      //          confirmLoading={confirmLoading}
      footer={null}
      destroyOnClose
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          marginTop: "10px",
          marginBottom: "20px",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
        }}
      >
        <div
          style={{
            display: "flex",
            flex: 1,
            width: "100%",
            flexDirection: "row",
            justifyContent: "start",
            alignItems: "center",
            // backgroundColor:"black",
            padding: "1px",
          }}
        >
          <span style={{ width: "90px" }}>출산(예정)일</span>
          <DatePicker
            width={100}
            defaultValue={month}
            picker="month"
            placeholder={"년월선택"}
            format={"YYYY-MM"}
            disabledDate={disabledDate}
            onChange={(e) => {
              month = e;
            }}
          />
        </div>

        <div style={{ marginTop: "10px", marginLeft: "50px" }}>
          <ActionButtonGroupView
            buttons={[
              { name: "다운로드", onClick: okHandler },
              { name: "취소", onClick: props.onCancel, isCancel: true },
            ]}
          />
        </div>
        <div style={{ height: "10px" }} />
      </div>
    </Modal>
  );
}


function defaultSearchDateOfRange(){

  // let startDate = moment().subtract(15, "days");
  // let endDate = moment().add(15, "days");

  let startDate = moment();
  let endDate = moment().add(7, "days");

  return {
    sDate:startDate,
    eDate:endDate
  }
}


function loadReservationDataList(updateState,serverEventEmmiter,reqEvent) {

    serverEventEmmiter({
      type: "FetchTableDataList",
      params: reqEvent.param,
      resultHandler: (data) => {
        // console.log("Response",data)
        let newEvent =  {
          type:1,
          request:reqEvent,
          result:data
        }
        updateState(newEvent)
      },
    });
}

export default function ChartView(props) {
  const { serverEventEmmiter } = useContext(ServerEventContext);


  // let [roomList, updateRoomList] = useState([]);
  //0 init state 1 loading state 3  load complete
  const [loadState,updateLoadState]  = useState({
    state:0,//0 loading 1 loaded
    event:{
      type:-1, //-1 초기화 상태  0 load roomList 1 load reservation list
      request:null,
      result:null,
    },
    viewState:0,
    roomList:[],
  })

  let [reState, updateTableDataList] = useState({
    dataList:[],
    request:null,
    roomList:[],
    viewState:0,
    currentDataList:[],
  });


  const dispach = newEventDispach(
    (newChartState) => {
      updateTableDataList({        
        ...reState,
        viewState: newChartState,
      });
      // updateLoadState({
      //   ...loadState,
      //   viewState:newChartState
      // })

    },
    (dataList, eParam = null) => {
        updateTableDataList({
          ...reState,
//          request:eParam,          
          currentDataList:dataList
        });
    },
    
    () => {
      return reState.dataList
      // updateTableDataList({
      //   ...reState,
      //   currentDataList:reState.dataList
      // })
    }
  );

  //table 쪽에서 popup 이 성공시 data reload 하고싶어하는 기능을 위해서 
  //밑에 내려보내는 dispach는 한번 더 감싼다 
  const dispachWrapper = (e) => {

    if("LoadReservationList") {
      updateLoadState({
        ...loadState,
        state:0,//start spin loading 
        event:{
          type:1,
          request:e.request,
        }
      })
    }
    else{
      dispach(e)
    }
  }


  //response handle for GetReservationList and RoomList 
  useEffect(() => {

//      console.log("process 1 effect",loadState)

      const stateCode = loadState.state;
      const stateEvent = loadState.event;
      
      //처음 초기화상태 
      //index = 1
      if(stateCode === 0 && stateEvent.type === -1 ) {

        serverEventEmmiter({
          type: "FetchRoomList",
          resultHandler: function (e) {

            //초기화 완료 roomList setting 완료 
            //이 시점에 reservation request 를 콜하게 만든다 
            //update request state to call reservation list 
            let cDate = defaultSearchDateOfRange()
            let param = {
              from: cDate.sDate.format("YYYY-MM-DD"),
              to: cDate.eDate.format("YYYY-MM-DD"),
            };
            const request = {
              type:"range",
              param:param
            }
            const dataList = e.dataList;
            updateLoadState(
              {
                ...loadState,
                state:0,
                roomList:dataList,
                event:{
                  type:1, //
                  request:request,
                  result:dataList
                }  
              }
            )
          },
        });  
      }
      else if(stateCode === 1 && stateEvent.type === 1) {
        //index =3 맨 마감 데이터 처리 
        //state ==1 이고 event.type ==1 이면 
        //처리완료된 reservation list 에 대한 httpRequest 가 있다는  상태 
        //통일된 result처리함수에 보내며 dispatch에서 통일되게 처리한다

        console.log("Update eventRequets",stateEvent.result.dataList)
        // dispach({
        //   type: "OnLoadCompletedResList",
        //   data: stateEvent.result,
        //   eParam: stateEvent.request,
        // });
        const dataList = stateEvent.result.dataList
        updateTableDataList({
          ...reState,
          roomList:loadState.roomList,
          request:stateEvent.request,
          dataList:dataList,
          currentDataList:dataList
        });
      };
    },
    [loadState.state,loadState.event.type]
  )


  //작용 :  state =1 로 만들어 spin 을 clear 한다 
  // state.event 에 result 를 부여함으로 다음 함수에서 실행 하도록한다 
  const reservationUpdater = (newEvent) => {
    updateLoadState({
      ...loadState,
      state:1,
      event:newEvent,
    })
  }

  //request handler for fetch reservation data 
  useEffect(() => {

//    console.log("process 2 effect",loadState)

    //index = 2
    //state = 0 은 spin 으 돌아가고있으며 event 의 request 가 들어와있는 상태이므로 
    //loadState.event.type 값이 1 이므로 http server 에서 데이터 요청 
    //상위 useEffect에서 response를 처리하여 화면을 refresh시킨다 
    if(loadState.state === 0 && loadState.event.type === 1){

      let requestEvent = loadState.event.request;
      loadReservationDataList(
        reservationUpdater,
        serverEventEmmiter,
        requestEvent
      )
    }
    else{
      console.log("PassEvent in Request")
    }
  });


  return (

    <div className={style.main}>

      <div style={{ padding: 10 }}>
        <HeaderView
          totalReportText={
            <ReportTextInfo
              query={loadState.event.request}
              dataList={reState.currentDataList}
              roomList={loadState.roomList}
            />
          }
          eventObserver={dispach}
          emitHttpEvent={dispachWrapper}
        />
      </div>
      <SearchConditionView
        displayState={loadState.viewState}
        eventObserver={dispach}
      />
      <Spin spinning={loadState.state===0} >

        <ListView
          query={reState.request}
          dispach={dispachWrapper}
          roomList={reState.roomList}
          viewState={reState.viewState}
          dataList={reState.currentDataList}
        />
      </Spin>

    </div>
  );
}
