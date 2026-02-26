const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');
const https = require('https');
const logger = require('../core/logger');

const ping = (req, res) => {
  res.status(200).send('pong');
};

// Define proxy middleware once to avoid per-request instantiation
const proxyMiddleware = createProxyMiddleware({
  target: 'http://0.0.0.0', // Default target, overridden by router
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

// Initialize proxy middleware once
const proxyMiddleware = createProxyMiddleware({
  target: 'http://0.0.0.0', // Default target, overridden by router
  router: (req) => req.query.target,
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
// Initialize proxy middleware once
const proxyMiddleware = createProxyMiddleware({
  target: 'http://0.0.0.0', // Default target (invalid), overridden by router
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

// Initialize proxy middleware once to improve performance
const proxyMiddleware = createProxyMiddleware({
  target: 'http://0.0.0.0', // Default target, overridden by router
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
});

// Optimization: Create proxy middleware once and reuse it to avoid overhead per request.
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

// Initialize proxy middleware once to avoid per-request instantiation overhead and listener leaks
const proxyMiddleware = createProxyMiddleware({
  target: 'http://0.0.0.0', // Default target, overridden by router
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
});

// Initialize proxy middleware once to avoid memory leaks and overhead
const proxyMiddleware = createProxyMiddleware({
  target: 'http://0.0.0.0', // Default target (overridden by router)
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
});

const proxyMiddleware = createProxyMiddleware({
  target: 'http://0.0.0.0', // Default target, overridden by router
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
  // Use the pre-initialized proxy middleware
  return proxyMiddleware(req, res, next);
  // Delegate to the shared proxy middleware instance
  return proxyMiddleware(req, res, next);
  return proxyMiddleware(req, res, next);
  // Dispatch based on protocol
  if (targetUrl.startsWith('https:')) {
    proxyMiddlewareHttps(req, res, next);
  } else {
    proxyMiddlewareHttp(req, res, next);
  }
  return proxyMiddleware(req, res, next);
  proxyMiddleware(req, res, next);
};

module.exports = {
  ping,
  handleProxy,
};
