const db = require('../config/db');
const { makeFileUrl } = require('../services/storage');

// Minimal reels controller — skeletal implementation to match frontend expectations
async function createReel(req, res, next) {
  try {
    const userId = req.params.userId;
    const { caption = '' } = req.body;

    // Hostinger için sadece local uploads kullan
    const media = [];
    if (req.files && Array.isArray(req.files)) {
      for (const f of req.files) {
        media.push({ mediaPath: makeFileUrl(f.filename), mediaType: f.mimetype });
      }
    }

    const insert = await db.query(
      'INSERT INTO reels (user_id, caption, created_at) VALUES ($1,$2,now()) RETURNING id, user_id, caption, created_at',
      [userId, caption]
    );

    const reel = insert.rows[0];
    res.json({ data: { reel: reel, media } });
  } catch (err) {
    next(err);
  }
}

module.exports = { createReel };
