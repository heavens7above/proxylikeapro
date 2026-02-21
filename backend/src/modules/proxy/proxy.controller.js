const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('../core/logger');

const ping = (req, res) => {
  res.status(200).send('pong');
};

const config = require('../core/config');

// Initialize proxy middleware once
const proxyMiddleware = createProxyMiddleware({
  target: 'http://localhost', // Default target, overridden by router
// Initialize middleware once to avoid overhead per request
// Using the 'router' option allows dynamic targets
const proxyMiddleware = createProxyMiddleware({
  target: 'http://localhost', // Fallback target, will be overridden by router
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '',
  },
  router: (req) => {
    return req.query.target;
      return req.query.target;
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

  return proxyMiddleware(req, res, next);
  proxyMiddleware(req, res, next);
};

module.exports = {
  ping,
  handleProxy,
};
