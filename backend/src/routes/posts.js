const express = require('express');
const router = express.Router();
const { getPosts, getPostById, createPost, deletePost } = require('../controllers/postsController');
const { upload } = require('../services/storage');
const { requireAuth } = require('../middleware/auth');

// GET /api/v1/posts - Get all posts (with optional filters)
router.get('/', getPosts);

// GET /api/v1/posts/:id - Get single post
router.get('/:id', getPostById);

// POST /api/v1/posts/web/:userId - Create new post
router.post('/web/:userId', upload.array('files', 8), createPost);

// DELETE /api/v1/posts/:id - Delete post (requires auth)
router.delete('/:id', requireAuth, deletePost);

module.exports = router;
