const request = require('supertest');
const config = require('../src/modules/core/config');

// Mock http-proxy-middleware
const mockCreateProxyMiddleware = jest.fn((options) => {
  return (req, res, next) => {
    res.status(200).send('Proxied Response');
  };
});

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: mockCreateProxyMiddleware,
}));

// Import app AFTER mocking
const app = require('../src/app');

describe('Proxy Optimization', () => {
  beforeAll(() => {
     config.proxyPassword = 'secure_test_password';
  });

  it('should instantiate proxy middleware only once across multiple requests', async () => {
    // Send first request
    await request(app)
      .get('/proxy?target=http://example.com')
      .set('x-proxy-password', 'secure_test_password');

    // Send second request
    await request(app)
      .get('/proxy?target=http://example.org')
      .set('x-proxy-password', 'secure_test_password');

    // Expectation: creation function called EXACTLY ONCE
    // In unoptimized code: it will be called 2 times (once per request).
    // In optimized code: it will be called 1 time (at module load).
    expect(mockCreateProxyMiddleware).toHaveBeenCalledTimes(1);
  });
});
