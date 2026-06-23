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

describe('Proxy Optimization Tests', () => {
  let app;
  let proxyController;

  beforeAll(() => {
     // Isolate modules so that the required module uses our mock
     jest.isolateModules(() => {
        proxyController = require('../src/modules/proxy/proxy.controller');
     });
  });

  beforeEach(() => {
    app = express();
    app.use('/proxy', proxyController.handleProxy);
  });

  it('should verify createProxyMiddleware is called exactly twice (during initialization, for http and https agents)', async () => {
    // Make requests to trigger the handler
    await request(app).get('/proxy?target=http://example.com');
    await request(app).get('/proxy?target=https://example.org');

    // It should have been called exactly twice during module initialization
    expect(createProxyMiddleware).toHaveBeenCalledTimes(2);

    // Verify the configuration passed includes router
    const configHttp = createProxyMiddleware.mock.calls[0][0];
    expect(configHttp).toHaveProperty('router');
    expect(typeof configHttp.router).toBe('function');

    // Test the router function logic
    const reqMock = { query: { target: 'http://target.com' } };
    expect(configHttp.router(reqMock)).toBe('http://target.com');
  });
});
