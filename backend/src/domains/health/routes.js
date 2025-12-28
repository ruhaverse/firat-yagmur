module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);

  router.get('/', controller.status);
};
