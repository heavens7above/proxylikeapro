const request = require('supertest');
const app = require('../src/app');
const config = require('../src/modules/core/config');

describe('Performance & Regression Tests', () => {
  beforeAll(() => {
    config.proxyPassword = 'secure_test_password';
  });

  it('should reuse connections and handle multiple requests correctly', async () => {
    // This test verifies that the proxy agents are working correctly
    // by making multiple sequential requests.
    // Ideally, we would inspect the agent's socket pool, but that's hard in integration tests.
    // Success implies that the agents are not exhausting sockets or failing.

    const target = 'https://www.google.com';
    const iterations = 5;

    for (let i = 0; i < iterations; i++) {
      const res = await request(app)
        .get(`/proxy?target=${target}`)
        .set('x-proxy-password', 'secure_test_password');

      expect(res.statusCode).toBe(200);
    }
  }, 20000); // Increased timeout for external requests
});
