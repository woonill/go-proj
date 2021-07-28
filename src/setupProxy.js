const { createProxyMiddleware } = require('http-proxy-middleware');


function resetProxyHeader(proxyReq) {
  proxyReq.setHeader('cookie', 'JSESSIONID=C5DCB5EA2E56B79BA0A8553882C4CB28; shared_session_id=C5DCB5EA2E56B79BA0A8553882C4CB28');
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
      '/resources',
    {
      target: 'http://testg.tosky.co.kr', changeOrigin: true,
      onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('Access-Control-Allow-Origin', 'true');
      }      
    }
    ))
};



// const {createProxyMiddleware} = require('http-proxy-middleware');
// module.exports = function(app) {
//   app.use(createProxyMiddleware('/myproject/api', {
// 	  "target": "http://10.111.111.111:8086"
//     }
//   ));
// };