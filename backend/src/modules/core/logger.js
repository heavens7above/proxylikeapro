const path = require('path');
const winston = require('winston');
const config = require('./config');

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.printf((info) => {
    if (info.level === 'http' || info.level.includes('http')) {
      // In Morgan, we pass the log object directly, which Winston merges into `info`.
      // Handle cases where properties are on `info` directly OR inside `info.message`
      let httpLog = info.message && typeof info.message === 'object' ? info.message : info;

      if (typeof info.message === 'string') {
          try {
              httpLog = JSON.parse(info.message);
          } catch(e) {
              httpLog = info;
          }
      }

      if (httpLog.method && httpLog.url) {
        return `${info.timestamp} [HTTP] [${httpLog.status}] ${httpLog.method} ${httpLog.url} (${httpLog.response_time} ms) - IP: ${httpLog.remote_addr}`;
      }
    }

    // For non-HTTP logs, format the message gracefully
    const msg = typeof info.message === 'object' ? JSON.stringify(info.message) : info.message;
    return `${info.timestamp} ${info.level}: ${msg}`;
  }),
);

const transports = [
  new winston.transports.Console({
    level: config.nodeEnv === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
    ),
  }),
  new winston.transports.File({
    filename: path.join(__dirname, '../../../logs/raw.log'),
    level: 'debug',
  }),
];

const logger = winston.createLogger({
  level: 'debug', // Allow all logs to flow to transports, let transports filter
  levels,
  format,
  transports,
});

module.exports = logger;
