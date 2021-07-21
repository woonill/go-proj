const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
//  console.log("resources called")
  app.use(createProxyMiddleware(
    '/ajax',
    {
      target: 'http://192.168.101.8:8080', changeOrigin: true,
      onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('cookie', 'JSESSIONID=6008D8431605F79716D86147B276E4EA; shared_session_id=6008D8431605F79716D86147B276E4EA');
      }
      // pathRewrite: {
      //   '^/ajax': '' // URL ^/api -> 공백 변경
      // }
    },
    '/resources',
    {
      target: 'http://192.168.101.8:8080', changeOrigin: true,
      onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('cookie', 'JSESSIONID=6008D8431605F79716D86147B276E4EA; shared_session_id=6008D8431605F79716D86147B276E4EA');
      }
    },
    '/static',
    {
      target: 'http://192.168.101.8:8080', changeOrigin: true,
      onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('cookie', 'JSESSIONID=6008D8431605F79716D86147B276E4EA; shared_session_id=6008D8431605F79716D86147B276E4EA');
      }
    },
    '/css',
    {
      target: 'http://192.168.101.8:8080', changeOrigin: true,
      onProxyReq(proxyReq, req, res) {
        proxyReq.setHeader('cookie', 'JSESSIONID=6008D8431605F79716D86147B276E4EA; shared_session_id=6008D8431605F79716D86147B276E4EA');
      }
    },


    ));

};



// const {createProxyMiddleware} = require('http-proxy-middleware');
// module.exports = function(app) {
//   app.use(createProxyMiddleware('/myproject/api', {
// 	  "target": "http://10.111.111.111:8086"
//     }
//   ));
// };