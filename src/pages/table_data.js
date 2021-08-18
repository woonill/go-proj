import { Table, } from 'antd';
import {ReservStateChecker } from "./chart_view_context";



function stateText(e) {

  if(ReservStateChecker.isPreInDespi(e)){//filter 1 
    return "입실예정(잔금미납)";
  }
  else if(ReservStateChecker.isPreInFull(e)){ //filter 2
    return "입실예정(잔금완납)";

  }
  else if(ReservStateChecker.isCheckInDespi(e)){ //filter 3
    return "입실완료(잔금미납)";

  }
  else if(ReservStateChecker.isCheckinFull(e)){ //filter 4
    return "입실완료(잔금완납)";
  }
  else if(ReservStateChecker.isMoveRoom(e)){ //filter 4
    return "입실완료(객실이동)";
  }
  else if(ReservStateChecker.isDrop(e)){ //filter 4
    return "계약포기";
  }
  else if(ReservStateChecker.isRevisit(e)){ //filter 4
    return "재방문";
  }
  else if(ReservStateChecker.isExitRoom(e)){ //filter 4
    return "퇴실";
  }
  else if(ReservStateChecker.isCancel(e)){ //filter 4
    return "취소";
  }
  else {
    return "none"
  }

}
const columns = [
    {
      title: '산모명',
      dataIndex: 'name',
//      key: 'name',
 //     render: text => <a>{text}</a>,
    },
    {
      title: '연락처',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '출산예정일',
      dataIndex: 'dueDate',
      key: 'fdate',
    },
    {
      title: '상태',
      dataIndex: 'state',
//      key: 'state',
      render: (text, record) => (
        <div>
          {stateText(record)}
        </div>
      ),
    },

    {
      title: '기간',
      dataIndex: 'days',
  //    key: 'age',
       render: text => <span>{text}일</span>,
 
    },
    {
      title: '객실정보',
      dataIndex: 'roomName',
//      key: 'homeInfo',
      render: (text, record) => (
        <div>
          [{record.rgName}]{record.roomName}({record.fromDate}~{record.toDate})
        </div>
      ),
    },
    {
      title: '상세보기',
      render: (text, record) => (
        <a href={"/reservation/view?reservation_no="+record.no}
           className="btn-middle bg-sky">

          <div style={{display:"flex",flex:1}}>
              <span style={{
                  display:"flex",
                  alignItems:"center",
                  marginRight:"1px",
                  }}>
                  <i className="icon-detail"></i>
                </span>              
                <span className="text">상세보기</span>          

          </div>
        </a>
      ),
    },
  ];
  
  


  function ChartDataView(props) {
      return (
        <Table 
        columns={columns} 
        dataSource={props.dataList} 
        pagination={false}/>
      )
  }

  export {
    ChartDataView
  }