/**
 * Format a date to a readable string
 * @param {Date|string} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  try {
    if (!date) return 'Invalid Date';
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    return 'Invalid Date';
  }
};

/**
 * Validate email address format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length (default: 100)
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || typeof text !== 'string') return '';

  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength) + '...';
};

/**
 * Generate a random ID
 * @returns {string} Random alphanumeric ID
 */
export const generateId = () => {
  return Math.random().toString(36).substring(2, 15);
};

/**
 * Format time duration in minutes to human readable format
 * @param {number} minutes - Duration in minutes
 * @returns {string} Formatted duration
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes < 0) return '0m';

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;

  return `${hours}h ${mins}m`;
};

/**
 * Get priority color class
 * @param {string} priority - Priority level (low, medium, high)
 * @returns {string} CSS class for priority color
 */
export const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
  case 'high':
    return 'text-red-600 bg-red-100';
  case 'medium':
    return 'text-yellow-600 bg-yellow-100';
  case 'low':
    return 'text-green-600 bg-green-100';
  default:
    return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Get status color class
 * @param {string} status - Task status
 * @returns {string} CSS class for status color
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
  case 'completed':
    return 'text-green-600 bg-green-100';
  case 'in progress':
    return 'text-blue-600 bg-blue-100';
  case 'todo':
    return 'text-gray-600 bg-gray-100';
  default:
    return 'text-gray-600 bg-gray-100';
  }
};

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
