/**
 * @fileoverview Notification Center Component
 * @author TaskFlow Team
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

/**
 * Individual notification item component
 */
const NotificationItem = ({ notification, isDarkMode, onMarkAsRead, onDelete }) => {
  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getNotificationColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer group ${
        !notification.read ? 'bg-blue-50' : ''
      }`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg ${getNotificationColor()}`}>
          {getNotificationIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {notification.title}
          </p>
          <p className={`text-xs mt-1 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {notification.message}
          </p>
          <p className={`text-xs mt-1 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {notification.time}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(notification.id);
          }}
          className={`opacity-0 group-hover:opacity-100 p-1 rounded transition-opacity ${
            isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          aria-label="Delete notification"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
};

/**
 * Main Notification Center Component
 */
const NotificationCenter = () => {
  const { state, actions } = useApp();
  const { notifications, isDarkMode } = state;
  const [isOpen, setIsOpen] = useState(false);

  // Memoized unread count for performance
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const handleMarkAsRead = (notificationId) => {
    actions.markNotificationRead(notificationId);
  };

  const handleClearAll = () => {
    actions.clearNotifications();
    setIsOpen(false);
  };

  const handleDeleteNotification = (notificationId) => {
    // For now, we'll mark as read. In a real app, you'd have a delete action
    actions.markNotificationRead(notificationId);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          isDarkMode
            ? 'hover:bg-gray-700 text-gray-300'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute right-0 mt-2 w-80 max-w-sm rounded-xl shadow-lg border z-50 ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Header */}
              <div className={`p-4 border-b ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 text-sm text-blue-500">
                        ({unreadCount} new)
                      </span>
                    )}
                  </h3>
                  {notifications.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <Bell className={`h-12 w-12 mx-auto mb-3 ${
                      isDarkMode ? 'text-gray-600' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      No notifications yet
                    </p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        isDarkMode={isDarkMode}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDeleteNotification}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className={`p-3 border-t text-center ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={`text-xs ${
                      isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
                    } transition-colors`}
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter;