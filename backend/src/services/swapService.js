// Swap model and queries for PostgreSQL
const db = require('../config/db');

const createSwap = async (swap) => {
  const { user_id, title, description, media_url, location, status } = swap;
  const result = await db.query(
    `INSERT INTO swaps (user_id, title, description, media_url, location, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [user_id, title, description, media_url, location, status || 'active']
  );
  return result.rows[0];
};

const updateSwap = async (swapId, swap) => {
  const { title, description, media_url, location, status } = swap;
  const result = await db.query(
    `UPDATE swaps SET title=$1, description=$2, media_url=$3, location=$4, status=$5, updated_at=NOW()
     WHERE id=$6 RETURNING *`,
    [title, description, media_url, location, status, swapId]
  );
  return result.rows[0];
};

const deleteSwap = async (swapId, userId) => {
  await db.query(`DELETE FROM swaps WHERE id=$1 AND user_id=$2`, [swapId, userId]);
};

const getSwapById = async (swapId) => {
  const result = await db.query(`SELECT * FROM swaps WHERE id=$1`, [swapId]);
  return result.rows[0];
};

const listSwaps = async ({ page = 1, limit = 20, status, location }) => {
  let filters = [];
  let values = [];
  let idx = 1;
  if (status) { filters.push(`status=$${idx++}`); values.push(status); }
  if (location) { filters.push(`location ILIKE $${idx++}`); values.push(`%${location}%`); }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const offset = (page - 1) * limit;
  const items = await db.query(
    `SELECT * FROM swaps ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );
  const totalRes = await db.query(`SELECT COUNT(*) FROM swaps ${where}`, values);
  return {
    items: items.rows,
    pagination: { page, limit, total: parseInt(totalRes.rows[0].count, 10) }
  };
};

const listSwapsByUser = async (email, { page = 1, limit = 20, status, location }) => {
  let filters = ['u.email=$1'];
  let values = [email];
  let idx = 2;
  if (status) { filters.push(`s.status=$${idx++}`); values.push(status); }
  if (location) { filters.push(`s.location ILIKE $${idx++}`); values.push(`%${location}%`); }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const offset = (page - 1) * limit;
  const items = await db.query(
    `SELECT s.* FROM swaps s JOIN users u ON s.user_id=u.id ${where} ORDER BY s.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );
  const totalRes = await db.query(
    `SELECT COUNT(*) FROM swaps s JOIN users u ON s.user_id=u.id ${where}`,
    values
  );
  return {
    items: items.rows,
    pagination: { page, limit, total: parseInt(totalRes.rows[0].count, 10) }
  };
};

const listSwapsByFriends = async (email, { page = 1, limit = 20, status, location }) => {
  // Get accepted friends' user_ids
  const friendsRes = await db.query(
    `SELECT f.friend_id FROM friendships f JOIN users u ON f.user_id=u.id WHERE u.email=$1 AND f.status='accepted'`,
    [email]
  );
  const friendIds = friendsRes.rows.map(r => r.friend_id);
  if (!friendIds.length) return { items: [], pagination: { page, limit, total: 0 } };
  let filters = [`user_id = ANY($1)`];
  let values = [friendIds];
  let idx = 2;
  if (status) { filters.push(`status=$${idx++}`); values.push(status); }
  if (location) { filters.push(`location ILIKE $${idx++}`); values.push(`%${location}%`); }
  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
  const offset = (page - 1) * limit;
  const items = await db.query(
    `SELECT * FROM swaps ${where} ORDER BY created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );
  const totalRes = await db.query(`SELECT COUNT(*) FROM swaps ${where}`, values);
  return {
    items: items.rows,
    pagination: { page, limit, total: parseInt(totalRes.rows[0].count, 10) }
  };
};

const listSavedSwaps = async (email, { page = 1, limit = 20, status, location }) => {
  // Get user_id
  const userRes = await db.query(`SELECT id FROM users WHERE email=$1`, [email]);
  if (!userRes.rows.length) return { items: [], pagination: { page, limit, total: 0 } };
  const userId = userRes.rows[0].id;
  let filters = ['ss.user_id=$1'];
  let values = [userId];
  let idx = 2;
  if (status) { filters.push(`s.status=$${idx++}`); values.push(status); }
  if (location) { filters.push(`s.location ILIKE $${idx++}`); values.push(`%${location}%`); }
  const where = filters.length ? `AND ${filters.join(' AND ')}` : '';
  const offset = (page - 1) * limit;
  const items = await db.query(
    `SELECT s.* FROM swaps s JOIN saved_swaps ss ON s.id=ss.swap_id WHERE 1=1 ${where} ORDER BY s.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`,
    [...values, limit, offset]
  );
  const totalRes = await db.query(
    `SELECT COUNT(*) FROM swaps s JOIN saved_swaps ss ON s.id=ss.swap_id WHERE 1=1 ${where}`,
    values
  );
  return {
    items: items.rows,
    pagination: { page, limit, total: parseInt(totalRes.rows[0].count, 10) }
  };
};

const saveSwap = async (userId, swapId) => {
  await db.query(
    `INSERT INTO saved_swaps (user_id, swap_id) VALUES ($1, $2) ON CONFLICT (user_id, swap_id) DO NOTHING`,
    [userId, swapId]
  );
  const res = await db.query(`SELECT * FROM saved_swaps WHERE user_id=$1 AND swap_id=$2`, [userId, swapId]);
  return res.rows[0];
};

const unsaveSwap = async (userId, swapId) => {
  await db.query(`DELETE FROM saved_swaps WHERE user_id=$1 AND swap_id=$2`, [userId, swapId]);
  return { user_id: userId, swap_id: swapId };
};

module.exports = {
  createSwap,
  updateSwap,
  deleteSwap,
  getSwapById,
  listSwaps,
  listSwapsByUser,
  listSwapsByFriends,
  listSavedSwaps
  ,saveSwap
  ,unsaveSwap
};
