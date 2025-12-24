const request = require('supertest');
const app = require('../index');
const db = require('../common/db');
const jwt = require('jsonwebtoken');
const { getConfig } = require('../common/env');
const config = getConfig();

describe('Posts domain integration', () => {
  beforeAll(async () => {
    await db.query('DELETE FROM posts');
    await db.query('DELETE FROM users');
    const u = await db.query(`INSERT INTO users (email, password, created_at, updated_at) VALUES ($1,$2,now(),now()) RETURNING *`, ['posts-test@example.com','test']);
    global.__TEST_USER__ = u.rows[0];
  });

  afterAll(async () => {
    await db.query('DELETE FROM posts');
    await db.query('DELETE FROM users');
    await db.pool.end();
  });

  test('GET /api/v1/posts returns array', async () => {
    const res = await request(app).get('/api/v1/posts');
      expect([200, 201]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('data');
      expect(Array.isArray(res.body.data)).toBe(true);
      const data = res.body.data || [];
      if (data.length > 0) {
        const item = data[0];
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('author_id');
        expect(item).toHaveProperty('content');
        expect(item).toHaveProperty('privacy');
        expect(item).toHaveProperty('created_at');
        expect(item).toHaveProperty('email');
        expect(item).toHaveProperty('first_name');
      }
  });

  test('POST /api/v1/posts creates a post and persists to DB', async () => {
    const user = global.__TEST_USER__;
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
    const payload = { content: 'Integration test post', privacy: 'public' };
    const res = await request(app)
      .post('/api/v1/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

      expect([200, 201]).toContain(res.statusCode);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('post');
      const created = res.body.data.post;
      expect(created).toHaveProperty('id');
      expect(created).toHaveProperty('author_id');
      expect(created).toHaveProperty('content');
      expect(created).toHaveProperty('privacy');
      expect(created).toHaveProperty('created_at');

    const q = await db.query('SELECT * FROM posts WHERE id = $1', [created.id]);
    expect(q.rowCount).toBe(1);
    expect(q.rows[0].content).toContain('Integration test post');
  });
});
