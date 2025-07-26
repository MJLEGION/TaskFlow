import api from './api';

// Mock axios
jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn()
      },
      response: {
        use: jest.fn()
      }
    }
  }))
}));

describe('API Service', () => {
  it('should create axios instance with correct base URL', () => {
    const axios = require('axios');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });

  it('should export axios instance', () => {
    expect(api).toBeDefined();
    expect(typeof api).toBe('object');
  });
});