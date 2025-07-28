import React from 'react';
import { WrenchIcon, RefreshCwIcon, PlusIcon } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  return (
    <header className="bg-white shadow-md border-b border-gray-200 flex-shrink-0">
      <div className="px-4 py-3">
        {/* Logo and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg text-sm font-bold min-w-[36px] text-center shadow-md">
              STS
            </div>
            <h1 className="text-lg font-bold text-gray-900 truncate">Servis Takip</h1>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => {
                // Ensure we're adding a new service, not editing
                const event = new CustomEvent('addNewService');
                window.dispatchEvent(event);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-2 text-sm font-medium min-h-[40px] whitespace-nowrap shadow-md hover:shadow-lg"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Yeni Servis</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;