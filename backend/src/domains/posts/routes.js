module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  const { upload } = deps.services.storage;
  const auth = deps.authMiddleware;

  // Public routes
  router.get('/', controller.getPosts); // List posts
  router.get('/email/:email', controller.listPostsByEmail); // Posts by user email
  router.get('/:email/saved_posts', controller.listSavedPostsByEmail); // Saved posts by email
  router.get('/:id', controller.getPostById); // Get single post
  router.get('/:id/comments', controller.getPostComments); // Get comments for a post

  // Protected routes (require authentication)
  router.post('/', auth.requireAuth, upload.array('files', 8), controller.createPost); // Create post
  router.put('/:id', auth.requireAuth, controller.updatePost); // Update post
  router.delete('/:id', auth.requireAuth, controller.deletePost); // Delete post

  // Likes/Dislikes
  router.post('/:pid/like', auth.requireAuth, controller.likeUnlike); // Like/unlike post

  // Save/Unsave
  router.post('/:pid/save', auth.requireAuth, controller.saveUnsave); // Save/unsave post

  // Comments
  router.post('/:id/comment', auth.requireAuth, controller.commentOnPost); // Add comment
  router.delete('/comments/:id', auth.requireAuth, controller.deleteComment); // Delete comment
};
