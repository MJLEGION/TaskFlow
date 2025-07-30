/**
 * @fileoverview Global Application Context for state management
 * @author TaskFlow Team
 * @version 1.0.0
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Initial state
const initialState = {
  // User state
  user: null,
  isAuthenticated: false,
  
  // UI state
  isDarkMode: localStorage.getItem('darkMode') === 'true',
  sidebarCollapsed: false,
  
  // Data state
  projects: [],
  tasks: [],
  notifications: [],
  
  // Loading states
  loading: {
    projects: false,
    tasks: false,
    notifications: false,
  },
  
  // Error states
  errors: {
    projects: null,
    tasks: null,
    notifications: null,
  },
  
  // Filters and search
  filters: {
    priority: 'all',
    status: 'all',
    assignee: 'all',
    dateRange: 'all'
  },
  searchTerm: '',
};

// Action types
export const ActionTypes = {
  // User actions
  SET_USER: 'SET_USER',
  LOGOUT: 'LOGOUT',
  
  // UI actions
  TOGGLE_DARK_MODE: 'TOGGLE_DARK_MODE',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  
  // Data actions
  SET_PROJECTS: 'SET_PROJECTS',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  
  SET_TASKS: 'SET_TASKS',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',
  
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  
  // Loading actions
  SET_LOADING: 'SET_LOADING',
  
  // Error actions
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  
  // Filter actions
  SET_FILTERS: 'SET_FILTERS',
  SET_SEARCH_TERM: 'SET_SEARCH_TERM',
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_USER:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
      };
      
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
      
    case ActionTypes.TOGGLE_DARK_MODE:
      const newDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', newDarkMode.toString());
      return {
        ...state,
        isDarkMode: newDarkMode,
      };
      
    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
      
    case ActionTypes.SET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        loading: { ...state.loading, projects: false },
        errors: { ...state.errors, projects: null },
      };
      
    case ActionTypes.ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
      
    case ActionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
      
    case ActionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
      };
      
    case ActionTypes.SET_TASKS:
      return {
        ...state,
        tasks: action.payload,
        loading: { ...state.loading, tasks: false },
        errors: { ...state.errors, tasks: null },
      };
      
    case ActionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };
      
    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
      
    case ActionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
      
    case ActionTypes.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        loading: { ...state.loading, notifications: false },
        errors: { ...state.errors, notifications: null },
      };
      
    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };
      
    case ActionTypes.MARK_NOTIFICATION_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true }
            : notification
        ),
      };
      
    case ActionTypes.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
      };
      
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: { ...state.loading, [action.payload.key]: action.payload.value },
      };
      
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.payload.key]: action.payload.value },
        loading: { ...state.loading, [action.payload.key]: false },
      };
      
    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        errors: { ...state.errors, [action.payload]: null },
      };
      
    case ActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
      
    case ActionTypes.SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const actions = {
    // User actions
    setUser: (user) => dispatch({ type: ActionTypes.SET_USER, payload: user }),
    logout: () => dispatch({ type: ActionTypes.LOGOUT }),
    
    // UI actions
    toggleDarkMode: () => dispatch({ type: ActionTypes.TOGGLE_DARK_MODE }),
    toggleSidebar: () => dispatch({ type: ActionTypes.TOGGLE_SIDEBAR }),
    
    // Project actions
    setProjects: (projects) => dispatch({ type: ActionTypes.SET_PROJECTS, payload: projects }),
    addProject: (project) => {
      dispatch({ type: ActionTypes.ADD_PROJECT, payload: project });
      toast.success('Project created successfully!');
    },
    updateProject: (project) => {
      dispatch({ type: ActionTypes.UPDATE_PROJECT, payload: project });
      toast.success('Project updated successfully!');
    },
    deleteProject: (projectId) => {
      dispatch({ type: ActionTypes.DELETE_PROJECT, payload: projectId });
      toast.success('Project deleted successfully!');
    },
    
    // Task actions
    setTasks: (tasks) => dispatch({ type: ActionTypes.SET_TASKS, payload: tasks }),
    addTask: (task) => {
      dispatch({ type: ActionTypes.ADD_TASK, payload: task });
      toast.success('Task created successfully!');
    },
    updateTask: (task) => {
      dispatch({ type: ActionTypes.UPDATE_TASK, payload: task });
      toast.success('Task updated successfully!');
    },
    deleteTask: (taskId) => {
      dispatch({ type: ActionTypes.DELETE_TASK, payload: taskId });
      toast.success('Task deleted successfully!');
    },
    
    // Notification actions
    setNotifications: (notifications) => dispatch({ type: ActionTypes.SET_NOTIFICATIONS, payload: notifications }),
    addNotification: (notification) => dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notification }),
    markNotificationRead: (notificationId) => dispatch({ type: ActionTypes.MARK_NOTIFICATION_READ, payload: notificationId }),
    clearNotifications: () => dispatch({ type: ActionTypes.CLEAR_NOTIFICATIONS }),
    
    // Loading actions
    setLoading: (key, value) => dispatch({ type: ActionTypes.SET_LOADING, payload: { key, value } }),
    
    // Error actions
    setError: (key, value) => {
      dispatch({ type: ActionTypes.SET_ERROR, payload: { key, value } });
      if (value) {
        toast.error(`Error: ${value}`);
      }
    },
    clearError: (key) => dispatch({ type: ActionTypes.CLEAR_ERROR, payload: key }),
    
    // Filter actions
    setFilters: (filters) => dispatch({ type: ActionTypes.SET_FILTERS, payload: filters }),
    setSearchTerm: (term) => dispatch({ type: ActionTypes.SET_SEARCH_TERM, payload: term }),
  };

  // Initialize data on mount
  useEffect(() => {
    // Load initial data here
    // This would typically involve API calls
    console.log('AppProvider initialized');
  }, []);

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;