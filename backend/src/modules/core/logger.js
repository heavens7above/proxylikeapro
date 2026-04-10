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
    let message = info.message;
    if (info.level === 'http') {
      let httpLog = undefined;

      // Handle the case where message is a string that might be JSON
      if (typeof message === 'string') {
        try {
          httpLog = JSON.parse(message);
        } catch (e) {
          // Not JSON, just normal string log
        }
      } else if (typeof message === 'object' && message !== null) {
        httpLog = message;
      }

      // If we got an object from Winston merging the log object
      if (!httpLog && info.method && info.url && info.status !== undefined) {
         httpLog = info;
      }

      if (httpLog && typeof httpLog === 'object' && httpLog.method && httpLog.url) {
        // Rich Text Format: [Timestamp] [HTTP] [Status] Method URL (Duration ms) - IP
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
