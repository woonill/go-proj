import React, { useState, useEffect, } from "react";
import { Button, DatePicker,Select, Input,} from "antd";


import moment from "moment";
import { SearchOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;


// const TextInputField = (props) => {

//   const [inputText,setInputText] = useState("")

//   const onChangeText =  (c) => {
//       c.preventDefault();
//       setInputText(c.target.value)
//   }

//   useEffect(()=>{
//     props.setValue(inputText)

//   },[inputText])

//   return  (
//       <Input
//       // placeholder="산모이름"
//       value={inputText}
//       style={{ marginLeft: 1, width: 255 }}
//       onChange={(e)=>onChangeText(e)}
//     />
//   )
// }



class TextInputFieldComp extends React.Component {
  constructor(props) {
      super(props)
      this.onChangeText = this.onChangeText.bind(this)
      this.state =  {
        selectedValue:props.selectedValue,
        inputText:"",
      }  
  }

  componentDidUpdate(prevProps) {
    if (this.props.selectedValue !== prevProps.selectedValue) {
      this.setState({
        ...this.state,
        inputText:""
      })
    }
  }

  // componentWillUnmount(params) {    
  //   console.log("Unmount TextInputFieldComponent")
  // }

  onChangeText(c){
    c.preventDefault();
    const textVal = c.target.value;
    this.props.setValue(textVal)
    this.setState({
      ...this.state,
      inputText:textVal
    })
}
  render() {

    return  (
      <Input
      // placeholder="산모이름"
      value={this.state.inputText}
      style={{ marginLeft: 1, width: 255 }}
      onChange={this.onChangeText}
    />
    )

  }
}


const DateInputField = (props) => {

  const [currentDate,updateState] = useState(moment())

  const onChangeCurrent =  (c) => {
      props.setValue(c)
      updateState(c)
  }

  useEffect(()=>{
    // if(props.selectedValue !== currentDateState.index) {
    // }
    // console.log("Clear due date component")
    updateState({
      index:props.selectedValue,
      currentDate:moment,
    })

  },[props.selectedValue])

  return  (
    <DatePicker
    format={props.dateFormat}
      // placeholder="YYYY-MM-DD"
      defaultValue={currentDate}
      style={{ marginLeft: 1, width: 255 }}
      onChange={onChangeCurrent}
      />
  )
}

const DateRangeInputField = (props) => {

  let [dateRangeVals, updateDateRange] = useState(props.dateRange);

  const onChangeCurrent =  (c) => {
    props.setValue(c)
    updateDateRange(c)
  }

  useEffect(()=>{


    props.setValue(dateRangeVals)

    // if(props.selectValue === "0") {
    //   console.log("useEffect",props)
    //   updateDateRange({
    //     dateRangeVals:props.dateRange,
    //   })
  
    // }
  })

  return  (
    <RangePicker
      value={dateRangeVals}
      format={props.dateFormat}
      onCalendarChange={onChangeCurrent}
    />
  )
}


function SearchConditionChoosherView(props) {

  const selectIndex = props.selectedValue;
  if("1" === selectIndex || "2" === selectIndex || "3" === selectIndex) {
    return <TextInputFieldComp {...props}/>
  }
  else if("4"=== selectIndex) {
    return <DateInputField {...props}/>
  }
  return <DateRangeInputField {...props}/>
}

//상위 검색조건 선택뷰
function HeaderView(props) {

  let [selectedValue, setSelectValue] = useState("0");
  let dateFormat = "YYYY-MM-DD";

  let handleSelectChange = (item) => {
    setSelectValue(item);
  };


  let textVal;//text 로 입력된 부분 
  let currentDate=moment();//출산예정일 

  let dRangeVals = props.defaultSearchDateOfRange()
  let dateRangeVals = [dRangeVals.sDate,dRangeVals.eDate];

  function updateVal(c) {
    if (selectedValue === "0") {
      // console.log("Update DateRange",c)
      dateRangeVals = c
    } 
    else if (selectedValue === "4") {
      currentDate = c;
    }
    else {
      textVal = c;
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
      searchType = "customer-name";
      params["uname"] = textVal;
    } else if (selectedValue === "2") {
      searchType = "customer-addr";
      params["uaddr"] = textVal;
    } else if (selectedValue === "3") {
      searchType = "acustomer-name";
      params["pname"] = textVal;
    } else if (selectedValue === "4") {
      searchType = "acustomer-dudate";
      params["due-data"] = currentDate.format("YYYY-MM-DD");
    } else {
      props.eventObserver({
        type: "ShowErrorMessage",
        errorMessage: "no specfic of condition type:" + selectedValue,
      });
      return;
    }

    const reqEvent =  {
      type:searchType,
      param:params
    }

    // console.log("Requet",reqEvent)
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
            padding:"3px",
            height: "100%",
          }}
        >
          {props.totalReportText}
        </div>
        <Select
          defaultValue="0"
          onChange={handleSelectChange}
          style={{ width: 120 }}
        >
          <Option value="0">기간 검색</Option>
          <Option value="1">산모 이름</Option>
          <Option value="2">산모 연락처</Option>
          <Option value="3">보호자 이름</Option>
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
        <Button icon={<SearchOutlined />} onClick={(e)=>{
          searchReservations({
            sIndex:selectedValue,
            textVal:textVal,
            dateRangeVals:dateRangeVals,
            currentDate:currentDate,
          })
        }}>
          검색
        </Button>
      </div>
    </div>
  );
}


export {
  HeaderView
}