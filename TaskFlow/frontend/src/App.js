import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, Link } from 'react-router-dom';
import { 
  Bell, Search, User, LogOut, Settings, Clock, CheckCircle, AlertCircle, 
  FolderOpen, Home, CheckSquare, BarChart3, ArrowRight, Eye, EyeOff
} from 'lucide-react';
import './App.css';

// Enhanced Login Component
const EnhancedLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({ firstName: 'Demo', lastName: 'User', email: formData.email });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      {/* Main container */}
      <div className="max-w-lg w-full relative z-10">
        {/* Premium glass card */}
        <div className="relative">
          {/* Outer glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
          
          {/* Main card */}
          <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl border border-white/10">
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
                <p className="text-gray-300 text-lg font-light tracking-wide">Elevate Your Productivity</p>
              </div>
            </div>

            {/* Premium form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Email field with luxury styling */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 tracking-wide">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

              {/* Password field with luxury styling */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-3 tracking-wide">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="w-full px-6 py-4 pr-14 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              </div>

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
                        <span>Signing you in...</span>
                      </>
                    ) : (
                      <span>Access TaskFlow</span>
                    )}
                  </div>
                </button>
              </div>
            </form>

            {/* Premium footer */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-center text-gray-400 text-sm">
                New to TaskFlow?{' '}
                <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200 hover:underline">
                  Create Account
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
const EnhancedHeader = ({ user, onLogout }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>

          <div className="flex-1 max-w-lg mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Search tasks, projects..."
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-xl transition-all"
              >
                <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{user?.firstName || 'User'}</span>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</div>
                    <div className="text-sm text-gray-500">{user?.email}</div>
                  </div>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </button>
                  <button
                    onClick={onLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Enhanced Sidebar
const EnhancedSidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, color: 'from-blue-500 to-blue-600' },
    { name: 'Projects', href: '/projects', icon: FolderOpen, color: 'from-green-500 to-green-600' },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare, color: 'from-purple-500 to-purple-600' },
    { name: 'Time Tracking', href: '/time', icon: Clock, color: 'from-orange-500 to-orange-600' },
    { name: 'Analytics', href: '/analytics', icon: BarChart3, color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <div className="w-64 bg-white shadow-sm h-screen border-r border-gray-200">
      <nav className="mt-6 px-3">
        <div className="space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-gradient-to-r ' + item.color + ' text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
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
const EnhancedDashboard = () => {
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

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  if (!isAuthenticated) {
    return <EnhancedLogin onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <EnhancedHeader user={user} onLogout={handleLogout} />
        <div className="flex">
          <EnhancedSidebar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<EnhancedDashboard />} />
              <Route path="/projects" element={<div className="p-6"><h1 className="text-2xl font-bold">Projects Page</h1></div>} />
              <Route path="/tasks" element={<div className="p-6"><h1 className="text-2xl font-bold">Tasks Page</h1></div>} />
              <Route path="/time" element={<div className="p-6"><h1 className="text-2xl font-bold">Time Tracking Page</h1></div>} />
              <Route path="/analytics" element={<div className="p-6"><h1 className="text-2xl font-bold">Analytics Page</h1></div>} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;