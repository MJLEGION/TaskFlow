/**
 * @fileoverview Main application layout component
 * @author TaskFlow Team
 * @version 1.0.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import Header from './Header';
import Sidebar from './Sidebar';
import ErrorBoundary from '../Common/ErrorBoundary';

/**
 * Main Layout Component
 */
const MainLayout = ({ children }) => {
  const { state, actions } = useApp();
  const { sidebarCollapsed, isDarkMode } = state;

  const handleToggleSidebar = () => {
    actions.toggleSidebar();
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'ml-20' : 'ml-70'
        }`}
        style={{ marginLeft: sidebarCollapsed ? '80px' : '280px' }}
      >
        {/* Header */}
        <Header onToggleSidebar={handleToggleSidebar} />
        
        {/* Page Content */}
        <main className="flex-1">
          <ErrorBoundary>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="container mx-auto px-4 py-6"
            >
              {children}
            </motion.div>
          </ErrorBoundary>
        </main>
      </div>
      
      {/* Mobile Sidebar Overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={handleToggleSidebar}
        />
      )}
    </div>
  );
};

export default MainLayout;