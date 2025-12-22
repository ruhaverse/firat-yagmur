const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, deletePost, listPostsByEmail, listSavedPostsByEmail, updatePost, likeUnlike, saveUnsave, commentOnPost, getPostComments } = require('../controllers/postsController');
const { upload } = require('../services/storage');
const { requireAuth } = require('../middleware/auth');

// GET /api/v1/posts - Get all posts (with optional filters)
router.get('/', getPosts);

// GET /api/v1/posts/:id - Get single post
// get by id must be below email/saved routes to avoid param conflict; keep order accordingly
router.get('/email/:email', listPostsByEmail);
router.get('/:email/saved_posts', listSavedPostsByEmail);
router.get('/:id', getPostById);
router.get('/:id/comments', getPostComments);

// POST /api/v1/posts - Create new post (requires auth)
// Body: { content, privacy } — use Authorization: Bearer <token>
// Server uses authenticated `req.user.id` as the post author (prevents impersonation)
router.post('/', requireAuth, upload.array('files', 8), createPost);

// DELETE /api/v1/posts/:id - Delete post (requires auth)
router.put('/:id', requireAuth, updatePost);
router.delete('/:id', requireAuth, deletePost);

// Like/unlike and save/unsave endpoints used by frontend
router.put('/:uid/like-unlike/:pid', requireAuth, likeUnlike);
router.put('/:uid/save-unsave/:pid', requireAuth, saveUnsave);
router.post('/:id/comment', requireAuth, commentOnPost);

module.exports = router;
