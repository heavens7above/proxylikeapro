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
      let httpLog = info.message;

      // If message is a string, try to parse it (backward compatibility)
      if (typeof httpLog === 'string') {
        try {
          httpLog = JSON.parse(httpLog);
        } catch (e) {
          // Fallback if parsing fails or it's just a string message
          return `${info.timestamp} ${info.level}: ${info.message}`;
        }
      }

      // If httpLog is an object (either passed directly or parsed)
      if (typeof httpLog === 'object' && httpLog !== null) {
         // Rich Text Format: [Timestamp] [HTTP] [Status] Method URL (Duration ms) - IP
         return `${info.timestamp} [HTTP] [${httpLog.status}] ${httpLog.method} ${httpLog.url} (${httpLog.response_time} ms) - IP: ${httpLog.remote_addr}`;
      } else {
         // Fallback
         return `${info.timestamp} ${info.level}: ${info.message}`;
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
