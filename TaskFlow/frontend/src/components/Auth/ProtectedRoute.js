/**
 * @fileoverview Protected Route component for authentication
 * @author TaskFlow Team
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuthApi } from '../../hooks/useApi';
import LoadingSpinner from '../Common/LoadingSpinner';

/**
 * Protected Route Component
 * Handles authentication checks and redirects
 */
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { state, actions } = useApp();
  const { user, isAuthenticated } = state;
  const { refreshToken } = useAuthApi();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a token in localStorage
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setIsLoading(false);
          setAuthChecked(true);
          return;
        }

        // If we have a token but no user data, try to refresh
        if (token && !user) {
          try {
            const response = await refreshToken();
            if (response && response.user) {
              actions.setUser(response.user);
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
            // Clear invalid token
            localStorage.removeItem('authToken');
            actions.logout();
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('authToken');
        actions.logout();
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    if (!authChecked) {
      checkAuth();
    } else {
      setIsLoading(false);
    }
  }, [user, refreshToken, actions, authChecked]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <LoadingSpinner 
          type="page" 
          message="Verifying authentication..." 
        />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location.pathname }} 
        replace 
      />
    );
  }

  // Check role-based access if required
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render the protected component
  return children;
};

export default ProtectedRoute;