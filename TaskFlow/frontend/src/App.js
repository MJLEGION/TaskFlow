import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, Link } from 'react-router-dom';
import {
  Bell, Search, User, LogOut, Settings, Clock, CheckCircle, AlertCircle,
  FolderOpen, Home, CheckSquare, BarChart3, ArrowRight, Eye, EyeOff, Sun, Moon,
  Plus, Edit, Trash2, Calendar, Play, Pause, Square, PieChart, TrendingUp,
  Filter, X, Save, Target
} from 'lucide-react';
import './App.css';

// Enhanced Login Component
const EnhancedLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (isRegistering) {
      if (!formData.name) {
        setError('Name is required for registration');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }

    setLoading(true);

    // Simulate authentication process
    setTimeout(() => {
      const userData = {
        email: formData.email,
        name: isRegistering ? formData.name : 'User',
        id: Math.random().toString(36).substr(2, 9)
      };

      // Store user data in localStorage (temporary solution)
      localStorage.setItem('taskflow_user', JSON.stringify(userData));

      onLogin(userData);
      setLoading(false);
    }, 1500);
  };

  const toggleAuthMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setFormData({ email: '', password: '', confirmPassword: '', name: '' });
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-all duration-500 ${
      isDarkMode
        ? 'bg-gradient-to-br from-slate-900 via-gray-900 to-black'
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-110 ${
          isDarkMode
            ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
            : 'bg-black/10 border-black/20 text-gray-800 hover:bg-black/20'
        }`}
      >
        {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
      </button>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse ${
          isDarkMode
            ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20'
            : 'bg-gradient-to-r from-blue-300/30 to-purple-300/30'
        }`}></div>
        <div className={`absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
          isDarkMode
            ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20'
            : 'bg-gradient-to-r from-purple-300/30 to-pink-300/30'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-2xl animate-pulse delay-500 ${
          isDarkMode
            ? 'bg-gradient-to-r from-cyan-600/10 to-blue-600/10'
            : 'bg-gradient-to-r from-cyan-300/20 to-blue-300/20'
        }`}></div>
      </div>

      {/* Main container */}
      <div className="max-w-lg w-full relative z-10">
        {/* Premium glass card */}
        <div className="relative">
          {/* Outer glow effect */}
          <div className={`absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur transition duration-1000 ${
            isDarkMode ? 'opacity-25 group-hover:opacity-40' : 'opacity-15 group-hover:opacity-25'
          }`}></div>

          {/* Main card */}
          <div className={`relative backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border transition-all duration-500 ${
            isDarkMode
              ? 'bg-white/5 border-white/10'
              : 'bg-white/80 border-white/30 shadow-xl'
          }`}>
            {/* Header section */}
            <div className="text-center mb-10">
              {/* Logo with premium styling */}
              <div className="relative mx-auto mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-50"></div>
                <div className="relative h-20 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
                  <CheckSquare className="h-10 w-10 text-white" />
                </div>
              </div>

              {/* Premium typography */}
              <div className="space-y-3">
                <h1 className={`text-4xl font-bold bg-clip-text text-transparent ${
                  isDarkMode
                    ? 'bg-gradient-to-r from-white via-blue-100 to-purple-100'
                    : 'bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600'
                }`}>
                  TaskFlow
                </h1>
                <div className={`h-px w-24 mx-auto bg-gradient-to-r from-transparent to-transparent ${
                  isDarkMode ? 'via-white/30' : 'via-gray-400/50'
                }`}></div>
                <p className={`text-lg font-light tracking-wide ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {isRegistering ? 'Join TaskFlow Today' : 'Elevate Your Productivity'}
                </p>
              </div>
            </div>

            {/* Premium form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error display */}
              {error && (
                <div className={`p-4 rounded-2xl border text-sm ${
                  isDarkMode
                    ? 'bg-red-500/10 border-red-500/30 text-red-300'
                    : 'bg-red-50 border-red-200 text-red-600'
                }`}>
                  {error}
                </div>
              )}

              {/* Name field (registration only) */}
              {isRegistering && (
                <div className="group">
                  <label className={`block text-sm font-medium mb-3 tracking-wide ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className={`w-full px-6 py-4 border rounded-2xl backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 ${
                        isDarkMode
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 group-hover:bg-white/10'
                          : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 group-hover:bg-white/90'
                      }`}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              )}

              {/* Email field with luxury styling */}
              <div className="group">
                <label className={`block text-sm font-medium mb-3 tracking-wide ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className={`w-full px-6 py-4 border rounded-2xl backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 ${
                      isDarkMode
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 group-hover:bg-white/10'
                        : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 group-hover:bg-white/90'
                    }`}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <div className='absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
                </div>
              </div>

              {/* Password field with luxury styling */}
              <div className="group">
                <label className={`block text-sm font-medium mb-3 tracking-wide ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`w-full px-6 py-4 pr-14 border rounded-2xl backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 ${
                      isDarkMode
                        ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 group-hover:bg-white/10'
                        : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 group-hover:bg-white/90'
                    }`}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                      isDarkMode
                        ? 'text-gray-400 hover:text-white'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Confirm Password field (registration only) */}
              {isRegistering && (
                <div className="group">
                  <label className={`block text-sm font-medium mb-3 tracking-wide ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Confirm Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      placeholder="Confirm your password"
                      className={`w-full px-6 py-4 border rounded-2xl backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 ${
                        isDarkMode
                          ? 'bg-white/5 border-white/10 text-white placeholder-gray-400 group-hover:bg-white/10'
                          : 'bg-white/70 border-gray-200 text-gray-800 placeholder-gray-500 group-hover:bg-white/90'
                      }`}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              )}

              {/* Premium submit button */}
              <div className="pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group relative w-full py-4 px-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-semibold text-lg tracking-wide shadow-2xl transition-all duration-300 hover:shadow-blue-500/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent mr-3"></div>
                        <span>{isRegistering ? 'Creating your account...' : 'Signing you in...'}</span>
                      </>
                    ) : (
                      <span>{isRegistering ? 'Create Account' : 'Access TaskFlow'}</span>
                    )}
                  </div>
                </button>
              </div>
            </form>

            {/* Premium footer */}
            <div className={`mt-8 pt-6 border-t ${
              isDarkMode ? 'border-white/10' : 'border-gray-200'
            }`}>
              <p className={`text-center text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {isRegistering ? 'Already have an account?' : 'New to TaskFlow?'}{' '}
                <button
                  onClick={toggleAuthMode}
                  className={`font-medium transition-colors duration-200 hover:underline ${
                    isDarkMode
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  {isRegistering ? 'Sign In' : 'Create Account'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced Header
const EnhancedHeader = ({ user, onLogout, isDarkMode, setIsDarkMode, onToggleSidebar, isSidebarOpen }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  return (
    <header className={`backdrop-blur-xl shadow-sm border-b fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
      isDarkMode
        ? 'bg-gray-800/80 border-gray-700/50'
        : 'bg-white/80 border-gray-200/50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Mobile menu button + Logo */}
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            >
              {isSidebarOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center">
              <div className="h-7 w-7 sm:h-8 sm:w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                TaskFlow
              </h1>
            </div>
          </div>

          {/* Center - Search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 lg:mx-8">
            <div className="relative w-full">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Search tasks, projects..."
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Mobile search button */}
            <button
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="md:hidden p-2 rounded-xl text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Search className="h-5 w-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl transition-all ${
                isDarkMode
                  ? 'text-gray-300 hover:text-white hover:bg-gray-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <button className={`relative p-2 rounded-xl transition-all ${
              isDarkMode
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}>
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className={`flex items-center space-x-2 p-2 rounded-xl transition-all ${
                  isDarkMode
                    ? 'hover:bg-gray-700'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-700'
                }`}>{user?.firstName || 'User'}</span>
              </button>

              {showProfileMenu && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-1 z-50 ${
                  isDarkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}>
                  <div className={`px-4 py-2 border-b ${
                    isDarkMode ? 'border-gray-700' : 'border-gray-100'
                  }`}>
                    <div className={`font-medium ${
                      isDarkMode ? 'text-gray-100' : 'text-gray-900'
                    }`}>{user?.firstName} {user?.lastName}</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{user?.email}</div>
                  </div>
                  <button className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                    isDarkMode
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={onLogout}
                    className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                      isDarkMode
                        ? 'text-red-400 hover:bg-gray-700'
                        : 'text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showMobileSearch && (
          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Search tasks, projects..."
                autoFocus
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

// Enhanced Sidebar
const EnhancedSidebar = ({ isDarkMode, isOpen, onClose }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, color: 'from-blue-500 to-blue-600' },
    { name: 'Projects', href: '/projects', icon: FolderOpen, color: 'from-green-500 to-green-600' },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, color: 'from-purple-500 to-purple-600' },
    { name: 'Time Tracking', href: '/time', icon: Clock, color: 'from-orange-500 to-orange-600' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'from-pink-500 to-pink-600' },
  ];

  const handleNavClick = () => {
    // Close sidebar on mobile when navigation item is clicked
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:shadow-sm border-r transition-colors duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Menu</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-md transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                : 'text-gray-400 hover:text-gray-500 hover:bg-gray-100'
            }`}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 pb-4 overflow-y-auto h-full">
          <div className="space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg transform scale-105'
                      : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
              {({ isActive }) => (
                <>
                  <item.icon className={`mr-3 h-5 w-5 ${
                    isActive
                      ? 'text-white'
                      : isDarkMode
                        ? 'text-gray-400'
                        : 'text-gray-400'
                  }`} />
                  {item.name}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};

// Enhanced Dashboard
const EnhancedDashboard = ({ isDarkMode: _isDarkMode }) => {
  const [stats] = useState({
    totalProjects: 12,
    activeTasks: 28,
    completedToday: 5,
    timeToday: 6.5
  });

  const [projects] = useState([
    { id: 1, name: 'Website Redesign', progress: 75, tasks: 12, color: 'from-blue-500 to-blue-600' },
    { id: 2, name: 'Mobile App', progress: 45, tasks: 8, color: 'from-green-500 to-green-600' },
    { id: 3, name: 'Marketing Campaign', progress: 90, tasks: 15, color: 'from-purple-500 to-purple-600' },
  ]);

  const [tasks] = useState([
    { id: 1, title: 'Design homepage mockup', project: 'Website Redesign', priority: 'high', status: 'in-progress' },
    { id: 2, title: 'Set up authentication', project: 'Mobile App', priority: 'medium', status: 'todo' },
    { id: 3, title: 'Write blog post', project: 'Marketing Campaign', priority: 'low', status: 'in-progress' },
  ]);

  const statCards = [
    { name: 'Total Projects', value: stats.totalProjects, icon: FolderOpen, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
    { name: 'Active Tasks', value: stats.activeTasks, icon: AlertCircle, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50' },
    { name: 'Completed Today', value: stats.completedToday, icon: CheckCircle, color: 'from-green-500 to-green-600', bg: 'bg-green-50' },
    { name: 'Hours Today', value: stats.timeToday, icon: Clock, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
    case 'high': return 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white">
        <div className="absolute inset-0 opacity-20"></div>
        <div className="relative">
          <h1 className="text-4xl font-bold mb-2">Good morning! 👋</h1>
          <p className="text-blue-100 text-lg">Ready to tackle your tasks today?</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects and Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Projects */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Recent Projects</h3>
              <Link to="/projects" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{project.name}</h4>
                  <span className="text-sm text-gray-500">{project.tasks} tasks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${project.color}`}
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Active Tasks</h3>
              <Link to="/tasks" className="flex items-center text-blue-600 hover:text-blue-700 font-medium">
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="p-4 border border-gray-100 rounded-xl hover:border-gray-200 transition-all">
                <div className="flex items-start space-x-3">
                  <input type="checkbox" className="mt-1 rounded border-gray-300" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{task.project}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Projects Page Component
const ProjectsPage = ({ isDarkMode }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete redesign of the company website with modern UI/UX',
      status: 'active',
      priority: 'high',
      progress: 75,
      startDate: '2024-01-15',
      endDate: '2024-03-15',
      team: ['John Doe', 'Jane Smith'],
      tasks: 12,
      completedTasks: 9,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Native mobile app for iOS and Android platforms',
      status: 'active',
      priority: 'medium',
      progress: 45,
      startDate: '2024-02-01',
      endDate: '2024-06-01',
      team: ['Mike Johnson', 'Sarah Wilson'],
      tasks: 8,
      completedTasks: 4,
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      description: 'Q2 digital marketing campaign across all channels',
      status: 'completed',
      priority: 'low',
      progress: 100,
      startDate: '2024-01-01',
      endDate: '2024-02-28',
      team: ['Lisa Brown'],
      tasks: 15,
      completedTasks: 15,
      color: 'from-purple-500 to-purple-600'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    priority: 'medium',
    startDate: '',
    endDate: '',
    team: []
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;

    const project = {
      id: Date.now(),
      ...newProject,
      status: 'active',
      progress: 0,
      tasks: 0,
      completedTasks: 0,
      color: 'from-indigo-500 to-indigo-600'
    };

    setProjects([...projects, project]);
    setNewProject({ name: '', description: '', priority: 'medium', startDate: '', endDate: '', team: [] });
    setShowCreateModal(false);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setNewProject({
      name: project.name,
      description: project.description,
      priority: project.priority,
      startDate: project.startDate,
      endDate: project.endDate,
      team: project.team
    });
    setShowCreateModal(true);
  };

  const handleUpdateProject = () => {
    if (!newProject.name.trim()) return;

    setProjects(projects.map(p =>
      p.id === editingProject.id
        ? { ...p, ...newProject }
        : p
    ));

    setEditingProject(null);
    setNewProject({ name: '', description: '', priority: 'medium', startDate: '', endDate: '', team: [] });
    setShowCreateModal(false);
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
    case 'high': return isDarkMode ? 'bg-red-900 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return isDarkMode ? 'bg-yellow-900 text-yellow-200 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return isDarkMode ? 'bg-green-900 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-200';
    default: return isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
    case 'active': return isDarkMode ? 'bg-blue-900 text-blue-200 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed': return isDarkMode ? 'bg-green-900 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-200';
    case 'paused': return isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    default: return isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`p-6 min-h-screen ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Projects</h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Manage your projects and track progress</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Project
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter className={`h-4 w-4 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={`px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="paused">Paused</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className={`rounded-2xl shadow-sm border transition-all hover:shadow-lg ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="p-6">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{project.name}</h3>
                  <p className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{project.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEditProject(project)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProject(project.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      isDarkMode
                        ? 'hover:bg-red-900 text-gray-400 hover:text-red-300'
                        : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                    }`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Status and Priority */}
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(project.priority)}`}>
                  {project.priority} priority
                </span>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Progress</span>
                  <span className={`text-sm ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>{project.progress}%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className={`text-center p-3 rounded-xl ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{project.completedTasks}/{project.tasks}</div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Tasks</div>
                </div>
                <div className={`text-center p-3 rounded-xl ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className={`text-lg font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{project.team.length}</div>
                  <div className={`text-xs ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Team</div>
                </div>
              </div>

              {/* Dates */}
              <div className="flex items-center justify-between text-sm">
                <div className={`flex items-center ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(project.startDate).toLocaleDateString()}
                </div>
                <div className={`flex items-center ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <Target className="h-4 w-4 mr-1" />
                  {new Date(project.endDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {editingProject ? 'Edit Project' : 'Create New Project'}
                </h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingProject(null);
                    setNewProject({ name: '', description: '', priority: 'medium', startDate: '', endDate: '', team: [] });
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Project Name</label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter project name"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Description</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
                    }`}
                    placeholder="Enter project description"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDarkMode
                        ? 'bg-gray-700 border-gray-600 text-white'
                        : 'bg-white border-gray-200 text-gray-900'
                    }`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Start Date</label>
                    <input
                      type="date"
                      value={newProject.startDate}
                      onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>End Date</label>
                    <input
                      type="date"
                      value={newProject.endDate}
                      onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDarkMode
                          ? 'bg-gray-700 border-gray-600 text-white'
                          : 'bg-white border-gray-200 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingProject(null);
                    setNewProject({ name: '', description: '', priority: 'medium', startDate: '', endDate: '', team: [] });
                  }}
                  className={`flex-1 px-4 py-2 border rounded-xl transition-colors ${
                    isDarkMode
                      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={editingProject ? handleUpdateProject : handleCreateProject}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all"
                >
                  {editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Tasks Page Component
const TasksPage = ({ isDarkMode }) => {
  const [tasks] = useState([
    {
      id: 1,
      title: 'Design homepage mockup',
      description: 'Create wireframes and high-fidelity mockups for the new homepage',
      project: 'Website Redesign',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-02-15',
      assignee: 'John Doe',
      tags: ['design', 'ui/ux'],
      timeSpent: 4.5
    },
    {
      id: 2,
      title: 'Set up authentication system',
      description: 'Implement user login, registration, and JWT token management',
      project: 'Mobile App',
      priority: 'medium',
      status: 'todo',
      dueDate: '2024-02-20',
      assignee: 'Jane Smith',
      tags: ['backend', 'security'],
      timeSpent: 0
    },
    {
      id: 3,
      title: 'Write blog post about new features',
      description: 'Create engaging content highlighting the latest product updates',
      project: 'Marketing Campaign',
      priority: 'low',
      status: 'completed',
      dueDate: '2024-02-10',
      assignee: 'Mike Johnson',
      tags: ['content', 'marketing'],
      timeSpent: 2.0
    }
  ]);

  const [, setShowCreateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
    case 'high': return isDarkMode ? 'bg-red-900 text-red-200 border-red-700' : 'bg-red-100 text-red-800 border-red-200';
    case 'medium': return isDarkMode ? 'bg-yellow-900 text-yellow-200 border-yellow-700' : 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low': return isDarkMode ? 'bg-green-900 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-200';
    default: return isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
    case 'todo': return isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    case 'in-progress': return isDarkMode ? 'bg-blue-900 text-blue-200 border-blue-700' : 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed': return isDarkMode ? 'bg-green-900 text-green-200 border-green-700' : 'bg-green-100 text-green-800 border-green-200';
    default: return isDarkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className={`p-6 min-h-screen ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Tasks</h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Manage and track your tasks</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`} />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={`px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          <option value="all">All Status</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className={`px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-700 text-white'
              : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-2xl shadow-sm border transition-all hover:shadow-lg p-6 ${
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className={`text-lg font-semibold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{task.title}</h3>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status.replace('-', ' ')}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className={`text-sm mb-3 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>{task.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className={`flex items-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <FolderOpen className="h-4 w-4 mr-1" />
                    {task.project}
                  </div>
                  <div className={`flex items-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <div className={`flex items-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <User className="h-4 w-4 mr-1" />
                    {task.assignee}
                  </div>
                  <div className={`flex items-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Clock className="h-4 w-4 mr-1" />
                    {task.timeSpent}h
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}>
                  <Edit className="h-4 w-4" />
                </button>
                <button className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? 'hover:bg-red-900 text-gray-400 hover:text-red-300'
                    : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
                }`}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Time Tracking Page Component
const TimeTrackingPage = ({ isDarkMode }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedProject, setSelectedProject] = useState('Website Redesign');
  const [selectedTask, setSelectedTask] = useState('Design homepage mockup');
  const [, setStartTime] = useState(null);

  const [timeEntries, setTimeEntries] = useState([
    { id: 1, project: 'Website Redesign', task: 'Design homepage mockup', duration: 2.5, date: '2024-02-14' },
    { id: 2, project: 'Mobile App', task: 'Set up authentication', duration: 1.5, date: '2024-02-14' },
    { id: 3, project: 'Marketing Campaign', task: 'Write blog post', duration: 2.0, date: '2024-02-13' }
  ]);

  const projects = ['Website Redesign', 'Mobile App', 'Marketing Campaign'];
  const tasks = {
    'Website Redesign': ['Design homepage mockup', 'Develop frontend', 'Test responsive design'],
    'Mobile App': ['Set up authentication', 'Create user interface', 'Implement API integration'],
    'Marketing Campaign': ['Write blog post', 'Create social media content', 'Design promotional materials']
  };

  // Timer functionality with useEffect
  React.useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setCurrentTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isTimerRunning && currentTime !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, currentTime]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    if (!isTimerRunning) {
      setStartTime(Date.now() - currentTime * 1000);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleReset = () => {
    setIsTimerRunning(false);
    setCurrentTime(0);
    setStartTime(null);
  };

  const handleSaveEntry = () => {
    if (currentTime > 0) {
      const newEntry = {
        id: Date.now(),
        project: selectedProject,
        task: selectedTask,
        duration: (currentTime / 3600).toFixed(2),
        date: new Date().toISOString().split('T')[0]
      };
      setTimeEntries([newEntry, ...timeEntries]);
      handleReset();
    }
  };

  return (
    <div className={`p-6 min-h-screen ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Time Tracking</h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Track time spent on projects and tasks</p>
        </div>

        {/* Timer Section */}
        <div className={`rounded-2xl shadow-sm border p-8 mb-8 text-center ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className={`text-6xl font-mono font-bold mb-6 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {formatTime(currentTime)}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <select
              value={selectedProject}
              onChange={(e) => {
                setSelectedProject(e.target.value);
                setSelectedTask(tasks[e.target.value][0]);
              }}
              className={`w-full sm:w-auto px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {projects.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className={`w-full sm:w-auto px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isDarkMode
                  ? 'bg-gray-700 border-gray-600 text-white'
                  : 'bg-white border-gray-200 text-gray-900'
              }`}
            >
              {tasks[selectedProject]?.map(task => (
                <option key={task} value={task}>{task}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleStartPause}
              className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isTimerRunning
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {isTimerRunning ? (
                <><Pause className="h-5 w-5 mr-2" /> Pause</>
              ) : (
                <><Play className="h-5 w-5 mr-2" /> Start</>
              )}
            </button>
            <button
              onClick={handleReset}
              className={`w-full sm:w-auto flex items-center justify-center px-6 py-3 border rounded-xl transition-colors ${
                isDarkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Square className="h-5 w-5 mr-2" />
              Reset
            </button>
            {currentTime > 0 && (
              <button
                onClick={handleSaveEntry}
                className="w-full sm:w-auto flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Save className="h-5 w-5 mr-2" />
                Save Entry
              </button>
            )}
          </div>
        </div>

        {/* Recent Time Entries */}
        <div className={`rounded-2xl shadow-sm border ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="p-6 border-b border-gray-200">
            <h3 className={`text-xl font-semibold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>Recent Time Entries</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {timeEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between py-3">
                  <div>
                    <div className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>{entry.task}</div>
                    <div className={`text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>{entry.project} • {entry.date}</div>
                  </div>
                  <div className={`font-mono font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>{entry.duration}h</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics Page Component
const AnalyticsPage = ({ isDarkMode }) => {
  const stats = {
    totalHours: 156.5,
    completedTasks: 47,
    activeProjects: 3,
    productivity: 85
  };

  return (
    <div className={`p-6 min-h-screen ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="mb-8">
        <h1 className={`text-3xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>Analytics</h1>
        <p className={`mt-2 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>Track your productivity and performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{stats.totalHours}h</div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Total Hours</div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{stats.completedTasks}</div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Completed Tasks</div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{stats.activeProjects}</div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Active Projects</div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <div className={`text-2xl font-bold ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>{stats.productivity}%</div>
              <div className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>Productivity</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Time Distribution</h3>
          <div className={`h-64 flex items-center justify-center border-2 border-dashed rounded-xl ${
            isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
          }`}>
            <div className="text-center">
              <PieChart className="h-12 w-12 mx-auto mb-2" />
              <p>Chart visualization coming soon</p>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-sm border p-6 ${
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Productivity Trends</h3>
          <div className={`h-64 flex items-center justify-center border-2 border-dashed rounded-xl ${
            isDarkMode ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-500'
          }`}>
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2" />
              <p>Chart visualization coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Check for existing user session on app load
  React.useEffect(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    const savedTheme = localStorage.getItem('taskflow_theme');

    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('taskflow_user');
      }
    }

    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('taskflow_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('taskflow_user');
  };

  const handleThemeChange = (darkMode) => {
    setIsDarkMode(darkMode);
    localStorage.setItem('taskflow_theme', darkMode ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return <EnhancedLogin onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? 'bg-gray-900'
          : 'bg-gray-50'
      }`}>
        <EnhancedHeader 
          user={user} 
          onLogout={handleLogout} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={handleThemeChange}
          onToggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
        <div className="flex h-screen pt-16">
          <EnhancedSidebar 
            isDarkMode={isDarkMode} 
            isOpen={isSidebarOpen}
            onClose={closeSidebar}
          />
          <main className="flex-1 overflow-auto lg:ml-0">
            <div className="max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<EnhancedDashboard isDarkMode={isDarkMode} />} />
                <Route path="/projects" element={<ProjectsPage isDarkMode={isDarkMode} />} />
                <Route path="/tasks" element={<TasksPage isDarkMode={isDarkMode} />} />
                <Route path="/time" element={<TimeTrackingPage isDarkMode={isDarkMode} />} />
                <Route path="/analytics" element={<AnalyticsPage isDarkMode={isDarkMode} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
