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

// Initialize proxy middleware once
const proxyMiddleware = createProxyMiddleware({
  target: 'http://0.0.0.0', // Default target, overridden by router
  changeOrigin: true,
  pathRewrite: {
    '^/proxy': '',
  },
  router: (req) => {
      const targetUrl = req.query.target;
      if (!targetUrl) return 'http://0.0.0.0';
      return targetUrl;
  },
  onProxyReq: (proxyReq, req, res) => {
      const targetUrl = req.query.target || 'http://0.0.0.0';
      // To correctly assign the agent, it must be assigned in the request options,
      // however `http-proxy` creates the client request internally.
      // Fortunately `http-proxy-middleware` uses `http-proxy`, which accepts the `agent`
      // option. Since we can only instantiate once, setting the `agent` globally forces it for all requests.
      // Actually `agent` can be dynamically passed via the `router` function in http-proxy-middleware!
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
    if (!res.headersSent) {
      res.status(500).send('Proxy Error');
    }
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

  // To properly assign agents dynamically while reusing proxy instance without breaking http-proxy:
  // Since http-proxy options apply to all, we can modify the request `agent` property directly
  // before proxying, or pass a custom `agent` configuration.

  const options = {
      agent: targetUrl.startsWith('https:') ? httpsAgent : httpAgent,
      target: targetUrl
  };

  // Use the pre-initialized proxy middleware
  // wait, the signature is function(req, res, next).
  return proxyMiddleware(req, res, next);
};

module.exports = {
  ping,
  handleProxy,
};
