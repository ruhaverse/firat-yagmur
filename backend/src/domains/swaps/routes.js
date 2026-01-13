module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  const auth = deps.authMiddleware;

  // Create swap
  router.post('/', auth.requireAuth, controller.createSwap);

  // Specific actions first (save/unsave)
  router.put('/:id/save', auth.requireAuth, controller.saveSwap);
  router.put('/:id/unsave', auth.requireAuth, controller.unsaveSwap);

  // List and user/friends routes (more specific before generic id)
  router.get('/user/:email', controller.listByUser);
  router.get('/friends/:email', controller.listByFriends);
  router.get('/:email/saved_swaps', controller.listSavedByEmail);

  // Generic swap routes by id
  router.get('/:id', controller.getSwapById);
  router.put('/:id', auth.requireAuth, controller.updateSwap);
  router.delete('/:id', auth.requireAuth, controller.deleteSwap);

  // List all swaps
  router.get('/', controller.listAll);
};
