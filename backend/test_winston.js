const winston = require('winston');

const format = winston.format.printf((info) => {
    console.log(info);
    return "";
});

const logger = winston.createLogger({
  level: 'http',
  format,
  transports: [new winston.transports.Console()]
});

logger.http({ method: 'GET', url: '/proxy' });
