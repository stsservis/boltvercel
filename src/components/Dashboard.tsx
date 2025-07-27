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
    <div className="px-4 pt-4 pb-2 space-y-4 flex-shrink-0 bg-gray-50">
      {/* Compact Status Cards */}
      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => onStatusCardClick('ongoing')}
          className={`bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-3 text-white transition-all ${
            statusFilter === 'ongoing' ? 'ring-2 ring-yellow-300 ring-offset-2' : 'hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium opacity-90">Devam Edenler</h3>
              <p className="text-xl font-bold">{ongoingServices.length}</p>
            </div>
            <ClockIcon className="h-6 w-6 opacity-80" />
          </div>
        </button>

        <button 
          onClick={() => onStatusCardClick('workshop')}
          className={`bg-gradient-to-r from-orange-500 to-red-500 rounded-lg p-3 text-white transition-all ${
            statusFilter === 'workshop' ? 'ring-2 ring-orange-300 ring-offset-2' : 'hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium opacity-90">Atölyede</h3>
              <p className="text-xl font-bold">{workshopServices.length}</p>
            </div>
            <WrenchIcon className="h-6 w-6 opacity-80" />
          </div>
        </button>

        <button 
          onClick={() => onStatusCardClick('completed')}
          className={`bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg p-3 text-white transition-all ${
            statusFilter === 'completed' ? 'ring-2 ring-green-300 ring-offset-2' : 'hover:shadow-lg'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-medium opacity-90">Tamamlanan</h3>
              <p className="text-xl font-bold">{completedServices.length}</p>
            </div>
            <CheckCircleIcon className="h-6 w-6 opacity-80" />
          </div>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'dashboard' });
              window.dispatchEvent(event);
            }}
            className={`py-1.5 px-2 border-b-2 font-medium text-xs transition-colors whitespace-nowrap text-center ${
              currentPage === 'dashboard'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <WrenchIcon className="h-3 w-3" />
              <span>Servisler</span>
            </div>
          </button>

          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'notes' });
              window.dispatchEvent(event);
            }}
            className={`py-1.5 px-2 border-b-2 font-medium text-xs transition-colors whitespace-nowrap text-center ${
              currentPage === 'notes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Notlar</span>
            </div>
          </button>

          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'reports' });
              window.dispatchEvent(event);
            }}
            className={`py-1.5 px-2 border-b-2 font-medium text-xs transition-colors whitespace-nowrap text-center ${
              currentPage === 'reports'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Raporlar</span>
            </div>
          </button>

          <button
            onClick={() => {
              const event = new CustomEvent('navigate', { detail: 'backup' });
              window.dispatchEvent(event);
            }}
            className={`py-1.5 px-2 border-b-2 font-medium text-xs transition-colors whitespace-nowrap text-center ${
              currentPage === 'backup'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-center space-x-1">
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              </svg>
              <span>Yedek</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;