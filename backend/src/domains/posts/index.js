const express = require('express');
const createRoutes = require('./routes');

function register(app, deps) {
  const router = express.Router();
  // Ensure a postsService is available to controllers. If not provided via deps, instantiate domain service.
  try {
    if (!deps.services) deps.services = {};
    if (!deps.services.postsService) {
      // domain-level service factory
      // service expects deps (db, etc.)
      // require here to avoid circular requires during common init
      const makePostsService = require('./service');
      deps.services.postsService = makePostsService(deps);
    }
  } catch (e) {
    // If service instantiation fails, log and continue; controllers will surface errors.
    if (deps && deps.logger && deps.logger.warn) deps.logger.warn({ err: e }, 'Failed to instantiate postsService');
  }

  createRoutes({ router, deps });
  const base = (deps && deps.config && deps.config.apiBase) ? deps.config.apiBase : '/api/v1';
  app.use(`${base}/posts`, router);
}

module.exports = { register };
