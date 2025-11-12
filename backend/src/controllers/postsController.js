const db = require('../config/db');
const { makeFileUrl } = require('../services/storage');

// Minimal posts controller — skeletal implementation to match frontend expectations
async function createPost(req, res, next) {
  try {
    const userId = req.params.userId;
    const { content = '', privacy = 'public' } = req.body;

    // handle optional files - Hostinger için sadece local uploads kullan
    const media = [];
    if (req.files && Array.isArray(req.files)) {
      for (const f of req.files) {
        media.push({ mediaPath: makeFileUrl(f.filename), mediaType: f.mimetype });
      }
    }

    // Insert into posts table (table should exist; see README)
    const insert = await db.query(
      'INSERT INTO posts (author_id, content, privacy, created_at) VALUES ($1,$2,$3,now()) RETURNING id, author_id, content, privacy, created_at',
      [userId, content, privacy]
    );

    const post = insert.rows[0];

    // Note: media saving to separate table is recommended; here we simply return media in response
    res.json({ data: { post: post, media } });
  } catch (err) {
    next(err);
  }
}

module.exports = { createPost };
