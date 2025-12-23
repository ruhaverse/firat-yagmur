const db = require('../config/db');
const logger = require('../utils/logger');

async function getPreferences(userId) {
  const q = await db.query(
    `SELECT np.notification_type,
            np.enabled,
            COALESCE(array_agg(nc.channel) FILTER (WHERE nc.channel IS NOT NULL), ARRAY[]::text[]) AS channels
     FROM notification_preferences np
     LEFT JOIN notification_preference_channels nc ON nc.preference_id = np.id
     WHERE np.user_id = $1
     GROUP BY np.notification_type, np.enabled`,
    [userId]
  );
  const prefs = {};
  for (const row of q.rows) prefs[row.notification_type] = { enabled: row.enabled, channels: row.channels };
  return prefs;
}

async function setPreference(userId, notificationType, enabled = true, channels = ['inbox']) {
  // Upsert preference (without channels column)
  const q = await db.query(
    `INSERT INTO notification_preferences (user_id, notification_type, enabled, created_at)
     VALUES ($1,$2,$3,now())
     ON CONFLICT (user_id, notification_type) DO UPDATE SET enabled=EXCLUDED.enabled
     RETURNING *`,
    [userId, notificationType, enabled]
  );
  const pref = q.rows[0];

  // Replace channels for this preference: delete existing, then insert provided channels
  await db.query('DELETE FROM notification_preference_channels WHERE preference_id = $1', [pref.id]);
  if (Array.isArray(channels) && channels.length > 0) {
    await db.query(
      `INSERT INTO notification_preference_channels (preference_id, channel, created_at)
       SELECT $1, ch, now() FROM unnest($2::text[]) AS ch
       ON CONFLICT (preference_id, channel) DO NOTHING`,
      [pref.id, channels]
    );
  }

  const chQ = await db.query('SELECT COALESCE(array_agg(channel), ARRAY[]::text[]) AS channels FROM notification_preference_channels WHERE preference_id = $1', [pref.id]);
  pref.channels = chQ.rows[0].channels || [];
  return pref;
}

// Create notification if user preference allows it
async function createNotification({ userId, actorId = null, type, targetType = null, targetId = null, data = {} }) {
  try {
    // check preference if exists
    const prefQ = await db.query('SELECT enabled FROM notification_preferences WHERE user_id = $1 AND notification_type = $2 LIMIT 1', [userId, type]);
    if (prefQ.rowCount > 0 && prefQ.rows[0].enabled === false) {
      logger.info('Notification skipped due to user preference', { userId, type });
      return null;
    }

    const insert = await db.query(
      `INSERT INTO notifications (user_id, actor_id, type, target_type, target_id, data, created_at)
       VALUES ($1,$2,$3,$4,$5,$6, now()) RETURNING *`,
      [userId, actorId, type, targetType, targetId, data]
    );
    return insert.rows[0];
  } catch (err) {
    logger.error('createNotification error', err);
    throw err;
  }
}

async function listNotifications(userId, limit = 50, offset = 0) {
  const q = await db.query(
    `SELECT n.*, u.email as actor_email, u.first_name as actor_first_name, u.last_name as actor_last_name, u.profile_picture as actor_profile_picture
     FROM notifications n
     LEFT JOIN users u ON n.actor_id = u.id
     WHERE n.user_id = $1
     ORDER BY n.created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return q.rows.map(r => ({
    ...r,
    actor_profile_picture: r.actor_profile_picture ? r.actor_profile_picture : null
  }));
}

async function markRead(notificationId, userId) {
  const q = await db.query('UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *', [notificationId, userId]);
  return q.rowCount > 0 ? q.rows[0] : null;
}

module.exports = { getPreferences, setPreference, createNotification, listNotifications, markRead };
