const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function makeController(deps) {
  const db = deps.db;
  const authService = (deps.services && deps.services.authService) ? deps.services.authService : require('./service')(deps);
  const config = deps.config;
  const JWT_SECRET = config.jwtSecret;
  const SALT_ROUNDS = config.saltRounds;

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function sanitizeUser(row) {
    if (!row) return null;
    const { password: _password, ...rest } = row;
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

      const exists = await authService.findUserByEmail(sanitizedEmail);
      if (exists) return res.status(409).json({ error: 'User already exists' });

      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      const user = await authService.createUser(sanitizedEmail, hash, sanitizedFirstName, sanitizedLastName);
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
      const user = await authService.findUserByEmail(sanitizedEmail);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
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
      const user = await authService.getUserByEmailPublic(sanitizedEmail);
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ data: user });
    } catch (err) { next(err); }
  }

  async function listUsers(req, res, next) {
    try {
      const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
      const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);
      const rows = await authService.listUsers(limit, offset);
      res.json({ data: rows });
    } catch (err) { next(err); }
  }

  async function assignRoleToUser(req, res, next) {
    try {
      const targetId = parseInt(req.params.id, 10);
      if (!targetId) return res.status(400).json({ error: 'Invalid user id' });
      const { role } = req.body;
      if (!role || typeof role !== 'string') return res.status(400).json({ error: 'role required' });
      const r = await authService.findRoleByName(role);
      if (!r) return res.status(404).json({ error: 'Role not found' });
      const roleId = r.id;
      await authService.addUserRole(targetId, roleId);
      const roles = await authService.listRolesForUser(targetId);
      res.json({ data: roles });
    } catch (err) { next(err); }
  }

  async function listUserRoles(req, res, next) {
    try {
      const targetId = parseInt(req.params.id, 10);
      if (!targetId) return res.status(400).json({ error: 'Invalid user id' });
      const roles = await authService.listRolesForUser(targetId);
      res.json({ data: roles });
    } catch (err) { next(err); }
  }

  return { register, login, getUserByEmail, listUsers, assignRoleToUser, listUserRoles };
}

module.exports = makeController;
