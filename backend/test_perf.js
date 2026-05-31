const { performance } = require('perf_hooks');
const winston = require('winston');

// 1. Winston printf parser
const format1 = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf((info) => {
    let message = info.message;
    if (info.level === 'http') {
      let httpLog = message;
      if (typeof message === 'string') {
        try {
          httpLog = JSON.parse(message);
        } catch (e) {
          return `${info.timestamp} ${info.level}: ${message}`;
        }
      }
      if (httpLog && typeof httpLog === 'object') {
        return `${info.timestamp} [HTTP] [${httpLog.status}] ${httpLog.method} ${httpLog.url} (${httpLog.response_time} ms) - IP: ${httpLog.remote_addr}`;
      }
    }
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
);

// 2. Winston object passing
const format2 = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf((info) => {
    if (info.level === 'http' && info.method && info.url) {
      return `${info.timestamp} [HTTP] [${info.status}] ${info.method} ${info.url} (${info.response_time} ms) - IP: ${info.remote_addr}`;
    }
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
);

const logger1 = winston.createLogger({
  level: 'http',
  format: format1,
  transports: [new winston.transports.Console({ silent: true })]
});

const logger2 = winston.createLogger({
  level: 'http',
  format: format2,
  transports: [new winston.transports.Console({ silent: true })]
});

const n = 100000;
let httpLogObj = { method: 'GET', url: '/api', status: 200, content_length: 50, response_time: 15, remote_addr: '127.0.0.1', user_agent: 'Curl' };
let httpLogStr = JSON.stringify(httpLogObj);

const t0 = performance.now();
for (let i = 0; i < n; i++) {
  logger1.http(httpLogStr);
}
const t1 = performance.now();

const t2 = performance.now();
for (let i = 0; i < n; i++) {
  logger2.http(httpLogObj);
}
const t3 = performance.now();

console.log(`JSON parse: ${t1 - t0}ms`);
console.log(`Object pass: ${t3 - t2}ms`);
