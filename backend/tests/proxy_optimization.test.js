// backend/tests/proxy_optimization.test.js
const { createProxyMiddleware } = require('http-proxy-middleware');

// 1. Mock the module. Jest hoists this.
jest.mock('http-proxy-middleware');

// 2. Setup the mock return value BEFORE requiring the controller.
// This ensures that if the controller instantiates the proxy at load time (optimized),
// it gets a valid middleware function instead of undefined.
const mockMiddleware = jest.fn((req, res, next) => {
    if (next) next();
});
createProxyMiddleware.mockReturnValue(mockMiddleware);

// 3. Import the controller.
// In the optimized version, this will trigger the single call to createProxyMiddleware.
const proxyController = require('../src/modules/proxy/proxy.controller');

describe('Proxy Optimization', () => {
  beforeEach(() => {
    // We do NOT clear createProxyMiddleware mock here because we want to preserve
    // the initialization call count for the optimized case.
    // Instead, we clear the execution mock to ensure we count executions correctly.
    mockMiddleware.mockClear();

    // Note: createProxyMiddleware.mockClear() would wipe the history of the initialization call.
    // If we want to check "only called once at init", we should check the TOTAL calls
    // since the start of the test suite.
  });

  test('should reuse the proxy middleware instance (singleton pattern)', () => {
    const req = {
      query: { target: 'http://example.com' },
      headers: {},
      url: '/proxy?target=http://example.com'
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    const next = jest.fn();

    // Verify initial state
    // Unoptimized: 0 calls (initialized inside handleProxy)
    // Optimized: 1 call (initialized at load)
    const initialCalls = createProxyMiddleware.mock.calls.length;

    // First request
    proxyController.handleProxy(req, res, next);

    // Second request
    proxyController.handleProxy(req, res, next);

    // Assertions

    // 1. verify the middleware functionality was actually invoked (2 times)
    expect(mockMiddleware).toHaveBeenCalledTimes(2);

    // 2. verify createProxyMiddleware calls
    // Unoptimized: initial (0) + 2 requests = 2 calls total.
    // Optimized: initial (1) + 0 requests = 1 call total.

    const finalCalls = createProxyMiddleware.mock.calls.length;

    // We expect EXACTLY 1 call total for the singleton pattern.
    // This assertion will FAIL on unoptimized code (it will be 2).
    expect(finalCalls).toBe(1);
  });
});
