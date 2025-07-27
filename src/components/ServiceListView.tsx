import React, { useState } from 'react';
import { 
  SearchIcon,
  ShareIcon,
  EditIcon,
  TrashIcon,
  GripVerticalIcon
} from 'lucide-react';
import { ServiceRecord } from '../types';

interface ServiceListViewProps {
  services: ServiceRecord[];
  statusFilter: 'all' | 'ongoing' | 'workshop' | 'completed';
  onEditService: (service: ServiceRecord) => void;
  onDeleteService: (id: string) => void;
  onViewService: (service: ServiceRecord) => void;
  onReorderServices?: (reorderedServices: ServiceRecord[]) => void;
  onBackToAll: () => void;
}

const getColorClasses = (color: string) => {
  const colorMap: { [key: string]: { bg: string; border: string } } = {
    white: { bg: 'bg-white', border: 'border-l-gray-400' },
    yellow: { bg: 'bg-yellow-100', border: 'border-l-yellow-500' },
    green: { bg: 'bg-green-100', border: 'border-l-green-500' },
    gray: { bg: 'bg-gray-100', border: 'border-l-gray-500' },
    red: { bg: 'bg-red-100', border: 'border-l-red-500' },
  };
  return colorMap[color] || colorMap.white;
};

const ServiceListView: React.FC<ServiceListViewProps> = ({ 
  services,
  statusFilter,
  onEditService,
  onDeleteService,
  onViewService,
  onReorderServices,
  onBackToAll
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Filter services based on search and status
  const filteredServices = services.filter(service => {
    const matchesSearch = service.phoneNumber.includes(searchTerm) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Show services only when a status is selected (not 'all')
  const servicesToShow = statusFilter === 'all' ? [] : filteredServices;

  const getStatusTitle = () => {
    switch (statusFilter) {
      case 'ongoing': return 'Devam Eden Servisler';
      case 'workshop': return 'Atölyedeki Servisler';
      case 'completed': return 'Tamamlanan Servisler';
      default: return 'Servis Listesi';
    }
  };

  const handlePhoneClick = (phoneNumber: string) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleShareService = (service: ServiceRecord) => {
    const text = encodeURIComponent(service.description);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex || !onReorderServices) {
      setDraggedIndex(null);
      return;
    }

    // Create a copy of the current filtered services
    const reorderedServices = [...servicesToShow];
    const [draggedItem] = reorderedServices.splice(draggedIndex, 1);
    reorderedServices.splice(dropIndex, 0, draggedItem);
    
    // Update the main services array with new order
    const updatedServices = services.map(service => {
      const newIndex = reorderedServices.findIndex(item => item.id === service.id);
      if (newIndex !== -1) {
        return { ...reorderedServices[newIndex] };
      }
      return service;
    });
    
    onReorderServices(updatedServices);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-2 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h2 className="text-sm font-semibold text-gray-900">{getStatusTitle()}</h2>
            {statusFilter !== 'all' && (
              <button
                onClick={onBackToAll}
                className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-2 py-1 rounded"
              >
                ← Geri
              </button>
            )}
          </div>
          <span className="text-xs text-gray-500">{servicesToShow.length}</span>
        </div>
        
        {statusFilter !== 'all' && (
          <div className="relative">
            <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
            <input
              type="text"
              placeholder="Telefon veya adres ara..."
              className="w-full pl-7 pr-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto min-h-[100px]">
        {servicesToShow.map((service, index) => {
          const colorClasses = getColorClasses(service.color || 'blue');
          const isDragging = draggedIndex === index;
          
          return (
            <div 
              key={service.id}
              draggable={servicesToShow.length > 1}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`p-3 hover:bg-white hover:shadow-sm transition-all duration-200 border-l-4 ${colorClasses.border} ${colorClasses.bg} ${
                isDragging ? 'opacity-50 transform scale-105 shadow-lg z-10' : ''
              } ${servicesToShow.length > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2 flex-1 min-w-0">
                  {servicesToShow.length > 1 && (
                    <div className="mt-1 opacity-60 hover:opacity-100 transition-opacity">
                      <GripVerticalIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                  
                  <div 
                    className="flex-1 min-w-0"
                    onClick={() => onViewService(service)}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePhoneClick(service.phoneNumber);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs bg-white px-2 py-0.5 rounded border border-blue-200 hover:border-blue-300 transition-all"
                      >
                        {service.phoneNumber}
                      </button>
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareService(service);
                    }}
                    className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded hover:bg-green-50"
                  >
                    <ShareIcon className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditService(service);
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded hover:bg-blue-50"
                  >
                    <EditIcon className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteService(service.id);
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
        
      {servicesToShow.length === 0 && statusFilter !== 'all' && (
        <div className="p-6 text-center text-gray-500 text-sm">
          {searchTerm ? 'Arama sonucuna uygun kayıt bulunamadı' : 'Henüz servis kaydı bulunmuyor'}
        </div>
      )}
      
      {statusFilter === 'all' && (
        <div className="p-4 text-center text-gray-500 text-xs">
          Servis kategorilerinden birini seçin
        </div>
      )}
    </div>
  );
};

export default ServiceListView;