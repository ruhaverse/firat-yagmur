const db = require('../db');

function requireRole(roleName) {
  return async function (req, res, next) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Authentication required' });
      const userId = req.user.id;
      const q = await db.query(
        `SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = $1 AND r.name = $2 LIMIT 1`,
        [userId, roleName]
      );
      if (q.rowCount === 0) return res.status(403).json({ error: 'Insufficient permissions' });
      next();
    } catch (err) {
      next(err);
    }
  };
}

function requireAnyRole(roles) {
  return async function (req, res, next) {
    try {
      if (!req.user || !req.user.id) return res.status(401).json({ error: 'Authentication required' });
      const userId = req.user.id;
      const q = await db.query(
        `SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id = $1 AND r.name = ANY($2::text[]) LIMIT 1`,
        [userId, roles]
      );
      if (q.rowCount === 0) return res.status(403).json({ error: 'Insufficient permissions' });
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { requireRole, requireAnyRole };
