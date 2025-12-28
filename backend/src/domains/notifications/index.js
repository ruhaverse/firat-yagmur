const express = require('express');
const createRoutes = require('./routes');

function register(app, deps) {
  const router = express.Router();
  // Ensure domain-level notificationService is available to controllers. If not provided via deps, instantiate it.
  try {
    if (!deps.services) deps.services = {};
    if (!deps.services.notificationService) {
      const makeNotificationService = require('./service');
      deps.services.notificationService = makeNotificationService(deps);
    }
  } catch (e) {
    if (deps && deps.logger && deps.logger.warn) deps.logger.warn({ err: e }, 'Failed to instantiate notificationService');
  }
  createRoutes({ router, deps });
  const base = (deps && deps.config && deps.config.apiBase) ? deps.config.apiBase : '/api/v1';
  app.use(`${base}/notifications`, router);
}

module.exports = { register };
