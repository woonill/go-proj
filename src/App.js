//import logo from './logo.svg';
import "./App.scss";
import ChartView from './pages/chart_view'
import React, { useEffect,useState } from 'react';
//import Icon from '@ant-design/icons';
import ReactDOM from 'react-dom';



function Header() {


  let [headerInfo,updateHeaderInfo] = useState({
    centerName:"",
    branchName:"",
    userName:""
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
        return res.json()
      }).then((resMessage) => {
        // console.log("dataResult",data)
        // console.log(data)

        let data = resMessage.data;
        updateHeaderInfo({
          ...headerInfo,
            centerName:data.center_name,
            branchName:data.branch_name,
            userName:data.user_name
          }
      )

      }).catch(e=>{
        console.log("error",e)
      }) 

  }, [])

  const ui =
    // <header id="header">
    <>
      <div class="hgroup clearfix">
        <h1 class="logo">


          <a href="/" class="clearfix">
            <i class="icon-logo"></i>

            <span class="text-ir">궁</span>
            <span class="text">{headerInfo.centerName}</span>
            <strong class="text branch">{headerInfo.branchName}</strong>
          </a>



        </h1>
        <div class="utils">
          <p class="account">
            <span class="text date">2021-06-15</span>
            <span class="text message">{headerInfo.userName}님 안녕하세요.</span>
          </p>

          <a href="/login/logout?sa=0" class="btn-logout">
            <i class="icon-logout"></i>
            <span class="text tup">logout</span>
          </a>
        </div>
      </div>
      <nav id="nav">
        <h2 class="text-ir">메뉴</h2>
        <ul class="clearfix">
          <li id="top_menu_12"><a href="/">홈</a></li>
          <li id="top_menu_14" class="active"><a href="/reservation/list">예약관리</a></li>
          <li id="top_menu_133"><a href="/reservation/calendar">입퇴실달력</a></li>
          <li id="top_menu_13"><a href="/reservation/add">예약추가</a></li>
          <li id="top_menu_15"><a href="/counsel/list">상담관리</a></li>
          <li id="top_menu_105"><a href="/app/list">APP 상담관리</a></li>
          <li id="top_menu_20"><a href="/schedule/main">조리원일정</a></li>
          <li id="top_menu_21"><a href="/balance/main">정산</a></li>
          <li id="top_menu_84"><a href="/inventory/payment/list">지출/결제</a></li>
          <li id="top_menu_16"><a href="/room/main">설정</a></li>
        </ul>
      </nav>
    </>
  // </header>  
  //    ReactDOM.render(ui, document.getElementById('header'));

  return ReactDOM.createPortal(
    ui
    , document.getElementById('header'));

}

// (function () {


// })()


function App() {
  return (
    <div className="App">
      <Header></Header>
      <ChartView></ChartView>
    </div>
  );
}

export default App;

export {
  Header
}
