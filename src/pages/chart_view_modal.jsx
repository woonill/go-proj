import React, { useState } from "react";
import { Select, DatePicker, Table, Input, Button, Radio } from "antd";
import moment from "moment";
import style from "./reservation_popup.module.scss";
import TextArea from "antd/lib/input/TextArea";
const { Option } = Select;

const { RangePicker } = DatePicker;

function TextLineWrapper(props) {
  return (
    <div className={style.TextLineWrapper}>
      <div className={style.TextTitle}>{props.title}</div>
      <div style={{ width: "10px" }}></div>
      <div className={style.TextContent}>{props.content}</div>
    </div>
  );
}

function RowComp(props) {
  return (
    <div className={style.TextLineWrapper}>
      <div className={style.TextTitle}>{props.title}</div>
      <div style={{ width: "10px" }}></div>
      <div className={style.TextContent}>{props.children}</div>
    </div>
  );
}

function CSpace(props) {
  return <div style={{ height: "2px" }}></div>;
}

//개실이동
function MoveRoomForm(props) {
  return (
    <div style={{ marginTop: "2px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ height: "2px" }}></div>
        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="개실등급"
          //optionFilterProp="children"
          // onChange={onChange}
          // onFocus={onFocus}
          // onBlur={onBlur}
          // onSearch={onSearch}
        >
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="tom">Tom</Option>
        </Select>

        <div style={{ height: "2px" }}></div>

        <Select
          showSearch
          style={{ width: 200 }}
          placeholder="객실"
          // onChange={onChange}
        >
          <Option value="jack">201호</Option>
          <Option value="lucy">301호</Option>
        </Select>
        <div style={{ height: "2px" }}></div>

        {/* <div style={{display:"flex",flex:2}}>

        </div> */}
        <RangePicker format="YYYY-MM-DD" />
      </div>
      <div style={{ height: "2px" }}></div>
    </div>
  );
}

//연장
function YenzangForm(props) {
  return (
    <div
      style={{
        marginTop: "2px",
        padding: "3px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <RangePicker
        // ranges={{
        //   Today: [moment(), moment()],
        //   "This Month": [moment().startOf("month"), moment().endOf("month")],
        // }}
        //                showTime
        format="YYYY-MM-DD"
        //      onChange={onChange}
      />

      <div style={{ height: "10px" }}></div>
      <Input
        style={{ width: "100px" }}
        placeholder="기존금액"
        readOnly
        value={"9,600,000원"}
      />
      <div style={{ height: "2px" }}></div>
      <div style={{ display: "flex", flexDirection: "row", padding: "5px" }}>
        <Select
          showSearch
          style={{ width: 100 }}
          placeholder="추가금액"
          // onChange={onChange}
        >
          <Option value="jack">현금</Option>
          <Option value="lucy">카드</Option>
        </Select>

        <div style={{ width: "2px" }}></div>
        <Input style={{ width: "100px" }} maxLength={10} placeholder="금액" />
        <div style={{ width: "2px" }}></div>
        <DatePicker
          defaultValue={moment("2021-01-01", "YYYY-MM-DD")}
          format={"YYYY-MM-DD"}
        />
        <div style={{ width: "2px" }}></div>
        <Button>+</Button>
      </div>
      <div style={{ height: "2px" }}></div>
    </div>
  );
}

//퇴실확정
function ReversionCancelPopup(props) {
  return (
    <div
      style={{
        marginTop: "2px",
        display: "flex",
        justifyContent: "end",
        flexDirection: "column",
      }}
    >
      <TextLineWrapper title="산모이름" content="오지은" />
      <div style={{ height: "2px" }}></div>
      <TextLineWrapper title="입실시간" content="2021-07-6 ~ 2021-07-16" />
    </div>
  );
}

//계약일자수정
function UpdateDueDateForm(props) {
  return (
    <div
      style={{
        marginTop: "2px",
        display: "flex",
        justifyContent: "end",
        flexDirection: "column",
      }}
    >
      <RowComp title="계약일">
        <DatePicker
          defaultValue={moment("2021-01-01", "YYYY-MM-DD")}
          format={"YYYY-MM-DD"}
        />
      </RowComp>
      <div style={{ height: "2px" }}></div>
    </div>
  );
}

//결제내역
function FinaceListView(props) {
  const columns = [
    {
      title: "결제종류",
      dataIndex: "name",
    },
    {
      title: "결제수단",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "총금액",
      dataIndex: "dueDate",
      key: "fdate",
    },
    {
      title: "결제금액",
      dataIndex: "state",
    },

    {
      title: "잔금",
      dataIndex: "days",
      render: (text) => <span>{text}일</span>,
    },
    {
      title: "결제일",
      dataIndex: "roomName",
    },
    {
      title: "메모",
      dataIndex: "roomName",
    },
  ];

  return (
    <Table
      style={{ width: "100px" }}
      columns={columns}
      dataSource={props.dataList}
      pagination={false}
    />
  );
}

const moneyTypeList = [
  { type: "01", name: "현금" },
  { type: "02", name: "카드" },
];

//잔금결제
function BalanceView(props) {
  let defaultItem = {
    type: moneyTypeList[0],
    amount: 0,
  };
  let [itemList, updateItems] = useState([defaultItem]);

  return (
    <div
      style={{
        marginTop: "2px",
        display: "flex",
        justifyContent: "end",
        flexDirection: "column",
      }}
    >
      <TextLineWrapper title="총금액" content="5,200,000" />
      <CSpace />
      <TextLineWrapper title="잔금" content="0" />
      <CSpace />
      <div className={style.BalanceWrapper}>
        <div className={style.BalanceTitle}>잔금 / 입금액</div>
        <CSpace />
        <div className={style.BalanceCostList}>
          {itemList.map((e) => {
            return (
              <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>
                <Select showSearch style={{ width: "100px" }}>
                  {moneyTypeList.map((me) => {
                    return <Option value={me.type}>{me.name}</Option>;
                  })}
                </Select>
                <div style={{ width: "2px" }}></div>
                <DatePicker
                  defaultValue={moment("2021-01-01", "YYYY-MM-DD")}
                  format={"YYYY-MM-DD"}
                />
                <div style={{ width: "2px" }}></div>
                <Button>+</Button>
                <Button>-</Button>
              </div>
            );
          })}
        </div>
      </div>
      <CSpace />
      <TextLineWrapper title="잔액" content="0" />
      <CSpace />
      <div
        style={{
          display: "flex",
          flex: 1,
          padding: "1px",
        }}
      >
        <div className={style.MemoInputBox}>
          <span>메모</span>
        </div>
        <div style={{ width: "2px" }}></div>
        <TextArea rows={7} />
      </div>
    </div>
  );
}

//환불
function RefundForm(props) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <TextLineWrapper title="환불 사유" content="환불" />
      <CSpace />
      <TextLineWrapper title="기존 총금액" content="9,600,000원" />
      <CSpace />
      <TextLineWrapper title="기존 잔금" content="0원" />

      <CSpace />

      <RowComp title={"퇴실여부"}>
        <Radio.Group defaultValue="a" buttonStyle="solid">
          <Radio.Button value="a">입실유지</Radio.Button>
          <Radio.Button value="b">퇴실</Radio.Button>
        </Radio.Group>
      </RowComp>

      <CSpace />

      <RowComp title="환불일">
        <DatePicker
          defaultValue={moment("2021-01-01", "YYYY-MM-DD")}
          format={"YYYY-MM-DD"}
        />
      </RowComp>

      <CSpace />

      <TextLineWrapper title="기존" content="2021-07-06~2021-07-16" />

      <CSpace />

      <RowComp title="환불금액">
        <Input value={"9,600,000"} />
      </RowComp>

      <CSpace />

      <div
        style={{
          display: "flex",
          flex: 1,
          padding: "1px",
        }}
      >
        <div className={style.MemoInputBox}>
          <span>메모</span>
        </div>
        <div style={{ width: "2px" }}></div>
        <TextArea rows={7} />
      </div>
    </div>
  );
}


//예약삭제 
function DelteReservationForm(props) {

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <TextLineWrapper title="산모 이름" content="김이연" />
      <CSpace />
      <TextLineWrapper title="예약기간" content="2021-07-06~2021-07-16" />
      <CSpace />
      <TextLineWrapper title="총금액" content="5,200,000원"/>
    </div>
  )
}

export {
  ReversionCancelPopup,
  MoveRoomForm,
  YenzangForm,
  UpdateDueDateForm,
  FinaceListView,
  BalanceView,
  RefundForm,
  DelteReservationForm,
};
