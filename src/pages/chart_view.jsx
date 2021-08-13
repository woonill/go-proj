import React, { useState,useEffect,useContext } from "react";

import {
    Button,
    DatePicker,
    Menu,
    Select,
    Input,
    Dropdown,
  } from "antd";

  import style from "./ChartView.module.scss"
  
  import {ReservStateChecker,toChartData,rangeOfDates  } from "./chart_view_context";
  import {ServerEventContext} from "../server_event_context.js"



  import moment from "moment";
  import {ChartDataView} from "./table_data"
  import {GroupTable} from './group_table'
  import { SearchOutlined } from "@ant-design/icons";
  const { Option } = Select;
   
 
  const { RangePicker } = DatePicker;

  
  
  function SearchConditionChoosherView(props) {


      let rangeView = (
        <RangePicker
          defaultValue={props.dateRange}      
          format={props.dateFormat}
        //   value={hackValue || value}
        //   disabledDate={disabledDate}
           onCalendarChange={val => {
//             console.log("range date",val)
             props.setValue(val)
           }}
//          onChange={val => console.log("change date",val)}
        //   onOpenChange={onOpenChange}
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
      let [dateRangeVals,updateDateRange] = useState(()=>{
        let startDate = moment().subtract(15,"days")
        let endDate = moment().add(15,"days")
        return [startDate,endDate]
      })


      let handleSelectChange = (item) => {
        setSelectValue(item);
      };
  
      let textVal;
  
      function updateVal(c) {
  
        if(selectedValue === "0") { //date range 로 처리  [moment,moment]  array 로 온다 
          updateDateRange(c)
        }else{
          c.preventDefault()
          textVal = c.target.value;
        }
      }
  
      function searchReservations(event){
  
          let params = {}
          let searchType;
  
          if(selectedValue === "0") {
  
            let startDate = dateRangeVals[0].format("YYYY-MM-DD");
            let endDate = dateRangeVals[1].format("YYYY-MM-DD");
  
            searchType = "range";
            params['from'] = startDate;
            params['to'] =endDate;
          }
          else if(selectedValue === "1") {
            params["uname"] = textVal
          }
          else if(selectedValue === "2") {
            params["uaddr"] = textVal;
          }
          else if(selectedValue === "3") {
            params["pname"] = textVal;
          }
          else if(selectedValue ==="4") {
            params["due-data"] = textVal
          }
          else {
            props.eventObserver({type:"ShowErrorMessage",errorMessage:"no specfic of condition type:"+selectedValue})
            return;
          }
  
          props.emitHttpEvent(
            {
              type:"FetchTableDataList",
              params:params,
              resultHandler:function(data){
                const sParam = {
                  type:searchType,
                  condition:params
                }
                props.eventObserver({type:"OnLoadCompletedResList",data:data,eParam:sParam})
          }})        
  
      }       

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
            padding: 10,
            borderBottom: "1px solid #dbdbdb",
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
              height: "100%" }}>
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
            <Button
              icon={<SearchOutlined />} 
              onClick={searchReservations}>검색</Button>
          </div>
        </div>
      );
  }
  

  // const searchConditions= [
  //   {
  //     title:"전체보기",
  //     filterType:"filter-0",
  //   },
  //   {
  //     title:"입실예정(잔금미납)",
  //     filterType:"filter-1",
  //   },
  //   {
  //     title:"전체보기",
  //     filterType:"filter-2",
  //   },
  //   {
  //     title:"전체보기",
  //     filterType:"filter-3",
  //   },
  //   {
  //     title:"전체보기",
  //     filterType:"filter-4",
  //   },
  //   {
  //     title:"전체보기",
  //     filterType:"filter-5",
  //   },
  //   {
  //     title:"전체보기",
  //     filterType:"filter-6",
  //   },
  //   {
  //     title:"전체보기",
  //     filterType:"filter-7",
  //   },
  //   {
  //     title:"전체보기",
  //     filterType:"filter-8",
  //   },
  //   {
  //     title:"전체보기",
  //     filterType:"filter-9",
  //   },
  // ]

  function ActionBunttonGroupView(props) {

    let eventObserver = props.eventObserver
    let dataShowName = props.displayState === 0 ? "목록" : "차트";


    const menu = (
      <Menu>
        <Menu.Item>
          <span onClick={(e)=>{
              eventObserver({type:"filter-0"})
          }}>
            전체보기
          </span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={(e)=>{
              eventObserver({type:"filter-1"})
          }}>
            입실예정(잔금미납)
          </span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={(e)=>{
              eventObserver({type:"filter-2"})
          }}>
            입실예정(잔금완납)
          </span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={(e)=>{
              eventObserver({type:"filter-3"})
          }}>
            입실완료(잔금미납)
          </span>
        </Menu.Item>
        <Menu.Item>          
          <span onClick={(e)=>{
              eventObserver({type:"filter-4"})
          }}>
            입실완료(잔금완납)
          </span>
        </Menu.Item>
        <Menu.Item>         
          <span onClick={(e)=>{
              eventObserver({type:"filter-5"})
          }}>
            입실완료(객실이동)
          </span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={(e)=>{
              eventObserver({type:"filter-6"})
          }}>
            계약포기
          </span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={(e)=>{
              eventObserver({type:"filter-7"})
          }}>
            취소
          </span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={(e)=>{
              eventObserver({type:"filter-8"})
          }}>
            재방문
          </span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={(e)=>{
              eventObserver({type:"filter-9"})
          }}>
            퇴실
          </span>
        </Menu.Item>
      </Menu>
    );
  
    return (
      <div
        style={{ display: "flex", justifyContent: "space-between", padding: 10 }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <i className="icon-dialog-no"></i>

          <button className={style.actionButton} onClick={(e)=>{
             eventObserver({type:"filter-1"})
          }}>
            입실예정(미납)
          </button>
          <li>
          <div className ={style.actionButton2}>
              <i className="icon_dialog_yes"></i>
              <span className={style.text} onClick={(e)=>{
                 eventObserver({type:"filter-2"})
              }}>입실예정(완납)</span>
          </div>

          </li>

          <li>
            <div className ={style.actionButton3}>
                <span className={style.text}
                onClick={(e)=>{
                  window.location.href="/reservation/calendar";
              }}>
                  입퇴실 달력
              </span>
            </div>
          </li>

          <button className={style.showGridButton}
            onClick={(e)=>{
                props.eventObserver({
                    type:"DataViewUpdate",currentDisplayState:props.displayState
                })
          }} >
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
              <button className={style.serachActionButton} type='button'>
                필터적용
              </button>
            </Dropdown>
  
            <button className={style.excelExportActionButton} type='button'>
              엑셀 다운로드
            </button>
          </div>
        </div>
      </div>
    );
  }


  let allReservationList=[]

  function newEventDispach(setChartViewState,updateTableDataList) {

    return function(e) {

        if(e.type === "DataViewUpdate") {
            let chartViewState = e.currentDisplayState ;
            if(chartViewState === 0) {
              setChartViewState(1)
            }else{
              setChartViewState(0)
            }
        }
        else if(e.type ==="OnLoadCompletedResList") {
//          console.log("update reservation data list",e.data)
          //allReservationList.splice(0,allReservationList.length)
          allReservationList = e.data.dataList;
          updateTableDataList(allReservationList,e.eParam)
        }
        // else if(e.type === "UpdateSearchCondition")  {
        //   setSelectValue(e.item)
        // }
        else if(e.type === "filter-0"){
          updateTableDataList(allReservationList)
        }
        else if(e.type === "filter-1"){

          let list = allReservationList.filter((e)=>{
              return ReservStateChecker.isPreInDespi(e)
          })
          updateTableDataList(list)
        }
        else if(e.type === "filter-2"){
          let list = allReservationList.filter((e)=>{
            return ReservStateChecker.isPreInFull(e)
          })
          updateTableDataList(list)
        }     
        else if(e.type === "filter-3"){
          let list = allReservationList.filter((e)=>{
            return ReservStateChecker.isCheckInDespi(e)
          })
          updateTableDataList(list)
        }     
        else if(e.type === "filter-4"){

          let list = allReservationList.filter((e)=>{
            return ReservStateChecker.isCheckinFull(e)
          })
          updateTableDataList(list)
        }     
        else if(e.type === "filter-5"){

          let list = allReservationList.filter((e)=>{
            return ReservStateChecker.isMoveRoom(e)
          })
          updateTableDataList(list)

        }     
        else if(e.type === "filter-6"){
          let list = allReservationList.filter((e)=>{
            return ReservStateChecker.isDrop(e)
          })
          updateTableDataList(list)
        }     
        else if(e.type === "filter-7"){

          let list = allReservationList.filter((e)=>{
            return ReservStateChecker.isCancel(e)
          })
          updateTableDataList(list)
        }     
        else if(e.type === "filter-8"){

          let list = allReservationList.filter((e)=>{
            return ReservStateChecker.isRevisit(e)
          })
          updateTableDataList(list)
        }     
        else if(e.type === "filter-9"){
          let list = allReservationList.filter(ReservStateChecker.isExitRoom)
          updateTableDataList(list)

        }
    }
  }

const groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

  function ChartDataViewWrapper(props) {


    let { serverEventEmmiter } = useContext(ServerEventContext);

    // let [chartObj, updateChartObj] = useState(() => {
    //   return {
    //     roomList: props.roomList,
    //     chartData:{},
    //     state:0,
    //     query: props.query,
    //   };
    // });

     const dispach = (sEvent)=>{
        
      serverEventEmmiter(
        {
          type:"FetchTableDataList",
          params:props.query.condition,
          resultHandler:(data)=>{
              const sParam = {
                type:"range",
                condition:props.query.condition
              }

              props.dispach({type:"OnLoadCompletedResList",data:data,eParam:sParam})
      }})
    }

//    console.log("Update",chartObj)
    // useEffect(()=>{

    //   let chartData = toChartData(props.dataList);

    //   updateChartObj({
    //     ...chartObj,
    //     state:1,
    //     chartData:chartData,            
    //   })


    // },[props.dataList])

    // if(chartObj.state === 0 ) {
    //   return <div>Loading.......</div>
    // }

//    console.log("Start render ChartView")

    let chartData = toChartData(props.dataList);

    return (
      <GroupTable
        dispach={dispach}
        dataList={props.dataList}
        roomList={props.roomList}
        chartData={chartData}
        query={props.query}
      />
    )
  }

  function ListView(props) {



    const dataList = props.reservationObj.dataList

    if(dataList.length <1) {
      return <div>loading.......</div>
    } 

    if(props.viewState === 0) {
        return <ChartDataViewWrapper
                  roomList={props.roomList}
                  dispach={props.dispach}
                  dataList={dataList} 
                  query={props.reservationObj.query}
               />
    }
    return <ChartDataView dataList={dataList}/>
  }

  function ReportTextInfo(props) {

    let [robj,updater] = useState({
      smin:0,
      tmin:0,
    })

    useEffect(()=>{

      if(props.dataList.length > 0) {

//        console.log("start update ReportText")

        let roomReport = {}

        props.dataList.forEach((sourceObj)=>{

//          console.log(sourceObj)
          let reDataRepo = roomReport[sourceObj.roomGradeNo]
          if (reDataRepo === undefined) {
            reDataRepo = {}
            roomReport[sourceObj.roomGradeNo] = reDataRepo
          }

          let dateList = rangeOfDates(sourceObj.fromDate,sourceObj.toDate)
          dateList.forEach((cDate)=>{
            let countVal = reDataRepo[cDate];
            if (countVal === undefined) {
              countVal = 1;  //1 로 초기화 밑에서 체크기준에 따라 추가 
              reDataRepo[cDate] = countVal;
            }else{
              reDataRepo[cDate] = countVal+1;
            }
          })      
        })

        const roomGradeGroup = groupBy(props.roomList,"gradeNo")

        const reduceFn = (e,dataObj)=>{

          const totalSize = roomGradeGroup[e].length
          let mVal=totalSize;
          const rObj = dataObj[e];

          if(rObj === undefined) {
            return totalSize
          }


          Object.keys(rObj).forEach((k)=>{
            let dv = totalSize-rObj[k];
            if(dv < mVal) {
              mVal = dv;
            }
          })

          return mVal
        }

        updater({
          smin:reduceFn(3,roomReport),
          tmin:reduceFn(4,roomReport),
        })
      }

    },[props.dataList])

    return (<span>최소 예약 가능 객실수 펜트하우스 : {robj.smin} / 골드 : {robj.tmin}</span>)
  }
  
  export default function ChartView(props) {


    let {serverEventEmmiter} = useContext(ServerEventContext);

    let [reservationObj,updateTableDataList] = useState({
      dataList:[],
      query:{},
      chartViewState:0,
    })

    let [roomList,updateRoomList] = useState([])


    let dispach = newEventDispach(
      (newChartState)=>{
      updateTableDataList({
        ...reservationObj,
        chartViewState:newChartState,
      })
    },
    (dataList,eParam=null)=>{
      
      if(eParam !== null) {

        updateTableDataList({
          ...reservationObj,
          dataList:dataList,
          query:eParam,
        })
      }
      else{
        updateTableDataList({
          ...reservationObj,
          dataList:dataList,
        })  
      }      
    }) 

    
    useEffect(() => {

      if(props.headerInfo !== null) {
//        console.log("Update roomList")
        serverEventEmmiter({
          type: "FetchRoomList",
          resultHandler: function (e) {
              updateRoomList(e.dataList)
          },
        });
      }
    },[props.headerInfo])


    useEffect(()=>{


      if(roomList.length>0) {

        let startDate = moment().subtract(15,"days").format("YYYY-MM-DD")
        let endDate = moment().add(15,"days").format("YYYY-MM-DD")

        let param = {
          from:startDate,
          to:endDate,
        }
        serverEventEmmiter(
          {
            type:"FetchTableDataList",
            params:param,
            resultHandler:(data)=>{
                const sParam = {
                  type:"range",
                  condition:param
                }
                dispach({type:"OnLoadCompletedResList",data:data,eParam:sParam})
        }})
      }

    },[roomList])//roomList 가 변화되면 다시 콜된다 



    return (
        <div className={style.main}>
          <div style={{ padding: 10 }}>
            <HeaderView
               totalReportText={<ReportTextInfo dataList={reservationObj.dataList} roomList={roomList}/>}
               eventObserver={dispach}
               emitHttpEvent={serverEventEmmiter}/>
          </div>
          <ActionBunttonGroupView 
            displayState={reservationObj.chartViewState} 
            eventObserver={dispach}/>
          <div style={{ padding: 10}}>
              <ListView
                dispach={dispach}
                roomList={roomList}
                viewState={reservationObj.chartViewState} 
                reservationObj={reservationObj}/>
          </div>
        </div>
    );
  }
  