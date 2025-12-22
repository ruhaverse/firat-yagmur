const db = require('../config/db');
const { makeFileUrl } = require('../services/storage');
const notificationService = require('../services/notificationService');

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

// List posts by user email
async function listPostsByEmail(req, res, next) {
  try {
    const email = req.params.email;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const offset = (page - 1) * limit;

    const q = await db.query(
      `SELECT p.*, u.email, u.first_name, u.last_name, u.profile_picture
       FROM posts p JOIN users u ON p.author_id = u.id
       WHERE u.email = $1
       ORDER BY p.created_at DESC LIMIT $2 OFFSET $3`,
      [email, limit, offset]
    );
    res.json({ data: q.rows });
  } catch (err) {
    next(err);
  }
}

// List saved posts for a given email (uses saved_posts table if present)
async function listSavedPostsByEmail(req, res, next) {
  try {
    const email = req.params.email;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const offset = (page - 1) * limit;

    // Get user id
    const u = await db.query('SELECT id FROM users WHERE email=$1', [email]);
    if (u.rowCount === 0) return res.json({ data: [] });
    const userId = u.rows[0].id;

    // Try query saved_posts join; if table missing, return empty
    try {
      const q = await db.query(
        `SELECT p.* FROM posts p JOIN saved_posts sp ON p.id = sp.post_id WHERE sp.user_id = $1 ORDER BY p.created_at DESC LIMIT $2 OFFSET $3`,
        [userId, limit, offset]
      );
      res.json({ data: q.rows });
    } catch (err) {
      // If saved_posts table doesn't exist, return empty without failing
      if (err && err.message && err.message.includes('relation "saved_posts"')) {
        return res.json({ data: [] });
      }
      throw err;
    }
  } catch (err) {
    next(err);
  }
}

// Minimal posts controller — skeletal implementation to match frontend expectations
async function createPost(req, res, next) {
  try {
    // Use authenticated user id from JWT (requireAuth middleware ensures this)
    const authUserId = req.user && req.user.id;
    if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });
    const userId = parseInt(authUserId, 10);
    
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

