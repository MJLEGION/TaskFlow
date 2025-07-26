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
    
    // Add a test route
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

// Only mock routes that actually exist
// jest.mock('../src/routes/users', () => {
//   return jest.fn(() => {
//     const mockRouter = {
//       get: jest.fn(),
//       post: jest.fn(),
//       put: jest.fn(),
//       delete: jest.fn(),
//       use: jest.fn()
//     };
//     return mockRouter;
//   });
// });

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
    app = require('../src/server');
  });

  afterEach(() => {
    jest.resetModules();
  });

  test('should start server and respond to health check', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
  });

  test('should handle 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/nonexistent-route')
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Route not found');
  });
});