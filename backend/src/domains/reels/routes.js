module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  const { upload } = deps.services.storage;
  const auth = deps.authMiddleware;

  router.get('/', controller.getReels);
  router.get('/email/:email', controller.listSavedReelsByEmail);
  router.get('/:id', controller.getReelById);

  router.post('/', auth.requireAuth, upload.array('files', 8), controller.createReel);
  router.delete('/:id', auth.requireAuth, controller.deleteReel);
};
