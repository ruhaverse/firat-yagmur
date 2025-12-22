const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
// const { getConfig } = require('../config/env');

// GET /api/v1/admin/metrics - basic system metrics (admin only)
router.get('/metrics', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const counts = await Promise.all([
      db.query('SELECT COUNT(*)::int AS count FROM users'),
      db.query('SELECT COUNT(*)::int AS count FROM posts'),
      db.query('SELECT COUNT(*)::int AS count FROM reels'),
      db.query('SELECT COUNT(*)::int AS count FROM swaps'),
      db.query('SELECT COUNT(*)::int AS count FROM notifications')
    ]);
    res.json({ data: {
      users: counts[0].rows[0].count,
      posts: counts[1].rows[0].count,
      reels: counts[2].rows[0].count,
      swaps: counts[3].rows[0].count,
      notifications: counts[4].rows[0].count
    }});
  } catch (err) { next(err); }
});

module.exports = router;
