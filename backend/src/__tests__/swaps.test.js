const request = require('supertest');
const app = require('../index');
const db = require('../common/db');
const jwt = require('jsonwebtoken');
const { getConfig } = require('../common/env');
const config = getConfig();

describe('Swaps domain integration', () => {
  beforeAll(async () => {
    await db.query('DELETE FROM swaps');
    await db.query('DELETE FROM users');
    const u = await db.query(`INSERT INTO users (email, password, created_at, updated_at) VALUES ($1,$2,now(),now()) RETURNING *`, ['swaps-test@example.com','test']);
    global.__TEST_USER__ = u.rows[0];
  });

  afterAll(async () => {
    await db.query('DELETE FROM swaps');
    await db.query('DELETE FROM users');
    await db.pool.end();
  });

  test('GET /api/v1/swaps returns array', async () => {
    const res = await request(app).get('/api/v1/swaps');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('items');
    expect(res.body.data).toHaveProperty('pagination');
    const items = res.body.data.items || [];
    if (items.length > 0) {
      const it = items[0];
      expect(it).toHaveProperty('id');
      expect(it).toHaveProperty('user_id');
      expect(it).toHaveProperty('title');
    }
  });

  test('POST /api/v1/swaps creates a swap and persists to DB', async () => {
    const user = global.__TEST_USER__;
    const token = jwt.sign({ id: user.id, email: user.email }, config.jwtSecret);
    const payload = { title: 'Integration swap', description: 'swap via test' };
    const res = await request(app)
      .post('/api/v1/swaps')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('data');
    const created = res.body.data;
    expect(created).toHaveProperty('id');
    expect(created).toHaveProperty('user_id');
    expect(created).toHaveProperty('title');
    expect(created).toHaveProperty('created_at');

    const q = await db.query('SELECT * FROM swaps WHERE id = $1', [created.id]);
    expect(q.rowCount).toBe(1);
    expect(q.rows[0].title).toContain('Integration swap');
  });
});
