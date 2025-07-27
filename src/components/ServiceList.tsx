import React, { useState } from 'react';
import { SearchIcon, EditIcon, TrashIcon, ShareIcon } from 'lucide-react';
import { ServiceRecord } from '../types';
import { formatCurrency, formatDate, calculateProfit } from '../utils/helpers';

interface ServiceListProps {
  services: ServiceRecord[];
  onEditService: (service: ServiceRecord) => void;
  onDeleteService: (id: string) => void;
}

const getColorClasses = (color: string) => {
  const colorMap: { [key: string]: { bg: string; border: string } } = {
    blue: { bg: 'bg-blue-50', border: 'border-l-blue-400' },
    green: { bg: 'bg-green-50', border: 'border-l-green-400' },
    yellow: { bg: 'bg-yellow-50', border: 'border-l-yellow-400' },
    red: { bg: 'bg-red-50', border: 'border-l-red-400' },
    purple: { bg: 'bg-purple-50', border: 'border-l-purple-400' },
    pink: { bg: 'bg-pink-50', border: 'border-l-pink-400' },
    indigo: { bg: 'bg-indigo-50', border: 'border-l-indigo-400' },
    gray: { bg: 'bg-gray-50', border: 'border-l-gray-400' },
  };
  return colorMap[color] || colorMap.blue;
};

const ServiceList: React.FC<ServiceListProps> = ({
  services,
  onEditService,
  onDeleteService,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ongoing' | 'completed' | 'workshop'>('all');
  
  const filteredServices = services.filter((service) => {
    const matchesSearch = 
      service.phoneNumber.includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handlePhoneClick = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleShareService = (service: ServiceRecord) => {
    const text = encodeURIComponent(service.description);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Servis Kayıtları</h2>
            <span className="text-sm text-gray-500">{filteredServices.length}</span>
          </div>
          
          <div className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Telefon/Açıklama Ara..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">Tüm Kayıtlar</option>
              <option value="ongoing">Devam Edenler</option>
              <option value="workshop">Atölyedekiler</option>
              <option value="completed">Tamamlananlar</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredServices.map((service) => {
            const profit = calculateProfit(service.feeCollected, service.expenses);
            const colorClasses = getColorClasses(service.color || 'blue');
            
            return (
              <div key={service.id} className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${colorClasses.border} ${colorClasses.bg}`}>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <button
                        onClick={() => handlePhoneClick(service.phoneNumber)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        {service.phoneNumber}
                      </button>
                      <span className="text-xs text-gray-500">{formatDate(service.date)}</span>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs">
                      <span className="text-green-600 font-medium">
                        {formatCurrency(service.feeCollected)}
                      </span>
                      <span className={`font-medium ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        Kâr: {formatCurrency(profit)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleShareService(service)}
                      className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                    >
                      <ShareIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEditService(service)}
                      className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <EditIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteService(service.id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredServices.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              {searchTerm 
                ? 'Arama sonucuna uygun kayıt bulunamadı' 
                : 'Henüz servis kaydı bulunmuyor'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceList;