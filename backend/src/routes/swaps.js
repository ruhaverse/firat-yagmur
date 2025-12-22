const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const {
  saveSwap,
  unsaveSwap,
  listSaved,
  listAll,
  listByUser,
  listByFriends,
  createSwap,
  getSwapById,
  updateSwap,
  deleteSwap,
  listSavedByEmail
} = require('../controllers/swapsController');
const { upload } = require('../services/storage');

// Save a swap for the authenticated user
router.post('/:id/save', requireAuth, saveSwap);

// Unsave a swap for the authenticated user
router.delete('/:id/save', requireAuth, unsaveSwap);

// List saved swaps for authenticated user (auth)
router.get('/saved', requireAuth, listSaved);

// Public: list all swaps (supports pagination/filters)
router.get('/', listAll);

// List swaps by user email
router.get('/email/:email', listByUser);

// Alias used by frontend: femail -> friends
router.get('/femail/:email', listByFriends);

// List swaps posted by friends of a user (email)
router.get('/friends/:email', listByFriends);

// List saved swaps for a specific email (frontend expects /:email/saved_swaps)
router.get('/:email/saved_swaps', listSavedByEmail);

// Create swap (authenticated) with optional files (field name: swapfiles)
// POST /api/v1/swaps - Body: payload fields for swap (server will set user_id from token)
// Backwards-compatible: frontend may POST to /swaps/:userId — ignore param and use token
router.post('/:userId', requireAuth, upload.array('swapfiles', 8), createSwap);

// New canonical endpoint: POST /api/v1/swaps
router.post('/', requireAuth, upload.array('swapfiles', 8), createSwap);

// Get single swap by id
router.get('/:id', getSwapById);

// Update swap (authenticated, owner)
router.put('/:id', requireAuth, updateSwap);

// Delete swap (authenticated, owner)
router.delete('/:id', requireAuth, deleteSwap);

module.exports = router;
