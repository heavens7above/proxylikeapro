const request = require('supertest');
const app = require('../src/app');

describe('Compression Middleware', () => {
  it('should compress large responses', async () => {
    // Add a temporary route for testing compression
    // Note: We are modifying the app instance for this test, which is fine as it's running in this process
    app.get('/test-compression', (req, res) => {
      res.send('A'.repeat(2048)); // > 1kb default threshold
    });

    const response = await request(app)
      .get('/test-compression')
      .set('Accept-Encoding', 'gzip')
      .expect(200);

    expect(response.headers['content-encoding']).toBe('gzip');
  });

  it('should not compress small responses', async () => {
    const response = await request(app)
      .get('/ping')
      .set('Accept-Encoding', 'gzip')
      .expect(200);

    // 'pong' is too small to be compressed by default
    expect(response.headers['content-encoding']).toBeUndefined();
  });
});
