import { Table,Button } from 'antd';

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: text => <a>{text}</a>,
    },
    {
      title: '연락처',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '출산예정일',
      dataIndex: 'fdate',
      key: 'fdate',
    },
    {
      title: '상태',
      dataIndex: 'state',
      key: 'state',
    },

    {
      title: '기간',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: '객실정보',
      dataIndex: 'homeInfo',
      key: 'homeInfo',
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
      key: 'action',
      render: (text, record) => (
        // <Space size="middle">
        //   <a>Invite {record.name}</a>
        //   <a>Delete</a>
        // </Space>
        <Button>
          상세보기
        </Button>
      ),
    },
  ];
  
  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      fdate: '2021-10-01',
      state:"퇴실완료",
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 42,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['loser'],

    },
    {
      key: '3',
      name: 'Joe Black',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 32,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['cool', 'teacher'],
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      fdate: '2021-10-01',
      state:"퇴실완료",
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 42,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['loser'],

    },
    {
      key: '3',
      name: 'Joe Black',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 32,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['cool', 'teacher'],
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      fdate: '2021-10-01',
      state:"퇴실완료",
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 42,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['loser'],

    },
    {
      key: '3',
      name: 'Joe Black',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 32,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['cool', 'teacher'],
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      fdate: '2021-10-01',
      state:"퇴실완료",
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 42,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['loser'],

    },
    {
      key: '3',
      name: 'Joe Black',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 32,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['cool', 'teacher'],
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      fdate: '2021-10-01',
      state:"퇴실완료",
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 42,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['loser'],

    },
    {
      key: '3',
      name: 'Joe Black',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 32,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['cool', 'teacher'],
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      fdate: '2021-10-01',
      state:"퇴실완료",
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 42,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['loser'],

    },
    {
      key: '3',
      name: 'Joe Black',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 32,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['cool', 'teacher'],
    },

    {
      key: '1',
      name: 'John Brown',
      age: 32,
      fdate: '2021-10-01',
      state:"퇴실완료",
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 42,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['loser'],

    },
    {
      key: '3',
      name: 'Joe Black',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 32,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['cool', 'teacher'],
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      fdate: '2021-10-01',
      state:"퇴실완료",
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 42,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['loser'],

    },
    {
      key: '3',
      name: 'Joe Black',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 32,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['cool', 'teacher'],
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      fdate: '2021-10-01',
      state:"퇴실완료",
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 42,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['loser'],

    },
    {
      key: '3',
      name: 'Joe Black',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 32,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['cool', 'teacher'],
    },
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      fdate: '2021-10-01',
      state:"퇴실완료",
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 42,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['loser'],

    },
    {
      key: '3',
      name: 'Joe Black',
      fdate: '2021-10-01',
      state:"퇴실완료",
      age: 32,
      address: '010-4474-9055',
      homeInfo:"[펜트하우스] 308호 (2021-04-16 ~ 2021-05-06)",
      tags: ['cool', 'teacher'],
    },


  ];


  function ChartDataView() {
      return (
        <Table columns={columns} dataSource={data} pagination={false}/>
      )

  }

  export {
    ChartDataView
  }