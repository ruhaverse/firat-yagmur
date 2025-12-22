const db = require('../config/db');
const notificationService = require('../services/notificationService');

// Send friend request (user sends request to target user id)
async function sendRequest(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { targetId } = req.body;
    if (!targetId) return res.status(400).json({ error: 'targetId required' });

    // create pending friendship (user_id -> targetId)
    const insert = await db.query('INSERT INTO friendships (user_id, friend_id, status, created_at) VALUES ($1,$2,$3,now()) ON CONFLICT (user_id, friend_id) DO UPDATE SET status=EXCLUDED.status RETURNING *', [userId, targetId, 'pending']);

    // notify target user
    try { await notificationService.createNotification({ userId: targetId, actorId: userId, type: 'friend_request', targetType: 'user', targetId: userId, data: { from: userId } }); } catch (e) {}

    res.json({ data: insert.rows[0] });
  } catch (err) { next(err); }
}

// Accept friend request (target accepts request from userId in params)
async function acceptRequest(req, res, next) {
  try {
    const userId = req.user && req.user.id; // accepter
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const requesterId = parseInt(req.params.requesterId, 10);
    if (!requesterId) return res.status(400).json({ error: 'Invalid requester id' });

    // update the friendship where user_id=requesterId and friend_id=userId
    const q = await db.query('UPDATE friendships SET status=$1, updated_at=now() WHERE user_id=$2 AND friend_id=$3 RETURNING *', ['accepted', requesterId, userId]);
    if (q.rowCount === 0) return res.status(404).json({ error: 'Friend request not found' });

    // create reciprocal accepted row if missing
    await db.query('INSERT INTO friendships (user_id, friend_id, status, created_at) VALUES ($1,$2,$3,now()) ON CONFLICT (user_id, friend_id) DO UPDATE SET status=EXCLUDED.status', [userId, requesterId, 'accepted']);

    // notify requester
    try { await notificationService.createNotification({ userId: requesterId, actorId: userId, type: 'friend_request_accepted', targetType: 'user', targetId: userId, data: { by: userId } }); } catch (e) {}

    res.json({ data: q.rows[0] });
  } catch (err) { next(err); }
}

module.exports = { sendRequest, acceptRequest };
