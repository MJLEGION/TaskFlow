// tests/server.test.js
const request = require('supertest');

// Mock the routes with proper Jest mock factory
jest.mock('../src/routes/auth', () => {
  return jest.fn(() => {
    const mockRouter = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      use: jest.fn()
    };

    // Add a test route (this specific mock implementation might not be needed for these tests,
    // but it's harmless if auth routes are not directly tested here)
    mockRouter.get.mockImplementation((path, handler) => {
      if (path === '/test') {
        // Simulate the handler
        return handler;
      }
    });

    return mockRouter;
  });
});

jest.mock('../src/routes/tasks', () => {
  return jest.fn(() => {
    const mockRouter = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      use: jest.fn()
    };
    return mockRouter;
  });
});

// Mock database connection
jest.mock('../src/config/database', () => ({
  query: jest.fn(),
  end: jest.fn()
}));

describe('Server', () => {
  let app;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Require the app after mocks are set up
    // This assumes '../src/server' exports the raw Express app instance
    app = require('../src/server');
  });

  afterEach(() => {
    // Reset modules to ensure a fresh app instance for each test run if needed
    jest.resetModules();
  });

  test('should start server and respond to health check', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
    // Optionally, you can also check the message property from the health check
    expect(response.body).toHaveProperty('message', 'Backend server is healthy and operational.');
  });

  test('should handle 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/nonexistent-route')
      .expect(404);

    // ADJUSTMENT HERE: Access the 'message' property within the 'error' object
    expect(response.body.error).toHaveProperty('message', 'Route not found');
    expect(response.body.error).toHaveProperty('status', 404); // Also check the status within the error object
  });
});
