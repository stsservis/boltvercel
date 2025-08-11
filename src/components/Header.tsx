import React from 'react';
import { WrenchIcon, PlusIcon, SparklesIcon } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  return (
    <div className="px-2 pt-2">
      <header className="bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 shadow-lg border-2 border-blue-200/80 flex-shrink-0 relative overflow-hidden rounded-xl">
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5 z-0"></div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23e0e7ff%22 fill-opacity=%220.1%22%3E%3Cpath d=%22M15 25l5-5 5 5-5 5-5-5zm10 0l5-5 5 5-5 5-5-5z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30 z-0"></div>
      
      {/* Enhanced Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer z-10 rounded-xl"></div>
      
      <div className="relative px-4 py-3 z-20">
        {/* Logo and Actions */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Premium Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur-sm opacity-30"></div>
              <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-3 py-2 rounded-xl text-sm font-bold min-w-[36px] text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-xl"></div>
                <span className="relative">STS</span>
              </div>
              <SparklesIcon className="absolute -top-1 -right-1 h-3 w-3 text-yellow-400 animate-pulse" />
            </div>
            
            {/* Premium Title */}
            <div className="flex flex-col">
              <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent truncate leading-tight">
                Servis Takip
              </h1>
            </div>
          </div>

          {/* Premium New Service Button */}
          <div className="flex items-center">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              
              <button
                onClick={() => {
                  // Ensure we're adding a new service, not editing
                  const event = new CustomEvent('addNewService');
                  window.dispatchEvent(event);
                }}
                className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 transition-all duration-300 flex items-center space-x-2 text-sm font-semibold min-h-[44px] whitespace-nowrap shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent rounded-xl"></div>
                
                {/* Button content */}
                <div className="relative flex items-center space-x-2">
                  <div className="bg-white/20 rounded-lg p-1">
                    <PlusIcon className="h-4 w-4" />
                  </div>
                  <span className="font-semibold">Yeni Servis</span>
                </div>
                
                {/* Subtle animation dot */}
                <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse opacity-80"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      </header>
    </div>
  );
};

export default Header;