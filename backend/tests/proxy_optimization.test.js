const { createProxyMiddleware } = require('http-proxy-middleware');

// Mock the middleware factory
jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: jest.fn(() => (req, res, next) => next()),
}));

describe('Proxy Controller Optimization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should instantiate proxy middleware only once across multiple requests', () => {
    jest.isolateModules(() => {
      const proxyController = require('../src/modules/proxy/proxy.controller');

      const req = {
        query: { target: 'http://example.com' },
        headers: {}
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn()
      };
      const next = jest.fn();

      // First Request
      proxyController.handleProxy(req, res, next);

      // Second Request
      proxyController.handleProxy(req, res, next);

      // Expectation: currently this will fail (it is called 2 times)
      // We want it to be called 1 time (during module load or first initialization)
      expect(createProxyMiddleware).toHaveBeenCalledTimes(1);
    });
  });
});
