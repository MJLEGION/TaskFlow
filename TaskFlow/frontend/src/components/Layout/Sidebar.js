/**
 * @fileoverview Main application sidebar component
 * @author TaskFlow Team
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  CheckSquare,
  FolderOpen,
  BarChart3,
  Clock,
  Users,
  Settings,
  Calendar,
  Target,
  Activity,
  FileText,
  Zap,
  ChevronDown,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

/**
 * Navigation items configuration
 */
const NAVIGATION_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: Home,
    path: '/',
    exact: true,
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
    path: '/tasks',
    badge: 'tasks',
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderOpen,
    path: '/projects',
    badge: 'projects',
    children: [
      { id: 'active-projects', label: 'Active Projects', path: '/projects/active' },
      { id: 'archived-projects', label: 'Archived', path: '/projects/archived' },
      { id: 'templates', label: 'Templates', path: '/projects/templates' },
    ],
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: Calendar,
    path: '/calendar',
  },
  {
    id: 'time-tracking',
    label: 'Time Tracking',
    icon: Clock,
    path: '/time',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    children: [
      { id: 'productivity', label: 'Productivity', path: '/analytics/productivity' },
      { id: 'time-reports', label: 'Time Reports', path: '/analytics/time' },
      { id: 'team-performance', label: 'Team Performance', path: '/analytics/team' },
    ],
  },
  {
    id: 'team',
    label: 'Team',
    icon: Users,
    path: '/team',
  },
];

const SECONDARY_ITEMS = [
  {
    id: 'goals',
    label: 'Goals',
    icon: Target,
    path: '/goals',
  },
  {
    id: 'activity',
    label: 'Activity',
    icon: Activity,
    path: '/activity',
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    path: '/documents',
  },
  {
    id: 'automations',
    label: 'Automations',
    icon: Zap,
    path: '/automations',
  },
];

/**
 * Navigation item component
 */
const NavItem = ({ item, isCollapsed, isDarkMode, level = 0 }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const isActive = item.exact 
    ? location.pathname === item.path
    : location.pathname.startsWith(item.path);
  
  const hasChildren = item.children && item.children.length > 0;
  const shouldShowChildren = hasChildren && isExpanded && !isCollapsed;

  const handleClick = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };

  const itemContent = (
    <div
      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200 group ${
        isActive
          ? isDarkMode
            ? 'bg-blue-600 text-white'
            : 'bg-blue-50 text-blue-600 border border-blue-200'
          : isDarkMode
          ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      } ${level > 0 ? 'ml-4' : ''}`}
    >
      <div className="flex items-center space-x-3 min-w-0">
        <item.icon className={`h-5 w-5 flex-shrink-0 ${
          isActive && !isDarkMode ? 'text-blue-600' : ''
        }`} />
        <AnimatePresence>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="font-medium truncate"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      
      {!isCollapsed && (
        <div className="flex items-center space-x-2">
          {item.badge && (
            <span className={`px-2 py-1 text-xs rounded-full ${
              isActive
                ? 'bg-white text-blue-600'
                : isDarkMode
                ? 'bg-gray-600 text-gray-300'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {/* This would be dynamic based on actual data */}
              3
            </span>
          )}
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div>
      {hasChildren ? (
        <button onClick={handleClick} className="w-full text-left">
          {itemContent}
        </button>
      ) : (
        <NavLink to={item.path} className="block">
          {itemContent}
        </NavLink>
      )}
      
      {/* Children */}
      <AnimatePresence>
        {shouldShowChildren && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1 space-y-1"
          >
            {item.children.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                isCollapsed={false}
                isDarkMode={isDarkMode}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/**
 * Quick actions component
 */
const QuickActions = ({ isCollapsed, isDarkMode }) => {
  const quickActions = [
    { label: 'New Task', action: () => console.log('New task') },
    { label: 'New Project', action: () => console.log('New project') },
    { label: 'New Team', action: () => console.log('New team') },
  ];

  if (isCollapsed) {
    return (
      <button
        className={`w-full p-3 rounded-lg transition-colors ${
          isDarkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        title="Quick Actions"
      >
        <Plus className="h-5 w-5 mx-auto" />
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className={`text-xs font-semibold uppercase tracking-wider ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        Quick Actions
      </h3>
      {quickActions.map((action, index) => (
        <button
          key={index}
          onClick={action.action}
          className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            isDarkMode
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
};

/**
 * Main Sidebar Component
 */
const Sidebar = () => {
  const { state, actions } = useApp();
  const { sidebarCollapsed, isDarkMode } = state;

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed left-0 top-0 h-full border-r z-20 ${
        isDarkMode
          ? 'bg-gray-800 border-gray-700'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <AnimatePresence>
            {!sidebarCollapsed ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TF</span>
                </div>
                <div>
                  <h1 className={`font-bold text-lg ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    TaskFlow
                  </h1>
                  <p className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Project Management
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TF</span>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Primary Navigation */}
          <nav className="space-y-2">
            {NAVIGATION_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isCollapsed={sidebarCollapsed}
                isDarkMode={isDarkMode}
              />
            ))}
          </nav>

          {/* Secondary Navigation */}
          {!sidebarCollapsed && (
            <div className="space-y-2">
              <h3 className={`text-xs font-semibold uppercase tracking-wider px-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                More
              </h3>
              {SECONDARY_ITEMS.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  isCollapsed={sidebarCollapsed}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          )}

          {/* Quick Actions */}
          <QuickActions isCollapsed={sidebarCollapsed} isDarkMode={isDarkMode} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <NavItem
            item={{
              id: 'settings',
              label: 'Settings',
              icon: Settings,
              path: '/settings',
            }}
            isCollapsed={sidebarCollapsed}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;