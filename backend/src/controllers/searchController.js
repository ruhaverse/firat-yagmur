const db = require('../config/db');
const { makeFileUrl } = require('../services/storage');

function parsePaging(req) {
  const limit = Math.min(parseInt(req.query.limit, 10) || 20, 200);
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const offset = (page - 1) * limit;
  return { limit, offset, page };
}

async function searchPosts(req, res, next) {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'q (query) parameter required' });
    const { limit, offset } = parsePaging(req);

    const sql = `SELECT p.*, u.email, u.first_name, u.last_name, u.profile_picture,
      ts_rank(to_tsvector('english', coalesce(p.content,'')), websearch_to_tsquery('english', $1)) AS rank,
      COUNT(*) OVER() AS total_count
      FROM posts p JOIN users u ON p.author_id = u.id
      WHERE to_tsvector('english', coalesce(p.content,'')) @@ websearch_to_tsquery('english', $1)
      ORDER BY rank DESC, p.created_at DESC LIMIT $2 OFFSET $3`;
    const result = await db.query(sql, [q, limit, offset]);
    const posts = result.rows;
    if (posts.length) {
      const ids = posts.map(p => p.id);
      const mediaRes = await db.query('SELECT * FROM post_media WHERE post_id = ANY($1::int[]) ORDER BY created_at ASC', [ids]);
      const mediaBy = {};
      for (const m of mediaRes.rows) {
        mediaBy[m.post_id] = mediaBy[m.post_id] || [];
        mediaBy[m.post_id].push({ id: m.id, media_url: m.media_url && m.media_url.startsWith('http') ? m.media_url : makeFileUrl(m.media_url), media_type: m.media_type, created_at: m.created_at });
      }
      for (const p of posts) {
        p.media = mediaBy[p.id] || [];
        p.profile_picture = p.profile_picture ? makeFileUrl(p.profile_picture) : null;
        p.rank = parseFloat(p.rank) || 0;
      }
    }
    const total = posts.length ? parseInt(posts[0].total_count, 10) : 0;
    res.json({ data: posts, meta: { total, page: parseInt(req.query.page, 10) || 1, limit } });
  } catch (err) { next(err); }
}

async function searchReels(req, res, next) {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'q (query) parameter required' });
    const { limit, offset } = parsePaging(req);

    const sql = `SELECT r.*, u.email, u.first_name, u.last_name, u.profile_picture,
      ts_rank(to_tsvector('english', coalesce(r.caption,'')), websearch_to_tsquery('english', $1)) AS rank,
      COUNT(*) OVER() AS total_count
      FROM reels r JOIN users u ON r.user_id = u.id
      WHERE to_tsvector('english', coalesce(r.caption,'')) @@ websearch_to_tsquery('english', $1)
      ORDER BY rank DESC, r.created_at DESC LIMIT $2 OFFSET $3`;
    const result = await db.query(sql, [q, limit, offset]);
    const reels = result.rows;
    if (reels.length) {
      const ids = reels.map(r => r.id);
      const mediaRes = await db.query('SELECT * FROM reel_media WHERE reel_id = ANY($1::int[]) ORDER BY created_at ASC', [ids]);
      const mediaBy = {};
      for (const m of mediaRes.rows) {
        mediaBy[m.reel_id] = mediaBy[m.reel_id] || [];
        mediaBy[m.reel_id].push({ id: m.id, media_url: m.media_url && m.media_url.startsWith('http') ? m.media_url : makeFileUrl(m.media_url), media_type: m.media_type, created_at: m.created_at });
      }
      for (const r of reels) {
        r.media = mediaBy[r.id] || [];
        r.profile_picture = r.profile_picture ? makeFileUrl(r.profile_picture) : null;
        r.rank = parseFloat(r.rank) || 0;
      }
    }
    const total = reels.length ? parseInt(reels[0].total_count, 10) : 0;
    res.json({ data: reels, meta: { total, page: parseInt(req.query.page, 10) || 1, limit } });
  } catch (err) { next(err); }
}

async function searchUsers(req, res, next) {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: 'q (query) parameter required' });
    const { limit, offset } = parsePaging(req);
    const sql = `SELECT id, email, first_name, last_name, profile_picture,
      ts_rank(to_tsvector('english', coalesce(first_name,'') || ' ' || coalesce(last_name,'') || ' ' || coalesce(email,'')), websearch_to_tsquery('english', $1)) AS rank,
      COUNT(*) OVER() AS total_count
      FROM users
      WHERE to_tsvector('english', coalesce(first_name,'') || ' ' || coalesce(last_name,'') || ' ' || coalesce(email,'')) @@ websearch_to_tsquery('english', $1)
      ORDER BY rank DESC, id DESC LIMIT $2 OFFSET $3`;
    const result = await db.query(sql, [q, limit, offset]);
    const rows = result.rows.map(r => ({ ...r, profile_picture: r.profile_picture ? makeFileUrl(r.profile_picture) : null, rank: parseFloat(r.rank) || 0 }));
    const total = rows.length ? parseInt(rows[0].total_count, 10) : 0;
    res.json({ data: rows, meta: { total, page: parseInt(req.query.page, 10) || 1, limit } });
  } catch (err) { next(err); }
}

module.exports = { searchPosts, searchReels, searchUsers };
