const express = require('express');
const router = express.Router();
const { createReel } = require('../controllers/reelsController');
const { upload } = require('../services/storage');

// POST /api/v1/reels/web/:userId
router.post('/web/:userId', upload.array('reelfiles', 4), createReel);

module.exports = router;
