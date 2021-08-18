import React, { useEffect, useState, useContext } from "react";
import {
  Select,
  DatePicker,
  Input,
  InputNumber,
  Button,
  Radio,
  message,
} from "antd";
import moment from "moment";
import { createIntl } from "react-intl";
import { GlobalProps } from "./chart_view_context";
import styles from "./reservation_popup.module.scss";
import TextArea from "antd/lib/input/TextArea";
import { ServerEventContext } from "../server_event_context.js";

const { Option } = Select;
const { RangePicker } = DatePicker;

const newDefaultItem = (index = 0) => {
  return {
    i: index,
    type: 0,
    amount: 0,
    payMethod: GlobalProps.PayMethodList[0].type,
    insertTime: moment(),
  };
};

const intl = createIntl({
  locale: "KOR",
  messages: {},
});

const toRangeString = (event) => event.fromDate + " ~ " + event.toDate;

function newCostEventObserver2(itemList, itemListUpdate) {
  return (e) => {
    let isCall = true;
    let obs = itemList[e.index];

    if (e.type === "updateAmount") {
      obs.amount = e.amount;
    } else if (e.type === "updatePaymentType") {
      obs["payType"] = e.payType;
    } else if (e.type === "updateInserttime") {
      obs["insertTime"] = e.insertTime;
    } else if (e.type === "updatePaymentMethod") {
      obs["payMethod"] = e.payMethod;
    } else {
      isCall = false;
    }

    if (isCall) {
      let newArr = [...itemList]; // copying the old datas array
      itemList[e.index] = obs; // replace e.target.value with whatever you want to change it to
      itemListUpdate(newArr);
    }
  };
}

function Container(props) {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        //      justifyContent: "end",
        flexDirection: "column",
        overflow: "scroll",
      }}
    >
      {props.children}
    </div>
  );
}

function PaymentTypeSelectComp(props) {
  if (props.item.payType === undefined || props.item.payType === null) {
    return null;
  }

  return (
    <Select
      //    showSearch
      //  style={{ width: "100px" }}
      style={{ width: "100%" }}
      defaultValue={props.item.payType}
      onChange={props.onChange}
    >
      {GlobalProps.SetupPayTypeList.map((me) => {
        return (
          <Option key={me.type} value={me.type}>
            {me.name}
          </Option>
        );
      })}
    </Select>
  );
}

