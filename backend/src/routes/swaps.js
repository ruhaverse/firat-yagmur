const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { saveSwap, unsaveSwap, listSaved } = require('../controllers/swapsController');

// Save a swap for the authenticated user
router.post('/:id/save', requireAuth, saveSwap);

// Unsave a swap for the authenticated user
router.delete('/:id/save', requireAuth, unsaveSwap);

// List saved swaps for authenticated user
router.get('/saved', requireAuth, listSaved);

module.exports = router;
