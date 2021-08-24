const { createProxyMiddleware } = require('http-proxy-middleware');


function resetProxyHeader(proxyReq) {
  proxyReq.setHeader('cookie', 'JSESSIONID=FDBEA50CDA92E14D096270983F5F51A3; shared_session_id=FDBEA50CDA92E14D096270983F5F51A3');
  proxyReq.setHeader('Access-Control-Allow-Origin', 'true');

}


module.exports = function (app) {
//  console.log("resources called")
  app.use(createProxyMiddleware(
    '/ajax',
    {
      target: 'http://192.168.101.8:8080', changeOrigin: true,
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
        target: 'http://192.168.101.8:8080', changeOrigin: true,
        onProxyReq(proxyReq, req, res) {
          resetProxyHeader(proxyReq)
//          proxyReq.setHeader('cookie', 'JSESSIONID=917BE2C28401ABCC7CF9105C32736D18; shared_session_id=917BE2C28401ABCC7CF9105C32736D18');
        }
      },      
    ))


    app.use(createProxyMiddleware(
      '/excel',
      {
        target: 'http://192.168.101.8:8080', changeOrigin: true,
        onProxyReq(proxyReq, req, res) {
          resetProxyHeader(proxyReq)
//          proxyReq.setHeader('cookie', 'JSESSIONID=917BE2C28401ABCC7CF9105C32736D18; shared_session_id=917BE2C28401ABCC7CF9105C32736D18');
        }
      },      
    ))

    app.use(createProxyMiddleware(
      '/login',
      {
        target: 'http://192.168.101.8:8080', changeOrigin: true,
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