const express = require('express');
const createRoutes = require('./routes');
const createController = require('./controller');
const createService = require('./service');

function register(app, deps) {
  const router = express.Router();
  const service = createService({ db: deps.db });
  const controller = createController({ service });
  createRoutes({ router, deps: { ...deps, service, controller } });
  const base = (deps && deps.config && deps.config.apiBase) ? deps.config.apiBase : '/api/v1';
  app.use(`${base}/friends`, router);
}

module.exports = { register };
