const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/postsController');
const { upload } = require('../services/storage');

// POST /api/v1/posts/web/:userId
router.post('/web/:userId', upload.array('files', 8), createPost);

module.exports = router;
