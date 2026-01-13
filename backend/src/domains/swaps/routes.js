module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  const auth = deps.authMiddleware;

  // List all swaps - FIRST (more specific than generic routes)
  router.get('/', controller.listAll);

  // Specific action routes - BEFORE generic /:id
  router.get('/user/:email', controller.listByUser);
  router.get('/friends/:email', controller.listByFriends);
  router.get('/saved/:email', controller.listSavedByEmail); // Changed from /:email/saved_swaps

  // Generic swap routes by id - LAST
  router.get('/:id', controller.getSwapById);
  router.post('/', auth.requireAuth, controller.createSwap);
  router.put('/:id', auth.requireAuth, controller.updateSwap);
  router.put('/:id/save', auth.requireAuth, controller.saveSwap);
  router.put('/:id/unsave', auth.requireAuth, controller.unsaveSwap);
  router.delete('/:id', auth.requireAuth, controller.deleteSwap);
};
