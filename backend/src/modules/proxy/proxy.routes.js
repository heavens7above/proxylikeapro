const express = require('express');
const router = express.Router();
const proxyController = require('./proxy.controller');
const authMiddleware = require('../core/auth.middleware');

// Public route
router.get('/ping', proxyController.ping);

// Protected route
router.use('/proxy', authMiddleware, proxyController.handleProxy);

module.exports = router;
