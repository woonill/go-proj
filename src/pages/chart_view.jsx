import React, { useState, useEffect, useContext,useReducer } from "react";
import { DatePicker, Menu,  Dropdown,Empty,Spin } from "antd";
import style from "./ChartView.module.scss";

import { ReservStateChecker,} from "./chart_view_context";
import { ServerEventContext } from "../server_event_context.js";

import { ActionButtonGroupView } from "./chart_view_modal";

import moment from "moment";
import { ChartDataView } from "./table_data";
import { GroupTable } from "./group_table";
import { Modal } from "antd";
import {HeaderView} from "./chart_header"
//import { v4 as uuidv4 } from "uuid";
//const { Option } = Select;
//const { RangePicker } = DatePicker;
//import { SearchOutlined } from "@ant-design/icons";


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
            eventObserver({ type: "filter-1-0" });
          }}
        >
          입실예정
        </span>
      </Menu.Item>
      <Menu.Item>
        <span
          onClick={(e) => {
            eventObserver({ type: "filter-3-1" });
          }}
        >
          입실완료
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
    }
    else if (e.type === "filter-1-0") {
      let list = allReservationList.filter((e) => {
        return ReservStateChecker.isPreInDespi(e) || 
        ReservStateChecker.isPreInFull(e)
      });
      updateTableDataList(list);
    }
    else if(e.type === "filter-3-1") {
      let list = allReservationList.filter((e) => {
        return ReservStateChecker.isCheckInDespi(e) || 
        ReservStateChecker.isCheckinFull(e)
      });
      updateTableDataList(list);
    }
    else if (e.type === "filter-1") {
      let list = allReservationList.filter((e) => {
        return ReservStateChecker.isPreInDespi(e);
      });
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


function isSame(obj,field,value) {

  return obj !== undefined 
      && obj[field] === value 
}

function ListView(props) {

  const dataList = props.dataList;

  if (dataList.length < 1) {
    return <Empty/>
  }

  if (props.viewState === 0) {

      return (
        <GroupTable
          dispach={props.dispach}
          dataList={dataList}
          roomList={props.roomList}
          query={props.query}
        />
      );
  }
  return <ChartDataView dataList={dataList} />;
}

function ReportTextInfo(props) {


  let [robj, updater] = useState([]);

  useEffect(() => {
    if (
      (props.dataList.length > 0)
        && isSame(props.query,"type","range"))
      //   && (props.query !== undefined && props.query.type === "range")
      // )
       {

//      console.log("UpdateReporTextInfo now")

      let roomReportList = [];
      props.dataList.forEach((sourceObj) => {

        let reDataRepo = {
            roomSize:sourceObj.roomSize,
            name:sourceObj.roomName,
        };
        const colObj = sourceObj.colDataArray
        const array = Object.keys(colObj)
        let minVal = sourceObj.roomSize;
        array.forEach((ckey) => {
          let colVal = colObj[ckey]
          colVal = sourceObj.roomSize - colVal
          if(colVal < minVal) {
            minVal = colVal;
          }
        })
        // minVal =  sourceObj.roomSize-minVal //방개수에서 최대 예야고디여있는 방을 덜어낸다 
//        console.log("ReDateRpo",reDataRepo)
        reDataRepo["qty"] = minVal < 0 ? 0 : minVal; //최소 0 으로 표현 
        roomReportList.push(reDataRepo)
      });

      updater(roomReportList);
    }
  }, [props.dataList]);

  if(props.query !== undefined && props.query !== null && props.query.type === "range") {
//    console.log("update now",robj)

    return (
      <span style={{padding:"10px",height:"100%"}}>
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

        let resDataList = (data === null || data === undefined ) ?  {dataList:[]} : data;
        
        let newEvent =  {
          type:1,
          request:reqEvent,
          result:resDataList
        }
        updateState(newEvent)
      },
    });
}


function reducer(state, action) {
  
  switch (action.type) {
    case 'LoadReservationList':

      return {
        ...state,
        loadState: {
          ...state.loadState,
          state:0,//start spin loading 
          event:action.event
        }
      };
    case 'InitRoomList' : 
      return {
        ...state,
        loadState: {
          ...state.loadState,
          state:action.state,
          roomList:action.roomList,
          event:action.event 
        }
      }
    case 'OnCompleteLoadState' : 
      return {
        ...state,
        loadState: {
          ...state.loadState,
          state:action.state,//start spin loading 
          event:action.event
        }
      };

    case 'TotalDataList' :
      return {
        ...state,
        totalReportData: action.value
        
      };
    case 'UpdateReservationList' : 
      return  {
        ...state,
        reState:{
          ...state.reState,
          roomList:action.roomList,
          request:action.request,
          dataList:action.dataList,
          currentDataList:action.dataList
        }
      }
    case 'updateViewState' : 
      return {
        ...state,
        reState:{
          ...state.reState,
          viewState: action.value,
        }
      }

    case 'updateReservationList' : 
      return {
        ...state,
        reState:{
          ...state.reState,
          currentDataList: action.value,
        }
      }

    default:
      return state;
  }
}


