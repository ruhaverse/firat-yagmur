module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  const { upload } = deps.services.storage;
  const auth = deps.authMiddleware;

  // Public routes - IMPORTANT: More specific routes BEFORE generic /:id
  router.get('/', controller.getPosts); // List posts
  router.get('/email/:email', controller.listPostsByEmail); // Posts by user email
  router.get('/email/:email/saved', controller.listSavedPostsByEmail); // Saved posts by email

  // Generic routes (must be last in GET to avoid conflicts)
  router.get('/:id', controller.getPostById); // Get single post
  router.get('/:id/comments', controller.getPostComments); // Get comments for a post

  // Protected routes (require authentication)
  router.post('/', auth.requireAuth, upload.array('files', 8), controller.createPost); // Create post
  router.put('/:id', auth.requireAuth, controller.updatePost); // Update post
  router.delete('/:id', auth.requireAuth, controller.deletePost); // Delete post

  // Post interactions - More specific before generic
  router.post('/:pid/like', auth.requireAuth, controller.likeUnlike); // Like/unlike post
  router.post('/:pid/save', auth.requireAuth, controller.saveUnsave); // Save/unsave post
  router.post('/:pid/comment', auth.requireAuth, controller.commentOnPost); // Add comment

  // Delete endpoints
  router.delete('/:id', auth.requireAuth, controller.deletePost); // Delete post
  router.delete('/:id/comment/:cid', auth.requireAuth, controller.deleteComment); // Delete comment
};
