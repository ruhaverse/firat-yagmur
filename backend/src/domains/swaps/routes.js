module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  const auth = deps.authMiddleware;

  router.post('/', auth.requireAuth, controller.createSwap);
  router.get('/:id', controller.getSwapById);
  router.put('/:id', auth.requireAuth, controller.updateSwap);
  router.delete('/:id', auth.requireAuth, controller.deleteSwap);

  router.get('/', controller.listAll);
  router.get('/user/:email', controller.listByUser);
  router.get('/friends/:email', controller.listByFriends);
  router.get('/:email/saved_swaps', controller.listSavedByEmail);

  router.put('/:id/save', auth.requireAuth, controller.saveSwap);
  router.put('/:id/unsave', auth.requireAuth, controller.unsaveSwap);
};
