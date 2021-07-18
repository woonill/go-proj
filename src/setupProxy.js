const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
//  console.log("resources called")
  app.use(createProxyMiddleware(
    '/ajax',
    {
      target: 'http://192.168.101.8:8080', changeOrigin: true,
      onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('cookie', 'JSESSIONID=A6A6FE85A1C6050700D2AE6DC8E5F84E; shared_session_id=A6A6FE85A1C6050700D2AE6DC8E5F84E');
      }
      // pathRewrite: {
      //   '^/ajax': '' // URL ^/api -> 공백 변경
      // }
    }));

};



// const {createProxyMiddleware} = require('http-proxy-middleware');
// module.exports = function(app) {
//   app.use(createProxyMiddleware('/myproject/api', {
// 	  "target": "http://10.111.111.111:8086"
//     }
//   ));
// };