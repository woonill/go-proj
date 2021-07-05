import React, { useState, createContext } from 'react'



function doHttpGet(uri,params,fn) {


    let query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&'); 
//    let url = '/ajax/api/tableDataList?' + query;
    let url = uri+"?"+query;

    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        },
        mode: 'cors',
        cache: 'default'
      })
        .then(res => {
          return res.json()
        }).then((resMessage) => {  
          let data = resMessage.data.dataList;
 //         eventDispacher({type:"OnLoadCompletedResList",dataList:data})
          fn(data)
        }).catch(e=>{
          console.log("error",e)
        }) 

}


function emitHttpEvent(event) {

    if(event.type === "FetchTableDataList") {
        doHttpGet("/ajax/api/tableDataList",event.params,event.resultHandler)
    }
}



export const GantchartContext = createContext()
export const ServerEventContext = createContext()

const GantchartContextProvider = (props) => {


    const [showPopup, updatePopupState] = useState(false)

    const eventDispach = (e) => {

        if (e.type === "ShowPopup") {
            updatePopupState(true)
            return;
        }

        if(e.type === "ClosePopup") {
            updatePopupState(false);
            return;
        }

        if (e.type === "updateChartBarGroupView") {

        }

        console.log("return now");
    }



    return (
        <GantchartContext.Provider value={{ showPopup,eventDispach }}>
            {props.children}
        </GantchartContext.Provider>
    )
}

export default GantchartContextProvider

export {
    emitHttpEvent
}