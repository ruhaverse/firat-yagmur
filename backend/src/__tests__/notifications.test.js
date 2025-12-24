const request = require('supertest');
const app = require('../index');
const db = require('../common/db');
const jwt = require('jsonwebtoken');
const { getConfig } = require('../common/env');
const config = getConfig();

describe('Notifications domain integration', () => {
  beforeAll(async () => {
    await db.query('DELETE FROM notifications');
    await db.query('DELETE FROM notification_preferences');
    await db.query('DELETE FROM notification_preference_channels');
    await db.query('DELETE FROM users');
    const u = await db.query(`INSERT INTO users (email, password, created_at, updated_at) VALUES ($1,$2,now(),now()) RETURNING *`, ['notes-test@example.com','test']);
    global.__TEST_USER__ = u.rows[0];
  });

  afterAll(async () => {
    await db.query('DELETE FROM notifications');
    await db.query('DELETE FROM notification_preferences');
    await db.query('DELETE FROM notification_preference_channels');
    await db.query('DELETE FROM users');
    await db.pool.end();
  });

  test('GET /api/v1/notifications returns inserted notifications for user', async () => {
    const user = global.__TEST_USER__;
    // insert a notification directly
    const inserted = await db.query(`INSERT INTO notifications (user_id, actor_id, type, target_type, target_id, data, created_at) VALUES ($1,$2,$3,$4,$5,$6,now()) RETURNING *`, [user.id, null, 'test', null, null, { test: true }]);
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
    const res = await request(app).get('/api/v1/notifications').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    const found = res.body.data.find(n => n.id === inserted.rows[0].id);
    expect(found).toBeDefined();
    if (found) {
      expect(found).toHaveProperty('id');
      expect(found).toHaveProperty('user_id');
      expect(found).toHaveProperty('type');
      expect(found).toHaveProperty('created_at');
      expect(found).toHaveProperty('data');
    }
  });

  test('PUT /api/v1/notifications/:id/read marks as read', async () => {
    const user = global.__TEST_USER__;
    const inserted = await db.query(`INSERT INTO notifications (user_id, actor_id, type, target_type, target_id, data, created_at) VALUES ($1,$2,$3,$4,$5,$6,now()) RETURNING *`, [user.id, null, 'test2', null, null, { t: 1 }]);
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
    const res = await request(app).put(`/api/v1/notifications/${inserted.rows[0].id}/read`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    // ensure DB updated
    const q = await db.query('SELECT is_read FROM notifications WHERE id = $1', [inserted.rows[0].id]);
    expect(q.rowCount).toBe(1);
    expect(q.rows[0].is_read).toBe(true);
    // response parity: updated notification returned
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('id');
    expect(res.body.data).toHaveProperty('is_read', true);
  });
});
