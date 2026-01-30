const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const logger = require('./logger');

// Rate Limiter: Max requests per windowMs
const authLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
});

const safeCompare = (a, b) => {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  if (bufferA.length !== bufferB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufferA, bufferB);
};

const authMiddleware = (req, res, next) => {
    // Allow OPTIONS requests
    if (req.method === 'OPTIONS') {
        return next();
    }

    const authHeader = req.headers['x-proxy-password'] || req.query.password;

    if (!config.proxyPassword) {
        logger.warn('No proxy password set! allowing access.');
        return next();
    }

    if (!authHeader) { // Missing header
        logger.warn(`Unauthorized (Missing Header) from ${req.ip}`);
        return res.status(401).json({ error: 'Unauthorized' });
    }

     if (safeCompare(authHeader, config.proxyPassword)) {
        return next();
    }

    logger.warn(`Unauthorized (Invalid Password) from ${req.ip}`);
    return res.status(401).json({ error: 'Unauthorized' });
};

// Export an array to chain the rate limiter with the auth check
module.exports = [authLimiter, authMiddleware];
