import React from 'react';
import { useState } from 'react';
import { ServiceRecord } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { XIcon, PhoneIcon, CalendarIcon, DollarSignIcon, ChevronDownIcon, ChevronUpIcon, MapPinIcon, WrenchIcon, PaletteIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

interface ServiceDetailProps {
  service: ServiceRecord;
  onClose: () => void;
  onEdit: (service: ServiceRecord) => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onClose, onEdit }) => {
  const [showFinancials, setShowFinancials] = useState(false);
  
  const cost = service.cost || service.feeCollected || 0;
  const profit = cost - service.expenses;
  const profitPercentage30 = profit * 0.3;
  const netProfit = profit - profitPercentage30;

  const handlePhoneClick = () => {
    const phone = service.customerPhone || service.phoneNumber || '';
    window.location.href = `tel:${phone}`;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing': return 'Devam Ediyor';
      case 'workshop': return 'Atölyede';
      case 'completed': return 'Tamamlandı';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-yellow-100 text-yellow-800';
      case 'workshop': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getColorName = (color: string) => {
    const colorNames: { [key: string]: string } = {
      white: 'Beyaz',
      red: 'Kırmızı',
      orange: 'Turuncu',
      yellow: 'Sarı',
      green: 'Yeşil',
      blue: 'Mavi',
      purple: 'Mor',
      pink: 'Pembe',
      gray: 'Gri',
    };
    return colorNames[color] || color;
  };

  const getColorClass = (color: string) => {
    const colorClasses: { [key: string]: string } = {
      white: 'bg-white border-gray-300',
      red: 'bg-red-100 border-red-300',
      orange: 'bg-orange-100 border-orange-300',
      yellow: 'bg-yellow-100 border-yellow-300',
      green: 'bg-green-100 border-green-300',
      blue: 'bg-blue-100 border-blue-300',
      purple: 'bg-purple-100 border-purple-300',
      pink: 'bg-pink-100 border-pink-300',
      gray: 'bg-gray-100 border-gray-300',
    };
    return colorClasses[color] || colorClasses.white;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 p-0">
      <div className="bg-white h-full w-full flex flex-col max-h-screen overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 px-3 py-2.5 flex items-center justify-between flex-shrink-0 min-h-[48px]">
          <h2 className="text-base font-semibold text-white truncate">Servis Detayları</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1.5 rounded min-w-[40px] min-h-[40px] flex items-center justify-center"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-2 space-y-2 pb-4">
          {/* Contact Info */}
          <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-200">
            <h3 className="text-xs font-medium text-gray-900 mb-2">İletişim</h3>
            <div className="space-y-2">
              <button
                onClick={handlePhoneClick}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 bg-white px-3 py-2 rounded border border-blue-200 hover:border-blue-300 transition-all w-full justify-start min-h-[44px]"
              >
                <PhoneIcon className="h-4 w-4" />
                <span className="text-sm font-medium break-all">{service.customerPhone || service.phoneNumber}</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-600 bg-white px-3 py-2 rounded text-xs min-h-[36px]">
                <CalendarIcon className="h-4 w-4" />
                <span className="break-words">Tarih: {service.createdAt ? new Date(service.createdAt).toLocaleDateString('tr-TR') : formatDate(service.date || '')}</span>
              </div>
            </div>
          </div>

          {/* Status and Color */}
          <div className="bg-gray-50 rounded-lg p-2.5">
            <h3 className="text-xs font-medium text-gray-900 mb-2">Durum</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between bg-white rounded p-2 min-h-[36px]">
                <div className="flex items-center space-x-2">
                  <WrenchIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-xs text-gray-600">Durum:</span>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
                  {getStatusText(service.status)}
                </span>
              </div>
              <div className="flex items-center justify-between bg-white rounded p-2 min-h-[36px]">
                <div className="flex items-center space-x-2">
                  <PaletteIcon className="h-4 w-4 text-gray-600" />
                  <span className="text-xs text-gray-600">Renk:</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-4 h-4 rounded border ${getColorClass(service.color || 'white')}`}></div>
                  <span className="text-xs text-gray-800">{getColorName(service.color || 'white')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address/Description */}
          <div className="bg-green-50 rounded-lg p-2.5 border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <MapPinIcon className="h-4 w-4 text-gray-600" />
              <h3 className="text-xs font-medium text-gray-900">Adres ve Açıklama</h3>
            </div>
            <p className="text-xs text-gray-700 bg-white rounded p-2.5 border break-words whitespace-pre-wrap leading-relaxed min-h-[60px] overflow-wrap-anywhere">
              {service.address || service.description}
            </p>
          </div>

          {/* Financial Information */}
          <div className="bg-emerald-50 rounded-lg border border-emerald-200">
            <div className="flex items-center justify-between p-2.5 cursor-pointer min-h-[44px]" onClick={() => setShowFinancials(!showFinancials)}>
              <div className="flex items-center">
                <DollarSignIcon className="h-4 w-4 mr-2" />
                <h3 className="text-xs font-medium text-gray-900">Finansal Bilgiler</h3>
              </div>
              <div className="flex items-center space-x-2">
                {showFinancials ? (
                  <EyeOffIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <EyeIcon className="h-4 w-4 text-gray-500" />
                )}
                {showFinancials ? (
                  <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>
            
            {showFinancials && (
              <div className="px-2.5 pb-2.5 space-y-2 border-t border-emerald-200">
                <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="bg-white rounded p-2.5 border border-green-200 text-center min-h-[50px] flex flex-col justify-center">
                  <div className="text-xs text-gray-500">Gelir</div>
                  <div className="font-bold text-green-600 text-xs break-words">{formatCurrency(cost)}</div>
                </div>
                <div className="bg-white rounded p-2.5 border border-red-200 text-center min-h-[50px] flex flex-col justify-center">
                  <div className="text-xs text-gray-500">Gider</div>
                  <div className="font-bold text-red-600 text-xs break-words">{formatCurrency(service.expenses)}</div>
                </div>
              </div>
              
              <div className="bg-white rounded p-2.5 space-y-2 border text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Net Kâr:</span>
                  <span className={`font-medium break-words ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(profit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kâr Payı (%30):</span>
                  <span className="font-medium text-orange-600 break-words">{formatCurrency(profitPercentage30)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-gray-600">Kalan Tutar:</span>
                  <span className={`font-bold break-words ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(netProfit)}
                  </span>
                </div>
              </div>
              </div>
            )}
          </div>

          {/* Legacy Parts - only show if exists */}
          {(service.partsChanged || service.missingParts) && (
            <div className="bg-purple-50 rounded-lg p-2.5 border border-purple-200">
              <h3 className="text-xs font-medium text-gray-900 mb-2">Ek Bilgiler</h3>
              {service.partsChanged && (
                <div className="mb-2">
                  <p className="text-xs text-gray-600 mb-1">Değiştirilen Parçalar:</p>
                  <p className="text-xs text-gray-700 bg-white rounded p-2.5 border break-words whitespace-pre-wrap">
                    {service.partsChanged}
                  </p>
                </div>
              )}
              {service.missingParts && (
                <div>
                  <p className="text-xs text-gray-600 mb-1">Eksik Parçalar:</p>
                  <p className="text-xs text-gray-700 bg-white rounded p-2.5 border break-words whitespace-pre-wrap">
                    {service.missingParts}
                  </p>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex-shrink-0 bg-white border-t border-gray-200 p-3 safe-area-inset-bottom">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(service)}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium min-h-[48px] flex items-center justify-center"
            >
              Düzenle
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium min-h-[48px] flex items-center justify-center"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;