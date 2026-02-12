const request = require('supertest');

// Mock http-proxy-middleware
jest.mock('http-proxy-middleware', () => {
  const original = jest.requireActual('http-proxy-middleware');
  return {
    ...original,
    createProxyMiddleware: jest.fn((config) => original.createProxyMiddleware(config)),
  };
});

describe('Proxy Optimization', () => {
  let app;
  let config;
  let createProxyMiddlewareMock;

  beforeEach(() => {
    jest.resetModules(); // Reset cache to reload modules
    createProxyMiddlewareMock = require('http-proxy-middleware').createProxyMiddleware;

    jest.isolateModules(() => {
        app = require('../src/app');
        config = require('../src/modules/core/config');
    });
  });

  it('should instantiate proxy middleware only once', async () => {
    config.proxyPassword = 'test';

    // First request
    await request(app)
        .get('/proxy?target=http://localhost:1234')
        .set('x-proxy-password', 'test');

    // Second request
    await request(app)
        .get('/proxy?target=http://localhost:5678')
        .set('x-proxy-password', 'test');

    // Should be called only once (at module load time)
    // Currently it is called twice (once per request)
    expect(createProxyMiddlewareMock).toHaveBeenCalledTimes(1);
  });
});
