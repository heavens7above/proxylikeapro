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
    // We cannot clear mock calls here for createProxyMiddleware because it is called at module load time.
    // However, we can verify it was called once overall.
    app = express();
    app.use('/proxy', proxyController.handleProxy);
  });

  it('should verify createProxyMiddleware is called exactly once (during initialization)', async () => {
    // Make requests to trigger the handler
    await request(app).get('/proxy?target=http://example.com');
    await request(app).get('/proxy?target=http://example.org');

    // It should have been called only once during module initialization
    expect(createProxyMiddleware).toHaveBeenCalledTimes(1);

    // Verify the configuration passed includes router
    const config = createProxyMiddleware.mock.calls[0][0];
    expect(config).toHaveProperty('router');
    expect(typeof config.router).toBe('function');

    // Test the router function logic if possible
    const reqMock = { query: { target: 'http://target.com' } };
    const routeResult = config.router(reqMock);
    // Modified to support an object being returned
    if (typeof routeResult === 'object') {
       expect(routeResult.target).toBe('http://target.com');
       expect(routeResult).toHaveProperty('agent');
    } else {
       expect(routeResult).toBe('http://target.com');
    }
  });
});
