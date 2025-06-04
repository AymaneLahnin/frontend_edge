import React from 'react';
import { Search, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search here..."
          className="bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-4 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-72"
          onChange={handleInputChange}
        />
      </div>
      
      <div className="flex items-center">
        <span className="text-gray-700 mr-2">Virtual Machines</span>
        <button className="bg-white border border-gray-300 rounded-md p-1">
          <ChevronDown size={16} />
        </button>
      </div>
    </div>
  );
};