import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider,  } from "antd";
import 'moment/locale/ko'
import locale from 'antd/es/locale/ko_KR';


// ReactDOM.render(
//   <React.StrictMode>
//     <Header />
//   </React.StrictMode>,
//   document.getElementById('header')
// );

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider locale={locale}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
