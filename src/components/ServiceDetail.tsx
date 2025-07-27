import React from 'react';
import { useState } from 'react';
import { ServiceRecord } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { XIcon, PhoneIcon, CalendarIcon, DollarSignIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

interface ServiceDetailProps {
  service: ServiceRecord;
  onClose: () => void;
  onEdit: (service: ServiceRecord) => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onClose, onEdit }) => {
  const [showCalculations, setShowCalculations] = useState(false);
  
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-blue-600 px-4 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Servis Detayları</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Contact Info */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-900 mb-2">İletişim Bilgileri</h3>
            <div className="space-y-2">
              <button
                onClick={handlePhoneClick}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <PhoneIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{service.customerPhone || service.phoneNumber}</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-600">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm">{service.createdAt ? new Date(service.createdAt).toLocaleDateString('tr-TR') : formatDate(service.date || '')}</span>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Durum</h3>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(service.status)}`}>
              {getStatusText(service.status)}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Adres</h3>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 break-words whitespace-pre-wrap word-wrap break-word overflow-hidden">
              {service.address || service.description}
            </p>
          </div>

          {/* Legacy Parts Changed - only show if exists */}
          {service.partsChanged && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">Değiştirilen Parçalar</h3>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 break-words whitespace-pre-wrap word-wrap break-word overflow-hidden">
                {service.partsChanged}
              </p>
            </div>
          )}

          {/* Financial Information */}
          <div className="bg-blue-50 rounded-lg p-3">
            <button
              onClick={() => setShowCalculations(!showCalculations)}
              className="w-full text-sm font-medium text-gray-900 mb-3 flex items-center justify-between hover:text-blue-600 transition-colors"
            >
              <div className="flex items-center">
                <DollarSignIcon className="h-4 w-4 mr-1" />
                Hesap
              </div>
              {showCalculations ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
            </button>
            
            {showCalculations && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Alınan Ücret:</span>
                  <span className="font-medium text-green-600">{formatCurrency(cost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Yapılan Gider:</span>
                  <span className="font-medium text-red-600">{formatCurrency(service.expenses)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-gray-600">Net Kâr:</span>
                  <span className={`font-medium ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(profit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kâr Payı (%30):</span>
                  <span className="font-medium text-orange-600">{formatCurrency(profitPercentage30)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-gray-600">Kalan Tutar:</span>
                  <span className={`font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(netProfit)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => onEdit(service)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Düzenle
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
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