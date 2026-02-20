const mockCreateProxyMiddleware = jest.fn((options) => (req, res, next) => next());

jest.mock('http-proxy-middleware', () => ({
  createProxyMiddleware: mockCreateProxyMiddleware,
}));

describe('Proxy Instantiation Performance', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        process.env.PROXY_PASSWORD = '';
    });

    it('should create proxy middleware only once globally', async () => {
        // Re-require app to ensure mocks are used
        const app = require('../src/app');
        const request = require('supertest');

        // Make 2 requests
        await request(app).get('/proxy?target=http://example.com');
        await request(app).get('/proxy?target=http://example.org');

        // Optimized behavior: Called 1 time (during module load)
        expect(mockCreateProxyMiddleware).toHaveBeenCalledTimes(1);
    });
});
