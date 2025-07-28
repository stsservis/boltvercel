import React from 'react';
import { WrenchIcon, RefreshCwIcon, PlusIcon } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
      <div className="px-3 py-2">
        {/* Logo and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 py-1.5 rounded-md text-xs font-bold min-w-[28px] text-center shadow-sm">
              STS
            </div>
            <h1 className="text-base font-bold text-gray-900 truncate">Servis Takip</h1>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => {
                // Ensure we're adding a new service, not editing
                const event = new CustomEvent('addNewService');
                window.dispatchEvent(event);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-md hover:from-blue-700 hover:to-blue-800 transition-all duration-200 flex items-center space-x-1.5 text-xs font-medium min-h-[32px] whitespace-nowrap shadow-sm hover:shadow-md"
            >
              <PlusIcon className="h-3.5 w-3.5" />
              <span>Yeni Servis</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;