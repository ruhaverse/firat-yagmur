const express = require('express');
const router = express.Router();
const { register, login, getUserByEmail, listUsers, assignRoleToUser, listUserRoles } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// POST /api/v1/users/register
router.post('/register', register);

// POST /api/v1/users/login
router.post('/login', login);

// GET /api/v1/users/  - list users (optional pagination) - admin only
router.get('/', requireAuth, requireRole('admin'), listUsers);

// GET /api/v1/users/:email
router.get('/:email', getUserByEmail);

// Admin: assign role to user
// PUT /api/v1/users/:id/roles  body: { role: 'admin' }
router.put('/:id/roles', requireAuth, requireRole('admin'), assignRoleToUser);

// Admin: list roles for a user
router.get('/:id/roles', requireAuth, requireRole('admin'), listUserRoles);

module.exports = router;
