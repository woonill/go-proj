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
    userName:"",
    menuList:[],
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
        
//        console.log("dataResult",resMessage)
        // console.log(data)

        let data = resMessage.data;
        updateHeaderInfo({
          ...headerInfo,
            centerName:data.center_name,
            branchName:data.branch_name,
            userName:data.user_name,
            menuList:data.menu_list
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
          {
            headerInfo.menuList.map((e)=>{
              let rid = "top_menu_"+e.no;
              if(e.no === 14) {
                return <li id={rid} class="active"><a href="/html/index.html">{e.name}</a></li> 
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
