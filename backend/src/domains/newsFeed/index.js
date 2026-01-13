const express = require('express');
const createRoutes = require('./routes');

function register(app, deps) {
  const router = express.Router();
  createRoutes({ router, deps });
  const base = (deps && deps.config && deps.config.apiBase) ? deps.config.apiBase : '/api/v1';
  // mount with exact case used by frontend: /newsFeed
  app.use(`${base}/newsFeed`, router);
}

module.exports = { register };
