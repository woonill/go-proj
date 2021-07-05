const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
  console.log("resources called")
  app.use(createProxyMiddleware(
    '/ajax',
    {
      target: 'http://localhost:8080', changeOrigin: true,

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