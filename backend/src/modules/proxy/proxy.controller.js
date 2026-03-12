const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');
const https = require('https');
const logger = require('../core/logger');

const ping = (req, res) => {
  res.status(200).send('pong');
};

// Optimization: Use global agents for connection pooling with a single proxy instance
http.globalAgent.keepAlive = true;
http.globalAgent.maxSockets = 100;
https.globalAgent.keepAlive = true;
https.globalAgent.maxSockets = 100;

// Initialize proxy middleware exactly ONCE to avoid per-request instantiation overhead and listener leaks.
// Dynamic targeting is handled by the `router` function.
const proxyMiddleware = createProxyMiddleware({
  target: 'http://0.0.0.0', // Default, required but overridden by router
  router: (req) => req.query.target,
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '',
  },
  onProxyRes: (proxyRes) => {
    // Allow embedding by stripping security headers
    delete proxyRes.headers['x-frame-options'];
    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['response-content-security-policy'];

    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
  onError: (err, req, res) => {
    logger.error('Proxy Error:', err);
    res.status(500).send('Proxy Error');
  },
});

const handleProxy = (req, res, next) => {
  const targetUrl = req.query.target;

  if (!targetUrl) {
    return res.status(400).send('Missing "target" query parameter');
  }

  // Recursion Prevention
  const normalize = (url) => url.replace(/\/$/, '');
  const frontendUrl = req.headers['x-frontend-url'] || req.query.frontend_url;

  if (frontendUrl && normalize(targetUrl) === normalize(frontendUrl)) {
    logger.warn('Recursion detected. Resetting client.');
    return res.status(205).send('Recursion Detected');
  }

  // Use the pre-initialized shared proxy middleware instance
  return proxyMiddleware(req, res, next);
};

module.exports = {
  ping,
  handleProxy,
};
