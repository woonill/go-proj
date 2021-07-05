import moment from "moment";



function toChartData(dataList) {

  let totalCount = {
    "room-grade-1":{},
    "room-grade-3":{}
  };

  let roomDataMap = {}
  let rangeObj = {}

  dataList.forEach(element => {


    let fmf = moment(element.fromDate)
    let emf = moment(element.toDate);


    //YYYY-MM  형식으로 중복된건 빼고 list 로 만든다 [2021-06,2021-07,2021-08]
    let fstr = fmf.format("YYYY-MM");
    if(rangeObj[fstr] === undefined) {
      rangeObj[fstr] = fstr
    }

    let estr = emf.format("YYYY-MM");
    if(rangeObj[estr] === undefined) {
      rangeObj[estr] = estr;
    }


    const id = element.roomGradeNo;
    const roomGradeTotalObj = totalCount["room-grade-"+id]
    if(roomGradeTotalObj !== undefined) { //골드 팬트하우스 빼고 다른방은 패스 

        let dueDateObj = roomGradeTotalObj[element.dueDate]
        if(dueDateObj !== undefined) {
          dueDateObj = 0
        }

        dueDateObj = dueDateObj+1;
        roomGradeTotalObj[element.dueDate] = dueDateObj //count 를 하나추가하고 update 한다
    }

    let roomKey = newRoomNo(element)
    let roomDataArray = roomDataMap[roomKey]
    if(roomDataArray === undefined) {
      roomDataArray = [];
      roomDataMap[roomKey] = roomDataArray
    }
    roomDataArray.push(toRoomData(element))
  });

  const list = [];

  const colDataArraySort = (a, b) => {
    var value1 = a["from"];
    var value2 = b["from"];
      return Date.parse(value1) - Date.parse(value2);
  }

  const keys = Object.keys(roomDataMap)
  keys.forEach((e)=>{

    let colDataArray = roomDataMap[e];
    colDataArray.sort(colDataArraySort)

    list.push({
      key: e,
      name: e,
      //      apriReport: fDataArray,
      colDataArray: colDataArray,
    });


  })

  const skeys = Object.keys(rangeObj);

  let data =  {
    list:list,
    range:skeys
  }

  return data;
}

function newRoomNo(record) {

  // private String roomName;
  // private String rgName;
  return record.rgName+" "+record.room+"호";
}


function toRoomData(record){

  return {
    key:""+record.no,
    from:record.fromDate,
    to:record.toDate,
    name:record.name
  }
}




function toRoomGradeReportFragment(record){
  return {
    key: record.no,
    dataVal: "10",
    // whenDay:i+5,
    // month:"4",
    // name: i+"a-total",  
  }
}


function GenerateChartData() {
    const data = [];

    data.push({
      key: "totallReport:" + 0,
      name: "Total-" + 0,
      //      apriReport: fDataArray,
      colDataArray: newTotalData(),
    });
  
    data.push({
      key: "totallReport:" + 1,
      name: "Total-" + 0,
      //      apriReport: fDataArray,
      colDataArray: newTotalData(),
    });
  
    data.push({
      key: "totallReport:" + 2,
      name: "Total-" + 0,
      //      apriReport: fDataArray,
      colDataArray: newTotalData(),
    });
  
    // data.push(newTotalData())
    // data.push(newTotalData())
  
    let fDataArray = [];
  
    fDataArray.push({
      //19까지 데이터
      key: "0-20210401",
      from: "2021-04-01",
      to: "2021-04-10",
      name: 0 + "앞 data",
    });
  
    fDataArray.push({
      //19 뒤로 오는거
      key: "0-1-20210407",
      from: "2021-04-7",
      to: "2021-04-18",
      name: 0 + "앞 data",
    });
  
    fDataArray.push({
      //19 뒤로 오는거
      key: "0-1-20210507",
      from: "2021-04-22",
      to: "2021-05-01",
      name: 0 + "앞 5 data",
    });
  
    fDataArray.push({
      //19 뒤로 오는거
      key: "0-1-20210507",
      from: "2021-05-7",
      to: "2021-05-15",
      name: 0 + "앞 5 data",
    });
  
    fDataArray.push({
      //19 뒤로 오는거
      key: "0-1-20210510",
      from: "2021-05-10",
      to: "2021-05-30",
      name: 0 + "앞 5 data",
    });
  
    data.push({
      key: 0,
      name: "Room-" + 0,
      //      apriReport: fDataArray,
      colDataArray: fDataArray,
    });
  
    for (let i = 1; i <= 10; i++) {
      let colDataArray = [];


      let colData = {
        //19까지 데이터
        key: "20210401",
        group:""+i,
        from: "2021-04-01",
        to: "2021-04-10",
        name: i + "앞 data",
      };
  
      let colData2 = {
        //19 뒤로 오는거
        key: "20210415",
        group:""+i,
        from: "2021-04-15",
        to: "2021-04-30",
        name: i + "앞 data",
      };
  
      let colData3 = {
        //19 뒤로 오는거
        key: "20210501",
        from: "2021-05-01",
        to: "2021-05-15",
        name: i + "앞 data",
      };
  
      let colData4 = {
        //19 뒤로 오는거
        key: "20210501",
        from: "2021-05-17",
        to: "2021-05-27",
        name: i + "앞 data",
      };
  
      colDataArray.push(colData);
      colDataArray.push(colData2);
      colDataArray.push(colData3);
      colDataArray.push(colData4);
  
      let obData = {
        key: i,
        name: "Room-" + i,
        //        apriReport: colDataArray,
        //      marthReport:colDataArray,
        colDataArray: colDataArray,
      };
  
      data.push(obData);
    }

    return data;
  
}



function newTotalData() {

    let fDataArray = [];

    for(let i = 0; i<10 ;i++) {
        fDataArray.push({
            //19까지 데이터
            key: i+"a-total",
            dataVal: "10",
            whenDay:i+5,
            month:"4",
            name: i+"a-total",
          });
    }    
    return fDataArray;
}



const tableData = [
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

export  {
    GenerateChartData,toChartData
}



