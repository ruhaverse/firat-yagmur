const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { sendRequest, acceptRequest } = require('../controllers/friendshipsController');

// POST /api/v1/friendships/send - body: { targetId }
router.post('/send', requireAuth, sendRequest);

// PUT /api/v1/friendships/:requesterId/accept - accept incoming request
router.put('/:requesterId/accept', requireAuth, acceptRequest);

module.exports = router;
