const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./modules/core/logger');
const config = require('./modules/core/config');
const proxyRoutes = require('./modules/proxy/proxy.routes');

const app = express();

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    frameguard: false
}));

// Strict CORS
app.use(cors({
  origin: config.corsOrigin,
}));

// Logging Middleware
// Custom format: Pass object directly to logger (avoiding JSON serialization)
app.use(morgan((tokens, req, res) => {
    const logObject = {
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        status: Number.parseFloat(tokens.status(req, res)),
        content_length: tokens.res(req, res, 'content-length'),
        response_time: Number.parseFloat(tokens['response-time'](req, res)),
        remote_addr: tokens['remote-addr'](req, res),
        user_agent: tokens['user-agent'](req, res),
    };
    logger.http({ message: logObject });
    return null;
}));

// Routes
app.use('/', proxyRoutes);

module.exports = app;
