import React, { useState } from 'react';
import { 
  ClockIcon, 
  WrenchIcon,
  CheckCircleIcon
} from 'lucide-react';
import { ServiceRecord } from '../types';
import { calculateDashboardStats } from '../utils/helpers';

interface DashboardProps {
  services: ServiceRecord[];
  missingParts: string[];
  onAddMissingPart: (missingPart: string) => void;
  onRemoveMissingPart: (index: number) => void;
  currentPage: string;
  statusFilter: 'all' | 'ongoing' | 'workshop' | 'completed';
  onStatusCardClick: (status: 'ongoing' | 'workshop' | 'completed') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  services, 
  missingParts, 
  onAddMissingPart, 
  onRemoveMissingPart,
  currentPage,
  statusFilter,
  onStatusCardClick
}) => {
  const stats = calculateDashboardStats(services);

  // Get ongoing services
  const ongoingServices = services.filter(service => service.status === 'ongoing');
  const workshopServices = services.filter(service => service.status === 'workshop');
  const completedServices = services.filter(service => service.status === 'completed');

  return (
    <div className="px-4 py-0.5 space-y-0.5">
      {/* Status Cards with Unified Background */} 
      <div className="header-style-bg dashboard-nav-bg rounded-xl shadow-lg relative overflow-hidden">
        <div className="grid grid-cols-3 gap-0 p-0.5 relative z-10">
          <button 
            onClick={() => onStatusCardClick('ongoing')}
            className={`relative py-2 px-1 rounded-lg font-medium text-xs transition-all duration-300 whitespace-nowrap text-center min-h-[50px] flex flex-col items-center justify-center ${
              statusFilter === 'ongoing' 
                ? 'bg-gradient-to-br from-white/10 to-white/5 text-yellow-200 shadow-md border border-white/30'
                : 'text-yellow-400 hover:text-yellow-200 hover:bg-white/10 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center space-y-0">
              <ClockIcon className="h-3.5 w-3.5" />
              <span className="leading-tight">Devam Edenler</span>
              <span className="text-xs font-bold">{ongoingServices.length}</span>
            </div>
          </button>

          <button 
            onClick={() => onStatusCardClick('workshop')}
            className={`relative py-2 px-1 rounded-lg font-medium text-xs transition-all duration-300 whitespace-nowrap text-center min-h-[50px] flex flex-col items-center justify-center ${
              statusFilter === 'workshop' 
                ? 'bg-gradient-to-br from-white/10 to-white/5 text-orange-200 shadow-md border border-white/30'
                : 'text-orange-400 hover:text-orange-200 hover:bg-white/10 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center space-y-0">
              <WrenchIcon className="h-3.5 w-3.5" />
              <span className="leading-tight">Atölyede</span>
              <span className="text-xs font-bold">{workshopServices.length}</span>
            </div>
          </button>

          <button 
            onClick={() => onStatusCardClick('completed')}
            className={`relative py-2 px-1 rounded-lg font-medium text-xs transition-all duration-300 whitespace-nowrap text-center min-h-[50px] flex flex-col items-center justify-center ${
              statusFilter === 'completed' 
                ? 'bg-gradient-to-br from-white/10 to-white/5 text-green-200 shadow-md border border-white/30'
                : 'text-green-400 hover:text-green-200 hover:bg-white/10 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center space-y-0">
              <CheckCircleIcon className="h-3.5 w-3.5" />
              <span className="leading-tight">Tamamlanan</span>
              <span className="text-xs font-bold">{completedServices.length}</span>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="header-style-bg dashboard-nav-bg rounded-xl shadow-lg relative overflow-hidden">
        <div className="grid grid-cols-4 gap-0 p-0.5 relative z-10">
          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'dashboard' });
              window.dispatchEvent(event);
            }}
            className={`relative py-2 px-1 rounded-lg font-medium text-xs transition-all duration-300 whitespace-nowrap text-center min-h-[50px] flex flex-col items-center justify-center ${
              currentPage === 'dashboard'
                ? 'bg-gradient-to-br from-white/10 to-white/5 text-white shadow-md border border-white/30'
                : 'text-white/70 hover:text-white hover:bg-white/10 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center space-y-0">
              <WrenchIcon className="h-3.5 w-3.5" />
              <span className="leading-tight">Servisler</span>
            </div>
          </button>

          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'notes' });
              window.dispatchEvent(event);
            }}
            className={`relative py-2 px-1 rounded-lg font-medium text-xs transition-all duration-300 whitespace-nowrap text-center min-h-[50px] flex flex-col items-center justify-center ${
              currentPage === 'notes'
                ? 'bg-gradient-to-br from-white/10 to-white/5 text-white shadow-md border border-white/30'
                : 'text-white/70 hover:text-white hover:bg-white/10 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center space-y-0">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="leading-tight">Notlar</span>
            </div>
          </button>

          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'reports' });
              window.dispatchEvent(event);
            }}
            className={`relative py-2 px-1 rounded-lg font-medium text-xs transition-all duration-300 whitespace-nowrap text-center min-h-[50px] flex flex-col items-center justify-center ${
              currentPage === 'reports'
                ? 'bg-gradient-to-br from-white/10 to-white/5 text-white shadow-md border border-white/30'
                : 'text-white/70 hover:text-white hover:bg-white/10 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center space-y-0">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="leading-tight">Raporlar</span>
            </div>
          </button>

          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'backup' });
              window.dispatchEvent(event);
            }}
            className={`relative py-2 px-1 rounded-lg font-medium text-xs transition-all duration-300 whitespace-nowrap text-center min-h-[50px] flex flex-col items-center justify-center ${
              currentPage === 'backup'
                ? 'bg-gradient-to-br from-white/10 to-white/5 text-white shadow-md border border-white/30'
                : 'text-white/70 hover:text-white hover:bg-white/10 hover:shadow-sm'
            }`}
          >
            <div className="flex flex-col items-center space-y-0">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <span className="leading-tight">Yedek</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;