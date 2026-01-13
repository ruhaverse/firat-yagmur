module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  const { upload } = deps.services.storage;
  const auth = deps.authMiddleware;

  // Basic reels routes - more specific routes FIRST
  router.get('/', controller.getReels); // List all reels
  router.get('/email/:email', controller.listSavedReelsByEmail); // Saved reels by email
  router.get('/:id', controller.getReelById); // Get single reel

  // Create reel
  router.post('/', auth.requireAuth, upload.array('files', 8), controller.createReel);
  router.delete('/:id', auth.requireAuth, controller.deleteReel); // Delete reel

  // Like / Unlike routes
  router.post('/:id/like', auth.requireAuth, controller.likeReel); // Like reel
  router.delete('/:id/like', auth.requireAuth, controller.unlikeReel); // Unlike reel
};
