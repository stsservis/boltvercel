import React from 'react';
import { PlusIcon } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  return ( 
    <div className="px-2 py-0.5">
      <header className="header-custom header-style-bg min-h-[50px]">
        <div className="moving-bg" aria-hidden="true"></div>
        <div className="header-content-wrapper">
          {/* Sol: STS Servis Takip */}
          <div className="brand-text">STS Servis Takip</div>

          {/* Sağ: + Yeni Servis Butonu */}
          <button
            onClick={() => {
              // Ensure we're adding a new service, not editing
              const event = new CustomEvent('addNewService');
              window.dispatchEvent(event);
            }}
            className="header-button"
          >
            + Yeni Servis
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;