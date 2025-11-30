const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getConfig } = require('../config/env');

const config = getConfig();
const JWT_SECRET = config.jwtSecret;
const SALT_ROUNDS = config.saltRounds;

function sanitizeUser(row) {
  if (!row) return null;
  const { password, ...rest } = row;
  return rest;
}

async function register(req, res, next) {
  try {
    const { email, password, firstName = '', lastName = '' } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const exists = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rowCount > 0) return res.status(409).json({ error: 'User already exists' });

    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const insert = await db.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id, email, first_name, last_name, profile_picture',
      [email, hash, firstName, lastName]
    );

    const user = insert.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ data: { user: sanitizeUser(user), token } });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const q = await db.query('SELECT id, email, password, first_name, last_name, profile_picture FROM users WHERE email = $1', [email]);
    if (q.rowCount === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = q.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({ data: { user: sanitizeUser(user), token } });
  } catch (err) {
    next(err);
  }
}

async function getUserByEmail(req, res, next) {
  try {
    const email = req.params.email;
    const q = await db.query('SELECT id, email, first_name, last_name, profile_picture FROM users WHERE email = $1', [email]);
    if (q.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ data: q.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, getUserByEmail };
