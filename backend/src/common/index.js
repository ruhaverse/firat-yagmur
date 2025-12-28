const db = require('./db');
const logger = require('./logger');
const { getConfig } = require('./env');
const authMiddleware = require('./middleware/auth');
const rbac = require('./middleware/rbac');

// Services
const storage = require('../services/storage');

const config = getConfig();

module.exports = {
  db,
  logger,
  config,
  authMiddleware,
  rbac,
  services: {
    storage,
  }
};
