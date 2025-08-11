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
      case 'ongoing': return 'bg-sky-100 text-sky-800';
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-blue-100 text-blue-900';
      default: return 'bg-slate-100 text-slate-800';
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
    <div className="fixed inset-0 bg-slate-900 bg-opacity-60 z-50 p-0">
      <div className="bg-white h-full w-full flex flex-col max-h-screen overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-3 flex items-center justify-between flex-shrink-0 min-h-[52px] shadow-lg">
          <h2 className="text-lg font-semibold text-white truncate">Servis Detayları</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-3 space-y-3 pb-5">
          {/* Contact Info */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl p-3 border border-blue-200 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">İletişim Bilgileri</h3>
            <div className="space-y-3">
              <button
                onClick={handlePhoneClick}
                className="flex items-center space-x-3 text-blue-700 hover:text-blue-900 bg-white px-4 py-3 rounded-lg border border-blue-200 hover:border-blue-300 hover:shadow-md transition-all w-full justify-start min-h-[48px]"
              >
                <PhoneIcon className="h-5 w-5" />
                <span className="text-base font-semibold break-all">{service.customerPhone || service.phoneNumber}</span>
              </button>
              <div className="flex items-center space-x-3 text-slate-600 bg-white px-4 py-3 rounded-lg border border-slate-200 text-sm min-h-[40px]">
                <CalendarIcon className="h-5 w-5" />
                <span className="break-words font-medium">Tarih: {service.createdAt ? new Date(service.createdAt).toLocaleDateString('tr-TR') : formatDate(service.date || '')}</span>
              </div>
            </div>
          </div>

          {/* Status and Color */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-3 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Durum Bilgileri</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white rounded-lg p-3 min-h-[40px] border border-slate-200">
                <div className="flex items-center space-x-3">
                  <WrenchIcon className="h-5 w-5 text-slate-600" />
                  <span className="text-sm text-slate-600 font-medium">Durum:</span>
                </div>
                <span className={`inline-flex px-3 py-1.5 text-sm font-semibold rounded-full ${getStatusColor(service.status)}`}>
                  {getStatusText(service.status)}
                </span>
              </div>
              <div className="flex items-center justify-between bg-white rounded-lg p-3 min-h-[40px] border border-slate-200">
                <div className="flex items-center space-x-3">
                  <PaletteIcon className="h-5 w-5 text-slate-600" />
                  <span className="text-sm text-slate-600 font-medium">Renk:</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded-md border-2 ${getColorClass(service.color || 'white')}`}></div>
                  <span className="text-sm text-slate-800 font-medium">{getColorName(service.color || 'white')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Address/Description */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-3 border border-emerald-200 shadow-sm">
            <div className="flex items-center space-x-3 mb-3">
              <MapPinIcon className="h-5 w-5 text-slate-600" />
              <h3 className="text-sm font-semibold text-slate-800">Adres ve Açıklama</h3>
            </div>
            <p className="text-sm text-slate-700 bg-white rounded-lg p-3 border border-emerald-200 break-words whitespace-pre-wrap leading-relaxed min-h-[70px] overflow-wrap-anywhere">
              {service.address || service.description}
            </p>
          </div>

          {/* Financial Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 shadow-sm">
            <div className="flex items-center justify-between p-3 cursor-pointer min-h-[48px]" onClick={() => setShowFinancials(!showFinancials)}>
              <div className="flex items-center">
                <DollarSignIcon className="h-5 w-5 mr-3" />
                <h3 className="text-sm font-semibold text-slate-800">Finansal Bilgiler</h3>
              </div>
              <div className="flex items-center space-x-3">
                {showFinancials ? (
                  <EyeOffIcon className="h-5 w-5 text-slate-500" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-slate-500" />
                )}
                {showFinancials ? (
                  <ChevronUpIcon className="h-5 w-5 text-slate-500" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5 text-slate-500" />
                )}
              </div>
            </div>
            
            {showFinancials && (
              <div className="px-3 pb-3 space-y-3 border-t border-blue-200">
                <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="bg-white rounded-lg p-3 border border-green-200 text-center min-h-[55px] flex flex-col justify-center shadow-sm">
                  <div className="text-sm text-slate-500 font-medium">Gelir</div>
                  <div className="font-bold text-green-600 text-sm break-words">{formatCurrency(cost)}</div>
                </div>
                <div className="bg-white rounded-lg p-3 border border-red-200 text-center min-h-[55px] flex flex-col justify-center shadow-sm">
                  <div className="text-sm text-slate-500 font-medium">Gider</div>
                  <div className="font-bold text-red-600 text-sm break-words">{formatCurrency(service.expenses)}</div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 space-y-3 border border-blue-200 text-sm shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Net Kâr:</span>
                  <span className={`font-semibold break-words ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(profit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Kâr Payı (%35):</span>
                  <span className="font-semibold text-orange-600 break-words">{formatCurrency(profitPercentage30)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                  <span className="text-slate-600 font-medium">Kalan Tutar:</span>
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
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-3 border border-purple-200 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Ek Bilgiler</h3>
              {service.partsChanged && (
                <div className="mb-3">
                  <p className="text-sm text-slate-600 mb-2 font-medium">Değiştirilen Parçalar:</p>
                  <p className="text-sm text-slate-700 bg-white rounded-lg p-3 border border-purple-200 break-words whitespace-pre-wrap">
                    {service.partsChanged}
                  </p>
                </div>
              )}
              {service.missingParts && (
                <div>
                  <p className="text-sm text-slate-600 mb-2 font-medium">Eksik Parçalar:</p>
                  <p className="text-sm text-slate-700 bg-white rounded-lg p-3 border border-purple-200 break-words whitespace-pre-wrap">
                    {service.missingParts}
                  </p>
                </div>
              )}
            </div>
          )}
          </div>
        </div>

        {/* Actions - Fixed at bottom */}
        <div className="flex-shrink-0 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-blue-200 p-4 safe-area-inset-bottom shadow-lg">
          <div className="flex space-x-3">
            <button
              onClick={() => onEdit(service)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all text-base font-semibold min-h-[52px] flex items-center justify-center shadow-md hover:shadow-lg"
            >
              Düzenle
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all text-base font-semibold min-h-[52px] flex items-center justify-center shadow-sm hover:shadow-md"
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