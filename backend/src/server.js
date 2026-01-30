const app = require('./app');
const config = require('./modules/core/config');
const logger = require('./modules/core/logger');

app.listen(config.port, () => {
  logger.info(`Server is running on port ${config.port}`);
});
