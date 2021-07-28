import React, { useEffect, useState,Component } from "react";
import { Select, DatePicker, Table, Input, Button, Radio, message } from "antd";
import moment from "moment";
import { FormattedNumber, createIntl } from "react-intl";
import style from "./reservation_popup.module.scss";
import TextArea from "antd/lib/input/TextArea";
const { Option } = Select;

const { RangePicker } = DatePicker;

const intl = createIntl({
  locale: "KOR",
  messages: {},
});

const toRangeString = (event) => event.fromDate + " ~ " + event.toDate;

function PaymentTypeSelectComp(props) {
  return (
    <Select showSearch style={{ width: "100px" }} defaultValue="0">
      {moneyTypeList.map((me) => {
        return <Option value={me.type}>{me.name}</Option>;
      })}
    </Select>
  );
}

function TextLineWrapper(props) {
  return (
    <div className={style.TextLineWrapper}>
      <div className={style.TextTitle}>{props.title}</div>
      <div style={{ width: "10px" }} />
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

function CSpace() {
  return <div style={{ width: "2px" }} />;
}

function HSpace() {
  return <div style={{ height: "2px" }} />;
}

function ButtonGroupView(props) {
  return (
    <div className={style.ButtonGroups}>
      {props.buttons.map((buttonProp, index) => {
        return (
          <>
            {index > 0 ? <div style={{ width: "10px" }} /> : null}
            <Button onClick={buttonProp.onClick}>{buttonProp.name}</Button>
          </>
        );
      })}
    </div>
  );
}

function ActionButtonView(props) {
  return (
    <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>
      <div style={{ display: "flex", flex: 1 }} />
      <div style={{ display: "flex", flex: 1 }}>
        <ButtonGroupView buttons={props.buttons} />
      </div>
    </div>
  );
}

function newCancelHandler(props) {
  return function (e) {
    props.dispach({ type: "Cancel" });
  };
}

function TextAreaInput(props) {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        padding: "1px",
        marginTop: "10px",
      }}
    >
      <CSpace />
      <TextArea rows={7} placeholder={"메모"} />
    </div>
  );
}

