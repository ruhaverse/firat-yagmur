// Lightweight service layer for auth domain - can be expanded
module.exports = function createService(deps) {
  const db = deps.db;

  return {
    // find user by email
    async findUserByEmail(email) {
      const q = await db.query('SELECT id, email, password, first_name, last_name, profile_picture FROM users WHERE email = $1', [email]);
      return q.rowCount ? q.rows[0] : null;
    }
  };
};
