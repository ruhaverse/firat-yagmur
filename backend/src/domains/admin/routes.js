module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  const auth = deps.authMiddleware;

  router.get('/metrics', auth.requireAuth, deps.rbac.requireRole('admin'), controller.metrics);
};