//const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
// Return value should be component
const antIcon = <div className="mskgb"
style={{ background: '#eee', margin: "24" }}
>
  <img  src="http://testg.tosky.co.kr:18080/resources/images/loading.gif"
  // className="mkbg"
  // width="238px"
  // height="86px"
  alt="loading"/>
</div>

const initialState  = {
  loadState: {
    state:0,//0 loading 1 loaded
    event:{
      type:-1, //-1 초기화 상태  0 load roomList 1 load reservation list
      request:null,
      result:null,
    },
    viewState:0,
    roomList:[],
  },
  reState: {
    request:null,
    roomList:[],
    viewState:0,
    dataList:[],
    currentDataList:[],
  },
  totalReportData:[]
}

export default function ChartView(props) {
  const { serverEventEmmiter } = useContext(ServerEventContext);


  // let [roomList, updateRoomList] = useState([]);
  //0 init state 1 loading state 3  load complete
//  const [totalReportData,updateTotalReport] = useState([])

  const [state, sDispatch] = useReducer(reducer, initialState);
  const loadState = state.loadState;
  const reState = state.reState;
  const totalReportData = state.totalReportData

  const dispach = newEventDispach(
    (newChartState) => {

      sDispatch({
        type:"updateViewState",
        value:newChartState
      })

    },
    (dataList, eParam = null) => {
        sDispatch({
          type:"updateReservationList",
          value:dataList
        })
    },    
    () => {
      return reState.dataList
    }
  );

  //table 쪽에서 popup 이 성공시 data reload 하고싶어하는 기능을 위해서 
  //밑에 내려보내는 dispach는 한번 더 감싼다 
  const dispachWrapper = (e) => {

    if(e.type === "LoadReservationList") {
      sDispatch({
        type:"LoadReservationList",
        event:{
          type:1,
          request:e.request,
        }
      })
    }
    else if(e.type ==="TotalDataList") {
//      console.log("TotalDataUpdated",e)
      // updateTotalReport(e.dataList)
      sDispatch({
        type:"TotalDataList",
        value:e.dataList
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
            sDispatch({
              type:"InitRoomList",
              state:0,
              roomList:dataList,
              event:{
                type:1, //
                request:request,
                result:dataList
              }  
            })           
          },
        });  
      }
      else if(stateCode === 1 && stateEvent.type === 1) {
        //index =3 맨 마감 데이터 처리 
        //state ==1 이고 event.type ==1 이면 
        //처리완료된 reservation list 에 대한 httpRequest 가 있다는  상태 
        //통일된 result처리함수에 보내며 dispatch에서 통일되게 처리한다
//        console.log("Update eventRequets",stateEvent.result.dataList)
        const dataList = stateEvent.result.dataList

        sDispatch({
          type:"UpdateReservationList",
          roomList:loadState.roomList,
          request:stateEvent.request,
          dataList:dataList,
          currentDataList:dataList
        })
      };
    },
    [loadState.state,loadState.event.type]
  )


  //작용 :  state =1 로 만들어 spin 을 clear 한다 
  // state.event 에 result 를 부여함으로 다음 함수에서 실행 하도록한다 
  const reservationUpdater = (newEvent) => {
    sDispatch({
      type:"OnCompleteLoadState",
      state:1,
      event:newEvent
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
    // else{
    //   console.log("PassEvent in Request")
    // }
  });

  return (

    <div className={style.main}>


      <div style={{ padding: 10 }}>

        <HeaderView
          defaultSearchDateOfRange={defaultSearchDateOfRange}
          totalReportText={
            <ReportTextInfo
              query={loadState.event.request}
              dataList={totalReportData}
//              dataList={reState.currentDataList}
//              roomList={loadState.roomList}
            />
          }
          eventObserver={dispach}
          emitHttpEvent={dispachWrapper}
        />
      </div>
      <Spin spinning={loadState.state===0}  
        indicator={antIcon} 
        style={{ height: '10%',width:"100%" }}>

        <SearchConditionView
          displayState={reState.viewState}
          eventObserver={dispach}
        />
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
