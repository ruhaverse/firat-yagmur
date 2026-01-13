module.exports = function makeAuthService(deps) {
  const db = deps.db;

  async function findUserByEmail(email) {
    const q = await db.query(
      'SELECT id, email, password, first_name, last_name, profile_picture FROM users WHERE email = $1',
      [email]
    );
    return q.rowCount === 0 ? null : q.rows[0];
  }

  async function createUser(email, hash, firstName, lastName) {
    const insert = await db.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id, email, first_name, last_name, profile_picture',
      [email, hash, firstName, lastName]
    );
    return insert.rows[0];
  }

  async function getUserByEmailPublic(email) {
    const q = await db.query(
      'SELECT id, email, first_name, last_name, profile_picture, bio, location FROM users WHERE email = $1',
      [email]
    );
    return q.rowCount === 0 ? null : q.rows[0];
  }

  async function listUsers(limit = 50, offset = 0) {
    const q = await db.query(
      'SELECT id, email, first_name, last_name, profile_picture FROM users ORDER BY id DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return q.rows;
  }

  async function findRoleByName(name) {
    const q = await db.query(
      'SELECT id FROM roles WHERE name=$1 LIMIT 1',
      [name]
    );
    return q.rowCount === 0 ? null : q.rows[0];
  }

  async function addUserRole(userId, roleId) {
    await db.query(
      'INSERT INTO user_roles (user_id, role_id, created_at) VALUES ($1,$2,now()) ON CONFLICT (user_id, role_id) DO NOTHING',
      [userId, roleId]
    );
  }

  async function listRolesForUser(userId) {
    const q = await db.query(
      `SELECT r.name FROM roles r
       JOIN user_roles ur ON ur.role_id = r.id
       WHERE ur.user_id=$1`,
      [userId]
    );
    return q.rows.map(x => x.name);
  }

  // New method to get the logged-in user's profile
  async function getProfile(userId) {
    const q = await db.query(
      'SELECT id, email, first_name, last_name, profile_picture, bio, location FROM users WHERE id = $1',
      [userId]
    );
    return q.rowCount === 0 ? null : q.rows[0];
  }

  return {
    findUserByEmail,
    createUser,
    getUserByEmailPublic,
    listUsers,
    findRoleByName,
    addUserRole,
    listRolesForUser,
    getProfile, // added
  };
};
