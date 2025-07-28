import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { projectsAPI, tasksAPI, timeAPI } from '../../services/api';
import ProjectCard from './ProjectCard';
import TaskSummary from './TaskSummary';
import { Plus, Clock, CheckCircle, AlertCircle, FolderOpen } from 'lucide-react';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeTasks: 0,
    completedToday: 0,
    timeToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, tasksRes, timeRes] = await Promise.all([
        projectsAPI.getAll(),
        tasksAPI.getAll(),
        timeAPI.getAll()
      ]);

      const projectsData = projectsRes.data;
      const tasksData = tasksRes.data;
      const timeData = timeRes.data;

      setProjects(projectsData.slice(0, 6)); // Show recent projects
      setTasks(tasksData.filter(task => task.status !== 'completed').slice(0, 5));

      // Calculate stats
      const today = new Date().toDateString();
      const completedToday = tasksData.filter(
        task => task.completedAt && new Date(task.completedAt).toDateString() === today
      ).length;

      const timeToday = timeData
        .filter(entry => new Date(entry.startTime).toDateString() === today)
        .reduce((total, entry) => total + (entry.duration || 0), 0);

      setStats({
        totalProjects: projectsData.length,
        activeTasks: tasksData.filter(task => task.status !== 'completed').length,
        completedToday,
        timeToday: Math.round(timeToday / 3600) // Convert to hours
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      name: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderOpen,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Tasks',
      value: stats.activeTasks,
      icon: AlertCircle,
      color: 'bg-yellow-500'
    },
    {
      name: 'Completed Today',
      value: stats.completedToday,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      name: 'Hours Today',
      value: stats.timeToday,
      icon: Clock,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-4 sm:p-6 text-white">
        <h1 className="text-2xl sm:text-3xl font-bold">Welcome back!</h1>
        <p className="mt-2 text-sm sm:text-base text-primary-100">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200">
            <div className="p-3 sm:p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`${stat.color} rounded-md p-2 sm:p-3`}>
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div className="ml-3 sm:ml-5 w-0 flex-1 min-w-0">
                  <dl>
                    <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                      {stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Projects and Tasks Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Projects */}
        <div className="bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Projects</h3>
              <Link
                to="/projects"
                className="text-primary-600 hover:text-primary-500 text-xs sm:text-sm font-medium transition-colors duration-200"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} compact />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <FolderOpen className="h-full w-full" />
                </div>
                <p className="text-sm sm:text-base text-gray-500 mb-4">No projects yet</p>
                <Link
                  to="/projects"
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors duration-200"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Create your first project
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white shadow rounded-lg hover:shadow-md transition-shadow duration-200">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-medium text-gray-900">Active Tasks</h3>
              <Link
                to="/tasks"
                className="text-primary-600 hover:text-primary-500 text-xs sm:text-sm font-medium transition-colors duration-200"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-4 sm:p-6">
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskSummary key={task.id} task={task} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                  <CheckCircle className="h-full w-full" />
                </div>
                <p className="text-sm sm:text-base text-gray-500 mb-4">No active tasks</p>
                <Link
                  to="/projects"
                  className="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-md text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors duration-200"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Add a task
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
