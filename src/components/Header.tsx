import React from 'react';
import { WrenchIcon, RefreshCwIcon, PlusIcon } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-3 py-3">
        {/* Logo and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white px-2 py-1 rounded-md text-xs font-bold">
              STS
            </div>
            <h1 className="text-sm font-semibold text-gray-900">Servis Takip</h1>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onNavigate('newService')}
              className="bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-1 text-xs"
            >
              <PlusIcon className="h-3 w-3" />
              <span>Yeni Servis</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;