const jwt = require('jsonwebtoken');
const { getConfig } = require('../config/env');

const config = getConfig();
const JWT_SECRET = config.jwtSecret;

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Authorization header missing' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid Authorization header' });
  const token = parts[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    // Attach userId to pino logger when available
    if (req.log && payload && payload.id) {
      req.log = req.log.child({ userId: payload.id });
    }
    next();
  } catch (_err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { requireAuth };
