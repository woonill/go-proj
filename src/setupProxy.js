const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
//  console.log("resources called")
  app.use(createProxyMiddleware(
    '/ajax',
    {
      target: 'http://192.168.101.8:8080', changeOrigin: true,
      onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('cookie', 'JSESSIONID=996846B41EB30B7C7992F2C8C6D12769; shared_session_id=996846B41EB30B7C7992F2C8C6D12769');
      }
      // pathRewrite: {
      //   '^/ajax': '' // URL ^/api -> 공백 변경
      // }
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