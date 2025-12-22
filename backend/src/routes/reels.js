const express = require('express');
const router = express.Router();
const { getReels, getReelById, createReel, deleteReel, listSavedReelsByEmail } = require('../controllers/reelsController');
const { upload } = require('../services/storage');
const { requireAuth } = require('../middleware/auth');

// GET /api/v1/reels - Get all reels (with optional filters)
router.get('/', getReels);

// GET /api/v1/reels/:id - Get single reel
// Saved reels by user email (frontend expects /:email/saved_reels)
router.get('/:email/saved_reels', listSavedReelsByEmail);

// GET /api/v1/reels/:id - Get single reel
router.get('/:id', getReelById);

// POST /api/v1/reels - Create new reel (requires auth)
// Body: { caption } — use Authorization: Bearer <token>
// Server uses authenticated `req.user.id` as the reel owner
// Canonical endpoint: POST /api/v1/reels
// Body: { caption?: string, source?: string }
// Ownership is always derived from the authenticated token (`req.user.id`).
router.post('/', requireAuth, upload.array('reelfiles', 4), createReel);

// DELETE /api/v1/reels/:id - Delete reel (requires auth)
router.delete('/:id', requireAuth, deleteReel);

// Legacy endpoints removed: use POST /api/v1/reels only. If you need to send
// an origin/source, include `source` in the JSON body.

module.exports = router;
