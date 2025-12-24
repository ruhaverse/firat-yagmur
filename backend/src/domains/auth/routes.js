module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  // POST /api/v1/users/register
  router.post('/register', controller.register);
  // POST /api/v1/users/login
  router.post('/login', controller.login);
  // GET /api/v1/users/  - list users (admin only)
  router.get('/', deps.authMiddleware.requireAuth, deps.rbac.requireRole('admin'), controller.listUsers);
  // GET /api/v1/users/:email
  router.get('/:email', controller.getUserByEmail);
  // PUT /api/v1/users/:id/roles
  router.put('/:id/roles', deps.authMiddleware.requireAuth, deps.rbac.requireRole('admin'), controller.assignRoleToUser);
  // GET /api/v1/users/:id/roles
  router.get('/:id/roles', deps.authMiddleware.requireAuth, deps.rbac.requireRole('admin'), controller.listUserRoles);
};
