import api, { authAPI, projectsAPI, tasksAPI, timeAPI, getToken, setToken, removeToken } from './api';

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

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
  });

  it('should create axios instance with correct configuration', () => {
    const axios = require('axios');
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });

  it('should export axios instance', () => {
    expect(api).toBeDefined();
    expect(typeof api).toBe('object');
  });

  describe('Token Management', () => {
    it('should get token from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('test-token');
      const token = getToken();
      expect(localStorageMock.getItem).toHaveBeenCalledWith('taskflow_token');
      expect(token).toBe('test-token');
    });

    it('should set token in localStorage', () => {
      setToken('new-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('taskflow_token', 'new-token');
    });

    it('should remove token from localStorage', () => {
      removeToken();
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('taskflow_token');
    });
  });

  describe('API Endpoints', () => {
    it('should export authAPI with correct methods', () => {
      expect(authAPI).toBeDefined();
      expect(typeof authAPI.login).toBe('function');
      expect(typeof authAPI.register).toBe('function');
      expect(typeof authAPI.getProfile).toBe('function');
    });

    it('should export projectsAPI with correct methods', () => {
      expect(projectsAPI).toBeDefined();
      expect(typeof projectsAPI.getAll).toBe('function');
      expect(typeof projectsAPI.getById).toBe('function');
      expect(typeof projectsAPI.create).toBe('function');
      expect(typeof projectsAPI.update).toBe('function');
      expect(typeof projectsAPI.delete).toBe('function');
    });

    it('should export tasksAPI with correct methods', () => {
      expect(tasksAPI).toBeDefined();
      expect(typeof tasksAPI.getByProject).toBe('function');
      expect(typeof tasksAPI.getAll).toBe('function');
      expect(typeof tasksAPI.create).toBe('function');
      expect(typeof tasksAPI.update).toBe('function');
      expect(typeof tasksAPI.delete).toBe('function');
    });

    it('should export timeAPI with correct methods', () => {
      expect(timeAPI).toBeDefined();
      expect(typeof timeAPI.getByTask).toBe('function');
      expect(typeof timeAPI.getByProject).toBe('function');
      expect(typeof timeAPI.getAll).toBe('function');
      expect(typeof timeAPI.start).toBe('function');
      expect(typeof timeAPI.stop).toBe('function');
      expect(typeof timeAPI.create).toBe('function');
      expect(typeof timeAPI.update).toBe('function');
      expect(typeof timeAPI.delete).toBe('function');
    });
  });
});