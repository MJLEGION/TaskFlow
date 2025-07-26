const request = require('supertest');
const express = require('express');

// Create a simple test app with health endpoint
const createHealthApp = () => {
  const app = express();
  
  app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
  });
  
  return app;
};

describe('Health Check Endpoint', () => {
  let app;

  beforeAll(() => {
    app = createHealthApp();
  });

  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
  });

  it('should return JSON content type', async () => {
    const response = await request(app)
      .get('/api/health');

    expect(response.headers['content-type']).toMatch(/json/);
  });

  it('should have valid timestamp format', async () => {
    const response = await request(app)
      .get('/api/health');

    const timestamp = response.body.timestamp;
    expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});