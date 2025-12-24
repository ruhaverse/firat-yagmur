module.exports = function createRoutes({ router, deps }) {
  const controller = require('./controller')(deps);
  const { upload } = deps.services.storage;
  const auth = deps.authMiddleware;

  router.get('/', controller.getPosts);
  router.get('/email/:email', controller.listPostsByEmail);
  router.get('/:email/saved_posts', controller.listSavedPostsByEmail);
  router.get('/:id', controller.getPostById);
  router.get('/:id/comments', controller.getPostComments);

  router.post('/', auth.requireAuth, upload.array('files', 8), controller.createPost);
  router.put('/:id', auth.requireAuth, controller.updatePost);
  router.delete('/:id', auth.requireAuth, controller.deletePost);

  router.put('/:uid/like-unlike/:pid', auth.requireAuth, controller.likeUnlike);
  router.put('/:uid/save-unsave/:pid', auth.requireAuth, controller.saveUnsave);
  router.post('/:id/comment', auth.requireAuth, controller.commentOnPost);
};
