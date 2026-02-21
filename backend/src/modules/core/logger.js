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
    // HTTP Log Formatting
    if (info.level === 'http') {
      let httpLog = info.message;

      // If message is a JSON string (backward compatibility), parse it
      if (typeof httpLog === 'string') {
        try {
          httpLog = JSON.parse(httpLog);
        } catch (e) {
          // If parsing fails, just log as string
          return `${info.timestamp} [HTTP] ${httpLog}`;
        }
      }

      if (httpLog && typeof httpLog === 'object') {
        // Rich Text Format: [Timestamp] [HTTP] [Status] Method URL (Duration ms) - IP
        const status = httpLog.status || '-';
        const method = httpLog.method || '-';
        const url = httpLog.url || '-';
        const duration = httpLog.response_time || '-';
        const ip = httpLog.remote_addr || '-';

        return `${info.timestamp} [HTTP] [${status}] ${method} ${url} (${duration} ms) - IP: ${ip}`;
      }
    }

    // Default format for other logs
    return `${info.timestamp} [${info.level.toUpperCase()}]: ${info.message}`;
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
