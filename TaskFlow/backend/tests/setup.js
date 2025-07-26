// Test setup file
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/taskflow_test';

// Suppress console.log during tests unless explicitly needed
if (process.env.VERBOSE_TESTS !== 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn()
  };
}

// Global test utilities
global.testUtils = {
  createMockUser: () => ({
    id: 1,
    username: 'testuser',
    email: 'test@example.com',
    created_at: new Date()
  }),
  
  createMockProject: () => ({
    id: 1,
    name: 'Test Project',
    description: 'Test project description',
    user_id: 1,
    created_at: new Date()
  }),
  
  createMockTask: () => ({
    id: 1,
    title: 'Test Task',
    description: 'Test task description',
    status: 'todo',
    priority: 'medium',
    project_id: 1,
    user_id: 1,
    created_at: new Date()
  })
};