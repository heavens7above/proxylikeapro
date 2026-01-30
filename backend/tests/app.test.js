const request = require('supertest');
const app = require('../src/app');
const config = require('../src/modules/core/config'); // Import config directly

describe('Proxy Backend Tests', () => {
  it('GET /ping should return 200 pong', async () => {
    const res = await request(app).get('/ping');
    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('pong');
  });

  it('GET /proxy should fail without password', async () => {
    // Ensure config requires password for this test
    config.proxyPassword = 'secure_test_password';
    const res = await request(app).get('/proxy?target=https://www.google.com');
    expect(res.statusCode).toEqual(401);
  });

  it('Integration: External Connectivity (Google) & Latency Test', async () => {
    config.proxyPassword = 'secure_test_password';
    
    console.log('\n--- Starting Connectivity Test ---');
    const start = Date.now();
    
    const res = await request(app)
      .get('/proxy?target=https://www.google.com')
      .set('x-proxy-password', 'secure_test_password');
      
    const duration = Date.now() - start;
    console.log(`Latency to Google: ${duration}ms`);
    console.log('--- End Connectivity Test ---\n');

    expect(res.statusCode).toEqual(200);
  }, 10000); // Increase timeout for real network request
});
