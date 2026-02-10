const { createProxyMiddleware } = require('http-proxy-middleware');

// Mock http-proxy-middleware
jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn().mockReturnValue((req, res, next) => next()),
}));

describe('Proxy Optimization', () => {
  let proxyController;

  beforeAll(() => {
    jest.clearAllMocks();
    // Require the controller inside isolateModules to ensure fresh require
    jest.isolateModules(() => {
        proxyController = require('../src/modules/proxy/proxy.controller');
    });
  });

  it('should instantiate proxy middleware once at startup', () => {
      // It should be called exactly once when the module is loaded
      expect(createProxyMiddleware).toHaveBeenCalledTimes(1);
  });

  it('should NOT instantiate proxy middleware during request handling', () => {
    // Clear calls from startup
    jest.clearAllMocks();

    const req = {
      query: { target: 'http://example.com' },
      headers: {},
      url: '/proxy?target=http://example.com'
    };
    const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    const next = jest.fn();

    // Call handleProxy multiple times
    proxyController.handleProxy(req, res, next);
    proxyController.handleProxy(req, res, next);
    proxyController.handleProxy(req, res, next);

    // Should still be 0 because the middleware instance is reused
    expect(createProxyMiddleware).toHaveBeenCalledTimes(0);
  });
});
