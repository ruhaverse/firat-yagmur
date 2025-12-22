const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { listNotifications, markAsRead } = require('../controllers/notificationsController');

// GET /api/v1/notifications/  - list notifications for current user
router.get('/', requireAuth, listNotifications);

// PUT /api/v1/notifications/:id/read - mark as read
router.put('/:id/read', requireAuth, markAsRead);

// Preferences
router.get('/preferences', requireAuth, require('../controllers/notificationsController').getPreferences);
router.put('/preferences', requireAuth, require('../controllers/notificationsController').setPreference);

module.exports = router;
