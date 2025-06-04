import React from 'react';
import { Bell, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onToggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
            <Bell size={20} />
          </button>
          <div className="flex items-center cursor-pointer">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-700" />
            </div>
            <ChevronDown size={16} className="ml-1 text-gray-500" />
          </div>
        </div>
      </div>
    </header>
  );
};