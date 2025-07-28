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
    <div className="px-2 pt-2 pb-1.5 space-y-1.5">
      {/* Compact Status Cards */}
      <div className="grid grid-cols-3 gap-1">
        <button 
          onClick={() => onStatusCardClick('ongoing')}
          className={`bg-gradient-to-br from-yellow-400 to-yellow-600 shimmer rounded-md p-2 text-white transition-all duration-200 min-h-[50px] shadow-sm hover:shadow-md ${
            statusFilter === 'ongoing' ? 'ring-2 ring-yellow-300 ring-offset-2 scale-105' : 'hover:scale-105'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium opacity-90 leading-tight">Devam Edenler</h3>
              <p className="text-base font-bold">{ongoingServices.length}</p>
            </div>
            <ClockIcon className="h-4 w-4 opacity-80" />
          </div>
        </button>

        <button 
          onClick={() => onStatusCardClick('workshop')}
          className={`bg-gradient-to-br from-orange-400 to-orange-600 shimmer rounded-md p-2 text-white transition-all duration-200 min-h-[50px] shadow-sm hover:shadow-md ${
            statusFilter === 'workshop' ? 'ring-2 ring-orange-300 ring-offset-2 scale-105' : 'hover:scale-105'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium opacity-90 leading-tight">Atölyede</h3>
              <p className="text-base font-bold">{workshopServices.length}</p>
            </div>
            <WrenchIcon className="h-4 w-4 opacity-80" />
          </div>
        </button>

        <button 
          onClick={() => onStatusCardClick('completed')}
          className={`bg-gradient-to-br from-green-400 to-green-600 shimmer rounded-md p-2 text-white transition-all duration-200 min-h-[50px] shadow-sm hover:shadow-md ${
            statusFilter === 'completed' ? 'ring-2 ring-green-300 ring-offset-2 scale-105' : 'hover:scale-105'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium opacity-90 leading-tight">Tamamlanan</h3>
              <p className="text-base font-bold">{completedServices.length}</p>
            </div>
            <CheckCircleIcon className="h-4 w-4 opacity-80" />
          </div>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-md shadow-sm border border-gray-200">
        <div className="grid grid-cols-4 gap-0.5 p-1">
          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'dashboard' });
              window.dispatchEvent(event);
            }}
            className={`py-1.5 px-1 rounded-sm font-medium text-xs transition-all duration-200 whitespace-nowrap text-center min-h-[32px] flex flex-col items-center justify-center ${
              currentPage === 'dashboard'
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
            className={`py-1.5 px-1 rounded-sm font-medium text-xs transition-all duration-200 whitespace-nowrap text-center min-h-[32px] flex flex-col items-center justify-center ${
              currentPage === 'notes'
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
            className={`py-1.5 px-1 rounded-sm font-medium text-xs transition-all duration-200 whitespace-nowrap text-center min-h-[32px] flex flex-col items-center justify-center ${
              currentPage === 'reports'
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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
            className={`py-1.5 px-1 rounded-sm font-medium text-xs transition-all duration-200 whitespace-nowrap text-center min-h-[32px] flex flex-col items-center justify-center ${
              currentPage === 'backup'
                ? 'bg-blue-50 text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
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