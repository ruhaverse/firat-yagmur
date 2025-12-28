module.exports = function makeReelsService(deps) {
  const db = deps.db;

  async function getReels({ userId = null, limit = 50, offset = 0 } = {}) {
    let query = `SELECT r.*, u.email, u.first_name, u.last_name, u.profile_picture FROM reels r JOIN users u ON r.user_id = u.id`;
    const params = [];
    if (userId) { query += ' WHERE r.user_id = $1'; params.push(userId); }
    query += ' ORDER BY r.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    const result = await db.query(query, params);
    const reels = result.rows || [];
    if (reels.length === 0) return { reels: [], mediaRows: [] };
    const ids = reels.map(r => r.id);
    const mediaRes = await db.query(`SELECT * FROM reel_media WHERE reel_id = ANY($1::int[]) ORDER BY created_at ASC`, [ids]);
    return { reels, mediaRows: mediaRes.rows || [] };
  }

  async function getReelById(id) {
    const result = await db.query(`SELECT r.*, u.email, u.first_name, u.last_name, u.profile_picture FROM reels r JOIN users u ON r.user_id = u.id WHERE r.id = $1`, [id]);
    if (result.rowCount === 0) return null;
    const reel = result.rows[0];
    const mediaQ = await db.query('SELECT * FROM reel_media WHERE reel_id = $1 ORDER BY created_at ASC', [reel.id]);
    return { reel, mediaRows: mediaQ.rows || [] };
  }

  async function createReel(userId, caption, source = null) {
    const insert = await db.query('INSERT INTO reels (user_id, caption, source, created_at) VALUES ($1,$2,$3,now()) RETURNING id, user_id, caption, source, created_at', [userId, caption, source]);
    return insert.rows[0];
  }

  async function deleteReel(id) {
    await db.query('DELETE FROM reels WHERE id = $1', [id]);
    return true;
  }

  async function listSavedReelsByEmail(email, limit = 50, offset = 0) {
    const u = await db.query('SELECT id FROM users WHERE email=$1', [email]);
    if (u.rowCount === 0) return { rows: [], mediaRows: [] };
    const userId = u.rows[0].id;
    const q = await db.query(`SELECT r.* FROM reels r JOIN saved_reels sr ON r.id = sr.reel_id WHERE sr.user_id = $1 ORDER BY r.created_at DESC LIMIT $2 OFFSET $3`, [userId, limit, offset]);
    const rows = q.rows || [];
    if (rows.length === 0) return { rows: [], mediaRows: [] };
    const ids = rows.map(r => r.id);
    const mediaRes = await db.query(`SELECT * FROM reel_media WHERE reel_id = ANY($1::int[]) ORDER BY created_at ASC`, [ids]);
    return { rows, mediaRows: mediaRes.rows || [] };
  }

  return { getReels, getReelById, createReel, deleteReel, listSavedReelsByEmail };
};
