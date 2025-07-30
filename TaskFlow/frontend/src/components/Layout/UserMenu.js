/**
 * @fileoverview User dropdown menu component
 * @author TaskFlow Team
 * @version 1.0.0
 */

import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Settings,
  LogOut,
  Bell,
  Shield,
  HelpCircle,
  CreditCard,
  Activity,
} from 'lucide-react';

/**
 * Menu item component
 */
const MenuItem = ({ icon: Icon, label, to, onClick, isDarkMode, danger = false }) => {
  const baseClasses = `flex items-center space-x-3 px-4 py-3 text-sm transition-colors ${
    isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
  }`;
  
  const textClasses = danger
    ? 'text-red-500'
    : isDarkMode
    ? 'text-gray-300'
    : 'text-gray-700';

  const content = (
    <>
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${textClasses}`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${textClasses} w-full text-left`}
    >
      {content}
    </button>
  );
};

/**
 * User profile section
 */
const UserProfile = ({ user, isDarkMode }) => (
  <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <User className="h-5 w-5 text-white" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`font-medium truncate ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {user?.name || 'User Name'}
        </p>
        <p className={`text-sm truncate ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {user?.email || 'user@example.com'}
        </p>
        {user?.role && (
          <p className={`text-xs truncate ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            {user.role}
          </p>
        )}
      </div>
    </div>
  </div>
);

/**
 * Main UserMenu Component
 */
const UserMenu = ({ user, isDarkMode, onClose, onLogout }) => {
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleLogout = () => {
    onClose();
    onLogout();
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={menuRef}
        initial={{ opacity: 0, y: -10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.95 }}
        className={`absolute right-0 mt-2 w-64 rounded-xl shadow-lg border z-50 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}
      >
        {/* User Profile Section */}
        <UserProfile user={user} isDarkMode={isDarkMode} />

        {/* Menu Items */}
        <div className="py-2">
          <MenuItem
            icon={User}
            label="Profile"
            to="/profile"
            isDarkMode={isDarkMode}
          />
          <MenuItem
            icon={Activity}
            label="Activity"
            to="/activity"
            isDarkMode={isDarkMode}
          />
          <MenuItem
            icon={Bell}
            label="Notifications"
            to="/notifications"
            isDarkMode={isDarkMode}
          />
        </div>

        <div className={`border-t py-2 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <MenuItem
            icon={Settings}
            label="Settings"
            to="/settings"
            isDarkMode={isDarkMode}
          />
          <MenuItem
            icon={Shield}
            label="Privacy & Security"
            to="/privacy"
            isDarkMode={isDarkMode}
          />
          <MenuItem
            icon={CreditCard}
            label="Billing"
            to="/billing"
            isDarkMode={isDarkMode}
          />
        </div>

        <div className={`border-t py-2 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <MenuItem
            icon={HelpCircle}
            label="Help & Support"
            to="/help"
            isDarkMode={isDarkMode}
          />
          <MenuItem
            icon={LogOut}
            label="Sign Out"
            onClick={handleLogout}
            isDarkMode={isDarkMode}
            danger
          />
        </div>

        {/* Footer */}
        <div className={`px-4 py-3 border-t text-center ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <p className={`text-xs ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            TaskFlow v1.0.0
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default UserMenu;