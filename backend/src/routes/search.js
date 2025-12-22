const express = require('express');
const router = express.Router();
const { searchPosts, searchReels, searchUsers } = require('../controllers/searchController');

// GET /api/v1/search/posts?q=...
router.get('/posts', searchPosts);
// GET /api/v1/search/reels?q=...
router.get('/reels', searchReels);
// GET /api/v1/search/users?q=...
router.get('/users', searchUsers);

module.exports = router;
