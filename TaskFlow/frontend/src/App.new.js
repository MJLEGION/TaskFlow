/**
 * @fileoverview Main Application Component - Clean and Modular
 * @author TaskFlow Team
 * @version 2.0.0
 */

import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './contexts/AppContext';
import ErrorBoundary from './components/Common/ErrorBoundary';
import LoadingSpinner from './components/Common/LoadingSpinner';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import './App.css';

// Lazy load components for better performance
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks/Tasks'));
const TaskDetail = lazy(() => import('./pages/Tasks/TaskDetail'));
const Projects = lazy(() => import('./pages/Projects/Projects'));
const ProjectDetail = lazy(() => import('./pages/Projects/ProjectDetail'));
const Calendar = lazy(() => import('./pages/Calendar/Calendar'));
const TimeTracking = lazy(() => import('./pages/TimeTracking/TimeTracking'));
const Analytics = lazy(() => import('./pages/Analytics/Analytics'));
const Team = lazy(() => import('./pages/Team/Team'));
const Profile = lazy(() => import('./pages/Profile/Profile'));
const Settings = lazy(() => import('./pages/Settings/Settings'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

/**
 * Loading fallback component
 */
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner type="page" message="Loading TaskFlow..." />
  </div>
);

/**
 * Auth Layout for login/register pages
 */
const AuthLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  </div>
);

/**
 * Main App Layout for authenticated pages
 */
const AppLayout = ({ children }) => (
  <MainLayout>
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner type="inline" message="Loading page..." />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  </MainLayout>
);

/**
 * Main Application Component
 */
const App = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Authentication Routes */}
              <Route
                path="/login"
                element={
                  <AuthLayout>
                    <Login />
                  </AuthLayout>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthLayout>
                    <Register />
                  </AuthLayout>
                }
              />

              {/* Protected Application Routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Dashboard />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Tasks Routes */}
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Tasks />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:id"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TaskDetail />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Projects Routes */}
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Projects />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <ProjectDetail />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* Other Protected Routes */}
              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Calendar />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/time"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <TimeTracking />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics/*"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Analytics />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/team"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Team />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Settings />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route
                path="/404"
                element={
                  <AuthLayout>
                    <NotFound />
                  </AuthLayout>
                }
              />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>

            {/* Global Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--toast-bg)',
                  color: 'var(--toast-color)',
                  border: '1px solid var(--toast-border)',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#FFFFFF',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#FFFFFF',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;