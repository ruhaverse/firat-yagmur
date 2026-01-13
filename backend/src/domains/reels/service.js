module.exports = function makeReelsService(deps) {
  const db = deps.db;

  // Get multiple reels with media
  async function getReels({ authorId = null, limit = 50, offset = 0 } = {}) {
    let query = `
      SELECT r.*, u.email, u.first_name, u.last_name, u.profile_picture
      FROM reels r
      JOIN users u ON r.author_id = u.id
    `;
    const params = [];
    if (authorId) {
      query += ' WHERE r.author_id = $1';
      params.push(authorId);
    }
    query += ' ORDER BY r.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await db.query(query, params);
    const reels = result.rows || [];
    if (reels.length === 0) return { reels: [], mediaRows: [] };

    const ids = reels.map(r => r.id);
    const mediaRes = await db.query(
      `SELECT * FROM reel_media WHERE reel_id = ANY($1::int[]) ORDER BY created_at ASC`,
      [ids]
    );

    return { reels, mediaRows: mediaRes.rows || [] };
  }

  // Get single reel by ID
  async function getReelById(id) {
    const result = await db.query(
      `
      SELECT r.*, u.email, u.first_name, u.last_name, u.profile_picture
      FROM reels r
      JOIN users u ON r.author_id = u.id
      WHERE r.id = $1
      `,
      [id]
    );

    if (result.rowCount === 0) return null;
    const reel = result.rows[0];

    const mediaQ = await db.query(
      'SELECT * FROM reel_media WHERE reel_id = $1 ORDER BY created_at ASC',
      [reel.id]
    );

    return { reel, mediaRows: mediaQ.rows || [] };
  }

  // Create a new reel
  async function createReel(authorId, content, source = null) {
    const contentValue = content || ''; // ensure NOT NULL
    const insert = await db.query(
      'INSERT INTO reels (author_id, content, source, created_at) VALUES ($1,$2,$3,now()) RETURNING id, author_id, content, source, created_at',
      [authorId, contentValue, source]
    );
    return insert.rows[0];
  }

  // Delete a reel
  async function deleteReel(id) {
    await db.query('DELETE FROM reels WHERE id = $1', [id]);
    return true;
  }

  // List saved reels by user email
  async function listSavedReelsByEmail(email, limit = 50, offset = 0) {
    const u = await db.query('SELECT id FROM users WHERE email=$1', [email]);
    if (u.rowCount === 0) return { rows: [], mediaRows: [] };
    const authorId = u.rows[0].id;

    const q = await db.query(
      `
      SELECT r.* FROM reels r
      JOIN saved_reels sr ON r.id = sr.reel_id
      WHERE sr.user_id = $1
      ORDER BY r.created_at DESC LIMIT $2 OFFSET $3
      `,
      [authorId, limit, offset]
    );

    const rows = q.rows || [];
    if (rows.length === 0) return { rows: [], mediaRows: [] };

    const ids = rows.map(r => r.id);
    const mediaRes = await db.query(
      `SELECT * FROM reel_media WHERE reel_id = ANY($1::int[]) ORDER BY created_at ASC`,
      [ids]
    );

    return { rows, mediaRows: mediaRes.rows || [] };
  }

  // Like a reel
  async function likeReel(userId, reelId) {
    await db.query(
      `
      INSERT INTO reel_likes (user_id, reel_id, created_at)
      VALUES ($1, $2, now())
      ON CONFLICT (user_id, reel_id) DO NOTHING
      `,
      [userId, reelId]
    );
    return true;
  }

  // Unlike a reel
  async function unlikeReel(userId, reelId) {
    await db.query(
      `DELETE FROM reel_likes WHERE user_id = $1 AND reel_id = $2`,
      [userId, reelId]
    );
    return true;
  }

  // Get list of users who liked a reel
  async function getReelLikes(reelId) {
    const res = await db.query(
      `
      SELECT u.id, u.email, u.first_name, u.last_name
      FROM reel_likes rl
      JOIN users u ON rl.user_id = u.id
      WHERE rl.reel_id = $1
      `,
      [reelId]
    );
    return res.rows || [];
  }

  return {
    getReels,
    getReelById,
    createReel,
    deleteReel,
    listSavedReelsByEmail,
    likeReel,
    unlikeReel,
    getReelLikes,
  };
};
