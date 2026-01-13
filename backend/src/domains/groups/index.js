const express = require('express');
const createRoutes = require('./routes');

function register(app, deps) {
  const router = express.Router();
  createRoutes({ router, deps });
  const base = (deps && deps.config && deps.config.apiBase) ? deps.config.apiBase : '/api/v1';
  app.use(`${base}/groups`, router);
}

module.exports = { register };
