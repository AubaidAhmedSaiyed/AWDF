const request = require('supertest');
const app = require('../app');

describe('Task Management API CI Test Suite', () => {
  // Step 2: Test that GET /tasks endpoint returns status 200
  test('GET /tasks returns status 200', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /tasks creates task and returns 201', async () => {
    const res = await request(app)
      .post('/tasks')
      .send({ title: 'CI Automated Test Task' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('CI Automated Test Task');
  });
});
