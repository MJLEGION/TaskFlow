/**
 * @fileoverview Custom hook for API operations with error handling and loading states
 * @author TaskFlow Team
 * @version 1.0.0
 */

import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import apiService from '../services/apiService';

/**
 * Custom hook for API operations
 * @param {Object} options - Configuration options
 * @param {boolean} options.showSuccessToast - Show success toast messages
 * @param {boolean} options.showErrorToast - Show error toast messages
 * @returns {Object} API hook utilities
 */
export const useApi = (options = {}) => {
  const {
    showSuccessToast = true,
    showErrorToast = true,
  } = options;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Execute an API call with error handling
   * @param {Function} apiCall - The API function to call
   * @param {Object} config - Configuration options
   * @returns {Promise} API response
   */
  const execute = useCallback(async (apiCall, config = {}) => {
    const {
      successMessage,
      errorMessage,
      onSuccess,
      onError,
      showLoading = true,
    } = config;

    try {
      if (showLoading) setLoading(true);
      setError(null);

      const response = await apiCall();

      if (successMessage && showSuccessToast) {
        toast.success(successMessage);
      }

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMsg);

      if (errorMessage && showErrorToast) {
        toast.error(errorMessage);
      } else if (showErrorToast) {
        toast.error(errorMsg);
      }

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [showSuccessToast, showErrorToast]);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    execute,
    clearError,
  };
};

/**
 * Hook for project-related API operations
 */
export const useProjectApi = () => {
  const api = useApi();

  const createProject = useCallback((projectData) => {
    return api.execute(
      () => apiService.projects.create(projectData),
      {
        successMessage: 'Project created successfully!',
        errorMessage: 'Failed to create project',
      }
    );
  }, [api]);

  const updateProject = useCallback((id, projectData) => {
    return api.execute(
      () => apiService.projects.update(id, projectData),
      {
        successMessage: 'Project updated successfully!',
        errorMessage: 'Failed to update project',
      }
    );
  }, [api]);

  const deleteProject = useCallback((id) => {
    return api.execute(
      () => apiService.projects.delete(id),
      {
        successMessage: 'Project deleted successfully!',
        errorMessage: 'Failed to delete project',
      }
    );
  }, [api]);

  const getProjects = useCallback(() => {
    return api.execute(
      () => apiService.projects.getAll(),
      {
        errorMessage: 'Failed to load projects',
        showSuccessToast: false,
      }
    );
  }, [api]);

  const getProject = useCallback((id) => {
    return api.execute(
      () => apiService.projects.getById(id),
      {
        errorMessage: 'Failed to load project',
        showSuccessToast: false,
      }
    );
  }, [api]);

  return {
    ...api,
    createProject,
    updateProject,
    deleteProject,
    getProjects,
    getProject,
  };
};

/**
 * Hook for task-related API operations
 */
export const useTaskApi = () => {
  const api = useApi();

  const createTask = useCallback((taskData) => {
    return api.execute(
      () => apiService.tasks.create(taskData),
      {
        successMessage: 'Task created successfully!',
        errorMessage: 'Failed to create task',
      }
    );
  }, [api]);

  const updateTask = useCallback((id, taskData) => {
    return api.execute(
      () => apiService.tasks.update(id, taskData),
      {
        successMessage: 'Task updated successfully!',
        errorMessage: 'Failed to update task',
      }
    );
  }, [api]);

  const deleteTask = useCallback((id) => {
    return api.execute(
      () => apiService.tasks.delete(id),
      {
        successMessage: 'Task deleted successfully!',
        errorMessage: 'Failed to delete task',
      }
    );
  }, [api]);

  const getTasks = useCallback((filters = {}) => {
    return api.execute(
      () => apiService.tasks.getAll(filters),
      {
        errorMessage: 'Failed to load tasks',
        showSuccessToast: false,
      }
    );
  }, [api]);

  const getTask = useCallback((id) => {
    return api.execute(
      () => apiService.tasks.getById(id),
      {
        errorMessage: 'Failed to load task',
        showSuccessToast: false,
      }
    );
  }, [api]);

  const assignTask = useCallback((taskId, assigneeId) => {
    return api.execute(
      () => apiService.tasks.assign(taskId, assigneeId),
      {
        successMessage: 'Task assigned successfully!',
        errorMessage: 'Failed to assign task',
      }
    );
  }, [api]);

  return {
    ...api,
    createTask,
    updateTask,
    deleteTask,
    getTasks,
    getTask,
    assignTask,
  };
};

/**
 * Hook for authentication-related API operations
 */
export const useAuthApi = () => {
  const api = useApi();

  const login = useCallback((credentials) => {
    return api.execute(
      () => apiService.auth.login(credentials),
      {
        successMessage: 'Login successful!',
        errorMessage: 'Login failed',
      }
    );
  }, [api]);

  const register = useCallback((userData) => {
    return api.execute(
      () => apiService.auth.register(userData),
      {
        successMessage: 'Registration successful!',
        errorMessage: 'Registration failed',
      }
    );
  }, [api]);

  const logout = useCallback(() => {
    return api.execute(
      () => apiService.auth.logout(),
      {
        successMessage: 'Logged out successfully!',
        errorMessage: 'Logout failed',
      }
    );
  }, [api]);

  const refreshToken = useCallback(() => {
    return api.execute(
      () => apiService.auth.refreshToken(),
      {
        showSuccessToast: false,
        showErrorToast: false,
      }
    );
  }, [api]);

  return {
    ...api,
    login,
    register,
    logout,
    refreshToken,
  };
};

export default useApi;