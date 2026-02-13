const { createProxyMiddleware } = require('http-proxy-middleware');
const logger = require('../core/logger');

const ping = (req, res) => {
  res.status(200).send('pong');
};

const config = require('../core/config');

// Initialize proxy middleware once to avoid per-request instantiation overhead.
// Using the `router` option allows dynamic targeting without re-creating the middleware.
const proxyMiddleware = createProxyMiddleware({
  target: 'http://0.0.0.0', // Fallback target, overridden by router
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

  return proxyMiddleware(req, res, next);
};

module.exports = {
  ping,
  handleProxy,
};
