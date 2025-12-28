module.exports = function makeRbacService(deps) {
  const db = deps.db;

  async function hasRole(userId, roleName) {
    const q = await db.query(
      `SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = $1 AND r.name = $2 LIMIT 1`,
      [userId, roleName]
    );
    return q.rowCount > 0;
  }

  async function hasAnyRole(userId, roles) {
    const q = await db.query(
      `SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = $1 AND r.name = ANY($2::text[]) LIMIT 1`,
      [userId, roles]
    );
    return q.rowCount > 0;
  }

  return { hasRole, hasAnyRole };
};
