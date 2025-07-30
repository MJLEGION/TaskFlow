/**
 * @fileoverview Loading spinner components with various styles
 * @author TaskFlow Team
 * @version 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';

/**
 * Basic spinning loader
 */
export const SpinnerLoader = ({ size = 'md', color = 'blue' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    blue: 'text-blue-500',
    gray: 'text-gray-500',
    white: 'text-white',
    green: 'text-green-500',
    red: 'text-red-500',
  };

  return (
    <Loader2 
      className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
    />
  );
};

/**
 * Pulsing dots loader
 */
export const DotsLoader = ({ color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    gray: 'bg-gray-500',
    white: 'bg-white',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={`w-2 h-2 rounded-full ${colorClasses[color]}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

/**
 * Progress bar loader
 */
export const ProgressLoader = ({ progress = 0, color = 'blue', showPercentage = false }) => {
  const colorClasses = {
    blue: 'bg-blue-500',
    gray: 'bg-gray-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
        {showPercentage && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <motion.div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
};

/**
 * Skeleton loader for content
 */
export const SkeletonLoader = ({ lines = 3, className = '' }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`bg-gray-200 dark:bg-gray-700 rounded h-4 mb-2 ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        />
      ))}
    </div>
  );
};

/**
 * Card skeleton loader
 */
export const CardSkeleton = ({ showAvatar = false }) => {
  return (
    <div className="animate-pulse p-4 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-3">
        {showAvatar && (
          <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full" />
        )}
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
      </div>
    </div>
  );
};

/**
 * Full page loading component
 */
export const PageLoader = ({ message = 'Loading...', isDarkMode = false }) => {
  return (
    <div className={`min-h-screen flex items-center justify-center ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="mx-auto mb-4"
        >
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full" />
        </motion.div>
        <p className={`text-lg font-medium ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {message}
        </p>
        <DotsLoader color={isDarkMode ? 'white' : 'blue'} />
      </div>
    </div>
  );
};

/**
 * Inline loading component
 */
export const InlineLoader = ({ 
  message = 'Loading...', 
  size = 'md', 
  color = 'blue',
  showMessage = true 
}) => {
  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <SpinnerLoader size={size} color={color} />
      {showMessage && (
        <span className="text-gray-600 dark:text-gray-400">
          {message}
        </span>
      )}
    </div>
  );
};

/**
 * Button loading state
 */
export const ButtonLoader = ({ children, loading = false, ...props }) => {
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`${props.className} ${loading ? 'cursor-not-allowed opacity-75' : ''}`}
    >
      <div className="flex items-center justify-center space-x-2">
        {loading && <SpinnerLoader size="sm" color="white" />}
        <span>{children}</span>
      </div>
    </button>
  );
};

/**
 * Main LoadingSpinner component (default export)
 */
const LoadingSpinner = ({ 
  type = 'spinner', 
  size = 'md', 
  color = 'blue',
  message,
  ...props 
}) => {
  switch (type) {
    case 'dots':
      return <DotsLoader color={color} {...props} />;
    case 'progress':
      return <ProgressLoader color={color} {...props} />;
    case 'skeleton':
      return <SkeletonLoader {...props} />;
    case 'card':
      return <CardSkeleton {...props} />;
    case 'page':
      return <PageLoader message={message} {...props} />;
    case 'inline':
      return <InlineLoader message={message} size={size} color={color} {...props} />;
    default:
      return <SpinnerLoader size={size} color={color} />;
  }
};

export default LoadingSpinner;