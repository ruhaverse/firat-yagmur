const express = require('express');
const createRoutes = require('./routes');

function register(app, deps) {
  const router = express.Router();
  createRoutes({ router, deps });
  const base = (deps && deps.config && deps.config.apiBase) ? deps.config.apiBase : '/api/v1';
  app.use(`${base}/stories`, router);
  // also mount uppercase variant to be tolerant of frontend inconsistencies
  app.use(`${base}/Stories`, router);
}

module.exports = { register };
