/**
 * @fileoverview Centralized API service for all HTTP requests
 * @author TaskFlow Team
 * @version 1.0.0
 */

import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    }
    
    if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

/**
 * Authentication API endpoints
 */
const authAPI = {
  /**
   * Login user
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise} API response
   */
  login: (credentials) => api.post('/auth/login', credentials),
  
  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} API response
   */
  register: (userData) => api.post('/auth/register', userData),
  
  /**
   * Logout user
   * @returns {Promise} API response
   */
  logout: () => api.post('/auth/logout'),
  
  /**
   * Refresh authentication token
   * @returns {Promise} API response
   */
  refreshToken: () => api.post('/auth/refresh'),
  
  /**
   * Get current user profile
   * @returns {Promise} API response
   */
  getProfile: () => api.get('/auth/profile'),
  
  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} API response
   */
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

/**
 * Projects API endpoints
 */
const projectsAPI = {
  /**
   * Get all projects
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAll: (params = {}) => api.get('/projects', { params }),
  
  /**
   * Get project by ID
   * @param {string|number} id - Project ID
   * @returns {Promise} API response
   */
  getById: (id) => api.get(`/projects/${id}`),
  
  /**
   * Create new project
   * @param {Object} projectData - Project data
   * @returns {Promise} API response
   */
  create: (projectData) => api.post('/projects', projectData),
  
  /**
   * Update project
   * @param {string|number} id - Project ID
   * @param {Object} projectData - Updated project data
   * @returns {Promise} API response
   */
  update: (id, projectData) => api.put(`/projects/${id}`, projectData),
  
  /**
   * Delete project
   * @param {string|number} id - Project ID
   * @returns {Promise} API response
   */
  delete: (id) => api.delete(`/projects/${id}`),
  
  /**
   * Get project statistics
   * @param {string|number} id - Project ID
   * @returns {Promise} API response
   */
  getStats: (id) => api.get(`/projects/${id}/stats`),
  
  /**
   * Get project members
   * @param {string|number} id - Project ID
   * @returns {Promise} API response
   */
  getMembers: (id) => api.get(`/projects/${id}/members`),
  
  /**
   * Add member to project
   * @param {string|number} id - Project ID
   * @param {Object} memberData - Member data
   * @returns {Promise} API response
   */
  addMember: (id, memberData) => api.post(`/projects/${id}/members`, memberData),
  
  /**
   * Remove member from project
   * @param {string|number} projectId - Project ID
   * @param {string|number} memberId - Member ID
   * @returns {Promise} API response
   */
  removeMember: (projectId, memberId) => api.delete(`/projects/${projectId}/members/${memberId}`),
};

/**
 * Tasks API endpoints
 */
