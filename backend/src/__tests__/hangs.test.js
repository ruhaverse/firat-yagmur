const request = require('supertest');
const app = require('../index');
const db = require('../common/db');
const jwt = require('jsonwebtoken');
const { getConfig } = require('../common/env');
const config = getConfig();

describe('Hangs domain smoke', () => {
  beforeAll(async () => {
    // ensure migrations ran (package.json test runs migrate, but double-check)
    // create a test user for authenticated requests
    await db.query(`DELETE FROM hangs`);
    await db.query(`DELETE FROM users`);
    const u = await db.query(`INSERT INTO users (email, password, created_at, updated_at) VALUES ($1,$2,now(),now()) RETURNING *`, ['test@example.com','test']);
    global.__TEST_USER__ = u.rows[0];
  });

  afterAll(async () => {
    await db.query(`DELETE FROM hangs`);
    await db.query(`DELETE FROM users`);
    await db.pool.end();
  });

  test('GET /api/v1/hangs/ping returns domain ok', async () => {
    const res = await request(app).get('/api/v1/hangs/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
    expect(res.body).toHaveProperty('domain', 'hangs');
  });

  test('POST /api/v1/hangs creates a hang in DB', async () => {
    const user = global.__TEST_USER__;
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
    const payload = { title: 'Test Hang', description: 'From test' };
    const res = await request(app)
      .post('/api/v1/hangs')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('title', payload.title);
    // parity: response contains created_at
    expect(res.body).toHaveProperty('created_at');

    const q = await db.query('SELECT * FROM hangs WHERE id = $1', [res.body.id]);
    expect(q.rowCount).toBe(1);
    expect(q.rows[0].title).toBe(payload.title);
  });
});
