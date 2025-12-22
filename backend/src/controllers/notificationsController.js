const notificationService = require('../services/notificationService');

async function listNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const offset = parseInt(req.query.offset, 10) || 0;
    const rows = await notificationService.listNotifications(userId, limit, offset);
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}

async function markAsRead(req, res, next) {
  try {
    const userId = req.user.id;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid notification id' });
    const updated = await notificationService.markRead(id, userId);
    if (!updated) return res.status(404).json({ error: 'Notification not found' });
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

async function getPreferences(req, res, next) {
  try {
    const userId = req.user.id;
    const prefs = await notificationService.getPreferences(userId);
    res.json({ data: prefs });
  } catch (err) { next(err); }
}

async function setPreference(req, res, next) {
  try {
    const userId = req.user.id;
    const { notification_type, enabled = true, channels = ['inbox'] } = req.body;
    if (!notification_type) return res.status(400).json({ error: 'notification_type required' });
    const pref = await notificationService.setPreference(userId, notification_type, enabled, channels);
    res.json({ data: pref });
  } catch (err) { next(err); }
}

module.exports = { listNotifications, markAsRead, getPreferences, setPreference };

