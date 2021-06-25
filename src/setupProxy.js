const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function(app){
  console.log("resources called")
  app.use(createProxyMiddleware('/resources', { target: 'http://testg.tosky.co.kr/resources' }));

};

