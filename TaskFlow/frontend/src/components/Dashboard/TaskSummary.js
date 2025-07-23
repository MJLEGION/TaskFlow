import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle, Calendar } from 'lucide-react';

const TaskSummary = ({ task }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < -1) return `${Math.abs(diffDays)} days overdue`;
    if (diffDays > 1) return `${diffDays} days left`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all duration-200">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {getStatusIcon(task.status)}
        <div className="flex-1 min-w-0">
          <Link 
            to={`/tasks/${task.id}`}
            className="text-sm font-medium text-gray-900 hover:text-primary-600 transition-colors block truncate"
          >
            {task.title}
          </Link>
          {task.project && (
            <p className="text-xs text-gray-500 truncate">
              {task.project.name}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2 ml-4">
        {task.priority && (
          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
            {task.priority.toUpperCase()}
          </span>
        )}
        
        {task.dueDate && (
          <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600' : 'text-gray-500'}`}>
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(task.dueDate)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSummary;