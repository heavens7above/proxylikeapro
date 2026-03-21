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
    if (info.level === 'http') {
      const httpLog = info.message;
      if (typeof httpLog === 'object' && httpLog !== null) {
        return `${info.timestamp} [HTTP] [${httpLog.status}] ${httpLog.method} ${httpLog.url} (${httpLog.response_time} ms) - IP: ${httpLog.remote_addr}`;
      }

      // Fallback if not an object or parsing fails
      if (typeof info.status !== 'undefined') {
        return `${info.timestamp} [HTTP] [${info.status}] ${info.method} ${info.url} (${info.response_time} ms) - IP: ${info.remote_addr}`;
      }
    }
    return `${info.timestamp} ${info.level}: ${info.message}`;
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
  level: 'debug',
  levels,
  format,
  transports,
});

module.exports = logger;
