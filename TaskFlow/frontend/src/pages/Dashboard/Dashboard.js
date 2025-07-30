/**
 * @fileoverview Main Dashboard Page Component
 * @author TaskFlow Team
 * @version 1.0.0
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckSquare,
  Clock,
  Users,
  TrendingUp,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { useProjectApi, useTaskApi } from '../../hooks/useApi';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

/**
 * Stats Card Component
 */
const StatsCard = ({ title, value, icon: Icon, color, trend, isDarkMode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-6 rounded-xl border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } hover:shadow-lg transition-shadow`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium ${
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {title}
        </p>
        <p className={`text-2xl font-bold mt-1 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          {value}
        </p>
        {trend && (
          <div className="flex items-center mt-2">
            <TrendingUp className={`h-4 w-4 mr-1 ${
              trend > 0 ? 'text-green-500' : 'text-red-500'
            }`} />
            <span className={`text-sm ${
              trend > 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {trend > 0 ? '+' : ''}{trend}%
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
    </div>
  </motion.div>
);

/**
 * Quick Actions Component
 */
const QuickActions = ({ isDarkMode }) => {
  const actions = [
    { label: 'New Task', icon: CheckSquare, color: 'bg-blue-500' },
    { label: 'New Project', icon: Users, color: 'bg-green-500' },
    { label: 'Time Entry', icon: Clock, color: 'bg-purple-500' },
    { label: 'Schedule Meeting', icon: Calendar, color: 'bg-orange-500' },
  ];

  return (
    <div className={`p-6 rounded-xl border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <h3 className={`text-lg font-semibold mb-4 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Quick Actions
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
              isDarkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-50 text-gray-700'
            }`}
          >
            <div className={`p-2 rounded ${action.color}`}>
              <action.icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Recent Activity Component
 */
const RecentActivity = ({ isDarkMode }) => {
  const activities = [
    {
      id: 1,
      type: 'task_completed',
      message: 'Completed "Design homepage mockup"',
      time: '2 hours ago',
      user: 'You',
    },
    {
      id: 2,
      type: 'project_created',
      message: 'Created new project "Mobile App Redesign"',
      time: '4 hours ago',
      user: 'John Doe',
    },
    {
      id: 3,
      type: 'comment_added',
      message: 'Added comment to "API Integration"',
      time: '6 hours ago',
      user: 'Jane Smith',
    },
  ];

  return (
    <div className={`p-6 rounded-xl border ${
      isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Recent Activity
        </h3>
        <button className="text-blue-500 hover:text-blue-600 text-sm font-medium">
          View All
        </button>
      </div>
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <span className="font-medium">{activity.user}</span>{' '}
                {activity.message}
              </p>
              <p className={`text-xs mt-1 ${
                isDarkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Main Dashboard Component
 */
const Dashboard = () => {
  const { state } = useApp();
  const { isDarkMode, user } = state;
  const { getProjects } = useProjectApi();
  const { getTasks } = useTaskApi();
  
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    activeProjects: 0,
    teamMembers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Load projects and tasks data
        const [projectsData, tasksData] = await Promise.all([
          getProjects(),
          getTasks(),
        ]);

        // Calculate stats
        const completedTasks = tasksData?.filter(task => task.status === 'completed').length || 0;
        const activeProjects = projectsData?.filter(project => project.status === 'active').length || 0;

        setStats({
          totalTasks: tasksData?.length || 0,
          completedTasks,
          activeProjects,
          teamMembers: 12, // This would come from team API
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [getProjects, getTasks]);

  if (loading) {
    return <LoadingSpinner type="page" message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-3xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className={`mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Here's what's happening with your projects today.
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
          <Plus className="h-4 w-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={CheckSquare}
          color="bg-blue-500"
          trend={12}
          isDarkMode={isDarkMode}
        />
        <StatsCard
          title="Completed"
          value={stats.completedTasks}
          icon={CheckSquare}
          color="bg-green-500"
          trend={8}
          isDarkMode={isDarkMode}
        />
        <StatsCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={Users}
          color="bg-purple-500"
          trend={-2}
          isDarkMode={isDarkMode}
        />
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          icon={Users}
          color="bg-orange-500"
          trend={5}
          isDarkMode={isDarkMode}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <QuickActions isDarkMode={isDarkMode} />
        
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className={`p-6 rounded-xl border ${
        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Upcoming Deadlines
          </h3>
          <button className="flex items-center space-x-1 text-blue-500 hover:text-blue-600 text-sm font-medium">
            <span>View Calendar</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <AlertCircle className={`h-12 w-12 mx-auto mb-3 ${
              isDarkMode ? 'text-gray-600' : 'text-gray-400'
            }`} />
            <p className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              No upcoming deadlines
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;