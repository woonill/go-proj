//import logo from './logo.svg';
import "./App.scss";
import ChartView from './pages/chart_view'
import React, { useEffect,useState } from 'react';
//import Icon from '@ant-design/icons';
import ReactDOM from 'react-dom';
import {IntlProvider} from 'react-intl'
import {ServerEventContext,newServerEventDispach} from "./server_event_context.js"
import moment from "moment";


function Header({headerInfo}) {




  const ui =
    // <header id="header">
    <>
      <div className="hgroup clearfix">
        <h1 className="logo">


          <a href="/" className="clearfix">
            <i className="icon-logo"></i>

            <span className="text-ir">궁</span>
            <span className="text">{headerInfo.centerName}</span>
            <strong className="text branch">{headerInfo.branchName}</strong>
          </a>



        </h1>
        <div className="utils">
          <p className="account">
            <span className="text date">{moment().format("YYYY-MM-DD")}</span>
            <span className="text message">{headerInfo.userName}님 안녕하세요.</span>
          </p>

          <a href="/login/logout?sa=0" className="btn-logout">
            <i className="icon-logout"></i>
            <span className="text tup">logout</span>
          </a>
        </div>
      </div>
      <nav id="nav">
        <h2 className="text-ir">메뉴</h2>
        <ul className="clearfix">
          {
            headerInfo.menuList.map((e)=>{
              let rid = "top_menu_"+e.no;
              if(e.no === 14) {
                return <li id={rid} className="active"><a href="/html/index.html">{e.name}</a></li> 
              }
              return <li id={rid}><a href={e.link}>{e.name}</a></li> 
            })
          }
        </ul>
      </nav>
    </>
  // </header>  
  //    ReactDOM.render(ui, document.getElementById('header'));

  return ReactDOM.createPortal(
    ui
    , document.getElementById('header'));

}


function ChartViewWrapper(props) {

  if(props.currentState.state === 0) {
    return <div>loading........</div>
  }

  const headerInfo = props.currentState.headerInfo
  const serverEventEmmiter = newServerEventDispach(headerInfo)

  return (
    <ServerEventContext.Provider value={{serverEventEmmiter,headerInfo}}>
    <ChartView/>
  </ServerEventContext.Provider>

  )
}


function App() {


  let [initState,updateHeaderInfo] = useState({
    state:0,
    headerInfo:{
      branch_no:"",
      centerName:"",
      branchName:"",
      userName:"",
      menuList:[],
    }
  })

  useEffect(() => {

    fetch('/ajax/api/currentUserInfo', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      // mode: 'cors',
      // cache: 'default'
    })
      .then(res => {
//        console.log("Request", res);
//        console.log("request status cocde",res.status,res)
        if(res.type === "basic" && res.status !== 200) {
          window.location.href= "/login/login?uri=/html/index.html"
          return
        }
        else if(res.status ===200 && res.redirected) {
         window.location.href= "/login/login?uri=/html/index.html"
         return;
        }

        return res.json()
      })
      .then((resMessage) => {
        
//        console.log("dataResult",resMessage)
        // console.log(data)

        let data = resMessage.data;
        updateHeaderInfo({
          state:200,
          headerInfo:{
            branch_no:data.branch_no,
            centerName:data.center_name,
            branchName:data.branch_name,
            userName:data.user_name,
            menuList:data.menu_list
          }
        }
      )
      }).catch(e=>{
        console.log("error",e)
      }) 

  }, [])


  return (
    <IntlProvider locale='en'>
      <div className="App">
          <Header key="header" headerInfo={initState.headerInfo}></Header>
            <ChartViewWrapper currentState={initState}/>
      </div>
    </IntlProvider>
  );
}

export default App;

export {
  Header
}
