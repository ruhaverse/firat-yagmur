const db = require('./db');
const logger = require('./logger');
const { getConfig } = require('./env');
const authMiddleware = require('./middleware/auth');
const rbac = require('./middleware/rbac');

// Services
const notificationService = require('../services/notificationService');
const swapService = require('../services/swapService');
const storage = require('../services/storage');

const config = getConfig();

module.exports = {
  db,
  logger,
  config,
  authMiddleware,
  rbac,
  services: {
    notificationService,
    swapService,
    storage,
  }
};
