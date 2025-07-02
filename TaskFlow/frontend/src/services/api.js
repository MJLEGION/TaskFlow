import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const getToken = () => localStorage.getItem('taskflow_token');
export const setToken = (token) => localStorage.setItem('taskflow_token', token);
export const removeToken = () => localStorage.removeItem('taskflow_token');

// Add token to requests
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Projects API
export const projectsAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (projectData) => api.post('/projects', projectData),
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Tasks API
export const tasksAPI = {
  getByProject: (projectId) => api.get(`/tasks?projectId=${projectId}`),
  getAll: () => api.get('/tasks'),
  create: (taskData) => api.post('/tasks', taskData),
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// Time tracking API
export const timeAPI = {
  getByTask: (taskId) => api.get(`/time?taskId=${taskId}`),
  getByProject: (projectId) => api.get(`/time?projectId=${projectId}`),
  getAll: () => api.get('/time'),
  start: (timeData) => api.post('/time/start', timeData),
  stop: (id) => api.post(`/time/${id}/stop`),
  create: (timeData) => api.post('/time', timeData),
  update: (id, timeData) => api.put(`/time/${id}`, timeData),
  delete: (id) => api.delete(`/time/${id}`),
};

export default api;