//개실이동
function MoveRoomForm(props) {
  const sourceObj = props.eventObj.source;
  //  console.log("SourceObj", sourceObj);
  const roomMap = props.roomMap;
  //  console.log("roomMap",roomMap)
  const [roomList, updateRoomList] = useState([]);
  let selectedRoomNo = null;
  let rangeDate;

  const okHandler = (e) => {
    if (selectedRoomNo == null) {
      message.info("이동방 선택");
      return;
    }

    if (rangeDate == null) {
      message.info("이동날짜 선택");
      return;
    }

    props.dispach({
      type: "PostChangeRoom",
      params: {
        reservation_no: sourceObj.no,
        reservation_room_no: sourceObj.reservationRoom,
        room_no: sourceObj.room,
        from_date: sourceObj.fromDate,
        to_date: sourceObj.toDate,
        t_room_no: selectedRoomNo,
        t_from_date: rangeDate[0].format("YYYY-MM-DD"),
        t_to_date: rangeDate[1].format("YYYY-MM-DD"),
      },
    });
  };

  return (
    <div
      style={{
        marginTop: "2px",
        width: "550px",
        // display: "flex",
        // flex: 1,
        //        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          //          backgroundColor:"black"
        }}
      >
        <HSpace />
        <RowComp title="개실등급">
          <Select
            showSearch
            style={{ width: 200 }}
            // placeholder="개실등급"
            //optionFilterProp="children"
            onChange={(e) => {
              updateRoomList(roomMap[e]);
            }}
          >
            {Object.keys(roomMap).map((key) => {
              return <Option value={key}>{key}</Option>;
            })}
          </Select>
        </RowComp>

        <HSpace />

        <RowComp title="객실">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="객실"
            onChange={(v) => {
              selectedRoomNo = v;
            }}
          >
            {roomList.map((e) => {
              return <Option value={e.no}>{e.name}</Option>;
            })}
          </Select>
        </RowComp>

        <HSpace />
        <div style={{ display: "flex", flex: 1 }}>
          <RowComp title="날짜">
            <RangePicker
              format="YYYY-MM-DD"
              onCalendarChange={(val) => (rangeDate = val)}
            />
          </RowComp>
        </div>
      </div>
      <HSpace />
      <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>
        <div style={{ display: "flex", flex: 1 }} />
        <div style={{ display: "flex", flex: 1 }}>
          <ButtonGroupView
            buttons={[
              { name: "객실이동", onClick: okHandler },
              { name: "취소", onClick: newCancelHandler(props) },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

//연장
function YenzangForm(props) {
  const source = props.eventObj.source;
  const defaultRange = [moment(source.fromDate), moment(source.toDate)];
  let [itemList, updateItems] = useState([]);

  useEffect(() => {
    updateItems([defaultItem]);

    // return function () {
    //   console.log("UseEffect clear");
    // };
  }, [props]);

  const AddButtonView = (props) => {
    if (props.index === itemList.length - 1) {
      const sIndex = props.index + 1;
      return (
        <Button
          onClick={(be) => {
            updateItems([
              ...itemList,
              {
                i: sIndex,
                type: moneyTypeList[0],
                amount: 0,
              },
            ]);
          }}
        >
          +
        </Button>
      );
    }
    return null;
  };

  const okHandler = function (bEvent) {};

  return (
    <div
      style={{
        marginTop: "2px",
        padding: "3px",
        display: "flex",
        flexDirection: "column",
        overlfow: "scroll",
      }}
    >
      <div>
        <RangePicker
          format="YYYY-MM-DD"
          defaultValue={defaultRange}
          //      onChange={onChange}
        />
      </div>
      <HSpace />
      <Input
        style={{ width: "100px" }}
        placeholder="기존금액"
        readOnly
        value={"9,600,000원"}
      />
      <HSpace />
      <div className={style.BalanceCostList}>
        {itemList.map((e, index) => {
          return (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <PaymentTypeSelectComp />
              <CSpace />
              <Input
                style={{ width: "100px" }}
                maxLength={10}
                placeholder="금액"
              />
              <CSpace />
              <DatePicker
                defaultValue={moment("2021-01-01", "YYYY-MM-DD")}
                format={"YYYY-MM-DD"}
              />
              <CSpace />
              <div style={{ display: "flex", flex: 1 }}>
                <CSpace />
                <AddButtonView show={index === e.i} index={index} />
                <Button
                  onClick={(be) => {
                    if (itemList.length <= 1) {
                      return;
                    }
                    updateItems(itemList.filter((item) => item.i !== index));
                  }}
                >
                  -
                </Button>
              </div>
            </div>
          );
        })}

        {/* <div
          style={{
            display: "flex",
            flex: 1,
            padding: "1px",
            marginTop: "10px",
          }}
        >
          <CSpace />
          <TextArea rows={7} placeholder={"메모"} />
        </div> */}
        <TextAreaInput />
      </div>
      <HSpace />
      <ActionButtonView
        buttons={[
          { name: "기간연장", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props) },
        ]}
      />
    </div>
  );
}

//퇴실확정
function ReversionCancelPopup(props) {
  const source = props.eventObj.source;

  const okHandler = (e) => {};

  const dataList = [
    {
      name: "하유진",
      value:toRangeString(source),
    }
  ];

  return (
    <div>
      <table className="table-entry">
          <colgroup>
              <col width="120"/>
              <col width="*"/>
          </colgroup>
          <tbody>

          {dataList.map((e, index) => {
            return (
              <>
                <tr>
                  <th scope="row">{e.name}</th>
                  <td id="name_d">하유진</td>
                </tr>
                <tr>
                  <th scope="row">입실 기간</th>
                  <td id="period_d">{e.value}</td>
                </tr>
              </>
            )
          })}
        </tbody>
      </table>
      <HSpace />
      <div className="ui-dialog-buttonpane right" >
            <button className="btn-dialog-yes">
                <i className="icon-dialog-yes"></i>
                <span className="text">퇴실 확정</span>
            </button>
            <button  className="btn-dialog-no">
                <i className="icon-dialog-no"></i>
                <span className="text">취소</span>
            </button>
        </div>  
      {/* <ActionButtonView
        buttons={[
          { name: "퇴실확정", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props) },
        ]} */}
    </div>
  );
}

function ReversionCancelPopup_old(props) {
  const source = props.eventObj.source;

  const okHandler = (e) => {};

  return (
    <div
      style={{
        marginTop: "2px",
        display: "flex",
        justifyContent: "end",
        flexDirection: "column",
      }}
    >
      <TextLineWrapper title="산모이름" content={source.name} />
      <HSpace />
      <TextLineWrapper title="입실시간" content={toRangeString(source)} />
      <HSpace />
      <ActionButtonView
        buttons={[
          { name: "퇴실확정", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props) },
        ]}
      />
    </div>
  );
}

//계약일자수정
function UpdateDueDateForm(props) {
  const okHandler = (e) => {};

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
      <HSpace />
      <ActionButtonView
        buttons={[
          { name: "수정", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props) },
        ]}
      />
    </div>
  );
}

