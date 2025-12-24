const request = require('supertest');
const app = require('../index');
const db = require('../common/db');
const jwt = require('jsonwebtoken');
const { getConfig } = require('../common/env');
const config = getConfig();

describe('Reels domain integration', () => {
  beforeAll(async () => {
    await db.query('DELETE FROM reels');
    await db.query('DELETE FROM users');
    const u = await db.query(`INSERT INTO users (email, password, created_at, updated_at) VALUES ($1,$2,now(),now()) RETURNING *`, ['reels-test@example.com','test']);
    global.__TEST_USER__ = u.rows[0];
  });

  afterAll(async () => {
    await db.query('DELETE FROM reels');
    await db.query('DELETE FROM users');
    await db.pool.end();
  });

  test('GET /api/v1/reels returns array', async () => {
    const res = await request(app).get('/api/v1/reels');
    expect([200,201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    const data = res.body.data || [];
    if (data.length > 0) {
      const item = data[0];
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('user_id');
      expect(item).toHaveProperty('caption');
      expect(item).toHaveProperty('created_at');
      expect(item).toHaveProperty('profile_picture');
    }
  });

  test('POST /api/v1/reels creates a reel and persists to DB', async () => {
    const user = global.__TEST_USER__;
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
    const payload = { caption: 'Integration reel test' };
    const res = await request(app)
      .post('/api/v1/reels')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect([200,201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('reel');
    const created = res.body.data.reel;
    expect(created).toHaveProperty('id');
    expect(created).toHaveProperty('user_id');
    expect(created).toHaveProperty('caption');
    expect(created).toHaveProperty('created_at');

    const q = await db.query('SELECT * FROM reels WHERE id = $1', [created.id]);
    expect(q.rowCount).toBe(1);
    expect(q.rows[0].caption).toContain('Integration reel test');
  });
});
