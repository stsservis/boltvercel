import React, { useState } from 'react';
import { 
  SearchIcon,
  ShareIcon,
  EditIcon,
  TrashIcon,
  XIcon
} from 'lucide-react';
import { ServiceRecord } from '../types';
import { saveServiceOrder } from '../utils/helpers';

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
    red: { bg: 'bg-red-100', border: 'border-l-red-500' },
    orange: { bg: 'bg-orange-100', border: 'border-l-orange-500' },
    yellow: { bg: 'bg-yellow-100', border: 'border-l-yellow-500' },
    green: { bg: 'bg-green-100', border: 'border-l-green-500' },
    blue: { bg: 'bg-blue-100', border: 'border-l-blue-500' },
    purple: { bg: 'bg-purple-100', border: 'border-l-purple-500' },
    pink: { bg: 'bg-pink-100', border: 'border-l-pink-500' },
    gray: { bg: 'bg-gray-100', border: 'border-l-gray-500' },
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
  const [shareModalService, setShareModalService] = useState<ServiceRecord | null>(null);

  // Filter services based on search and status
  const filteredServices = services.filter(service => {
    const phone = service.customerPhone || service.phoneNumber || '';
    const address = service.address || service.description || '';
    const matchesSearch = phone.includes(searchTerm) ||
      address.toLowerCase().includes(searchTerm.toLowerCase());
    
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
    const address = service.address || service.description || '';
    
    // Check if native sharing is supported
    if (navigator.share) {
      navigator.share({
        title: 'Servis Adresi',
        text: address,
      }).catch((error) => {
        console.log('Paylaşım iptal edildi:', error);
      });
    } else {
      // Fallback to custom modal for unsupported browsers
      setShareModalService(service);
    }
  };

  const handleShareToWhatsApp = (service: ServiceRecord) => {
    const address = service.address || service.description || '';
    const phone = service.customerPhone || service.phoneNumber || '';
    const text = encodeURIComponent(`${address}\nTelefon: ${phone}`);
    const whatsappUrl = `https://wa.me/?text=${text}`;
    window.open(whatsappUrl, '_blank');
    setShareModalService(null);
  };

  const handleCopyToClipboard = async (service: ServiceRecord) => {
    const address = service.address || service.description || '';
    const phone = service.customerPhone || service.phoneNumber || '';
    const text = `${address}\nTelefon: ${phone}`;
    
    try {
      await navigator.clipboard.writeText(text);
      alert('Servis bilgileri panoya kopyalandı!');
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Servis bilgileri panoya kopyalandı!');
    }
    setShareModalService(null);
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
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Create a copy of the filtered services for reordering
    const reorderedServices = [...servicesToShow];
    const [draggedService] = reorderedServices.splice(draggedIndex, 1);
    reorderedServices.splice(dropIndex, 0, draggedService);

    // Create a new services array with the reordered filtered services
    const serviceMap = new Map(reorderedServices.map((service, index) => [service.id, { ...service, order: index }]));
    
    const updatedServices = services.map(service => {
      if (serviceMap.has(service.id)) {
        return serviceMap.get(service.id)!;
      }
      return service;
    });

    // Sort by the new order for filtered services, keep others in original position
    const finalServices = updatedServices.sort((a, b) => {
      const aInFiltered = serviceMap.has(a.id);
      const bInFiltered = serviceMap.has(b.id);
      
      if (aInFiltered && bInFiltered) {
        return (a.order || 0) - (b.order || 0);
      }
      if (aInFiltered && !bInFiltered) return -1;
      if (!aInFiltered && bInFiltered) return 1;
      return 0;
    });

    if (onReorderServices) {
      onReorderServices(finalServices);
    }
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <div className="bg-white shadow-sm border-0 border-t border-gray-100 flex flex-col">
      <div className="p-1.5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <h2 className="text-xs font-semibold text-gray-900 truncate">{getStatusTitle()}</h2>
            {statusFilter !== 'all' && (
              <button
                onClick={onBackToAll}
                className="text-xs text-blue-600 hover:text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded-sm whitespace-nowrap"
              >
                ← Geri
              </button>
            )}
          </div>
          <span className="text-xs text-gray-400 whitespace-nowrap">{servicesToShow.length}</span>
        </div>
        
        {statusFilter !== 'all' && (
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Telefon veya adres ara..."
              className="w-full pl-8 pr-2.5 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs min-h-[36px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="divide-y divide-gray-50">
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
              className={`p-1.5 hover:bg-gray-25 transition-all duration-200 border border-gray-100 hover:border-gray-200 rounded-md shadow-sm hover:shadow-sm border-l-3 ${colorClasses.border} ${colorClasses.bg} ${
                isDragging ? 'opacity-50 transform scale-[1.02] shadow-lg z-10' : ''
              } ${servicesToShow.length > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} min-h-[48px] mb-1`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-1.5 flex-1 min-w-0">
                  <div 
                    className="flex-1 min-w-0 py-0"
                    onClick={() => onViewService(service)}
                  >
                    <div className="flex items-center space-x-1.5 mb-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const phone = service.customerPhone || service.phoneNumber || '';
                          handlePhoneClick(phone);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-xs bg-white px-1.5 py-1 rounded-sm border border-blue-200 hover:border-blue-300 transition-all font-medium min-h-[26px] flex items-center shadow-sm"
                      >
                        {service.customerPhone || service.phoneNumber}
                      </button>
                    </div>
                    
                    <div className="min-h-[24px] flex items-start">
                      <p className="text-xs text-gray-600 line-clamp-2 leading-snug break-words overflow-wrap-anywhere">
                      {service.address || service.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-0.5 ml-1 mt-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShareService(service);
                    }}
                    className="p-1 text-gray-400 hover:text-green-600 transition-colors rounded-sm hover:bg-green-50 min-w-[26px] min-h-[26px] flex items-center justify-center"
                  >
                    <ShareIcon className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditService(service);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors rounded-sm hover:bg-blue-50 min-w-[26px] min-h-[26px] flex items-center justify-center"
                  >
                    <EditIcon className="h-3 w-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteService(service.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded-sm hover:bg-red-50 min-w-[26px] min-h-[26px] flex items-center justify-center"
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
        <div className="p-4 text-center text-gray-500 text-sm">
          {searchTerm ? 'Arama sonucuna uygun kayıt bulunamadı' : 'Henüz servis kaydı bulunmuyor'}
        </div>
      )}
      
      {/* Share Modal */}
      {shareModalService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full mx-4">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Paylaş</h3>
                <button
                  onClick={() => setShareModalService(null)}
                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
              <button
                onClick={() => handleShareToWhatsApp(shareModalService)}
                className="w-full flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-all duration-200 min-h-[60px] border border-green-200 hover:border-green-300"
              >
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">WhatsApp</div>
                  <div className="text-sm text-gray-500">WhatsApp'ta paylaş</div>
                </div>
              </button>
              
              <button
                onClick={() => handleCopyToClipboard(shareModalService)}
                className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200 min-h-[60px] border border-blue-200 hover:border-blue-300"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">Kopyala</div>
                  <div className="text-sm text-gray-500">Panoya kopyala</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {statusFilter === 'all' && (
        <div className="p-6 text-center text-gray-500 flex-1 flex flex-col justify-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Kategori Seçin</h3>
          <p className="text-sm text-gray-500 mb-3">
            Servisleri görmek için yukarıdan bir kategori seçin
          </p>
          <p className="text-sm text-blue-600 font-medium">
            Toplam {services.length} servis mevcut
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceListView;