const express = require('express');
const createRoutes = require('./routes');

function register(app, deps) {
  const router = express.Router();
  try {
    if (!deps.services) deps.services = {};
    if (!deps.services.healthService) {
      const makeService = require('./service');
      deps.services.healthService = makeService(deps);
    }
  } catch (e) {
    if (deps && deps.logger && deps.logger.warn) deps.logger.warn({ err: e }, 'Failed to instantiate healthService');
  }

  createRoutes({ router, deps });
  const base = (deps && deps.config && deps.config.apiBase) ? deps.config.apiBase : '/api/v1';
  app.use(`${base}/health`, router);
}

module.exports = { register };
