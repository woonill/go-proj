import { Table,Button } from 'antd';

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

    // {
    //   title: '상셰보기',
    //   key: 'tags',
    //   dataIndex: 'tags',
    //   render: tags => (
    //     <>
    //       {tags.map(tag => {
    //         let color = tag.length > 5 ? 'geekblue' : 'green';
    //         if (tag === 'loser') {
    //           color = 'volcano';
    //         }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag.toUpperCase()}
    //           </Tag>
    //         );
    //       })}
    //     </>
    //   ),
    // },
    {
      title: '상세보기',
//      key: 'action',
      render: (text, record) => (
        // <Space size="middle">
        //   <a>Invite {record.name}</a>
        //   <a>Delete</a>
        // </Space>
        <Button onClick={(e)=>{
//          console.log("click now",record.no)
          window.location.href="/reservation/view?reservation_no="+record.no
        }}>
          상세보기
        </Button>
      ),
    },
  ];
  
  


  function ChartDataView(props) {
      return (
        <Table columns={columns} dataSource={props.dataList} pagination={false}/>
      )

  }

  export {
    ChartDataView
  }