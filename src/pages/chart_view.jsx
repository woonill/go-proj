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
  
//      let SearchInputView = newSubSearchInputRender(selectedValue)
      let textVal;
//      let rangeDate;
  
      function updateVal(c) {
  
        if(selectedValue === "0") { //date range 로 처리  [moment,moment]  array 로 온다 
          updateDateRange(c)
//           rangeDate = c;
        }else{
          c.preventDefault()
          textVal = c.target.value;
        }
      }
  
  
      function searchReservations(event){

//          console.log("search value",textVal,dateRangeVals)
  
          let params = {}
  
          if(selectedValue === "0") {
  
            let startDate = dateRangeVals[0].format("YYYY-MM-DD");
            let endDate = dateRangeVals[1].format("YYYY-MM-DD");
  
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
  
          emitHttpEvent(
            {
              type:"FetchTableDataList",
              params:params,
              resultHandler:function(data){
//                console.log("http data","return",data)
                props.eventObserver({type:"OnLoadCompletedResList",data:data})
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


  let allReservationList=[]

  function newEventDispach(
    setChartViewState,
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
        else if(e.type ==="OnLoadCompletedResList") {
          console.log("update reservation data list",e.data)
          allReservationList = Array.from(e.data.dataList);
          updateTableDataList(allReservationList)
        }
        // else if(e.type === "UpdateSearchCondition")  {
        //   setSelectValue(e.item)
        // }
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

          let list = allReservationList.filter((e)=>{
            return e.isMove === 1 
          })
          updateTableDataList(list)

        }     
        else if(e.type === "filter-6"){
          let list = allReservationList.filter((e)=>{
            return e.inState === 2 || e.inState === 3000
          })
          updateTableDataList(list)
        }     
        else if(e.type === "filter-7"){

          let list = allReservationList.filter((e)=>{
            return e.delState === 1
          })
          updateTableDataList(list)
        }     
        else if(e.type === "filter-8"){

          let list = allReservationList.filter((e)=>{
            return e.revisit
          })
          updateTableDataList(list)
        }     
        else if(e.type === "filter-9"){
          let list = allReservationList.filter((e)=>{
            return e.delState === 2
          })
          updateTableDataList(list)

        }
    }
  }


  function ListView(props) {

    let TableComponent = React.memo(
      (props) => {
  
        return (
          <GroupTable dataList={props.dataList}/>
        );
      },
//      [props.dataList]
      (prevProps, nextProps) => {
        return prevProps.dataList.length !== nextProps.dataList.length;
      }
    );

    if(props.viewState === 0) {

      return (
          <TableComponent dataList={props.dataList}/>
      )
    }else{
        return (
            <ChartDataView dataList={props.dataList}/>
        )
    }


  }
  
  export default function ChartView() {

    let [chartViewState,setChartViewState] = useState(0)
    let [reservationDataList,updateTableDataList] = useState([])

    let dispach = newEventDispach(setChartViewState,updateTableDataList)

    
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
//              console.log("data",data)
              dispach({type:"OnLoadCompletedResList",data:data})
      }})
    }, [])//한번만 콜된다 , 그후로는 search button에 의해 동작하기때문에 

//    let HeaderView = HeaderView(setSelectValue,selectedValue,eventDiapcher)
//    let ListView = buildListView(chartViewState);

    return (
      <ServerEventContext.Provider >
        <div className={style.main}>
          <div style={{ padding: 10 }}>
            <HeaderView eventObserver={dispach}/>
          </div>
          <ActionBunttonGroupView 
            displayState={chartViewState} 
            eventObserver={dispach}/>
          <div style={{ padding: 10 }}>
              <ListView viewState={chartViewState} dataList={reservationDataList}/>
          </div>
        </div>
      </ServerEventContext.Provider>
    );
  }
  