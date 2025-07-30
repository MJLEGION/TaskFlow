/**
 * @fileoverview Advanced Search Component with filters
 * @author TaskFlow Team
 * @version 1.0.0
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, Filter, X, Calendar } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

/**
 * Filter options configuration
 */
const FILTER_OPTIONS = {
  priority: [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' },
  ],
  status: [
    { value: 'all', label: 'All Status' },
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'review', label: 'In Review' },
    { value: 'completed', label: 'Completed' },
  ],
  dateRange: [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' },
  ],
};

/**
 * Filter Select Component
 */
const FilterSelect = ({ label, value, options, onChange, isDarkMode }) => (
  <div>
    <label className={`block text-sm font-medium mb-2 ${
      isDarkMode ? 'text-gray-300' : 'text-gray-700'
    }`}>
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        isDarkMode
          ? 'bg-gray-700 border-gray-600 text-white'
          : 'bg-white border-gray-200 text-gray-900'
      }`}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

/**
 * Date Range Picker Component
 */
const DateRangePicker = ({ startDate, endDate, onChange, isDarkMode }) => (
  <div className="grid grid-cols-2 gap-2">
    <div>
      <label className={`block text-xs font-medium mb-1 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        From
      </label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => onChange('startDate', e.target.value)}
        className={`w-full px-2 py-1 text-sm rounded border ${
          isDarkMode
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      />
    </div>
    <div>
      <label className={`block text-xs font-medium mb-1 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        To
      </label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => onChange('endDate', e.target.value)}
        className={`w-full px-2 py-1 text-sm rounded border ${
          isDarkMode
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-200 text-gray-900'
        }`}
      />
    </div>
  </div>
);

/**
 * Main Advanced Search Component
 */
const AdvancedSearch = ({ onSearch, placeholder = "Search tasks, projects..." }) => {
  const { state, actions } = useApp();
  const { isDarkMode, searchTerm, filters } = state;
  
  const [isOpen, setIsOpen] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localFilters, setLocalFilters] = useState(filters);
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  // Memoized active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (localFilters.priority !== 'all') count++;
    if (localFilters.status !== 'all') count++;
    if (localFilters.dateRange !== 'all') count++;
    return count;
  }, [localFilters]);

  const handleSearchTermChange = useCallback((value) => {
    setLocalSearchTerm(value);
    actions.setSearchTerm(value);
  }, [actions]);

  const handleFilterChange = useCallback((filterType, value) => {
    const newFilters = { ...localFilters, [filterType]: value };
    setLocalFilters(newFilters);
    actions.setFilters(newFilters);
  }, [localFilters, actions]);

  const handleDateRangeChange = useCallback((field, value) => {
    setCustomDateRange(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSearch = useCallback(() => {
    const searchData = {
      term: localSearchTerm,
      filters: localFilters,
      ...(localFilters.dateRange === 'custom' && customDateRange),
    };
    
    if (onSearch) {
      onSearch(searchData);
    }
    
    setIsOpen(false);
  }, [localSearchTerm, localFilters, customDateRange, onSearch]);

  const handleReset = useCallback(() => {
    const resetFilters = {
      priority: 'all',
      status: 'all',
      assignee: 'all',
      dateRange: 'all'
    };
    
    setLocalSearchTerm('');
    setLocalFilters(resetFilters);
    setCustomDateRange({ startDate: '', endDate: '' });
    
    actions.setSearchTerm('');
    actions.setFilters(resetFilters);
    
    if (onSearch) {
      onSearch({ term: '', filters: resetFilters });
    }
  }, [actions, onSearch]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        {/* Search Input */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={localSearchTerm}
            onChange={(e) => handleSearchTermChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isDarkMode
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
            }`}
            onKeyPress={handleKeyPress}
          />
          {localSearchTerm && (
            <button
              onClick={() => handleSearchTermChange('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative p-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          } ${activeFiltersCount > 0 ? 'ring-2 ring-blue-500' : ''}`}
          aria-label="Advanced filters"
        >
          <Filter className="h-4 w-4" />
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Filter Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className={`absolute right-0 mt-2 w-80 max-w-sm rounded-xl shadow-lg border z-50 p-4 ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Advanced Filters
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded hover:bg-gray-100 ${
                    isDarkMode ? 'hover:bg-gray-700' : ''
                  }`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Priority Filter */}
                <FilterSelect
                  label="Priority"
                  value={localFilters.priority}
                  options={FILTER_OPTIONS.priority}
                  onChange={(value) => handleFilterChange('priority', value)}
                  isDarkMode={isDarkMode}
                />

                {/* Status Filter */}
                <FilterSelect
                  label="Status"
                  value={localFilters.status}
                  options={FILTER_OPTIONS.status}
                  onChange={(value) => handleFilterChange('status', value)}
                  isDarkMode={isDarkMode}
                />

                {/* Date Range Filter */}
                <FilterSelect
                  label="Date Range"
                  value={localFilters.dateRange}
                  options={FILTER_OPTIONS.dateRange}
                  onChange={(value) => handleFilterChange('dateRange', value)}
                  isDarkMode={isDarkMode}
                />

                {/* Custom Date Range */}
                {localFilters.dateRange === 'custom' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <DateRangePicker
                      startDate={customDateRange.startDate}
                      endDate={customDateRange.endDate}
                      onChange={handleDateRangeChange}
                      isDarkMode={isDarkMode}
                    />
                  </motion.div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <button
                    onClick={handleSearch}
                    className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Apply Filters
                  </button>
                  <button
                    onClick={handleReset}
                    className={`px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                      isDarkMode
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch;