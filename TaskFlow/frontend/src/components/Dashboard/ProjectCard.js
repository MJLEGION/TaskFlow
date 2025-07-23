import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';

const ProjectCard = ({ project, compact = false }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (compact) {
    return (
      <Link 
        to={`/projects/${project.id}`}
        className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {project.name}
            </h4>
            <p className="text-xs text-gray-500 truncate mt-1">
              {project.description}
            </p>
          </div>
          <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>
        <div className="mt-2 flex items-center text-xs text-gray-500">
          <Calendar className="h-3 w-3 mr-1" />
          {formatDate(project.dueDate)}
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <Link 
              to={`/projects/${project.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
            >
              {project.name}
            </Link>
            <p className="text-gray-600 mt-1 line-clamp-2">
              {project.description || 'No description available'}
            </p>
          </div>
          <span className={`ml-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Due: {formatDate(project.dueDate)}</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>{project.tasksCount || 0} tasks</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>{project.membersCount || 1} members</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{project.timeSpent || 0}h logged</span>
          </div>
        </div>

        {project.progress !== undefined && (
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;