//결제내역
function FinaceListView(props) {
  const [paymentList, updatePaymentList] = useState([]);

  useEffect(() => {
    props.loadData({
      type: "FetchPaymentHistorylist",
      params: { reservation_no: props.eventObj.no, bno: 3 },
      resultHandler: function (data) {
        console.log(data);
        updatePaymentList(data.payment_history);
      },
    });
  }, [props]);

  const columns = [
    {
      title: "결제종류",
      dataIndex: "type",
    },
    {
      title: "결제수단",
      dataIndex: "method",
      key: "phone",
    },
    {
      title: "총금액",
      dataIndex: "real_money",
      key: "fdate",
      render: (text, record, index) => {
        const m = record["real_money"];
        return <span>{intl.formatNumber(m)}원</span>;
      },
    },
    {
      title: "결제금액",
      dataIndex: "payment",
      render: (text, record, index) => {
        const m = record["payment"];
        return <span>{intl.formatNumber(m)}원</span>;
      },
    },

    {
      title: "잔금",
      dataIndex: "days",
      render: (text, record, index) => {
        const m = record["real_money"] - record["payment"];
        return <span>{intl.formatNumber(m)}원</span>;
      },
    },
    {
      title: "결제일",
      dataIndex: "inserttime",
      render: (text, record, index) => {
        // console.log("inserttime", record["inserttime"]);
        return <span>{moment(record["inserttime"]).format()}</span>;
      },
    },
    {
      title: "메모",
      dataIndex: "memo",
    },
  ];

  return (
    <>
      <Table
        //     style={{ height: "200px",overflow: "scroll", }}
        height={200}
        scroll={true}
        columns={columns}
        dataSource={paymentList}
        pagination={false}
      />
      <ActionButtonView
        buttons={[{ name: "취소", onClick: newCancelHandler(props) }]}
      />
    </>
  );
}

const moneyTypeList = [
  { type: "0", name: "현금" },
  { type: "1", name: "카드" },
];

const defaultItem = {
  i: 0,
  type: moneyTypeList[0],
  amount: 0,
};

