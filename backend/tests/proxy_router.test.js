const express = require('express');
const request = require('supertest');
const app = require('../src/app');
const config = require('../src/modules/core/config');

describe('Proxy Router Logic', () => {
  let targetServer;
  let targetPort;
  let targetUrl;

  beforeAll((done) => {
    // Setup dummy target server
    const targetApp = express();
    targetApp.get('/test', (req, res) => {
      res.send('Target Reached');
    });
    targetServer = targetApp.listen(0, () => {
      targetPort = targetServer.address().port;
      targetUrl = `http://localhost:${targetPort}`;
      done();
    });
  });

  afterAll((done) => {
    targetServer.close(done);
  });

  it('should proxy to the dynamic target specified in query param', async () => {
    // Set password for testing
    config.proxyPassword = 'test_password';

    const res = await request(app)
      .get(`/proxy/test?target=${targetUrl}`)
      .set('x-proxy-password', 'test_password');

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Target Reached');
  });

  it('should handle different targets dynamically', async () => {
     // Setup another dummy target
    const targetApp2 = express();
    targetApp2.get('/test2', (req, res) => {
      res.send('Target 2 Reached');
    });

    // Use a promise to listen
    const server2 = await new Promise(resolve => {
        const s = targetApp2.listen(0, () => resolve(s));
    });

    const port2 = server2.address().port;
    const url2 = `http://localhost:${port2}`;

    config.proxyPassword = 'test_password';

    const res = await request(app)
        .get(`/proxy/test2?target=${url2}`)
        .set('x-proxy-password', 'test_password');

    server2.close();

    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Target 2 Reached');
  });
});
