const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');
const https = require('https');
const logger = require('../core/logger');

const ping = (req, res) => {
  res.status(200).send('pong');
};

// HTTP Agent
const httpAgent = new http.Agent({
  keepAlive: true,
  maxSockets: 100,
});

// HTTPS Agent
const httpsAgent = new https.Agent({
  keepAlive: true,
  maxSockets: 100,
});

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

// Middleware for HTTP targets
const proxyMiddlewareHttp = createProxyMiddleware({
  ...commonProxyOptions,
  target: 'http://localhost', // fallback
  agent: httpAgent,
});

// Middleware for HTTPS targets
const proxyMiddlewareHttps = createProxyMiddleware({
  ...commonProxyOptions,
  target: 'https://google.com', // fallback
  agent: httpsAgent,
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

  // Dispatch based on protocol
  if (targetUrl.startsWith('https:')) {
    proxyMiddlewareHttps(req, res, next);
  } else {
    proxyMiddlewareHttp(req, res, next);
  }
};

module.exports = {
  ping,
  handleProxy,
};
