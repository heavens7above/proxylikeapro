require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  proxyPassword: process.env.PROXY_PASSWORD,
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000,
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX) || 50,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:8000',
};
