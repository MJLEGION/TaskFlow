import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  FolderOpen, 
  CheckSquare, 
  Clock, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Tasks', href: '/tasks', icon: CheckSquare },
    { name: 'Time Tracking', href: '/time', icon: Clock },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-white shadow-sm h-screen">
      <nav className="mt-5 px-2">
        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-100 text-primary-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon
                className="mr-3 flex-shrink-0 h-6 w-6"
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="space-y-1">
            <NavLink
              to="/settings"
              className="text-gray-600 hover:bg-gray-50 hover:text-gray-900 group flex items-center px-2 py-2 text-sm font-medium rounded-md"
            >
              <Settings className="mr-3 flex-shrink-0 h-6 w-6" />
              Settings
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;