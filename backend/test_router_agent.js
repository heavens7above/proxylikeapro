const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');

const agent = new http.Agent();

const proxy = createProxyMiddleware({
  target: 'http://localhost',
  router: (req) => {
    return { target: 'http://example.com', agent: agent };
  }
});
console.log("Success");
