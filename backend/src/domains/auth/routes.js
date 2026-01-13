module.exports = function createAuthRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  const auth = deps.authMiddleware;

  // POST /api/v1/auth/register
  router.post('/register', controller.register);

  // POST /api/v1/auth/login
  router.post('/login', controller.login);

  // GET /api/v1/users/profile (and /me alias)
  router.get('/profile', auth.requireAuth, controller.getProfile);
  router.get('/me', auth.requireAuth, controller.getProfile);

  // GET /api/v1/users/:email
  router.get('/:email', controller.getUserByEmail);

  // GET /api/v1/users
  router.get('/', controller.listUsers);

  // POST /api/v1/users/:id/roles
  router.post('/:id/roles', auth.requireAuth, controller.assignRoleToUser);

  // GET /api/v1/users/:id/roles
  router.get('/:id/roles', controller.listUserRoles);
};
