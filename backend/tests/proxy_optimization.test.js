const request = require('supertest');
const express = require('express');

// Mock http-proxy-middleware BEFORE requiring the controller
jest.mock('http-proxy-middleware', () => {
  const originalModule = jest.requireActual('http-proxy-middleware');
  return {
    ...originalModule,
    createProxyMiddleware: jest.fn((config) => {
      // Return a dummy middleware that just sends 200 OK
      return (req, res, next) => {
        res.status(200).send('Proxied');
      };
    }),
  };
});

const { createProxyMiddleware } = require('http-proxy-middleware');
// Controller must be required AFTER mocking
const proxyController = require('../src/modules/proxy/proxy.controller');

describe('Proxy Optimization Tests', () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = express();
    app.use('/proxy', proxyController.handleProxy);
  });

  it('should verify createProxyMiddleware is called exactly twice (once for HTTP, once for HTTPS)', async () => {
    // Re-requiring the module to trigger the top-level calls
    jest.resetModules();
    jest.mock('http-proxy-middleware', () => ({
        createProxyMiddleware: jest.fn(() => (req, res, next) => next()),
    }));

    // Trigger module load
    require('../src/modules/proxy/proxy.controller');

    // It should have been called exactly twice during module initialization
    // One for HTTP agent, one for HTTPS agent
    const { createProxyMiddleware } = require('http-proxy-middleware');
    expect(createProxyMiddleware).toHaveBeenCalledTimes(2);

    // Verify the configuration passed includes router
    const config1 = createProxyMiddleware.mock.calls[0][0];
    const config2 = createProxyMiddleware.mock.calls[1][0];

    expect(config1).toHaveProperty('router');
    expect(config2).toHaveProperty('router');
  });
});
