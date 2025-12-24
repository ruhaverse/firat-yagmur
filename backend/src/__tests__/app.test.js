const request = require('supertest');
const app = require('../index');

describe('Smoke tests for backend', () => {
  test('GET / returns health OK', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('ok', true);
  });
});
