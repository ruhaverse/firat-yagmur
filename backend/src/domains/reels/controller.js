const makeController = (deps) => {
  const db = deps.db;
  const makeFileUrl = deps.services.storage.makeFileUrl;

  function sanitizeCaption(caption) {
    if (!caption || typeof caption !== 'string') return '';
    return caption.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '').trim().slice(0, 2000);
  }

  async function getReels(req, res, next) {
    try {
      const { userId, limit = 50, offset = 0 } = req.query;
      let query = `SELECT r.*, u.email, u.first_name, u.last_name, u.profile_picture FROM reels r JOIN users u ON r.user_id = u.id`;
      const params = [];
      if (userId) { query += ' WHERE r.user_id = $1'; params.push(userId); }
      query += ' ORDER BY r.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
      params.push(limit, offset);
      const result = await db.query(query, params);
      const reels = result.rows || [];
      if (reels.length > 0) {
        const ids = reels.map(r => r.id);
        const mediaRes = await db.query(`SELECT * FROM reel_media WHERE reel_id = ANY($1::int[]) ORDER BY created_at ASC`, [ids]);
        const mediaByReel = {};
        for (const m of mediaRes.rows) {
          if (!mediaByReel[m.reel_id]) mediaByReel[m.reel_id] = [];
          const url = m.media_url && m.media_url.startsWith('http') ? m.media_url : makeFileUrl(m.media_url);
          mediaByReel[m.reel_id].push({ id: m.id, media_url: url, media_type: m.media_type, created_at: m.created_at });
        }
        for (const r of reels) { r.media = mediaByReel[r.id] || []; r.profile_picture = r.profile_picture ? makeFileUrl(r.profile_picture) : null; }
      }
      res.json({ data: reels });
    } catch (err) { next(err); }
  }

  async function getReelById(req, res, next) {
    try {
      const reelId = req.params.id;
      const result = await db.query(`SELECT r.*, u.email, u.first_name, u.last_name, u.profile_picture FROM reels r JOIN users u ON r.user_id = u.id WHERE r.id = $1`, [reelId]);
      if (result.rowCount === 0) return res.status(404).json({ error: 'Reel not found' });
      const reel = result.rows[0];
      const mediaQ = await db.query('SELECT * FROM reel_media WHERE reel_id = $1 ORDER BY created_at ASC', [reel.id]);
      reel.media = mediaQ.rows.map(m => ({ id: m.id, media_url: m.media_url && m.media_url.startsWith('http') ? m.media_url : makeFileUrl(m.media_url), media_type: m.media_type, created_at: m.created_at }));
      reel.profile_picture = reel.profile_picture ? makeFileUrl(reel.profile_picture) : null;
      res.json({ data: reel });
    } catch (err) { next(err); }
  }

  async function createReel(req, res, next) {
    try {
      const authUserId = req.user && req.user.id; if (!authUserId) return res.status(401).json({ error: 'Unauthorized' });
      const userId = parseInt(authUserId, 10);
      const { caption = '', source = null } = req.body;
      const sanitizedCaption = sanitizeCaption(caption);
      const media = [];
      if (req.files && Array.isArray(req.files)) for (const f of req.files) media.push({ mediaPath: makeFileUrl(f.filename), mediaType: f.mimetype });
      const insert = await db.query('INSERT INTO reels (user_id, caption, source, created_at) VALUES ($1,$2,$3,now()) RETURNING id, user_id, caption, source, created_at', [userId, sanitizedCaption, source]);
      const reel = insert.rows[0]; if (source) reel.source = source;
      res.status(201).json({ data: { reel: reel, media } });
    } catch (err) { next(err); }
  }

  async function deleteReel(req, res, next) {
    try {
      const reelId = req.params.id; const userId = req.user.id;
      const check = await db.query('SELECT user_id FROM reels WHERE id = $1', [reelId]); if (check.rowCount === 0) return res.status(404).json({ error: 'Reel not found' });
      if (check.rows[0].user_id !== userId) return res.status(403).json({ error: 'Not authorized to delete this reel' });
      await db.query('DELETE FROM reels WHERE id = $1', [reelId]); res.json({ message: 'Reel deleted successfully' });
    } catch (err) { next(err); }
  }

  async function listSavedReelsByEmail(req, res, next) {
    try {
      const email = req.params.email; const page = parseInt(req.query.page,10) || 1; const limit = Math.min(parseInt(req.query.limit,10) || 50, 200);
      const offset = (page - 1) * limit; const u = await db.query('SELECT id FROM users WHERE email=$1', [email]); if (u.rowCount === 0) return res.json({ data: [] });
      const userId = u.rows[0].id;
      try {
        const q = await db.query(`SELECT r.* FROM reels r JOIN saved_reels sr ON r.id = sr.reel_id WHERE sr.user_id = $1 ORDER BY r.created_at DESC LIMIT $2 OFFSET $3`, [userId, limit, offset]);
        const rows = q.rows || [];
        if (rows.length > 0) {
          const ids = rows.map(r => r.id);
          const mediaRes = await db.query(`SELECT * FROM reel_media WHERE reel_id = ANY($1::int[]) ORDER BY created_at ASC`, [ids]);
          const mediaByReel = {};
          for (const m of mediaRes.rows) { if (!mediaByReel[m.reel_id]) mediaByReel[m.reel_id] = []; const url = m.media_url && m.media_url.startsWith('http') ? m.media_url : makeFileUrl(m.media_url); mediaByReel[m.reel_id].push({ id: m.id, media_url: url, media_type: m.media_type, created_at: m.created_at }); }
          for (const r of rows) r.media = mediaByReel[r.id] || [];
        }
        res.json({ data: rows });
      } catch (err) { if (err && err.message && err.message.includes('relation "saved_reels"')) return res.json({ data: [] }); throw err; }
    } catch (err) { next(err); }
  }

  return { getReels, getReelById, createReel, deleteReel, listSavedReelsByEmail };
};

module.exports = makeController;
