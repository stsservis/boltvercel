import React, { useState } from 'react';
import { ServiceRecord } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ChevronUpIcon, ChevronDownIcon, GripVerticalIcon } from 'lucide-react';
import { saveServiceOrder } from '../utils/helpers';

interface ReportsProps {
  services: ServiceRecord[];
  onViewService: (service: ServiceRecord) => void;
  onReorderServices?: (reorderedServices: ServiceRecord[]) => void;
}

export default function Reports({ services, onViewService, onReorderServices }: ReportsProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showYearlyStats, setShowYearlyStats] = useState(false);
  const [showMonthlyDetails, setShowMonthlyDetails] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Filter services by selected month and year
  const filteredServices = services.filter(service => {
    const serviceDate = service.createdAt ? new Date(service.createdAt) : new Date(service.date || '');
    return service.status === 'completed' &&
           serviceDate.getMonth() + 1 === selectedMonth && 
           serviceDate.getFullYear() === selectedYear;
  });

  // Filter yearly services
  const yearlyServices = services.filter(service => {
    const serviceDate = service.createdAt ? new Date(service.createdAt) : new Date(service.date || '');
    return service.status === 'completed' &&
           serviceDate.getFullYear() === selectedYear;
  });

  // Calculate monthly financial data
  const monthlyRevenue = filteredServices.reduce((sum, service) => sum + (service.cost || service.feeCollected || 0), 0);
  const monthlyExpenses = filteredServices.reduce((sum, service) => sum + service.expenses, 0);
  const monthlyNetProfit = monthlyRevenue - monthlyExpenses;
  const monthlyProfitShare = monthlyNetProfit * 0.3;
  const monthlyRemaining = monthlyNetProfit - monthlyProfitShare;

  // Calculate yearly financial data
  const yearlyRevenue = yearlyServices.reduce((sum, service) => sum + (service.cost || service.feeCollected || 0), 0);
  const yearlyExpenses = yearlyServices.reduce((sum, service) => sum + service.expenses, 0);
  const yearlyNetProfit = yearlyRevenue - yearlyExpenses;
  const yearlyProfitShare = yearlyNetProfit * 0.3;
  const yearlyRemaining = yearlyNetProfit - yearlyProfitShare;

  const months = [
    { value: 1, label: 'Ocak' },
    { value: 2, label: 'Şubat' },
    { value: 3, label: 'Mart' },
    { value: 4, label: 'Nisan' },
    { value: 5, label: 'Mayıs' },
    { value: 6, label: 'Haziran' },
    { value: 7, label: 'Temmuz' },
    { value: 8, label: 'Ağustos' },
    { value: 9, label: 'Eylül' },
    { value: 10, label: 'Ekim' },
    { value: 11, label: 'Kasım' },
    { value: 12, label: 'Aralık' }
  ];

  const years = [2023, 2024, 2025, 2026];

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
    const reorderedServices = [...filteredServices];
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
    <div className="p-2 pb-0 space-y-2 bg-gray-50 h-full overflow-y-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-2">
        <h1 className="text-sm font-bold text-gray-900 mb-2">Rapor Dönemi</h1>
        
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Ay</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Yıl</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-2 py-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
            >
              {years.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Monthly Financial Summary */}
      <div className="bg-white rounded-lg shadow-sm p-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold text-gray-900">
            {months.find(m => m.value === selectedMonth)?.label} {selectedYear} - {filteredServices.length} servis
          </h2>
          <button
            onClick={() => setShowMonthlyDetails(!showMonthlyDetails)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showMonthlyDetails ? 'Gizle' : 'Detay'}
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-1 text-xs mb-2">
          <div className="text-center p-1.5 bg-green-50 rounded">
            <div className="font-medium text-green-600">{formatCurrency(monthlyRevenue)}</div>
            <div className="text-gray-500 text-xs">Gelir</div>
          </div>
          <div className="text-center p-1.5 bg-red-50 rounded">
            <div className="font-medium text-red-600">{formatCurrency(monthlyExpenses)}</div>
            <div className="text-gray-500 text-xs">Gider</div>
          </div>
          <div className="text-center p-1.5 bg-blue-50 rounded">
            <div className="font-medium text-blue-600">{formatCurrency(monthlyNetProfit)}</div>
            <div className="text-gray-500 text-xs">Kâr</div>
          </div>
        </div>

        {showMonthlyDetails && (
          <div className="bg-gray-50 rounded p-2 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Kâr Payı (%30):</span>
              <span className="font-medium text-orange-600">{formatCurrency(monthlyProfitShare)}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="text-gray-600">Kalan Tutar:</span>
              <span className={`font-bold ${monthlyRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(monthlyRemaining)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Yearly Summary - Collapsible */}
      <div className="bg-white rounded-lg shadow-sm p-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-900">
            {selectedYear} Yıllık Özet - {yearlyServices.length} servis
          </h3>
          <button
            onClick={() => setShowYearlyStats(!showYearlyStats)}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            {showYearlyStats ? 'Gizle' : 'Göster'}
          </button>
        </div>
        
        {showYearlyStats && (
          <div className="mt-2">
            <div className="grid grid-cols-3 gap-1 text-xs mb-2">
              <div className="text-center p-1.5 bg-green-50 rounded">
                <div className="font-medium text-green-600">{formatCurrency(yearlyRevenue)}</div>
                <div className="text-gray-500 text-xs">Gelir</div>
              </div>
              <div className="text-center p-1.5 bg-red-50 rounded">
                <div className="font-medium text-red-600">{formatCurrency(yearlyExpenses)}</div>
                <div className="text-gray-500 text-xs">Gider</div>
              </div>
              <div className="text-center p-1.5 bg-blue-50 rounded">
                <div className="font-medium text-blue-600">{formatCurrency(yearlyNetProfit)}</div>
                <div className="text-gray-500 text-xs">Kâr</div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded p-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Kâr Payı (%30):</span>
                <span className="font-medium text-orange-600">{formatCurrency(yearlyProfitShare)}</span>
              </div>
              <div className="flex justify-between border-t pt-1">
                <span className="text-gray-600">Kalan Tutar:</span>
                <span className={`font-bold ${yearlyRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(yearlyRemaining)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Service Details Table */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-2 border-b border-gray-200">
          <h2 className="text-xs font-semibold text-gray-900">
            Servis Detayları
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adres
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tel
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gelir
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gider
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kâr
                </th>
                <th className="px-2 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payı
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service, index) => {
                const cost = service.cost || service.feeCollected || 0;
                const profit = cost - service.expenses;
                const profitShare = profit * 0.3;
                const remaining = profit - profitShare;
                const isDragging = draggedIndex === index;
                
                return (
                  <tr 
                    key={service.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    className={`hover:bg-gray-50 cursor-pointer ${
                      isDragging ? 'opacity-50 bg-blue-50' : ''
                    }`}
                    onClick={() => onViewService(service)}
                  >
                    <td className="px-2 py-1.5 whitespace-nowrap text-xs text-gray-900">
                      <div className="flex items-center">
                        <div className="mr-1 cursor-grab">
                          <GripVerticalIcon className="h-3 w-3 text-gray-400" />
                        </div>
                        {service.createdAt ? new Date(service.createdAt).toLocaleDateString('tr-TR').split('.').slice(0, 2).join('.') : formatDate(service.date || '').split('.').slice(0, 2).join('.')}
                      </div>
                    </td>
                    <td className="px-2 py-1.5 text-xs text-gray-900 max-w-xs">
                      <div className="truncate" title={service.address || service.description}>
                        {service.address || service.description}
                      </div>
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap text-xs text-blue-600 font-medium">
                      {service.customerPhone || service.phoneNumber}
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap text-xs text-green-600 font-medium">
                      {(service.cost || service.feeCollected || 0).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap text-xs text-red-600 font-medium">
                      {service.expenses.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap text-xs text-blue-600 font-medium">
                      {profit.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-2 py-1.5 whitespace-nowrap text-xs text-orange-600 font-medium">
                      {remaining.toLocaleString('tr-TR')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredServices.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-xs">
              Seçilen dönemde servis bulunamadı
            </div>
          )}
        </div>
      </div>
    </div>
  );
}