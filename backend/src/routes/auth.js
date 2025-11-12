const express = require('express');
const router = express.Router();
const { register, login, getUserByEmail } = require('../controllers/authController');

// POST /api/v1/users/register
router.post('/register', register);

// POST /api/v1/users/login
router.post('/login', login);

// GET /api/v1/users/:email
router.get('/:email', getUserByEmail);

module.exports = router;
