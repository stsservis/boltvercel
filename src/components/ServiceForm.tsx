import React, { useState, useEffect } from 'react';
import { ServiceRecord } from '../types';
import { generateId, formatCurrency, formatPhoneNumberForStorage, extractPhoneFromText } from '../utils/helpers';

const STS_TEMP_SERVICE_FORM_DATA = 'sts_temp_service_form_data';

interface ServiceFormProps {
  service?: ServiceRecord;
  onSave: (service: ServiceRecord) => void;
  onCancel: () => void;
}

const colorOptions = [
  { value: 'white', label: 'Beyaz', class: 'bg-white border-gray-300', bgClass: 'bg-white', borderClass: 'border-l-gray-400' },
  { value: 'red', label: 'Kırmızı', class: 'bg-red-100 border-red-300', bgClass: 'bg-red-100', borderClass: 'border-l-red-500' },
  { value: 'orange', label: 'Turuncu', class: 'bg-orange-100 border-orange-300', bgClass: 'bg-orange-100', borderClass: 'border-l-orange-500' },
  { value: 'yellow', label: 'Sarı', class: 'bg-yellow-100 border-yellow-300', bgClass: 'bg-yellow-100', borderClass: 'border-l-yellow-500' },
  { value: 'green', label: 'Yeşil', class: 'bg-green-100 border-green-300', bgClass: 'bg-green-100', borderClass: 'border-l-green-500' },
  { value: 'blue', label: 'Mavi', class: 'bg-blue-100 border-blue-300', bgClass: 'bg-blue-100', borderClass: 'border-l-blue-500' },
  { value: 'purple', label: 'Mor', class: 'bg-purple-100 border-purple-300', bgClass: 'bg-purple-100', borderClass: 'border-l-purple-500' },
  { value: 'pink', label: 'Pembe', class: 'bg-pink-100 border-pink-300', bgClass: 'bg-pink-100', borderClass: 'border-l-pink-500' },
  { value: 'gray', label: 'Gri', class: 'bg-gray-100 border-gray-300', bgClass: 'bg-gray-100', borderClass: 'border-l-gray-500' },
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
    rawCustomerPhoneInput: '',
    address: '',
    color: 'white',
    cost: 0,
    expenses: 0,
    status: 'ongoing',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    phoneNumberNote: '',
  });
  
  const [displayPhoneNumber, setDisplayPhoneNumber] = useState('');

  useEffect(() => {
    if (service) {
      const originalPhone = service.rawCustomerPhoneInput || service.customerPhone || service.phoneNumber || '';
      setFormData({
        ...service,
        // Migrate legacy fields if they exist
        customerPhone: formatPhoneNumberForStorage(originalPhone),
        rawCustomerPhoneInput: service.rawCustomerPhoneInput || service.customerPhone || service.phoneNumber || '',
        address: service.address || service.description || '',
        cost: service.cost || service.feeCollected || 0,
        phoneNumberNote: service.phoneNumberNote || '',
        updatedAt: new Date().toISOString(),
      });
      setDisplayPhoneNumber(originalPhone);
    } else {
      // Check for temporary form data when creating a new service
      try {
        const tempData = localStorage.getItem(STS_TEMP_SERVICE_FORM_DATA);
        if (tempData) {
          const parsedData = JSON.parse(tempData);
          const tempPhone = parsedData.displayPhoneNumber || parsedData.rawCustomerPhoneInput || parsedData.customerPhone || '';
          setFormData({
            ...parsedData,
            customerPhone: formatPhoneNumberForStorage(tempPhone),
            rawCustomerPhoneInput: parsedData.rawCustomerPhoneInput || tempPhone,
            phoneNumberNote: parsedData.phoneNumberNote || '',
            updatedAt: new Date().toISOString(),
          });
          setDisplayPhoneNumber(tempPhone);
        } else {
          // Always reset form completely when no service is provided (new service)
          const newId = generateId();
          setFormData({
            id: newId,
            customerPhone: '',
            rawCustomerPhoneInput: '',
            address: '',
            color: 'white',
            cost: 0,
            expenses: 0,
            status: 'ongoing',
            phoneNumberNote: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          setDisplayPhoneNumber('');
        }
      } catch (error) {
        console.error('Failed to load temporary form data:', error);
        // Fallback to empty form
        const newId = generateId();
        setFormData({
          id: newId,
          customerPhone: '',
          rawCustomerPhoneInput: '',
          address: '',
          color: 'white',
          cost: 0,
          expenses: 0,
          status: 'ongoing',
          phoneNumberNote: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        setDisplayPhoneNumber('');
      }
    }
  }, [service]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    let processedValue = value;
    let updatedFormData = { ...formData };
    
    // Format phone number if it's the customerPhone field
    if (name === 'customerPhone') {
      setDisplayPhoneNumber(value); // Store raw input for display
      const extractedPhone = extractPhoneFromText(value);
      updatedFormData.customerPhone = extractedPhone;
      updatedFormData.rawCustomerPhoneInput = value; // Store raw input
      updatedFormData.updatedAt = new Date().toISOString();
    } else {
      updatedFormData[name] = name === 'cost' || name === 'expenses'
        ? parseFloat(processedValue) || 0 
        : processedValue;
      updatedFormData.updatedAt = new Date().toISOString();
    }
    
    setFormData(updatedFormData);
    
    // Save form data to localStorage for persistence (only for new services)
    if (!service) {
      try {
        const dataToSave = {
          ...updatedFormData,
          rawCustomerPhoneInput: name === 'customerPhone' ? value : updatedFormData.rawCustomerPhoneInput,
          displayPhoneNumber: name === 'customerPhone' ? value : displayPhoneNumber,
        };
        localStorage.setItem(STS_TEMP_SERVICE_FORM_DATA, JSON.stringify(dataToSave));
      } catch (error) {
        console.error('Failed to save temporary form data:', error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
    
    // Clear temporary form data after successful save
    try {
      localStorage.removeItem(STS_TEMP_SERVICE_FORM_DATA);
    } catch (error) {
      console.error('Failed to clear temporary form data:', error);
    }
  };

  const handleCancel = () => {
    // Clear temporary form data when canceling
    try {
      localStorage.removeItem(STS_TEMP_SERVICE_FORM_DATA);
    } catch (error) {
      console.error('Failed to clear temporary form data:', error);
    }
    onCancel();
  };

  const profit = formData.cost - formData.expenses;
  const profitPercentage30 = profit * 0.3;
  const netProfit = profit - profitPercentage30;

  return (
    <div className="px-1.5 py-1.5 h-full overflow-y-auto">
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden max-w-full">
        {/* Header */}
        <div className="bg-blue-600 px-2.5 py-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white truncate">
              Servis Kaydını Düzenle
            </h2>
            <button
              onClick={handleCancel}
              className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-md transition-colors min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-2 space-y-2 pb-16">
          {/* Description - Moved to top */}
          <div>
            <label htmlFor="address" className="block text-xs font-medium text-gray-700 mb-0.5">
              Adres *
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              required
              className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs resize-none min-h-[60px]"
              placeholder="Müşteri adresi..."
            />
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="customerPhone" className="block text-xs font-medium text-gray-700 mb-0.5">
              Telefon Numarası *
            </label>
            <input
              type="text"
              id="customerPhone"
              name="customerPhone"
              value={displayPhoneNumber}
              onChange={handleChange}
              required
              className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs min-h-[36px]"
              placeholder="05XX XXX XX XX veya +90 5XX XXX XX XX (karakter ve sembol kullanabilirsiniz)"
            />
          </div>

          {/* Service Date - Moved after phone number */}
          <div>
            <label htmlFor="serviceDate" className="block text-xs font-medium text-gray-700 mb-0.5">
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
              className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs min-h-[36px]"
            />
          </div>

          {/* Status, Color */}
          <div className="space-y-2">
            <div>
              <label htmlFor="status" className="block text-xs font-medium text-gray-700 mb-0.5">
                Durum
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs min-h-[36px]"
              >
                <option value="ongoing">Devam Edenler</option>
                <option value="workshop">Atölyede</option>
                <option value="completed">Tamamlanan</option>
              </select>
            </div>

            <div>
              <label htmlFor="color" className="block text-xs font-medium text-gray-700 mb-0.5">
                Renk
              </label>
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs min-h-[36px]"
              >
                {colorOptions.map(color => (
                  <option key={color.value} value={color.value}>{color.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Financial Information */}
          <div className="bg-gray-50 rounded-md p-2">
            <h3 className="text-xs font-medium text-gray-900 mb-2">Finansal Bilgiler</h3>
            
            <div className="space-y-2 mb-2">
              <div>
                <label htmlFor="cost" className="block text-xs font-medium text-gray-700 mb-0.5">
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
                  className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs min-h-[36px]"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label htmlFor="expenses" className="block text-xs font-medium text-gray-700 mb-0.5">
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
                  className="w-full px-2.5 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs min-h-[36px]"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Profit Calculations */}
            <div className="bg-white rounded-md p-2 space-y-1.5">
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
                <div className="flex justify-between items-center border-t pt-1.5">
                  <span className="text-gray-600">Net Kâr:</span>
                  <span className={`font-medium break-words ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(profit)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Kar Payı (%35):</span>
                  <span className="font-medium text-orange-600 break-words">{formatCurrency(profitPercentage30)}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-1.5">
                  <span className="text-gray-600">Kalan Tutar:</span>
                  <span className={`font-bold break-words ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(netProfit)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex space-x-1.5 pt-1.5">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2.5 px-3 rounded-md hover:bg-blue-700 transition-colors font-medium text-xs min-h-[40px] flex items-center justify-center"
            >
              Güncelle
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-3 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors font-medium text-xs min-h-[40px] flex items-center justify-center"
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