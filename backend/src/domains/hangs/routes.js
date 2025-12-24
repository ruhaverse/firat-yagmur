const controller = require('./controller');

module.exports = function createRoutes({ router, deps }) {
  // Simple health endpoint to verify domain loader
  router.get('/ping', controller.ping(deps));

  // Placeholder create hang route (not implemented yet)
  router.post('/', deps.authMiddleware.requireAuth, controller.createHang(deps));
};
