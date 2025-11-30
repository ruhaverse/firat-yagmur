const db = require('../config/db');
const { makeFileUrl } = require('../services/storage');

function sanitizeContent(content) {
  if (!content || typeof content !== 'string') return '';
  // Remove script tags and limit length
  return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim().slice(0, 5000);
}

function validateInteger(value, min = 1, max = 1000) {
  const num = parseInt(value, 10);
  if (isNaN(num) || num < min || num > max) {
    return { valid: false, value: min };
  }
  return { valid: true, value: num };
}

// Get all posts or posts by user
async function getPosts(req, res, next) {
  try {
    const { userId, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT p.*, u.email, u.first_name, u.last_name, u.profile_picture
      FROM posts p
      JOIN users u ON p.author_id = u.id
    `;
    const params = [];
    
    if (userId) {
      query += ' WHERE p.author_id = $1';
      params.push(userId);
    }
    
    query += ' ORDER BY p.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    
    res.json({ data: result.rows });
  } catch (err) {
    next(err);
  }
}

// Get single post by ID
async function getPostById(req, res, next) {
  try {
    const postId = req.params.id;
    
    const result = await db.query(`
      SELECT p.*, u.email, u.first_name, u.last_name, u.profile_picture
      FROM posts p
      JOIN users u ON p.author_id = u.id
      WHERE p.id = $1
    `, [postId]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ data: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Minimal posts controller — skeletal implementation to match frontend expectations
async function createPost(req, res, next) {
  try {
    const userIdValidation = validateInteger(req.params.userId, 1, 999999999);
    if (!userIdValidation.valid) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }
    const userId = userIdValidation.value;
    
    const { content = '', privacy = 'public' } = req.body;
    const sanitizedContent = sanitizeContent(content);
    const validPrivacy = ['public', 'friends', 'private'].includes(privacy) ? privacy : 'public';

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
      [userId, sanitizedContent, validPrivacy]
    );

    const post = insert.rows[0];

    // Note: media saving to separate table is recommended; here we simply return media in response
    res.json({ data: { post: post, media } });
  } catch (err) {
    next(err);
  }
}

// Delete post
async function deletePost(req, res, next) {
  try {
    const postId = req.params.id;
    const userId = req.user.id; // from auth middleware
    
    // Check if post exists and belongs to user
    const check = await db.query('SELECT author_id FROM posts WHERE id = $1', [postId]);
    
    if (check.rowCount === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    if (check.rows[0].author_id !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }
    
    await db.query('DELETE FROM posts WHERE id = $1', [postId]);
    
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPosts, getPostById, createPost, deletePost };
