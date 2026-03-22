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
    // Check if message is a JSON string (from Morgan) or an object
    let message = info.message;
    if (info.level === 'http') {
      let httpLog;
      if (typeof message === 'object' && message !== null) {
        httpLog = message;
      } else if (typeof message === 'string') {
        // If message is a string, try to parse it (backward compatibility)
        try {
          httpLog = JSON.parse(message);
        } catch (e) {
          // Fallback if parsing fails
          return `${info.timestamp} ${info.level}: ${message}`;
        }
      }

      if (httpLog && typeof httpLog === 'object') {
        // Rich Text Format: [Timestamp] [HTTP] [Status] Method URL (Duration ms) - IP
        return `${info.timestamp} [HTTP] [${httpLog.status}] ${httpLog.method} ${httpLog.url} (${httpLog.response_time} ms) - IP: ${httpLog.remote_addr}`;
      }

      // If no valid message property, check info directly
      if (info.status) {
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
  level: 'debug', // Allow all logs to flow to transports, let transports filter
  levels,
  format,
  transports,
});

module.exports = logger;
