const request = require('supertest');
const app = require('../index');
const db = require('../common/db');

describe('Auth domain migration smoke', () => {
  beforeAll(async () => {
    // ensure clean state
    await db.query('DELETE FROM users');
  });

  afterAll(async () => {
    await db.query('DELETE FROM users');
    await db.pool.end();
  });

  test('POST /api/v1/users/register then login', async () => {
    const payload = { email: 'migrate-test@example.com', password: 'password123', firstName: 'M', lastName: 'T' };
    const res = await request(app).post('/api/v1/users/register').send(payload);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body.data).toHaveProperty('token');
    // parity: user created in DB
    const u = await db.query('SELECT * FROM users WHERE email = $1', [payload.email]);
    expect(u.rowCount).toBe(1);
    const loginRes = await request(app).post('/api/v1/users/login').send({ email: payload.email, password: payload.password });
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.data).toHaveProperty('token');
  });
});
