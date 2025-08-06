import React from 'react';
import { WrenchIcon, RefreshCwIcon, PlusIcon } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  return (
    <header className="bg-gradient-to-r from-sky-500 to-blue-900 shimmer rounded-xl shadow-lg border-b border-blue-800 flex-shrink-0 mx-2 mt-2">
      <div className="px-3 py-2">
        {/* Logo and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-lg text-sm font-extrabold min-w-[32px] text-center shadow-md">
              STS
            </div>
            <h1 className="text-lg font-extrabold text-white truncate">Servis Takip</h1>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => {
                // Ensure we're adding a new service, not editing
                const event = new CustomEvent('addNewService');
                window.dispatchEvent(event);
              }}
              className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white px-4 py-2.5 rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 flex items-center space-x-2 text-sm font-semibold min-h-[36px] whitespace-nowrap shadow-lg hover:shadow-xl"
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