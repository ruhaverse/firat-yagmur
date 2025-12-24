const express = require('express');
const createRoutes = require('./routes');

function register(app, deps) {
  const router = express.Router();
  createRoutes({ router, deps });
  // Mount under API base + domain name
  const base = (deps && deps.config && deps.config.apiBase) ? deps.config.apiBase : '/api/v1';
  app.use(`${base}/hangs`, router);
}

module.exports = { register };
