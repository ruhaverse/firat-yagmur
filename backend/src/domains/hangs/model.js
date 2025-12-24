// Placeholder model file for future DB queries related to hangs
// Keep SQL helpers and DB access here when implemented
module.exports = {
  async insert(db, { user_id, title, description }) {
    const q = await db.query(
      `INSERT INTO hangs (user_id, title, description, created_at, updated_at)
       VALUES ($1,$2,$3, now(), now()) RETURNING *`,
      [user_id, title, description]
    );
    return q.rows[0];
  },

  async findById(db, id) {
    const q = await db.query('SELECT * FROM hangs WHERE id = $1', [id]);
    return q.rows[0] || null;
  }
};
