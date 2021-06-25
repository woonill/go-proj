import React, { useState } from "react";

import {
    Button,
    DatePicker,
    Menu,
    Select,
    Input,
    Dropdown,
  } from "antd";

  import style from "./ChartView.module.scss"
  
  
  import {ChartDataView} from "./table_data"
  import {GroupTable} from './group_table'
//  import styles from 'antd/dist/antd.css';
  import { SearchOutlined } from "@ant-design/icons";
  const { Option } = Select;
   
 
  const { RangePicker } = DatePicker;

  
  // function isDebugger() {
  //   return "dev" == process.env.NODE_ENV;
  // }
  
  
  
  
  
  
  function newSubSearchInputRender(selectedValue) {
    let rangeView = (
      <RangePicker
      //   value={hackValue || value}
      //   disabledDate={disabledDate}
      //   onCalendarChange={val => setDates(val)}
      //   onChange={val => setValue(val)}
      //   onOpenChange={onOpenChange}
      />
    );
  
    switch (selectedValue) {
      case "0":
        return rangeView;
      case "1":
        return (
          <Input placeholder="산모이름" style={{ marginLeft: 1, width: 255 }} />
        );
      case "2":
        return (
          <Input placeholder="산모주소" style={{ marginLeft: 1, width: 255 }} />
        );
  
      case "3":
        return (
          <Input placeholder="산모연락처" style={{ marginLeft: 1, width: 255 }} />
        );
  
      case "4":
        return (
          <Input placeholder="YYYY-MM-DD" style={{ marginLeft: 1, width: 255 }} />
        );
  
      default:
        return rangeView;
    }
  }
  
  function newHeaderView(selectedValue, setSelectValue) {
  
    let handleSelectChange = (item) => {
      //    console.log(item);
      setSelectValue(item);
    };
  
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flex: 1,
          justifyContent: "space-between",
          //        alignItems: "start",
          //        backgroundColor: "red",
          padding: 10,
          borderBottom: "1px solid #dbdbdb",
        }}
      >
        <div style={{ fontSize: 20 }}>예약관리</div>
  
        <div
          style={{
            display: "flex",
            //        flexDirection: "column",
            flex: 1,
            justifyContent: "flex-end",
            // padding: 10,
            // borderBottom: "1px solid #dbdbdb",
          }}
        >
          <div style={{ marginRight: 10, justifyContent: "center", height: "100%" }}>
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
          {newSubSearchInputRender(selectedValue)}
          <div style={{ width: 1 }} />
          <Button icon={<SearchOutlined />}>검색</Button>
        </div>
      </div>
    );
  }
  
  function ActionBunttonGroupView(props) {

    let dataShowName = props.dataShowState == 0 ? "목록" : "차트";

    const menu = (
      <Menu>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.antgroup.com"
          >
            전체보기
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            입실예정(잔금미납)
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            입실예정(잔금완납)
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            입실완료(잔금미납)
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            입실완료(잔금완납)
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            입실완료(객실이동)
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            계약포기
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            취소
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            재방문
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.luohanacademy.com"
          >
            계약보기
          </a>
        </Menu.Item>
      </Menu>
    );
  
    return (
      <div
        style={{ display: "flex", justifyContent: "space-between", padding: 10 }}
      >
        <div style={{ display: "flex", flexDirection: "row" }}>
          <i className="icon-dialog-no"></i>

          <button className={style.actionButton} >
            입실예정(미납)
          </button>
          
          {/* <Button className={style.actionButton2}>
            <a className ={style.actionButton2}}>
            입실예정(완납)
            </a> 
          </Button>
        */}
          <li>
          <div className ={style.actionButton2}>
              {/* <i className={style.iconDialogYes}></i> */}
              <i className="icon_dialog_yes"></i>

              <span className={style.text}>입실예정(완납)</span>
          </div>

          </li>
          <button className={style.actionButton3}>
            입퇴실 달력
          </button>
          <button className={style.showGridButton} onClick={(e)=>{
                props.eventObserver({
                    type:"DataViewUpdate",
                })
          }} >
{/*           type="primary" */}
            {/* <i className={style.iconDetail}></i> */}
            {/* <span className={style.text}>목록</span> */}
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

  function BuildActionButtonGroup(viewState) {

    if(viewState === 0) {
        return (
            <GroupTable/>
        )
    }else{
        return (
            <ChartDataView></ChartDataView>
        )
    }
  }
  
  export default function ChartView() {

    let [chartViewState,setChartViewState] = useState(0)
    let [selectedValue, setSelectValue] = useState("0");


    let eventDiapcher = function(e) {

//        console.log("e:"+e)
        if(e.type === "DataViewUpdate") {
            
            if(chartViewState === 0) {
                setChartViewState(1)
            }else{
                setChartViewState(0)
            }
        }
    }

    let header = newHeaderView(selectedValue,setSelectValue);
    return (
      <div
      className={style.main}
        // style={{
        //     width: 1280,
        //     flex: 1,
        //     display: "flex",
        //     flexDirection: "column",
        // }}
      >
        <div style={{ padding: 10 }}>{header}</div>

        <ActionBunttonGroupView dataShowState={chartViewState} eventObserver={eventDiapcher}/>
        <div style={{ padding: 10 }}>
            {BuildActionButtonGroup(chartViewState)}
        </div>
      </div>
    );
  }
  