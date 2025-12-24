const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function makeController(deps) {
  const db = deps.db;
  const config = deps.config;
  const JWT_SECRET = config.jwtSecret;
  const SALT_ROUNDS = config.saltRounds;

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function sanitizeUser(row) {
    if (!row) return null;
    const { password, ...rest } = row;
    return rest;
  }

  function validateEmail(email) {
    if (!email || typeof email !== 'string') return false;
    return EMAIL_REGEX.test(email.trim().toLowerCase());
  }

  function validatePassword(password) {
    if (!password || typeof password !== 'string') return false;
    return password.length >= 8;
  }

  function sanitizeInput(input) {
    if (!input || typeof input !== 'string') return '';
    return input.trim().slice(0, 255);
  }

  async function register(req, res, next) {
    try {
      const { email, password, firstName = '', lastName = '' } = req.body;
      if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
      if (!validatePassword(password)) return res.status(400).json({ error: 'Password must be at least 8 characters' });

      const sanitizedEmail = email.trim().toLowerCase();
      const sanitizedFirstName = sanitizeInput(firstName);
      const sanitizedLastName = sanitizeInput(lastName);

      const exists = await db.query('SELECT id FROM users WHERE email = $1', [sanitizedEmail]);
      if (exists.rowCount > 0) return res.status(409).json({ error: 'User already exists' });

      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      const insert = await db.query(
        'INSERT INTO users (email, password, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id, email, first_name, last_name, profile_picture',
        [sanitizedEmail, hash, sanitizedFirstName, sanitizedLastName]
      );
      const user = insert.rows[0];
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ data: { user: sanitizeUser(user), token } });
    } catch (err) { next(err); }
  }

  async function login(req, res, next) {
    try {
      const { email, password } = req.body;
      if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
      if (!password || typeof password !== 'string') return res.status(400).json({ error: 'Password is required' });

      const sanitizedEmail = email.trim().toLowerCase();
      const q = await db.query('SELECT id, email, password, first_name, last_name, profile_picture FROM users WHERE email = $1', [sanitizedEmail]);
      if (q.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });
      const user = q.rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ data: { user: sanitizeUser(user), token } });
    } catch (err) { next(err); }
  }

  async function getUserByEmail(req, res, next) {
    try {
      const email = req.params.email;
      if (!validateEmail(email)) return res.status(400).json({ error: 'Invalid email format' });
      const sanitizedEmail = email.trim().toLowerCase();
      const q = await db.query('SELECT id, email, first_name, last_name, profile_picture, bio, location FROM users WHERE email = $1', [sanitizedEmail]);
      if (q.rowCount === 0) return res.status(404).json({ error: 'User not found' });
      res.json({ data: q.rows[0] });
    } catch (err) { next(err); }
  }

  async function listUsers(req, res, next) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
      const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
      const q = await db.query('SELECT id, email, first_name, last_name, profile_picture FROM users ORDER BY id DESC LIMIT $1 OFFSET $2', [limit, offset]);
      res.json({ data: q.rows });
    } catch (err) { next(err); }
  }

  async function assignRoleToUser(req, res, next) {
    try {
      const targetId = parseInt(req.params.id, 10);
      if (!targetId) return res.status(400).json({ error: 'Invalid user id' });
      const { role } = req.body;
      if (!role || typeof role !== 'string') return res.status(400).json({ error: 'role required' });
      const r = await db.query('SELECT id FROM roles WHERE name=$1 LIMIT 1', [role]);
      if (r.rowCount === 0) return res.status(404).json({ error: 'Role not found' });
      const roleId = r.rows[0].id;
      await db.query('INSERT INTO user_roles (user_id, role_id, created_at) VALUES ($1,$2,now()) ON CONFLICT (user_id, role_id) DO NOTHING', [targetId, roleId]);
      const roles = await db.query(`SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id=r.id WHERE ur.user_id=$1`, [targetId]);
      res.json({ data: roles.rows.map(x => x.name) });
    } catch (err) { next(err); }
  }

  async function listUserRoles(req, res, next) {
    try {
      const targetId = parseInt(req.params.id, 10);
      if (!targetId) return res.status(400).json({ error: 'Invalid user id' });
      const roles = await db.query(`SELECT r.name FROM roles r JOIN user_roles ur ON ur.role_id = r.id WHERE ur.user_id=$1`, [targetId]);
      res.json({ data: roles.rows.map(x => x.name) });
    } catch (err) { next(err); }
  }

  return { register, login, getUserByEmail, listUsers, assignRoleToUser, listUserRoles };
}

module.exports = makeController;
