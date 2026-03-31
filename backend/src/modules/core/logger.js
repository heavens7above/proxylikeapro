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
    // When passing object directly to logger.http, Winston extracts properties into info
    if (info.level === 'http') {
      // If properties exist directly on info, use them
      if (info.status !== undefined && info.method !== undefined && info.url !== undefined) {
        return `${info.timestamp} [HTTP] [${info.status}] ${info.method} ${info.url} (${info.response_time} ms) - IP: ${info.remote_addr}`;
      }

      // Fallback for strings or nested objects (backward compatibility)
      let message = info.message;
      let httpLog = message;

      if (typeof message === 'string') {
        try {
          httpLog = JSON.parse(message);
        } catch (e) {
          // Fallback if parsing fails
          return `${info.timestamp} ${info.level}: ${message}`;
        }
      }

      if (httpLog && typeof httpLog === 'object') {
        return `${info.timestamp} [HTTP] [${httpLog.status}] ${httpLog.method} ${httpLog.url} (${httpLog.response_time} ms) - IP: ${httpLog.remote_addr}`;
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
  level: 'debug', // Allow all logs to flow to transports, let transports filter
  levels,
  format,
  transports,
});

module.exports = logger;
