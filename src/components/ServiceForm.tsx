import React, { useState, useEffect } from 'react';
import { ServiceRecord } from '../types';
import { generateId, formatCurrency } from '../utils/helpers';

interface ServiceFormProps {
  service?: ServiceRecord;
  onSave: (service: ServiceRecord) => void;
  onCancel: () => void;
}

const colorOptions = [
  { value: 'white', label: 'Beyaz', class: 'bg-white border-gray-300' },
  { value: 'yellow', label: 'Sarı', class: 'bg-yellow-100 border-yellow-300' },
  { value: 'green', label: 'Yeşil', class: 'bg-green-100 border-green-300' },
  { value: 'gray', label: 'Gri', class: 'bg-gray-100 border-gray-300' },
  { value: 'red', label: 'Kırmızı', class: 'bg-red-100 border-red-300' },
];

const ServiceForm: React.FC<ServiceFormProps> = ({
  service,
  onSave,
  onCancel,
}) => {
  const today = new Date().toISOString().split('T')[0];
  
  const [formData, setFormData] = useState<ServiceRecord>({
    id: '',
    customerPhone: '',
    address: '',
    color: 'white',
    cost: 0,
    expenses: 0,
    status: 'ongoing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Format phone number from +90 to 0 format
  const formatPhoneNumber = (phone: string): string => {
    // Only remove spaces and some special characters, keep letters and numbers
    let cleaned = phone.replace(/[\s\-\(\)]/g, '');
    
    // If starts with +90, replace with 0
    if (cleaned.startsWith('+90')) {
      cleaned = '0' + cleaned.substring(3);
    }
    
    return cleaned;
  };
  
  useEffect(() => {
    if (service) {
      setFormData({
        ...service,
        // Migrate legacy fields if they exist
        customerPhone: service.customerPhone || service.phoneNumber || '',
        address: service.address || service.description || '',
        cost: service.cost || service.feeCollected || 0,
        updatedAt: new Date().toISOString(),
      });
    } else {
      // Always reset form completely when no service is provided (new service)
      const newId = generateId();
      setFormData({
        id: newId,
        customerPhone: '',
        address: '',
        color: 'white',
        cost: 0,
        expenses: 0,
        status: 'ongoing',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }, [service]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    
    // Format phone number if it's the customerPhone field
    if (name === 'customerPhone') {
      processedValue = formatPhoneNumber(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'cost' || name === 'expenses'
        ? parseFloat(processedValue) || 0 
        : processedValue,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
  };

  const profit = formData.cost - formData.expenses;
  const profitPercentage30 = profit * 0.3;
  const netProfit = profit - profitPercentage30;

  return (
    <div className="px-2 py-2 h-full overflow-y-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden max-w-full">
        {/* Header */}
        <div className="bg-blue-600 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-white truncate">
              Servis Kaydını Düzenle
            </h2>
            <button
              onClick={onCancel}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1.5 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-blue-100 text-xs mt-1">
            Servis kaydını güncellemek için aşağıdaki formu kullanın.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-3 space-y-3 pb-20">
          {/* Description - Moved to top */}
          <div>
            <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-1">
              Adres *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={4}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none min-h-[80px]"
              placeholder="Müşteri adresi..."
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="customerPhone" className="block text-xs font-medium text-gray-700 mb-1">
              Telefon Numarası *
            </label>
            <input
              type="text"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[44px]"
              placeholder="05XX XXX XX XX"
            />
          </div>

          {/* Service Date - Moved after phone number */}
          <div>
            <label htmlFor="serviceDate" className="block text-xs font-medium text-gray-700 mb-1">
              Servis Tarihi
            </label>
            <input
              type="date"
              id="serviceDate"
              name="serviceDate"
              value={formData.createdAt ? formData.createdAt.split('T')[0] : new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                const selectedDate = e.target.value;
                const dateTime = new Date(selectedDate + 'T' + new Date().toTimeString().split(' ')[0]).toISOString();
                setFormData(prev => ({
                  ...prev,
                  createdAt: dateTime,
                  updatedAt: new Date().toISOString(),
                }));
              }}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[44px]"
            />
          </div>

          {/* Status, Color */}
          <div className="space-y-3">
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-1">
                Durum
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[44px]"
              >
                <option value="ongoing">Devam Edenler</option>
                <option value="workshop">Atölyede</option>
                <option value="completed">Tamamlanan</option>
              </select>
            </div>

            <div>
              <label htmlFor="color" className="block text-xs font-medium text-gray-700 mb-1">
                Renk
              </label>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`p-2 rounded-lg border-2 transition-all min-h-[60px] ${color.class} ${
                      formData.color === color.value 
                        ? 'ring-2 ring-blue-500 ring-offset-2 border-blue-400' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={color.label}
                  >
                    <div className="w-full h-4 rounded flex items-center justify-center mb-1">
                      {formData.color === color.value && (
                        <svg className="w-3 h-3 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-600 block leading-tight">{color.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Finansal Bilgiler</h3>
            
            <div className="space-y-3 mb-4">
              <div>
                <label htmlFor="cost" className="block text-xs font-medium text-gray-700 mb-1">
                  Alınan Ücret (TL)
                </label>
                <input
                  type="number"
                  id="cost"
                  name="cost"
                  value={formData.cost || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[44px]"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="expenses" className="block text-xs font-medium text-gray-700 mb-1">
                  Yapılan Gider (TL)
                </label>
                <input
                  type="number"
                  id="expenses"
                  name="expenses"
                  value={formData.expenses || ''}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm min-h-[44px]"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Profit Calculations */}
            <div className="bg-white rounded-lg p-3 space-y-2">
              <h4 className="font-medium text-gray-900 text-xs">Kâr Hesaplaması</h4>
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Alınan Ücret:</span>
                  <span className="font-medium text-green-600 break-words">{formatCurrency(formData.cost)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Yapılan Gider:</span>
                  <span className="font-medium text-red-600 break-words">{formatCurrency(formData.expenses)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-gray-600">Net Kâr:</span>
                  <span className={`font-medium break-words ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(profit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kar Payı (%30):</span>
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
          </div>

          {/* Form Actions */}
          <div className="flex space-x-2 pt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm min-h-[48px] flex items-center justify-center"
            >
              Güncelle
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm min-h-[48px] flex items-center justify-center"
            >
              İptal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;