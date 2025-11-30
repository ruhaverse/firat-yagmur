const db = require('../config/db');
const { makeFileUrl } = require('../services/storage');

function sanitizeCaption(caption) {
  if (!caption || typeof caption !== 'string') return '';
  // Remove script tags and limit length
  return caption.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim().slice(0, 2000);
}

function validateInteger(value, min = 1, max = 1000) {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < min || num > max) {
    return { valid: false, value: min };
  }
  return { valid: true, value: num };
}

// Get all reels or reels by user
async function getReels(req, res, next) {
  try {
    const { userId, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT r.*, u.email, u.first_name, u.last_name, u.profile_picture
      FROM reels r
      JOIN users u ON r.user_id = u.id
    `;
    const params = [];
    
    if (userId) {
      query += ' WHERE r.user_id = $1';
      params.push(userId);
    }
    
    query += ' ORDER BY r.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
}

// Get single reel by ID
async function getReelById(req, res, next) {
  try {
    const reelId = req.params.id;
    
    const result = await db.query(`
      SELECT r.*, u.email, u.first_name, u.last_name, u.profile_picture
      FROM reels r
      JOIN users u ON r.user_id = u.id
      WHERE r.id = $1
    `, [reelId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Reel not found' });
    }
    
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Minimal reels controller — skeletal implementation to match frontend expectations
async function createReel(req, res, next) {
  try {
    const userIdValidation = validateInteger(req.params.userId, 1, 999999999);
    if (!userIdValidation.valid) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const userId = userIdValidation.value;
    
    const { caption = '' } = req.body;
    const sanitizedCaption = sanitizeCaption(caption);

    // Hostinger için sadece local uploads kullan
    const media = [];
    if (req.files && Array.isArray(req.files)) {
      for (const f of req.files) {
        media.push({ mediaPath: makeFileUrl(f.filename), mediaType: f.mimetype });
      }
    }

    const insert = await db.query(
      'INSERT INTO reels (user_id, caption, created_at) VALUES ($1,$2,now()) RETURNING id, user_id, caption, created_at',
      [userId, sanitizedCaption]
    );

    const reel = insert.rows[0];
    res.json({ data: { reel: reel, media } });
  } catch (err) {
    next(err);
  }
}

// Delete reel
async function deleteReel(req, res, next) {
  try {
    const reelId = req.params.id;
    const userId = req.user.id; // from auth middleware
    
    // Check if reel exists and belongs to user
    const check = await db.query('SELECT user_id FROM reels WHERE id = $1', [reelId]);
    
    if (check.rowCount === 0) {
      return res.status(404).json({ error: 'Reel not found' });
    }
    
    if (check.rows[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this reel' });
    }
    
    await db.query('DELETE FROM reels WHERE id = $1', [reelId]);
    
    res.json({ message: 'Reel deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getReels, getReelById, createReel, deleteReel };