const tasksAPI = {
  /**
   * Get all tasks
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAll: (params = {}) => api.get('/tasks', { params }),
  
  /**
   * Get task by ID
   * @param {string|number} id - Task ID
   * @returns {Promise} API response
   */
  getById: (id) => api.get(`/tasks/${id}`),
  
  /**
   * Create new task
   * @param {Object} taskData - Task data
   * @returns {Promise} API response
   */
  create: (taskData) => api.post('/tasks', taskData),
  
  /**
   * Update task
   * @param {string|number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise} API response
   */
  update: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  
  /**
   * Delete task
   * @param {string|number} id - Task ID
   * @returns {Promise} API response
   */
  delete: (id) => api.delete(`/tasks/${id}`),
  
  /**
   * Assign task to user
   * @param {string|number} taskId - Task ID
   * @param {string|number} assigneeId - Assignee user ID
   * @returns {Promise} API response
   */
  assign: (taskId, assigneeId) => api.put(`/tasks/${taskId}/assign`, { assigneeId }),
  
  /**
   * Update task status
   * @param {string|number} id - Task ID
   * @param {string} status - New status
   * @returns {Promise} API response
   */
  updateStatus: (id, status) => api.put(`/tasks/${id}/status`, { status }),
  
  /**
   * Add comment to task
   * @param {string|number} taskId - Task ID
   * @param {Object} commentData - Comment data
   * @returns {Promise} API response
   */
  addComment: (taskId, commentData) => api.post(`/tasks/${taskId}/comments`, commentData),
  
  /**
   * Get task comments
   * @param {string|number} taskId - Task ID
   * @returns {Promise} API response
   */
  getComments: (taskId) => api.get(`/tasks/${taskId}/comments`),
  
  /**
   * Upload task attachment
   * @param {string|number} taskId - Task ID
   * @param {FormData} formData - File form data
   * @returns {Promise} API response
   */
  uploadAttachment: (taskId, formData) => 
    api.post(`/tasks/${taskId}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
};

/**
 * Time tracking API endpoints
 */
const timeAPI = {
  /**
   * Get time entries
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getEntries: (params = {}) => api.get('/time', { params }),
  
  /**
   * Start time tracking
   * @param {Object} timeData - Time tracking data
   * @returns {Promise} API response
   */
  start: (timeData) => api.post('/time/start', timeData),
  
  /**
   * Stop time tracking
   * @param {string|number} entryId - Time entry ID
   * @returns {Promise} API response
   */
  stop: (entryId) => api.put(`/time/${entryId}/stop`),
  
  /**
   * Create manual time entry
   * @param {Object} timeData - Time entry data
   * @returns {Promise} API response
   */
  create: (timeData) => api.post('/time', timeData),
  
  /**
   * Update time entry
   * @param {string|number} id - Time entry ID
   * @param {Object} timeData - Updated time data
   * @returns {Promise} API response
   */
  update: (id, timeData) => api.put(`/time/${id}`, timeData),
  
  /**
   * Delete time entry
   * @param {string|number} id - Time entry ID
   * @returns {Promise} API response
   */
  delete: (id) => api.delete(`/time/${id}`),
  
  /**
   * Get time reports
   * @param {Object} params - Report parameters
   * @returns {Promise} API response
   */
  getReports: (params = {}) => api.get('/time/reports', { params }),
};

/**
 * Users API endpoints
 */
const usersAPI = {
  /**
   * Get all users
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAll: (params = {}) => api.get('/users', { params }),
  
  /**
   * Get user by ID
   * @param {string|number} id - User ID
   * @returns {Promise} API response
   */
  getById: (id) => api.get(`/users/${id}`),
  
  /**
   * Search users
   * @param {string} query - Search query
   * @returns {Promise} API response
   */
  search: (query) => api.get('/users/search', { params: { q: query } }),
};

/**
 * Notifications API endpoints
 */
const notificationsAPI = {
  /**
   * Get user notifications
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getAll: (params = {}) => api.get('/notifications', { params }),
  
  /**
   * Mark notification as read
   * @param {string|number} id - Notification ID
   * @returns {Promise} API response
   */
  markAsRead: (id) => api.put(`/notifications/${id}/read`),
  
  /**
   * Mark all notifications as read
   * @returns {Promise} API response
   */
  markAllAsRead: () => api.put('/notifications/read-all'),
  
  /**
   * Delete notification
   * @param {string|number} id - Notification ID
   * @returns {Promise} API response
   */
  delete: (id) => api.delete(`/notifications/${id}`),
  
  /**
   * Clear all notifications
   * @returns {Promise} API response
   */
  clearAll: () => api.delete('/notifications'),
};

/**
 * Analytics API endpoints
 */
const analyticsAPI = {
  /**
   * Get dashboard analytics
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getDashboard: (params = {}) => api.get('/analytics/dashboard', { params }),
  
  /**
   * Get productivity metrics
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getProductivity: (params = {}) => api.get('/analytics/productivity', { params }),
  
  /**
   * Get time analytics
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getTimeAnalytics: (params = {}) => api.get('/analytics/time', { params }),
  
  /**
   * Get project analytics
   * @param {string|number} projectId - Project ID
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getProjectAnalytics: (projectId, params = {}) => 
    api.get(`/analytics/projects/${projectId}`, { params }),
};

// Export all API services
const apiService = {
  auth: authAPI,
  projects: projectsAPI,
  tasks: tasksAPI,
  time: timeAPI,
  users: usersAPI,
  notifications: notificationsAPI,
  analytics: analyticsAPI,
};

export default apiService;