function PaymentMethodSelectComp(props) {
  const selectedVal = props.defaultVal === undefined ? 0 : props.defaultVal;

  return (
    <div style={props.style}>
      <Select
        showSearch
        // style={{ width: "100px" }}
        style={{ width: "100%" }}
        defaultValue={selectedVal}
        onChange={props.onChange}
      >
        {GlobalProps.PayMethodList.map((me) => {
          return (
            <Option key={me.type} value={me.type}>
              {me.name}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}

function CSpace() {
  return <div style={{ width: "2px" }} />;
}

const ActionButtonGroupView = (props) => {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        padding: "10px",
        // backgroundColor: "red",
      }}
    >
      <div
        style={{
  //        display: "flex",
          width: "100%",
//          flex: 9,
        }}
      />
      {props.buttons.map((buttonProp, index) => {
        const isCancel = buttonProp.isCancel;
        let iconClassName =
          isCancel !== undefined && isCancel
            ? "icon-dialog-no"
            : "icon-dialog-yes";

        return (
          <div
            key={index}
            style={{
              width: "100px",
//              backgroundColor: "black",
            }}
          >
            <button
              type="button"
              className={styles.ActionButton}
              onClick={buttonProp.onClick}
            >
              <span style={{
                display:"flex",
                // backgroundColor:"black",
                height:"100%",
                alignItems:"center",
                marginRight:"1px",
                }}>
                <i className={iconClassName}/>
              </span>
              <span className="text">{buttonProp.name}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

const AddButtonView = (props) => {
  if (props.index === props.total - 1) {
    return <Button onClick={props.onClick}>+</Button>;
  }
  return null;
};

function CostItemComp(props) {
  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        //backgroundColor:"black",
        //flexDirection: "row",
        //justifyContent:"space-between",
        //alignContent:"stretch"
      }}
    >
      {/* <div style={{ width: "140px", display: "flex" }}>
        <PaymentTypeSelectComp
          item={props.item}
          style={{ width: "80px", padding: "10" }}
          onChange={(e) => {
            props.eObserver({
              index: props.index,
              type: "updatePaymentType",
              payType: e,
            });
          }}
        />
      </div> */}

      {props.item.payType !== undefined && (
        <div style={{ width: "140px", display: "flex" }}>
          <PaymentTypeSelectComp
            item={props.item}
            style={{ width: "80px", padding: "10" }}
            onChange={(e) => {
              props.eObserver({
                index: props.index,
                type: "updatePaymentType",
                payType: e,
              });
            }}
          />
        </div>
      )}

      <div style={{ width: "400px", display: "flex" }}>
        <CSpace />
        <PaymentMethodSelectComp
          style={{ width: "30%", padding: "10" }}
          defaultVal={props.item.payMethod}
          onChange={(e) => {
            props.eObserver({
              index: props.index,
              type: "updatePaymentMethod",
              payMethod: e,
            });
          }}
        />
        <CSpace />
        <InputNumber
          //        style={{ width: "120px" }}
          style={{ width: "35%" }}
          maxLength={20}
          placeholder="금액"
          formatter={(value) => intl.formatNumber(value)}
          defaultValue={props.item.amount}
          onChange={(e) => {
            //e.preventDefault();
            props.eObserver({
              index: props.index,
              type: "updateAmount",
              amount: parseInt(e),
            });
          }}
        />
        <CSpace />
        <DatePicker
          style={{ width: "35%" }}
          value={props.item.insertTime}
          format={"YYYY-MM-DD"}
          onChange={(e) => {
            props.eObserver({
              index: props.index,
              type: "updateInserttime",
              insertTime: e,
            });
          }}
        />
      </div>
      <CSpace />
      <div style={{ display: "flex", flex: 1 }}>
        <AddButtonView
          index={props.index}
          total={props.itemLen}
          onClick={props.addOnClick}
        />
        <Button onClick={props.removeOnClick}>-</Button>
      </div>
    </div>
  );
}

function newCancelHandler(props) {
  return function (e) {
    props.dispach({ type: "Cancel" });
  };
}

const passtiveFunc = (e) => {};

function TextAreaInput(props) {
  const onChangeFunc =
    props.onChange === undefined ? passtiveFunc : props.onChange;

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
      <TextArea rows={7} placeholder={"메모"} onChange={onChangeFunc} />
    </div>
  );
}

function getRoomListOf(roomMap, key) {
  return roomMap[key].roomList;
}

function RoomLevelComp(props) {
  const selectedVal = props.defaultVal === undefined ? 0 : props.defaultVal;
  //  console.log("SelectValue",props.defaultVal,props.roomMap)

  return (
    <div className="field small select">
      <Select
        defaultValue={selectedVal}
        //showSearch
        style={{ width: "100%" }}
        onChange={props.onChange}
      >
        {Object.keys(props.roomMap).map((key) => {
          const name = props.roomMap[key].name;
          return (
            <Option key={key} value={key}>
              {name}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}

function RoomListComp(props) {
  const selectedVal = props.defaultVal === undefined ? 0 : props.defaultVal;

  return (
    <div className="field small select">
      <Select
        defaultValue={selectedVal}
        showSearch
        style={{ width: "100%" }}
        placeholder="객실"
        onChange={props.onChange}
      >
        {props.roomList.map((e) => {
          return (
            <Option key={e.no} value={e.no}>
              {e.name}
            </Option>
          );
        })}
      </Select>
    </div>
  );
}

//개실이동
//complete 21.08.04 22:37
//httpPost ok
//input check 해야함
function MoveRoomForm(props) {
  //1,새로움직이는 방은 원래 데이터의 from ~ to 날짜 않에서만 이동가능하다

  const sourceObj = props.eventObj.source;
  //  console.log("SourceObj", sourceObj);
  const roomMap = props.roomMap;

  const defaultRoomList = getRoomListOf(roomMap, sourceObj.roomGradeNo);
  const defaultRoom = defaultRoomList.filter(newRoomFilter(sourceObj.room))[0];

  let [inParam, updateObj] = useState({
    roomGradeNo: sourceObj.roomGradeNo,
    roomObj: defaultRoom,
    roomList: defaultRoomList,
    rangeDate: [moment(sourceObj.fromDate), moment(sourceObj.toDate)],
  });

  const okHandler = (e) => {
    if (inParam.roomObj.no === sourceObj.room) {
      message.info("같은방 입니다");
      return;
    }

    // if (inParam.rangeDate == null) {
    //   message.info("이동날짜 선택");
    //   return;
    // }

    const currentRoomList = getRoomListOf(roomMap, inParam.roomGradeNo);
    if (
      currentRoomList.filter((e) => {
        return e.no === inParam.roomObj.no;
      }).length < 1
    ) {
      message.info("룸과 레벨이 불일치");
      return;
    }

    const rangeDate = inParam.rangeDate;

    let param = {
      reservation_no: sourceObj.no,
      reservation_room_no: sourceObj.reserRoomNo,
      room_no: sourceObj.room,
      from_date: sourceObj.fromDate,
      to_date: sourceObj.toDate,
      t_room_no: inParam.roomNo,
      t_from_date: rangeDate[0].format("YYYY-MM-DD"),
      t_to_date: rangeDate[1].format("YYYY-MM-DD"),
    };

    // if (sourceObj.reserRoomNo > 0) {
    //   param.reservation_room_no = sourceObj.reserRoomNo;
    // }

    props.dispach({
      type: "PostChangeRoom",
      params: param,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        marginBottom: "20px",
      }}
    >
      <table className="table-entry">
        <colgroup>
          <col width="120" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">객실 등급</th>
            <td>
              <RoomLevelComp
                roomMap={roomMap}
                defaultVal={sourceObj.rgName}
                onChange={(e) => {
                  //                  updateRoomList(getRoomListOf(roomMap, e));
                  updateObj({
                    ...inParam,
                    roomGradeNo: e,
                    roomList: getRoomListOf(roomMap, e),
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">객실</th>
            <td>
              <RoomListComp
                defaultVal={sourceObj.roomName}
                roomList={inParam.roomList}
                onChange={(v) => {
                  let currentRoom = inParam.roomList.filter(
                    newRoomFilter(v)
                  )[0];
                  updateObj({
                    ...inParam,
                    roomNo: v,
                    roomObj: currentRoom,
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">날짜</th>
            <td>
              <RangePicker
                format="YYYY-MM-DD"
                value={inParam.rangeDate}
                onCalendarChange={(val) => {
                  updateObj({
                    ...inParam,
                    rangeDate: val,
                  });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <ActionButtonGroupView
        buttons={[
          { name: "객실이동", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props), isCancel: true },
        ]}
      />
    </div>
  );
}

//기간연장
//complete 21.08.04 22:37
//httpPsot ok
//로직 테스트 필요
function YenzangForm(props) {
  const source = props.eventObj.source;

  let [sParam, updateParam] = useState({
    memoStr: "",
    itemList: [newDefaultItem()],
    rangeDate: [moment(source.fromDate), moment(source.toDate)],
  });

  let itemList = sParam.itemList;

  const eObserver = newCostEventObserver2(sParam.itemList, function (dataList) {
    updateParam({
      ...sParam,
      itemList: dataList,
    });
  });

  const okHandler = function (bEvent) {
    // console.log("Memo",sParam,sParam.rangeDate[0].format("YYYY-MM-DD"))
    let param = {
      reservation_no: source.no,
      memo: sParam.memoStr,
      from_date: sParam.rangeDate[0].format("YYYY-MM-DD"),
      to_date: sParam.rangeDate[1].format("YYYY-MM-DD"),
      pay_count: itemList.length,
      real_money: source.realMoney,
    };

    itemList.forEach((e) => {
      const index = e.i;
      param["pay_type_" + index] = GlobalProps.ExtendDateTypeCode().type;
      param["inserttime_" + index] = e["insertTime"].format("YYYY-MM-DD");
      param["pay_method_" + index] = e["payMethod"];
      param["payment_" + index] = e["amount"];
    });

    props.dispach({
      type: "ExtendReDates", //기간연장
      params: param,
    });
  };

  return (
    <Container>
      <table className="table-entry">
        <colgroup>
          <col width="120" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">예약기간</th>
            <td>
              <RangePicker
                format="YYYY-MM-DD"
                value={sParam.rangeDate}
                onCalendarChange={(e) => {
                  sParam.rangeDate = e;
                  updateParam({
                    ...sParam,
                    rangeDate: e,
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">기존 금액</th>
            <td className="e_real_money">
              {intl.formatNumber(source.realMoney)}
            </td>
          </tr>
          <tr>
            <th scope="row">추가금액</th>
            <td>
              {itemList.map((e, index) => {
                return (
                  <CostItemComp
                    item={e}
                    index={index}
                    itemLen={itemList.length}
                    eObserver={eObserver}
                    addOnClick={(ae) => {
                      const sIndex = index + 1;
                      let newArray = [...sParam.itemList];
                      newArray.push({
                        i: sIndex,
                        //type: moneyTypeList[0],
                        payMethod: GlobalProps.PayMethodList[0].type,
                        amount: 0,
                        insertTime: moment(),
                      });
                      updateParam({
                        ...sParam,
                        itemList: newArray,
                      });
                    }}
                    removeOnClick={(re) => {
                      if (itemList.length <= 1) {
                        return;
                      }
                      //updateItems(itemList.filter((item) => item.i !== index));
                    }}
                  />
                );
              })}
            </td>
          </tr>
          <tr>
            <th scope="row">메모</th>
            <td>
              <div className="field full">
                <TextAreaInput
                  onChange={(e) => {
                    e.preventDefault();
                    sParam.memoStr = e.target.value;
                    updateParam({
                      ...sParam,
                      memoStr: e.target.value,
                    });
                  }}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <ActionButtonGroupView
        buttons={[
          { name: "기간연장", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props), isCancel: true },
        ]}
      />
    </Container>
  );
}

//퇴실확정
//complete 21.08.04 22:37
function ReversionCancelPopup(props) {
  const source = props.eventObj.source;

  const okHandler = (e) => {
    ///reservation/confirmexit
    const param = {
      reservation_no: source.no,
      name: source.name,
    };

    // console.log("param", param);
    props.dispach({
      type: "CancelRoom",
      params: param,
    });
  };

  return (
    <div>
      <table className="table-entry">
        <colgroup>
          <col width="120" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">산모이름</th>
            <td id="name_d">{source.name}</td>
          </tr>
          <tr>
            <th scope="row">입실 기간</th>
            <td id="period_d">{toRangeString(source)}</td>
          </tr>
        </tbody>
      </table>
      <ActionButtonGroupView
        buttons={[
          { name: "퇴실확정", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props),isCancel: true  },
        ]}
      />
    </div>
  );
}

//계약일수정
//complete 21.08.04 22:37
//httpPost 21.08.96 14:11 통과
function UpdateDueDateForm(props) {
  const source = props.eventObj.source;
  let changeDate = moment(source.contractDate);

  const okHandler = (e) => {
    const param = {
      reservation_no: props.eventObj.source.no,
      contract_date: changeDate.format("YYYY-MM-DD"),
    };

    //    console.log("Change contract param", param);
    props.dispach({
      type: "UpdateContractDate",
      params: param,
    });
  };

  return (
    <Container>
      <table className="table-entry">
        <colgroup>
          <col width="120" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">계약일</th>
            <td>
              <DatePicker
                defaultValue={changeDate}
                format={"YYYY-MM-DD"}
                onChange={(e) => {
                  changeDate = e;
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <ActionButtonGroupView
        buttons={[
          { name: "수정", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props),isCancel: true  },
        ]}
      />
    </Container>
  );
}

//결제내역
//httpGet 통과
function FinaceListView(props) {
  const [paymentList, updatePaymentList] = useState([]);

  useEffect(() => {
    props.loadData({
      type: "FetchPaymentHistorylist",
      params: { reservation_no: props.eventObj.no, bno: 3 },
      resultHandler: function (data) {
        //        console.log(data);
        updatePaymentList(data.payment_history);
      },
    });
  }, [props]);

  return (
    <Container>
      <table className="normal-list">
        <colgroup>
          <col width="*" />
          <col width="*" />
          <col width="*" />
          <col width="*" />
          <col width="*" />
          <col width="*" />
          <col width="37.5%" />
        </colgroup>
        <thead>
          <tr>
            <th scope="col">결제종류</th>
            <th scope="col">결제수단</th>
            <th scope="col">총금액</th>
            <th scope="col">결제 금액</th>
            <th scope="col">잔금</th>
            <th scope="col">결제일</th>
            <th scope="col">메모</th>
          </tr>
        </thead>
        <tbody id="payment_history_list">
          {paymentList.map((e, i) => {
            const lastMoney = e["real_money"] - e["payment"];
            let sTime = e["inserttime"] / 1000;
            return (
              <tr>
                <td>{GlobalProps.getSetupPayType(e.type).name}</td>
                <td>{GlobalProps.getPayMethodOfCode(e.method).name}</td>
                <td className="right">{intl.formatNumber(e["real_money"])}</td>
                <td className="right">{intl.formatNumber(e["payment"])}</td>
                <td className="right">{intl.formatNumber(lastMoney)}</td>
                <td>{moment.unix(sTime).format("YYYY-MM-DD")}</td>
                <td className="left">
                  <span>{e.memo}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ActionButtonGroupView
        buttons={[{ name: "닫기", onClick: newCancelHandler(props),isCancel: true  }]}
      />
    </Container>
  );
}

const newRoomFilter = (no) => {
  return (e) => {
    return e.no === no;
  };
};

//입실확정
//complete 21.08.04 22:37
//httpPost 통과
function ReservationConfirmForm(props) {
  const sourceObj = props.eventObj.source;

  const roomMap = props.roomMap;

  const defaultRoomList = getRoomListOf(roomMap, sourceObj.roomGradeNo);
  const defaultRoom = defaultRoomList.filter((e) => {
    return e.no === sourceObj.room;
  })[0];

  const newItem = (index = 0, amount = 0) => {
    return {
      ...newDefaultItem(),
      i: index,
      payType: GlobalProps.getDefaultSetupPayType().type,
      amount: amount,
    };
  };

  const [inObj, updateObj] = useState({
    // roomGrade: sourceObj.roomGradeNo,
    // roomNo: sourceObj.room,
    roomGradeNo: sourceObj.roomGradeNo,
    roomObj: defaultRoom,
    roomList: defaultRoomList,
    itemList: [newItem(0, sourceObj.remainMoney)],
    rangeDate: [moment(sourceObj.fromDate), moment(sourceObj.toDate)],
    lastMoney: sourceObj.remainMoney,
  });

  let itemList = inObj.itemList;

  const calLastMoney = (itemList) => {
    const calAmount = itemList.reduce((total, newEl) => {
      return total + newEl.amount;
    }, 0);

    return sourceObj.remainMoney - calAmount;
  };

  const observer = newCostEventObserver2(itemList, function (dataList) {
    updateObj({
      ...inObj,
      itemList: dataList,
      lastMoney: calLastMoney(dataList),
    });
  });

  const okHandler = (e) => {
    const currentRoomList = getRoomListOf(roomMap, inObj.roomGradeNo);
    if (
      currentRoomList.filter((e) => {
        return e.no === inObj.roomObj.no;
      }).length < 1
    ) {
      message.info("룸과 레벨이 불일치");
      return;
    }

    const param = {
      reservation_no: sourceObj.no,
      reservation_room_no: sourceObj.reserRoomNo,
      from_date: inObj.rangeDate[0].format("YYYY-MM-DD"),
      to_date: inObj.rangeDate[1].format("YYYY-MM-DD"),
      pay_type: sourceObj.payType,
      issetup: sourceObj.inState,
      // t_room_no: inObj.roomNo,
      // t_from_date: inObj.rangeDate[0].format("YYYY-MM-DD"),
      // t_to_date: inObj.rangeDate[1].format("YYYY-MM-DD"),
      room_no: inObj.roomObj.no,
      room_grade_no: inObj.roomObj.gradeNo,
      room_name: inObj.roomObj.name,
      pay_count: itemList.length,
      real_money: sourceObj.realMoney,
      remain_money: sourceObj.remainMoney,
    };

    inObj.itemList.forEach((e) => {
      const index = e.i;
      const inerTimeStr = e["insertTime"].format("YYYY-MM-DD");
      param["pay_type_" + index] = e["payType"];
      param["inserttime_" + index] = inerTimeStr;
      param["pay_method_" + index] = e["payMethod"];
      param["payment_" + index] = e["amount"];
    });

    //    console.log("ConfirmCheckIn", param);

    props.dispach({
      type: "ConfirmCheckIn",
      params: param,
    });
  };

  return (
    <Container>
      <table className="table-entry">
        <colgroup>
          <col width="120" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">객실 등급</th>
            <td>
              <RoomLevelComp
                defaultVal={sourceObj.rgName}
                roomMap={roomMap}
                onChange={(e) => {
                  updateObj({
                    ...inObj,
                    roomGradeNo: e,
                    roomList: getRoomListOf(roomMap, e),
                  });
                  //                  updateRoomList(getRoomListOf(roomMap, e));
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">객실</th>
            <td>
              <RoomListComp
                defaultVal={sourceObj.roomName}
                roomList={inObj.roomList}
                onChange={(v) => {
                  let currentRoom = inObj.roomList.filter((e) => {
                    return e.no === v;
                  })[0];

                  updateObj({
                    ...inObj,
                    roomNo: v,
                    roomObj: currentRoom,
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">예약기간</th>
            <td>
              <RangePicker
                format="YYYY-MM-DD"
                value={inObj.rangeDate}
                onCalendarChange={(val) => {
                  updateObj({
                    ...inObj,
                    rangeDate: val,
                  });
                }}
              />
            </td>
          </tr>
          {/* <tr className="pay_type_full" style={{display: "none;"}}>
            <th scope="row">결제방법</th>
            <td id="full_pay_type">완납</td>
          </tr> */}
          <tr className="pay_type_full" style={{ display: "none;" }}>
            <th scope="row">총금액</th>
            <td className="m_pretotal">
              {intl.formatNumber(sourceObj.realMoney)}
            </td>
          </tr>
          {/* <tr className="pay_type_deposit">
            <th scope="row">총금액</th>
            <td className="m_pretotal">6,300,000</td>
          </tr> */}
          <tr className="pay_type_deposit">
            <th scope="row">잔금</th>
            <td id="m_preremain">{intl.formatNumber(sourceObj.remainMoney)}</td>
          </tr>
          <tr className="pay_type_deposit">
            <th scope="row">최종입금액</th>
            <td>
              {itemList.map((e, index) => {
                return (
                  <div style={{ display: "flex", flex: 1, padding: "2px" }}>
                    <CostItemComp
                      eObserver={observer}
                      item={e}
                      index={index}
                      itemLen={itemList.length}
                      addOnClick={(ae) => {
                        const sIndex = index + 1;
                        let newArray = [...itemList, newItem(sIndex)];
                        updateObj({
                          ...inObj,
                          itemList: newArray,
                        });
                      }}
                      removeOnClick={(re) => {
                        if (itemList.length <= 1) {
                          return;
                        }
                        const newItemArray = itemList.filter(
                          (item) => item.i !== index
                        );
                        updateObj({
                          ...inObj,
                          itemList: newItemArray,
                        });
                      }}
                    />
                  </div>
                );
              })}
            </td>
          </tr>
          <tr className="pay_type_deposit">
            <th scope="row">잔액</th>
            <td>
              <div className="field xsmall">
                <Input
                  maxLength={20}
                  disabled={true}
                  // value={intl.formatNumber(inObj.lastMoney)} />
                  value={intl.formatNumber(inObj.lastMoney)}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <ActionButtonGroupView
        buttons={[
          { name: "입실확인", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props), isCancel: true },
        ]}
      />
    </Container>
  );
}

//잔금결제
//complete 21.08.04 22:37
//httpEvent 통과
//로직처리
function BalanceView(props) {
  let sourceObj = props.eventObj.source;

  const newItem = (index = 0, amount = 0) => {
    let obj = {
      ...newDefaultItem(),
      i: index,
      amount: amount,
    };

    return obj;
  };

  const calLastMoney = (itemList) => {
    let calAmount = itemList.reduce((total, newEl) => {
      return total + newEl.amount;
    }, 0);

    return sourceObj.remainMoney - calAmount;
  };

  let [sParam, updateParam] = useState(() => {
    let initParam = {
      memoStr: "",
      itemList: [newItem(0, sourceObj.remainMoney)],
      lastMoney: sourceObj.remainMoney,
    };

    return initParam;
  });

  let itemList = sParam.itemList;

  const eObserver = newCostEventObserver2(sParam.itemList, function (dataList) {
    updateParam({
      ...sParam,
      itemList: dataList,
      lastMoney: calLastMoney(dataList),
    });
  });

  const okHandler = function (bEvent) {
    let param = {
      reservation_no: sourceObj.no,
      memo: sParam.memoStr,
      pay_count: itemList.length,
      real_money: sourceObj.realMoney,
      remain_money: sourceObj.remainMoney,
    };

    sParam.itemList.forEach((e) => {
      const index = e.i;
      param["pay_type_" + index] = GlobalProps.BalancePayTypeCode().type;
      param["inserttime_" + index] = e["insertTime"].format("YYYY-MM-DD");
      param["pay_method_" + index] = e["payMethod"];
      param["payment_" + index] = e["amount"];
    });

    props.dispach({
      type: "BalancePayment",
      params: param,
    });
  };

  return (
    <Container>
      <table className="table-entry">
        <colgroup>
          <col width="120" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">총금액</th>
            <td id="rp_pretotal">{intl.formatNumber(sourceObj.realMoney)}</td>
          </tr>
          <tr>
            <th scope="row">잔금</th>
            <td id="rp_preremain">
              {intl.formatNumber(sourceObj.remainMoney)}
            </td>
          </tr>
          <tr>
            <th scope="row">잔금 / 입금액</th>
            <td>
              {itemList.map((e, index) => {
                return (
                  <CostItemComp
                    item={e}
                    index={index}
                    itemLen={itemList.length}
                    eObserver={eObserver}
                    addOnClick={(ae) => {
                      const sIndex = index + 1;
                      const newItemObj = newItem(sIndex);
                      //                      console.log("updated",newItemObj)
                      let newArray = [...itemList, newItemObj];
                      updateParam({
                        ...sParam,
                        itemList: newArray,
                      });
                    }}
                    removeOnClick={(re) => {
                      if (itemList.length <= 1) {
                        return;
                      }
                      const newItemArray = itemList.filter(
                        (item) => item.i !== index
                      );
                      updateParam({
                        ...sParam,
                        itemList: newItemArray,
                      });
                    }}
                  />
                );
              })}
            </td>
          </tr>
          <tr>
            <th scope="row">잔액</th>
            <td>
              <div className="field xsmall">
                <input
                  id="rp_remain_money"
                  type="text"
                  className="i-text"
                  value={sParam.lastMoney}
                  disabled={true}
                />
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row">메모</th>
            <td>
              <TextAreaInput
                onChange={(e) => {
                  updateParam({
                    ...sParam,
                    memoStr: e.target.value,
                  });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <ActionButtonGroupView
        buttons={[
          { name: "잔금결제", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props), isCancel: true },
        ]}
      />
    </Container>
  );
}

// PAY_TYPE_ADD_RESERVATION = 0;
// PAY_TYPE_PAY_REMAIN = 1;
// PAY_TYPE_SOME_REFUNDS = 2;
// PAY_TYPE_CANCEL_RESERVATION = 3;
// PAY_TYPE_ALL_REFUNDS = 4;
// PAY_TYPE_GIVEUP_TOTAL = 5;
// PAY_TYPE_GIVEUP_REFUND = 6;
// PAY_TYPE_EXTEND_DATE = 7;

//환불,예약취소  두기능이 같다 다만 type_code 가 틀릴뿐이다
//form은 같은걸 사용하고 type은 props를통해 외부에서 받기로한다
//httpPost 환불 ok type=2
//httpPost 예약취소는 type=3   ok
function RefundForm(props) {
  let { headerInfo } = useContext(ServerEventContext);

  const sourceObj = props.eventObj.source;

  const title = props.type === 2 ? "환불" : "예약취소";

  const isRefund = () => {
    return props.type === 2;
  };

  const fromToStr = sourceObj.fromDate + "~" + sourceObj.toDate;

  const [sParam, updateObj] = useState({
    memoStr: "",
    amount: 0,
    isout: GlobalProps.RoomStateList[0],
    refundDate: moment(),
  });

  const okHandler = (e) => {
    if (sParam.memoStr === null || sParam.memoStr.length < 1) {
      message.info("메모 필수입력");
      return;
    }

    let param = {
      type: props.type,
      reservation_no: sourceObj.no,
      from_date: sourceObj.fromDate,
      to_date: sourceObj.toDate,
      isout: sParam.isout.type,
      out_date: "",
      payment: sourceObj.payment,
      real_money: sourceObj.realMoney,
      refund_date: sParam.refundDate.format("YYYY-MM-DD"),
      del_date: moment().format("YYYY-MM-DD"),
      del_manager: headerInfo.userName,
    };

    props.dispach({
      type: "PostRefund",
      params: param,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <table className="table-entry">
        <colgroup>
          <col width="120" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">환불 사유</th>
            <td id="txt_why">{title}</td>
          </tr>
          <tr>
            <th scope="row">기존 총금액</th>
            <td id="r_pretotal">{intl.formatNumber(sourceObj.realMoney)}</td>
          </tr>
          <tr>
            <th scope="row">기존 잔금</th>
            <td id="r_preremain">{sourceObj.remainMoney}</td>
          </tr>
          {isRefund() && (
            <tr id="r_rdate">
              <th scope="row">퇴실여부</th>
              <td>
                <Radio.Group
                  defaultValue={sParam.isout}
                  onChange={(e) => {
                    updateObj({
                      ...sParam,
                      isout: e,
                    });
                  }}
                  buttonStyle="solid"
                >
                  <Radio.Button value={GlobalProps.RoomStateList[0]}>
                    입실유지
                  </Radio.Button>
                  <Radio.Button value={GlobalProps.RoomStateList[1]}>
                    퇴실
                  </Radio.Button>
                </Radio.Group>
              </td>
            </tr>
          )}

          <tr id="r_rfdate">
            <th scope="row">환불일</th>
            <td>
              <DatePicker defaultValue={moment()} format={"YYYY-MM-DD"} />
            </td>
          </tr>
          <tr id="r_otdate" style={{ display: "none" }}>
            <th scope="row">퇴실일</th>
            <td>
              <DatePicker defaultValue={moment()} format={"YYYY-MM-DD"} />
            </td>
          </tr>
          {isRefund() && (
            <tr id="r_period">
              <th scope="row">기간</th>
              <td>{fromToStr}</td>
            </tr>
          )}
          <tr>
            <th scope="row">환불금액</th>
            <td>
              <InputNumber
                style={{ width: "120px" }}
                maxLength={20}
                formatter={(value) => intl.formatNumber(value)}
                defaultValue={sourceObj.realMoney - sourceObj.remainMoney}
                onChange={(e) => {
                  updateObj({
                    ...sParam,
                    amount: e,
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row" className="required">
              메모
            </th>
            <td>
              <div className="field full">
                <textarea
                  name=""
                  id="r_memo"
                  className="i-textarea"
                  placeholder="사유 필수 기입"
                  required=""
                  onChange={(e) => {
                    e.preventDefault();
                    updateObj({
                      ...sParam,
                      memoStr: e.target.value,
                    });
                  }}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <ActionButtonGroupView
        buttons={[
          { name: "환불", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props), isCancel: true },
        ]}
      />
    </div>
  );
}

//예약삭제
//complete 21.08.04 22:37
//httpPost ok
function DelteReservationForm(props) {
  const eventObj = props.eventObj;
  const sourceObj = eventObj.source;

  // const [sParam,updateObj] = useState({
  // })

  const okHandler = function (e) {
    let param = {
      reservation_no: sourceObj.no,
    };

    props.dispach({
      type: "DeleteReservationExe",
      params: param,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <table className="table-entry">
        <colgroup>
          <col width="120" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">산모 이름</th>
            <td id="name_d">{sourceObj.name}</td>
          </tr>
          <tr>
            <th scope="row">예약기간</th>
            <td id="period_d">{toRangeString(sourceObj)}</td>
          </tr>
          <tr>
            <th scope="row">총금액</th>
            <td id="realmoney_d">{intl.formatNumber(sourceObj.realMoney)}</td>
          </tr>
        </tbody>
      </table>

      <ActionButtonGroupView
        buttons={[
          { name: "예약삭제", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props),isCancel: true  },
        ]}
      />
    </div>
  );
}

//계약포기
//complete 21.08.04 22:37
//httpPost 완성
function CancelContractForm(props) {
  const sourceObj = props.eventObj.source;

  const [inObj, updateObj] = useState({
    amount: 0,
    onDate: moment(),
  });

  const okHandler = (e) => {
    let param = {
      reservation_no: sourceObj.no,
      from_date: sourceObj.fromDate,
      to_date: sourceObj.toDate,
      payment: sourceObj.payment,
      refund: inObj.amount,
      sleep_date: inObj.onDate.format("YYYY-MM-DD"),
    };

    props.dispach({
      type: "SleepReservation",
      params: param,
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <table className="table-entry">
        <colgroup>
          <col width="120" />
          <col width="*" />
        </colgroup>
        <tbody>
          <tr>
            <th scope="row">산모 이름</th>
            <td id="sl_name">{sourceObj.name}</td>
          </tr>
          <tr>
            <th scope="row">예약기간</th>
            <td id="sl_from_to">{toRangeString(sourceObj)}</td>
          </tr>
          <tr>
            <th scope="row">총금액</th>
            <td id="sl_realmoney">{intl.formatNumber(sourceObj.realMoney)}</td>
          </tr>
          <tr>
            <th scope="row">계약금</th>
            <td id="sl_payment">{intl.formatNumber(sourceObj.payment)}</td>
          </tr>
          <tr>
            <th scope="row">잔금</th>
            <td id="sl_remain">{intl.formatNumber(sourceObj.remainMoney)}</td>
          </tr>
          <tr>
            <th scope="row">환불금액</th>
            <td>
              {/* <FormattedNumber
                value={sourceObj.realMoney - sourceObj.remainMoney}
                currency={"kor"}
              /> */}

              <InputNumber
                style={{ width: "120px" }}
                maxLength={20}
                formatter={(value) => intl.formatNumber(value)}
                defaultValue={inObj.amount}
                onChange={(e) => {
                  updateObj({
                    ...inObj,
                    amount: e,
                  });
                }}
              />
            </td>
          </tr>
          <tr>
            <th scope="row">계약포기일</th>
            <td>
              <DatePicker
                defaultValue={inObj.onDate}
                format={"YYYY-MM-DD"}
                onChange={(e) => {
                  updateObj({
                    ...inObj,
                    onDate: e,
                  });
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <ActionButtonGroupView
        buttons={[
          { name: "계약포기", onClick: okHandler },
          { name: "취소", onClick: newCancelHandler(props), isCancel: true },
        ]}
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
  CancelContractForm,
  ReservationConfirmForm,
  ActionButtonGroupView,
};
