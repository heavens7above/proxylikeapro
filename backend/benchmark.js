const http = require('http');
// Need to set env vars before requiring app because config is loaded on require
process.env.RATE_LIMIT_MAX = '10000';
process.env.PROXY_PASSWORD = '';
process.env.NODE_ENV = 'test';
process.env.PORT = '4000'; // Override port just in case

const app = require('./src/app');

// Configuration
const TEST_PORT = 4000;
const TARGET_PORT = 4001;
const NUM_REQUESTS = 5000;
const CONCURRENCY = 50;

// Create a dummy target server
const targetServer = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('pong');
});

async function runBenchmark() {
  // Start target server
  await new Promise(resolve => targetServer.listen(TARGET_PORT, resolve));
  console.log(`Target server listening on port ${TARGET_PORT}`);

  // Start proxy server
  // app is an express instance.
  const proxyServer = app.listen(TEST_PORT, () => {
    console.log(`Proxy server listening on port ${TEST_PORT}`);
  });

  // Wait a bit for servers to settle
  await new Promise(resolve => setTimeout(resolve, 1000));

  console.log(`Starting benchmark: ${NUM_REQUESTS} requests with concurrency ${CONCURRENCY}...`);
  const start = performance.now();

  let errors = 0;
  let count = 0;

  const agent = new http.Agent({ keepAlive: true });

  const runRequest = () => new Promise((resolve) => {
      const req = http.get({
        hostname: 'localhost',
        port: TEST_PORT,
        path: `/proxy?target=http://localhost:${TARGET_PORT}`,
        agent: agent
      }, (res) => {
        if (res.statusCode !== 200) {
            errors++;
        }
        res.resume();
        res.on('end', resolve);
      });
      req.on('error', (e) => {
        console.error(e);
        errors++;
        resolve();
      });
  });

  const workers = [];
  for (let i = 0; i < CONCURRENCY; i++) {
      workers.push((async () => {
          while (true) {
              // Check count atomically-ish (single threaded JS)
              if (count >= NUM_REQUESTS) break;
              count++;
              await runRequest();
          }
      })());
  }

  await Promise.all(workers);

  const end = performance.now();
  const duration = (end - start) / 1000; // seconds
  const rps = NUM_REQUESTS / duration;

  console.log(`Benchmark completed.`);
  console.log(`Time: ${duration.toFixed(3)}s`);
  console.log(`RPS: ${rps.toFixed(2)}`);
  console.log(`Errors: ${errors}`);

  // Cleanup
  proxyServer.close();
  targetServer.close();
}

runBenchmark().catch(console.error);
