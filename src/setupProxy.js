const { createProxyMiddleware } = require('http-proxy-middleware');

const HOST_SERVER = "http://testg.tosky.co.kr:18080"
//const HOST_SERVER = "http://192.168.101.8:8080"


function resetProxyHeader(proxyReq) {
  proxyReq.setHeader('cookie', 'JSESSIONID=818FA0CF3B32687461C182835AD73554; shared_session_id=818FA0CF3B32687461C182835AD73554');
  proxyReq.setHeader('Access-Control-Allow-Origin', 'true');

}


module.exports = function (app) {
//  console.log("resources called")
  app.use(createProxyMiddleware(
    '/ajax',
    {
      target:HOST_SERVER , changeOrigin: true,
      onProxyReq(proxyReq, req, res) {
//        proxyReq.setHeader('cookie', 'JSESSIONID=917BE2C28401ABCC7CF9105C32736D18; shared_session_id=917BE2C28401ABCC7CF9105C32736D18');
          resetProxyHeader(proxyReq)
      }
      // pathRewrite: {
      //   '^/ajax': '' // URL ^/api -> 공백 변경
      // }
    },
    ))

    app.use(createProxyMiddleware(
      '/reservation',
      {
        target: HOST_SERVER, changeOrigin: true,
        onProxyReq(proxyReq, req, res) {
          resetProxyHeader(proxyReq)
//          proxyReq.setHeader('cookie', 'JSESSIONID=917BE2C28401ABCC7CF9105C32736D18; shared_session_id=917BE2C28401ABCC7CF9105C32736D18');
        }
      },      
    ))


    app.use(createProxyMiddleware(
      '/excel',
      {
        target: HOST_SERVER, changeOrigin: true,
        onProxyReq(proxyReq, req, res) {
          resetProxyHeader(proxyReq)
//          proxyReq.setHeader('cookie', 'JSESSIONID=917BE2C28401ABCC7CF9105C32736D18; shared_session_id=917BE2C28401ABCC7CF9105C32736D18');
        }
      },      
    ))

    app.use(createProxyMiddleware(
      '/login',
      {
        target: HOST_SERVER, changeOrigin: true,
        onProxyReq(proxyReq, req, res) {
          resetProxyHeader(proxyReq)
//          proxyReq.setHeader('cookie', 'JSESSIONID=917BE2C28401ABCC7CF9105C32736D18; shared_session_id=917BE2C28401ABCC7CF9105C32736D18');
        }
      },      
    ))

    // app.use(createProxyMiddleware(
    //   '/resources',
    // {
    //   target: 'http://192.168.101.8:8080', changeOrigin: true,

    //   onProxyReq(proxyReq, req, res) {
    //       resetProxyHeader(proxyReq)
    //   }      
    // }
    // ))
};



// const {createProxyMiddleware} = require('http-proxy-middleware');
// module.exports = function(app) {
//   app.use(createProxyMiddleware('/myproject/api', {
// 	  "target": "http://10.111.111.111:8086"
//     }
//   ));
// };