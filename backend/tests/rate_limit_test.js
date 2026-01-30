const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/proxy?target=http://example.com',
  method: 'GET',
  headers: {
    'x-proxy-password': 'wrong_password' // Fail auth, but hit rate limit logic
  }
};

let success = 0;
let rateLimited = 0;
let errors = 0;
const totalRequests = 60; // Config is 50, so we expect some 429s

console.log(`Sending ${totalRequests} requests to testing rate limit...`);

function sendRequest(id) {
  return new Promise((resolve) => {
    const req = http.request(options, (res) => {
      if (res.statusCode === 429) {
        rateLimited++;
      } else if (res.statusCode === 401) {
        success++; // 401 means "processed but unauthorized", so it counts as a generic "hit" before limit
      } else {
        console.log(`Unexpected Status: ${res.statusCode}`);
      }
      res.on('data', () => {}); // consume
      res.on('end', resolve);
    });

    req.on('error', (e) => {
      console.error(`Problem with request: ${e.message}`);
      errors++;
      resolve();
    });

    req.end();
  });
}

async function run() {
  const promises = [];
  for (let i = 0; i < totalRequests; i++) {
    promises.push(sendRequest(i));
  }
  await Promise.all(promises);
  
  console.log('--- Rate Limit Test Results ---');
  console.log(`Total Requests: ${totalRequests}`);
  console.log(`Processed (401/200): ${success}`);
  console.log(`Rate Limited (429): ${rateLimited}`);
  console.log(`Errors: ${errors}`);
  
  if (rateLimited > 0 && success <= 55) { // Allow slight buffer for async timing
      console.log('PASS: Rate limiting is active.');
  } else {
      console.log('FAIL: Rate limiting did not trigger as expected.');
  }
}

run();
