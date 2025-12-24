module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  const auth = deps.authMiddleware;

  router.get('/', auth.requireAuth, controller.listNotifications);
  router.put('/:id/read', auth.requireAuth, controller.markAsRead);
  router.get('/preferences', auth.requireAuth, controller.getPreferences);
  router.post('/preferences', auth.requireAuth, controller.setPreference);
};
