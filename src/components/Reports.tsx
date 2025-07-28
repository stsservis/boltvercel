import React, { useState } from 'react';
import { ServiceRecord } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ChevronUpIcon, ChevronDownIcon } from 'lucide-react';
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
  const [sortConfig, setSortConfig] = useState<{
    key: 'phone' | 'revenue' | 'expenses' | 'profit' | 'remaining' | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Filter services by selected month and year
  let filteredServices = services.filter(service => {
    const serviceDate = service.createdAt ? new Date(service.createdAt) : new Date(service.date || '');
    return service.status === 'completed' &&
           serviceDate.getMonth() + 1 === selectedMonth && 
           serviceDate.getFullYear() === selectedYear;
  });

  // Apply sorting
  if (sortConfig.key) {
    filteredServices = [...filteredServices].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;
      
      switch (sortConfig.key) {
        case 'phone':
          aValue = a.customerPhone || a.phoneNumber || '';
          bValue = b.customerPhone || b.phoneNumber || '';
          break;
        case 'revenue':
          aValue = a.cost || a.feeCollected || 0;
          bValue = b.cost || b.feeCollected || 0;
          break;
        case 'expenses':
          aValue = a.expenses;
          bValue = b.expenses;
          break;
        case 'profit':
          aValue = (a.cost || a.feeCollected || 0) - a.expenses;      // Net Kâr
          bValue = (b.cost || b.feeCollected || 0) - b.expenses;      // Net Kâr
          break;
        case 'remaining':
          const aNetProfit = (a.cost || a.feeCollected || 0) - a.expenses;  // Net Kâr
          const bNetProfit = (b.cost || b.feeCollected || 0) - b.expenses;  // Net Kâr
          const aProfitShare = aNetProfit * 0.3;                            // Kâr Payı
          const bProfitShare = bNetProfit * 0.3;                            // Kâr Payı
          aValue = aNetProfit - aProfitShare;                               // Kalan
          bValue = bNetProfit - bProfitShare;                               // Kalan
          break;
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue, 'tr')
          : bValue.localeCompare(aValue, 'tr');
      }
      
      return sortConfig.direction === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }

  // Filter yearly services
  const yearlyServices = services.filter(service => {
    const serviceDate = service.createdAt ? new Date(service.createdAt) : new Date(service.date || '');
    return service.status === 'completed' &&
           serviceDate.getFullYear() === selectedYear;
  });

  // Calculate monthly financial data
  const monthlyRevenue = filteredServices.reduce((sum, service) => sum + (service.cost || service.feeCollected || 0), 0);
  const monthlyExpenses = filteredServices.reduce((sum, service) => sum + service.expenses, 0);
  const monthlyNetProfit = monthlyRevenue - monthlyExpenses;  // Gelir - Gider = Net Kâr
  const monthlyProfitShare = monthlyNetProfit * 0.3;          // Net Kâr × %30 = Kâr Payı
  const monthlyRemaining = monthlyNetProfit - monthlyProfitShare; // Net Kâr - Kâr Payı = Kalan

  // Calculate yearly financial data
  const yearlyRevenue = yearlyServices.reduce((sum, service) => sum + (service.cost || service.feeCollected || 0), 0);
  const yearlyExpenses = yearlyServices.reduce((sum, service) => sum + service.expenses, 0);
  const yearlyNetProfit = yearlyRevenue - yearlyExpenses;     // Gelir - Gider = Net Kâr
  const yearlyProfitShare = yearlyNetProfit * 0.3;           // Net Kâr × %30 = Kâr Payı
  const yearlyRemaining = yearlyNetProfit - yearlyProfitShare; // Net Kâr - Kâr Payı = Kalan

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

  const handleSort = (key: 'phone' | 'revenue' | 'expenses' | 'profit' | 'remaining') => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key: string) => {
    if (sortConfig.key !== key) {
      return (
        <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    return sortConfig.direction === 'asc' ? (
      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
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
    <div className="p-1.5 pb-3 space-y-1.5 bg-gray-50">
      {/* Header */}
      <div className="bg-white rounded-md shadow-sm p-1.5">
        <h1 className="text-xs font-bold text-gray-900 mb-1.5">Rapor Dönemi</h1>
        
        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">Ay</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs min-h-[30px]"
            >
              {months.map(month => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-0.5">Yıl</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-2 py-1.5 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs min-h-[30px]"
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
      <div className="bg-white rounded-md shadow-sm p-1.5">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-xs font-semibold text-gray-900">
            <span className="break-words">{months.find(m => m.value === selectedMonth)?.label} {selectedYear} - {filteredServices.length} servis</span>
          </h2>
          <button
            onClick={() => setShowMonthlyDetails(!showMonthlyDetails)}
            className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
          >
            {showMonthlyDetails ? 'Gizle' : 'Detay'}
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-1 text-xs mb-1.5">
          <div className="text-center p-1.5 bg-green-50 rounded-sm min-h-[40px] flex flex-col justify-center">
            <div className="font-medium text-green-600 break-words text-xs">{formatCurrency(monthlyRevenue)}</div>
            <div className="text-gray-500 text-xs">Gelir</div>
          </div>
          <div className="text-center p-1.5 bg-red-50 rounded-sm min-h-[40px] flex flex-col justify-center">
            <div className="font-medium text-red-600 break-words text-xs">{formatCurrency(monthlyExpenses)}</div>
            <div className="text-gray-500 text-xs">Gider</div>
          </div>
          <div className="text-center p-1.5 bg-blue-50 rounded-sm min-h-[40px] flex flex-col justify-center">
            <div className="font-medium text-blue-600 break-words text-xs">{formatCurrency(monthlyNetProfit)}</div>
            <div className="text-gray-500 text-xs">Kâr</div>
          </div>
        </div>

        {showMonthlyDetails && (
          <div className="bg-gray-50 rounded-sm p-1.5 space-y-0.5 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600">Kâr Payı (%30):</span>
              <span className="font-medium text-orange-600 break-words">{formatCurrency(monthlyProfitShare)}</span>
            </div>
            <div className="flex justify-between border-t pt-1">
              <span className="text-gray-600">Kalan Tutar:</span>
              <span className={`font-bold break-words ${monthlyRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(monthlyRemaining)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Yearly Summary - Collapsible */}
      <div className="bg-white rounded-md shadow-sm p-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-gray-900">
            <span className="break-words">{selectedYear} Yıllık Özet - {yearlyServices.length} servis</span>
          </h3>
          <button
            onClick={() => setShowYearlyStats(!showYearlyStats)}
            className="text-xs text-blue-600 hover:text-blue-800 whitespace-nowrap"
          >
            {showYearlyStats ? 'Gizle' : 'Göster'}
          </button>
        </div>
        
        {showYearlyStats && (
          <div className="mt-1.5">
            <div className="grid grid-cols-3 gap-1 text-xs mb-1.5">
              <div className="text-center p-1.5 bg-green-50 rounded-sm min-h-[40px] flex flex-col justify-center">
                <div className="font-medium text-green-600 break-words text-xs">{formatCurrency(yearlyRevenue)}</div>
                <div className="text-gray-500 text-xs">Gelir</div>
              </div>
              <div className="text-center p-1.5 bg-red-50 rounded-sm min-h-[40px] flex flex-col justify-center">
                <div className="font-medium text-red-600 break-words text-xs">{formatCurrency(yearlyExpenses)}</div>
                <div className="text-gray-500 text-xs">Gider</div>
              </div>
              <div className="text-center p-1.5 bg-blue-50 rounded-sm min-h-[40px] flex flex-col justify-center">
                <div className="font-medium text-blue-600 break-words text-xs">{formatCurrency(yearlyNetProfit)}</div>
                <div className="text-gray-500 text-xs">Kâr</div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-sm p-1.5 space-y-0.5 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Kâr Payı (%30):</span>
                <span className="font-medium text-orange-600 break-words">{formatCurrency(yearlyProfitShare)}</span>
              </div>
              <div className="flex justify-between border-t pt-1">
                <span className="text-gray-600">Kalan Tutar:</span>
                <span className={`font-bold break-words ${yearlyRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(yearlyRemaining)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Service Details Table */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="p-1.5 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-900">
            Servis Detayları
          </h2>
        </div>
        
        <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" style={{ WebkitOverflowScrolling: 'touch' }}>
          <table className="min-w-[800px] divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-1 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-1 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Adres
                </th>
                <th 
                  className="px-1 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('phone')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Tel</span>
                    {getSortIcon('phone')}
                  </div>
                </th>
                <th 
                  className="px-1 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('revenue')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Gelir</span>
                    {getSortIcon('revenue')}
                  </div>
                </th>
                <th 
                  className="px-1 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('expenses')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Gider</span>
                    {getSortIcon('expenses')}
                  </div>
                </th>
                <th 
                  className="px-1 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('profit')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Net Kâr</span>
                    {getSortIcon('profit')}
                  </div>
                </th>
                <th className="px-1 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <span>Kâr Payı</span>
                </th>
                <th 
                  className="px-1 py-1.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('remaining')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Kalan</span>
                    {getSortIcon('remaining')}
                  </div>
                </th>
              </tr>
            </thead>
            
            <tbody className="bg-white divide-y divide-gray-200" style={{ touchAction: 'pan-x' }}>
              {filteredServices.map((service, index) => {
                const cost = service.cost || service.feeCollected || 0;
                const netProfit = cost - service.expenses;              // Gelir - Gider = Net Kâr
                const profitShare = netProfit * 0.3;                   // Net Kâr × %30 = Kâr Payı
                const remaining = netProfit - profitShare;             // Net Kâr - Kâr Payı = Kalan
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
                    } min-h-[36px]`}
                    onClick={() => onViewService(service)}
                  >
                    <td className="px-1 py-1.5 whitespace-nowrap text-xs text-gray-900">
                      <div className="flex items-center select-text">
                        <span className="break-words select-text user-select-text">{service.createdAt ? new Date(service.createdAt).toLocaleDateString('tr-TR').split('.').slice(0, 2).join('.') : formatDate(service.date || '').split('.').slice(0, 2).join('.')}</span>
                      </div>
                    </td>
                    <td className="px-1 py-1.5 text-xs text-gray-900 max-w-[100px]">
                      <div className="truncate break-words select-text user-select-text" title={service.address || service.description}>
                        {service.address || service.description}
                      </div>
                    </td>
                    <td className="px-1 py-1.5 text-xs text-blue-600 font-medium max-w-[70px]">
                      <div className="break-words select-text user-select-text">{service.customerPhone || service.phoneNumber}</div>
                    </td>
                    <td className="px-1 py-1.5 text-xs text-green-600 font-medium">
                      <div className="break-words select-text user-select-text">{(service.cost || service.feeCollected || 0).toLocaleString('tr-TR')}</div>
                    </td>
                    <td className="px-1 py-1.5 text-xs text-red-600 font-medium">
                      <div className="break-words select-text user-select-text">{service.expenses.toLocaleString('tr-TR')}</div>
                    </td>
                    <td className="px-1 py-1.5 text-xs text-blue-600 font-medium">
                      <div className="break-words select-text user-select-text">{netProfit.toLocaleString('tr-TR')}</div>
                    </td>
                    <td className="px-1 py-1.5 text-xs text-orange-600 font-medium">
                      <div className="break-words select-text user-select-text">{profitShare.toLocaleString('tr-TR')}</div>
                    </td>
                    <td className="px-1 py-1.5 text-xs text-orange-600 font-medium">
                      <div className="break-words select-text user-select-text">{remaining.toLocaleString('tr-TR')}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredServices.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-xs px-3">
              Seçilen dönemde servis bulunamadı
            </div>
          )}
        </div>
      </div>
    </div>
  );
}