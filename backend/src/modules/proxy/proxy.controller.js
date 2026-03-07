const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');
const https = require('https');
const logger = require('../core/logger');

const ping = (req, res) => {
  res.status(200).send('pong');
};

const commonProxyOptions = {
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '',
  },
  router: (req) => {
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
};

// Optimization: Create proxy middleware once and reuse it to avoid overhead per request.
// Dynamic targeting is handled by the `router` function.
const proxyMiddleware = createProxyMiddleware({
  ...commonProxyOptions,
  target: 'http://0.0.0.0', // Default, required but overridden by router
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

  // Use the pre-initialized proxy middleware
  return proxyMiddleware(req, res, next);
};

module.exports = {
  ping,
  handleProxy,
};
