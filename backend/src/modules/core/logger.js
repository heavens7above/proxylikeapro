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

    // Handle HTTP logs specially
    if (info.level === 'http') {
      let httpLog = message;

      // If message is a string, try to parse it (backward compatibility)
      if (typeof message === 'string') {
        try {
          httpLog = JSON.parse(message);
        } catch (e) {
          // Fallback if parsing fails
          return `${info.timestamp} [HTTP] ${message}`;
        }
      }

      if (httpLog && typeof httpLog === 'object') {
        // Rich Text Format: [Timestamp] [HTTP] [Status] Method URL (Duration ms) - IP
        const status = httpLog.status !== undefined ? `[${httpLog.status}] ` : '';
        const method = httpLog.method || '';
        const url = httpLog.url || '';
        const duration = httpLog.response_time !== undefined ? `(${httpLog.response_time} ms)` : '';
        const ip = httpLog.remote_addr ? ` - IP: ${httpLog.remote_addr}` : '';

        return `${info.timestamp} [HTTP] ${status}${method} ${url} ${duration}${ip}`;
      }
    }

    // Default format for other logs
    return `${info.timestamp} [${info.level.toUpperCase()}]: ${message}`;
  }),
);

const transports = [
  new winston.transports.Console({
    level: config.nodeEnv === 'development' ? 'debug' : 'info',
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      format // Use the custom format for console too, to get the nice HTTP logs
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
