import request from 'supertest';
import app from './app';


describe('GET /api/example', () => {
  it('should return 200 OK', async () => {
    const result = await request(app).get('/ping');
    expect(result.status).toBe(200);
    expect(result.body.message).toBe('OK');
    return
  });
});