//잔금결제
function BalanceView(props) {
  const sourceObj = props.eventObj.source;

  //  let [update,updateList] = useState([defaultItem]);
  let [itemList, updateItems] = useState([]);

  //  console.log(itemList);

  useEffect(() => {
    updateItems([defaultItem]);
    // return function(){
    //   console.log("UseEffect clear")
    // }
  }, [props]);

  const okHandler = function (bEvent) {};

  const AddButtonView = (props) => {
    if (props.index === itemList.length - 1) {
      const sIndex = props.index + 1;
      return (
        <>
          <Button
            onClick={(be) => {
              updateItems([
                ...itemList,
                {
                  i: sIndex,
                  type: moneyTypeList[0],
                  amount: 0,
                },
              ]);
            }}
          >
            +
          </Button>
          <CSpace />
        </>
      );
    }

    return null;
  };

  return (
    <div
      style={{
        marginTop: "2px",
        display: "flex",
        flex: 1,
        justifyContent: "end",
        //        alignItems: "stretch",
        flexDirection: "column",
        overflow: "scroll",
      }}
    >
      <TextLineWrapper
        title="총금액"
        content={intl.formatNumber(sourceObj.realMoney)}
      />
      <HSpace />
      <TextLineWrapper
        title="잔금"
        content={intl.formatNumber(sourceObj.remainMoney)}
      />
      <HSpace />
      <div className={style.BalanceWrapper}>
        <div className={style.BalanceTitle}>잔금 / 입금액</div>
        <HSpace />
        <div className={style.BalanceCostList}>
          {itemList.map((e, index) => {
            return (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>
                  {/* <div style={{ width: "2px" }}></div> */}
                  <PaymentTypeSelectComp />
                  <Input
                    placeholder="0"
                    style={{ width: "100px", marginLeft: "2px" }}
                  />
                  <div style={{ marginLeft: "2px", width: "100px" }}>
                    <DatePicker
                      defaultValue={moment("2021-01-01")}
                      format={"YYYY-MM-DD"}
                    />
                  </div>
                </div>
                <div style={{ display: "flex", flex: 1 }}>
                  <CSpace />
                  <AddButtonView show={index === e.i} index={index} />
                  <Button
                    onClick={(be) => {
                      if (itemList.length <= 1) {
                        console.log("Last one");
                        return;
                      }
                      updateItems(itemList.filter((item) => item.i !== index));
                    }}
                  >
                    -
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CSpace />
      <TextLineWrapper title="잔액" content="0" />
      <CSpace />
      {/* <div
        style={{
          display: "flex",
          flex: 1,
          padding: "1px",
        }}
      >
        <TextAreaInput/>
      </div> */}

      <TextAreaInput />

      <ActionButtonView
        buttons={[
          { name: "기간연장", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props) },
        ]}
      />
    </div>
  );
}

//환불
function RefundForm(props) {
  const eventObj = props.eventObj;
  const sourceObj = eventObj.source;
  //  console.log("EventObj",sourceObj)

  //   const intl = useIntl()

  const fromToStr = sourceObj.fromDate + "~" + sourceObj.toDate;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <TextLineWrapper title="환불 사유" content="환불" />
      <CSpace />
      <TextLineWrapper
        title="기존 총금액"
        content={intl.formatNumber(sourceObj.realMoney)}
      />
      <CSpace />
      <TextLineWrapper title="기존 잔금" content={sourceObj.remainMoney} />
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
      <TextLineWrapper title="기간" content={fromToStr} />
      <CSpace />
      <RowComp title="환불금액">
        {/* <Input value={sourceObj.realMoney-sourceObj.remainMoney} /> */}
        <FormattedNumber
          value={sourceObj.realMoney - sourceObj.remainMoney}
          //                    style="currency"
          currency={"kor"}
          // minimumFractionDigits={minimum}
          // maximumFractionDigits={maximum}
        />
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
        <CSpace />
        <TextArea rows={7} />
      </div>
    </div>
  );
}

//예약삭제
function DelteReservationForm(props) {
  const eventObj = props.eventObj;
  const sourceObj = eventObj.source;

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <TextLineWrapper title="산모 이름" content={sourceObj.name} />
      <CSpace />
      <TextLineWrapper title="예약기간" content={toRangeString(sourceObj)} />
      <CSpace />
      <TextLineWrapper
        title="총금액"
        content={intl.formatNumber(sourceObj.realMoney)}
      />
    </div>
  );
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
