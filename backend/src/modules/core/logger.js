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
      // The morgan middleware passes an object with these properties.
      // Winston merges them into the top-level info object.
      if (info.method && info.url) {
        return `${info.timestamp} [HTTP] [${info.status}] ${info.method} ${info.url} (${info.response_time} ms) - IP: ${info.remote_addr}`;
      }

      // Fallback for string messages or improperly formatted logs
      let message = info.message;
      if (typeof message === 'string') {
        try {
           let parsed = JSON.parse(message);
           return `${info.timestamp} [HTTP] [${parsed.status}] ${parsed.method} ${parsed.url} (${parsed.response_time} ms) - IP: ${parsed.remote_addr}`;
        } catch (e) {
          // ignore parsing error
        }
      }
      return `${info.timestamp} [HTTP] ${message}`;
    }
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
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
