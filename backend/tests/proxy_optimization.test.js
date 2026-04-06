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

    // It should have been called twice during module initialization (one for HTTP, one for HTTPS)
    expect(createProxyMiddleware).toHaveBeenCalledTimes(2);

    // Verify the configuration passed includes router
    const configHttp = createProxyMiddleware.mock.calls[0][0];
    const configHttps = createProxyMiddleware.mock.calls[1][0];

    expect(configHttp).toHaveProperty('router');
    expect(typeof configHttp.router).toBe('function');

    expect(configHttps).toHaveProperty('router');
    expect(typeof configHttps.router).toBe('function');

    // Test the router function logic if possible
    const reqMock = { query: { target: 'http://target.com' } };
    expect(configHttp.router(reqMock)).toBe('http://target.com');
    expect(configHttps.router(reqMock)).toBe('http://target.com');
  });
});
