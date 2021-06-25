


export default function newTotalData() {

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