// Update post
async function updatePost(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'Invalid id' });
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const check = await db.query('SELECT author_id FROM posts WHERE id = $1', [id]);
    if (check.rowCount === 0) return res.status(404).json({ error: 'Post not found' });
    if (check.rows[0].author_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    const { content = null, privacy = null } = req.body;
    const updates = [];
    const params = [];
    let idx = 1;
    if (content !== null) {
      updates.push(`content=$${idx++}`);
      params.push(sanitizeContent(content));
    }
    if (privacy !== null) {
      updates.push(`privacy=$${idx++}`);
      params.push(privacy);
    }
    if (!updates.length) return res.status(400).json({ error: 'No updatable fields provided' });
    params.push(id);
    const q = await db.query(`UPDATE posts SET ${updates.join(',')}, updated_at=now() WHERE id=$${idx} RETURNING *`, params);
    res.json({ data: q.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Like/unlike a post (toggle). Uses likes table with target_type='post'
async function likeUnlike(req, res, next) {
  try {
    const pid = parseInt(req.params.pid, 10);
    const authId = req.user && req.user.id;
    if (!authId) return res.status(401).json({ error: 'Unauthorized' });
    const uidParam = parseInt(req.params.uid, 10) || null;
    if (uidParam && uidParam !== authId) return res.status(403).json({ error: 'Forbidden' });
    const uid = authId;

    // check existing like
    const q = await db.query('SELECT id FROM likes WHERE user_id=$1 AND target_type=$2 AND target_id=$3', [uid, 'post', pid]);
    if (q.rowCount > 0) {
      // unlike
      await db.query('DELETE FROM likes WHERE id=$1', [q.rows[0].id]);
      await db.query('UPDATE posts SET likes_count = GREATEST(COALESCE(likes_count,0)-1,0) WHERE id=$1', [pid]);
      return res.json({ data: { post_id: pid, liked: false } });
    }
    // like
    await db.query('INSERT INTO likes (user_id, target_type, target_id, created_at) VALUES ($1,$2,$3,now()) ON CONFLICT DO NOTHING', [uid, 'post', pid]);
    await db.query('UPDATE posts SET likes_count = COALESCE(likes_count,0)+1 WHERE id=$1', [pid]);
    // notify post author
    try {
      const postQ = await db.query('SELECT author_id FROM posts WHERE id = $1 LIMIT 1', [pid]);
      if (postQ.rowCount > 0) {
        const authorId = postQ.rows[0].author_id;
        if (authorId && authorId !== uid) {
          await notificationService.createNotification({ userId: authorId, actorId: uid, type: 'post_like', targetType: 'post', targetId: pid, data: { liker: uid, post_id: pid } });
        }
      }
    } catch (e) {
      // non-fatal
    }
    res.json({ data: { post_id: pid, liked: true } });
  } catch (err) {
    next(err);
  }
}

// Comment on a post
async function commentOnPost(req, res, next) {
  try {
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const postId = parseInt(req.params.id, 10);
    const { content } = req.body;
    if (!postId || !content) return res.status(400).json({ error: 'Missing post id or content' });

    const sanitized = sanitizeContent(content).slice(0,1000);
    const insert = await db.query('INSERT INTO comments (post_id, user_id, content, target_type, created_at) VALUES ($1,$2,$3,$4,now()) RETURNING *', [postId, userId, sanitized, 'post']);
    // increment comments count
    await db.query('UPDATE posts SET comments_count = COALESCE(comments_count,0)+1 WHERE id = $1', [postId]);

    // notify post author
    try {
      const postQ = await db.query('SELECT author_id FROM posts WHERE id = $1 LIMIT 1', [postId]);
      if (postQ.rowCount > 0) {
        const authorId = postQ.rows[0].author_id;
        if (authorId && authorId !== userId) {
          await notificationService.createNotification({ userId: authorId, actorId: userId, type: 'post_comment', targetType: 'post', targetId: postId, data: { commenter: userId, post_id: postId } });
        }
      }
    } catch (e) {}

    res.json({ data: insert.rows[0] });
  } catch (err) {
    next(err);
  }
}

// Get comments for a post
async function getPostComments(req, res, next) {
  try {
    const postId = parseInt(req.params.id, 10);
    if (!postId) return res.status(400).json({ error: 'Invalid post id' });
    const q = await db.query(`SELECT c.*, u.email, u.first_name, u.last_name, u.profile_picture FROM comments c JOIN users u ON c.user_id = u.id WHERE c.post_id = $1 ORDER BY c.created_at ASC`, [postId]);
    const rows = q.rows.map(r => ({ ...r, profile_picture: r.profile_picture ? makeFileUrl(r.profile_picture) : null }));
    res.json({ data: rows });
  } catch (err) { next(err); }
}

// Save/unsave a post for a user - requires saved_posts table
async function saveUnsave(req, res, next) {
  try {
    const pid = parseInt(req.params.pid, 10);
    const authId = req.user && req.user.id;
    if (!authId) return res.status(401).json({ error: 'Unauthorized' });
    const uidParam = parseInt(req.params.uid, 10) || null;
    if (uidParam && uidParam !== authId) return res.status(403).json({ error: 'Forbidden' });
    const uid = authId;

    // ensure saved_posts exists; if not, create-like behavior using likes table backup
    try {
      const q = await db.query('SELECT id FROM saved_posts WHERE user_id=$1 AND post_id=$2', [uid, pid]);
      if (q.rowCount > 0) {
        await db.query('DELETE FROM saved_posts WHERE id=$1', [q.rows[0].id]);
        return res.json({ data: { post_id: pid, saved: false } });
      }
      await db.query('INSERT INTO saved_posts (user_id, post_id, created_at) VALUES ($1,$2,now()) ON CONFLICT DO NOTHING', [uid, pid]);
      return res.json({ data: { post_id: pid, saved: true } });
    } catch (err) {
      if (err && err.message && err.message.includes('relation "saved_posts"')) {
        // fallback: return not implemented
        return res.status(501).json({ error: 'Saved posts not enabled on server' });
      }
      throw err;
    }
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

module.exports = { getPosts, getPostById, createPost, deletePost, listPostsByEmail, listSavedPostsByEmail, updatePost, likeUnlike, saveUnsave, commentOnPost, getPostComments };
