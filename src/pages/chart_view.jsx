import React, { useState,useEffect } from "react";

import {
    Button,
    DatePicker,
    Menu,
    Select,
    Input,
    Dropdown,
  } from "antd";

  import style from "./ChartView.module.scss"
  
  import { ServerEventContext,emitHttpEvent } from "./chart_view_context";
  import moment from "moment";
  import {ChartDataView} from "./table_data"
  import {GroupTable} from './group_table'
  import { SearchOutlined } from "@ant-design/icons";
  const { Option } = Select;
   
 
  const { RangePicker } = DatePicker;

  
  // function isDebugger() {
  //   return "dev" == process.env.NODE_ENV;
  // }
  
  
  
  
  function newSubSearchInputRender(selectedValue) {

    let dateFormat = "YYYY-MM-DD";
    let startDate = moment().subtract(15,"days")
    let endDate = moment().add(15,"days")

    let rangeView = (
      <RangePicker
        defaultValue={[startDate, endDate]}      
        format={dateFormat}
      //   value={hackValue || value}
      //   disabledDate={disabledDate}
      //   onCalendarChange={val => setDates(val)}
      //   onChange={val => setValue(val)}
      //   onOpenChange={onOpenChange}
      />
    );

    return function(props) {


      switch (selectedValue) {

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
              placeholder="산모연락처" 
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
  
 
  }
  
  function newHeaderView(setSelectValue,selectedValue) {
    
    //selectedValue, setSelectValue
  
    let handleSelectChange = (item) => {
      //    console.log(item);
      setSelectValue(item);
//      props.eventObserver({type:"UpdateSearchCondition",item:item})
    };

    let SearchInputView = newSubSearchInputRender(selectedValue)
    let textVal;

    function updateVal(c) {
      c.preventDefault()
      textVal = c.target.value;
    }

    function observeEvent(buttonEvent){
        console.log("search value",textVal)      
//        props.eventObserver({type:""})
    }
  
    return function(props) {

 

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
                최소 예약 가능 객실수 펜트하우스 : 0 / 골드 : 3
            </div>
            <Select
              defaultValue="기간"
              onChange={handleSelectChange}
              style={{ width: 120 }}
            >
              <Option value="0">기간</Option>
              <Option value="1">산모이름</Option>
              <Option value="2">산모주소</Option>
              <Option value="3">산모연락처</Option>
              <Option value="4">예정일</Option>
            </Select>
            <div style={{ width: 1 }} />
            <SearchInputView setValue={updateVal}/>
            <div style={{ width: 1 }} />
            <Button icon={<SearchOutlined />} onClick={observeEvent}>검색</Button>
          </div>
        </div>
      );
    }
  }
  
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
          {/* <button className={style.actionButton3} >
            입퇴실 달력
          </button> */}


          <li>
          <div className ={style.actionButton3}>
              {/* <i className="icon_dialog_yes"></i> */}
              <span className={style.text}>
                <a href="/reservation/calendar">
                입퇴실 달력
                </a>
                </span>
          </div>

          </li>




          <button className={style.showGridButton} onClick={(e)=>{
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

  function buildListView(viewState) {


    return function(props){

      if(viewState === 0) {
        return (
            <GroupTable dataList={props.dataList}/>
        )
      }else{
          return (
              <ChartDataView dataList={props.dataList}/>
          )
      }
    }
  }




  let allReservationList=[]


  function newEventDispach(
    setChartViewState,
    setSelectValue,
    updateTableDataList) {


    return function(e) {

        if(e.type === "DataViewUpdate") {
            let chartViewState = e.currentDisplayState ;
            if(chartViewState === 0) {
              setChartViewState(1)
            }else{
              setChartViewState(0)
            }
        }
        else if(e.type==="OnLoadCompletedResList") {
//          console.log("update reservation data list")
          allReservationList = Array.from(e.dataList);
          updateTableDataList( allReservationList)
        }
        else if(e.type === "UpdateSearchCondition")  {
          setSelectValue(e.item)
        }
        else if(e.type === "filter-0"){
          console.log(allReservationList.length)
          updateTableDataList(allReservationList)
        }
        else if(e.type === "filter-1"){

//          console.log("size:",allReservationList.length)
          let list = allReservationList.filter((e)=>{
              return e.inState === 0 && e.payType === "deposit"
          })
          updateTableDataList(list)
        }
        else if(e.type === "filter-2"){
          let list = allReservationList.filter((e)=>{
            return e.inState === 0 && e.payType === "full"
        })
        updateTableDataList(list)

        }     
        else if(e.type === "filter-3"){

          let list = allReservationList.filter((e)=>{
            return e.inState === 1 && e.payType === "deposit"
          })
          updateTableDataList(list)
        }     
        else if(e.type === "filter-4"){

          let list = allReservationList.filter((e)=>{
            return e.inState === 1 && e.payType === "full"
          })
          updateTableDataList(list)
        }     
        else if(e.type === "filter-5"){

        }     
        else if(e.type === "filter-6"){

        }     
        else if(e.type === "filter-7"){

        }     
        else if(e.type === "filter-8"){

          let list = allReservationList.filter((e)=>{
            return e.revisit
          })
          updateTableDataList(list)


        }     
        else if(e.type === "filter-9"){

        }
    }
  }
  
  export default function ChartView() {

    let [chartViewState,setChartViewState] = useState(0)
    let [selectedValue, setSelectValue] = useState("0");
    let [reservationDataList,updateTableDataList] = useState([])

    let eventDiapcher = newEventDispach(setChartViewState,setSelectValue,updateTableDataList)

    
    useEffect(() => {

      let startDate = moment().subtract(15,"days").format("YYYY-MM-DD")
      let endDate = moment().add(15,"days").format("YYYY-MM-DD")

      let param = {
        from:startDate,
        to:endDate,
      }

      emitHttpEvent(
        {
          type:"FetchTableDataList",
          params:param,
          resultHandler:function(data){
            eventDiapcher({type:"OnLoadCompletedResList",dataList:data})
      }})
//      loadTableDataList(eventDiapcher,param)
    }, [])

    let HeaderView = newHeaderView(setSelectValue,selectedValue)
    let ListView = buildListView(chartViewState);

    return (
      <ServerEventContext.Provider >
        <div className={style.main}>
          <div style={{ padding: 10 }}>
            <HeaderView eventObserver={eventDiapcher}/>
          </div>
          <ActionBunttonGroupView 
            displayState={chartViewState} 
            eventObserver={eventDiapcher}/>
          <div style={{ padding: 10 }}>
              <ListView dataList={reservationDataList}/>
          </div>
        </div>
      </ServerEventContext.Provider>
    );
  }
  