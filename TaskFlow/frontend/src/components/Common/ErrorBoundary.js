/**
 * @fileoverview Error Boundary component for handling React errors gracefully
 * @author TaskFlow Team
 * @version 1.0.0
 */

import React from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';

/**
 * Error Boundary Class Component
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2),
    };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Report error to monitoring service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }

    // You can also log the error to an error reporting service here
    // Example: Sentry.captureException(error);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state;
      const isDarkMode = document.documentElement.classList.contains('dark');

      return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${
          isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className={`max-w-md w-full rounded-lg shadow-lg p-6 text-center ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className={`text-xl font-semibold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Oops! Something went wrong
            </h1>

            {/* Error Description */}
            <p className={`text-sm mb-6 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              We encountered an unexpected error. Don't worry, our team has been notified and is working on a fix.
            </p>

            {/* Error ID */}
            {errorId && (
              <div className={`text-xs mb-6 p-2 rounded ${
                isDarkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
              }`}>
                Error ID: {errorId}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Try Again</span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={this.handleGoHome}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Home className="h-4 w-4" />
                  <span>Go Home</span>
                </button>

                <button
                  onClick={this.handleReload}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                    isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Reload</span>
                </button>
              </div>
            </div>

            {/* Development Error Details */}
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mt-6 text-left">
                <summary className={`cursor-pointer text-sm font-medium mb-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <div className="flex items-center space-x-2">
                    <Bug className="h-4 w-4" />
                    <span>Error Details (Development)</span>
                  </div>
                </summary>
                <div className={`text-xs p-3 rounded border overflow-auto max-h-40 ${
                  isDarkMode
                    ? 'bg-gray-900 border-gray-600 text-gray-300'
                    : 'bg-gray-50 border-gray-200 text-gray-600'
                }`}>
                  <div className="mb-2">
                    <strong>Error:</strong>
                    <pre className="whitespace-pre-wrap mt-1">{error.toString()}</pre>
                  </div>
                  {errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap mt-1">{errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Help Text */}
            <p className={`text-xs mt-4 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              If the problem persists, please contact our support team.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;