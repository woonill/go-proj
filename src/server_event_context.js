import { createContext } from 'react'

function toUrl(uri,params) {

    if(params === null) {
      return uri;
    }
  
    let query = Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
    //    let url = '/ajax/api/tableDataList?' + query;
    return uri + "?" + query;
  
  }
  
  function doHttpGet(uri, params, fn) {
  
  //  console.log("call http request now")
  
    const url = toUrl(uri,params)
  
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
      let data = resMessage.data;
      //         eventDispacher({type:"OnLoadCompletedResList",dataList:data})
      fn(data)
    }).catch(e => {
      console.log("error", e)
    })
  
  }


function doHttpPost(uri, params, fn) {

    //  console.log("call http request now")
    
      let formData = new FormData()
      Object.keys(params).forEach((k)=>{
        formData.append(k,params[k])
      })
  
  
      fetch(uri, {
        method: 'POST',
        body:formData,
        // headers: {
        //   'Content-Type': 'application/json;charset=UTF-8'
        // },
        mode: 'cors',
        cache: 'default'
      })
        .then(res => {
          return res.json()
        }).then((resMessage) => {
          let data = resMessage.data;
          //         eventDispacher({type:"OnLoadCompletedResList",dataList:data})
          fn(data)
        }).catch(e => {
          console.log("error", e)
        })
    
    }
  
  
  function emitHttpEvent(event,extendParam) {
  

//    console.log("httpEvent",event)
    if (event.type === "FetchTableDataList") {
      doHttpGet("/ajax/api/tableDataList", event.params, event.resultHandler)
      return
    }
  
    if (event.type === "FetchRoomList") {
      doHttpGet("/ajax/api/roomList", null, event.resultHandler)
      return 
    }
  
    if(event.type === "FetchPaymentHistorylist") {
      doHttpGet("/reservation/payment/list",event.params,event.resultHandler)
      return;
    }
  
  
    if (event.type === "PostChangeRoom") {
       doHttpPost("/reservation/change/room",event.params,event.resultHandler)
      return;
    }

    if(event.type === "ExtendReDates") {
      doHttpPost("/reservation/extend/date",event.params,event.resultHandler)
      return;
    }

    if(event.type === "CancelRoom") {
//      doHttpPost("/reservation/confirmexit",event.params,event.resultHandler)
      return;
    }

    if(event.type === "UpdateContractDate") {
      doHttpPost("/reservation/change/contract",event.params,event.resultHandler)
      return;
    }

    if(event.type === "ConfirmCheckIn") {
      doHttpPost("/reservation/setupexe",event.params,event.resultHandler)
      return;
    }

    if(event.type === "BalancePayment") {
      doHttpPost("/reservation/pay/remain",event.params,event.resultHandler)
      return;
    }

    if (event.type === "DeleteReservationExe") {
      doHttpPost("/reservation/deleteexe",event.params,event.resultHandler)
      return;
    }


    if(event.type === "SleepReservation") {
      doHttpPost("/reservation/sleep",event.params,event.resultHandler)
      return;
    }
    
    if(event.type === "PostRefund") {
        doHttpPost("/reservation/refund",event.params,event.resultHandler)
        return;
    }
  }


  function newServerEventDispach(headerInfo) {

    return function(event) {

        let extendParam = {
          bno:headerInfo["branch_no"]
        }

        if(event !== null && event.params !== null) {
          event.params = {

            ...event.params,
            bno:headerInfo["branch_no"]
          }
        }

//        console.log("HttpEvent",event,extendParam,headerInfo)

        return emitHttpEvent(event,extendParam);
    }
  }

  export const ServerEventContext = createContext()

 export {
    newServerEventDispach
 }
