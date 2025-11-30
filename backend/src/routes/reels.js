const express = require('express');
const router = express.Router();
const { getReels, getReelById, createReel, deleteReel } = require('../controllers/reelsController');
const { upload } = require('../services/storage');
const { requireAuth } = require('../middleware/auth');

// GET /api/v1/reels - Get all reels (with optional filters)
router.get('/', getReels);

// GET /api/v1/reels/:id - Get single reel
router.get('/:id', getReelById);

// POST /api/v1/reels/web/:userId - Create new reel
router.post('/web/:userId', upload.array('reelfiles', 4), createReel);

// DELETE /api/v1/reels/:id - Delete reel (requires auth)
router.delete('/:id', requireAuth, deleteReel);

module.exports = router;
