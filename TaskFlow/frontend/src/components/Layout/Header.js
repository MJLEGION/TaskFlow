/**
 * @fileoverview Main application header component
 * @author TaskFlow Team
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  LogOut,
  Settings,
  Sun,
  Moon,
  Menu,
  Bell,
  Search,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useAuthApi } from '../../hooks/useApi';
import NotificationCenter from '../Notifications/NotificationCenter';
import AdvancedSearch from '../Search/AdvancedSearch';
import UserMenu from './UserMenu';

/**
 * Breadcrumb component for navigation
 */
const Breadcrumb = ({ isDarkMode }) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  if (pathSegments.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm">
      <Link
        to="/"
        className={`hover:text-blue-500 transition-colors ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}
      >
        Home
      </Link>
      {pathSegments.map((segment, index) => {
        const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
        const isLast = index === pathSegments.length - 1;
        const displayName = segment.charAt(0).toUpperCase() + segment.slice(1);

        return (
          <React.Fragment key={path}>
            <span className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>
              /
            </span>
            {isLast ? (
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
                {displayName}
              </span>
            ) : (
              <Link
                to={path}
                className={`hover:text-blue-500 transition-colors ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

/**
 * Main Header Component
 */
const Header = ({ onToggleSidebar }) => {
  const { state, actions } = useApp();
  const { user, isDarkMode, sidebarCollapsed } = state;
  const { logout } = useAuthApi();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      actions.logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      actions.logout();
      navigate('/login');
    }
  };

  const handleSearch = (searchData) => {
    console.log('Search data:', searchData);
    // Implement search logic here
  };

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-colors ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle */}
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 font-bold text-xl"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>
              TaskFlow
            </span>
          </Link>

          {/* Breadcrumb */}
          <div className="hidden md:block">
            <Breadcrumb isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-2xl mx-4 hidden lg:block">
          <AdvancedSearch
            onSearch={handleSearch}
            placeholder="Search tasks, projects, or team members..."
          />
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search Button */}
          <button
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={actions.toggleDarkMode}
            className={`p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          {/* Notifications */}
          <NotificationCenter />

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="hidden md:block text-left">
                <p className={`text-sm font-medium ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {user?.name || 'User'}
                </p>
                <p className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {user?.role || 'Member'}
                </p>
              </div>
              <ChevronDown className="h-4 w-4" />
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <UserMenu
                user={user}
                isDarkMode={isDarkMode}
                onClose={() => setShowUserMenu(false)}
                onLogout={handleLogout}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 pb-3">
        <AdvancedSearch
          onSearch={handleSearch}
          placeholder="Search..."
        />
      </div>
    </header>
  );
};

export default Header;