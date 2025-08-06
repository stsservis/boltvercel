import React, { useState } from 'react';
import { ServiceRecord } from '../types';
import { formatCurrency, formatDate } from '../utils/helpers';
import { ChevronUpIcon, ChevronDownIcon, SearchIcon } from 'lucide-react';
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
  const [showServicesList, setShowServicesList] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: 'date' | 'address' | 'phone' | 'revenue' | 'expenses' | 'profit' | 'remaining' | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Filter services by selected month and year
  let filteredServices = services.filter(service => {
    const serviceDate = service.createdAt ? new Date(service.createdAt) : new Date(service.date || '');
    return service.status === 'completed' &&
           serviceDate.getMonth() + 1 === selectedMonth && 
           serviceDate.getFullYear() === selectedYear;
  });

  // Apply search and date filters
  if (searchTerm || dateFilter) {
    filteredServices = filteredServices.filter(service => {
      const phone = service.customerPhone || service.phoneNumber || '';
      const address = service.address || service.description || '';
      const serviceDate = service.createdAt ? new Date(service.createdAt) : new Date(service.date || '');
      
      const matchesSearch = !searchTerm || 
        phone.includes(searchTerm) ||
        address.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDate = !dateFilter || 
        serviceDate.toISOString().includes(dateFilter) ||
        serviceDate.toLocaleDateString('tr-TR').includes(dateFilter) ||
        serviceDate.getFullYear().toString().includes(dateFilter) ||
        (serviceDate.getMonth() + 1).toString().padStart(2, '0').includes(dateFilter) ||
        serviceDate.getDate().toString().padStart(2, '0').includes(dateFilter);
      
      return matchesSearch && matchesDate;
    });
  }

  // Apply sorting
  if (sortConfig.key) {
    filteredServices = [...filteredServices].sort((a, b) => {
      let aValue: number | string = 0;
      let bValue: number | string = 0;
      
      switch (sortConfig.key) {
        case 'date':
          const aDate = a.createdAt ? new Date(a.createdAt) : new Date(a.date || '');
          const bDate = b.createdAt ? new Date(b.createdAt) : new Date(b.date || '');
          aValue = aDate.getTime();
          bValue = bDate.getTime();
          break;
        case 'address':
          aValue = a.address || a.description || '';
          bValue = b.address || b.description || '';
          break;
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

  const handleSort = (key: 'date' | 'address' | 'phone' | 'revenue' | 'expenses' | 'profit' | 'remaining') => {
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
    <div className="p-1.5 pb-3 space-y-1.5">
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

      {/* Yearly Summary - Collapsible */}
      <div className="bg-white rounded-md shadow-sm p-1.5">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-xs font-semibold text-gray-900">
            <span className="break-words">Aylık Özet ({months.find(m => m.value === selectedMonth)?.label} {selectedYear})</span>
          </h2>
          <button
            onClick={() => setShowMonthlyDetails(!showMonthlyDetails)}
            className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {showMonthlyDetails ? (
              <ChevronUpIcon className="w-3 h-3" />
            ) : (
              <ChevronDownIcon className="w-3 h-3" />
            )}
          </button>
        </div>
        
        {showMonthlyDetails && (
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-green-50 rounded p-1.5 border border-green-200 text-center min-h-[40px] flex flex-col justify-center">
                <div className="text-xs text-gray-500">Gelir</div>
                <div className="font-bold text-green-600 text-xs break-words">{formatCurrency(monthlyRevenue)}</div>
              </div>
              <div className="bg-red-50 rounded p-1.5 border border-red-200 text-center min-h-[40px] flex flex-col justify-center">
                <div className="text-xs text-gray-500">Gider</div>
                <div className="font-bold text-red-600 text-xs break-words">{formatCurrency(monthlyExpenses)}</div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded p-1.5 border border-blue-200 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Net Kâr:</span>
                <span className={`font-medium break-words ${monthlyNetProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(monthlyNetProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kâr Payı (%30):</span>
                <span className="font-medium text-orange-600 break-words">{formatCurrency(monthlyProfitShare)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-1">
                <span className="text-gray-600">Kalan Tutar:</span>
                <span className={`font-bold break-words ${monthlyRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(monthlyRemaining)}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => setShowServicesList(!showServicesList)}
              className="w-full bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 transition-colors text-xs font-medium"
            >
              {showServicesList ? 'Servis Listesini Gizle' : 'Servis Listesini Göster'}
            </button>
            
            <div className="text-center text-xs text-gray-500 bg-gray-50 rounded p-1.5">
              Toplam {filteredServices.length} tamamlanan servis
            </div>
          </div>
        )}
      </div>

      {/* Yearly Summary */}
      <div className="bg-white rounded-md shadow-sm p-1.5">
        <div className="flex items-center justify-between mb-1.5">
          <h2 className="text-xs font-semibold text-gray-900">
            <span className="break-words">Yıllık Özet ({selectedYear})</span>
          </h2>
          <button
            onClick={() => setShowYearlyStats(!showYearlyStats)}
            className="text-xs text-blue-600 hover:text-blue-800 focus:outline-none"
          >
            {showYearlyStats ? (
              <ChevronUpIcon className="w-3 h-3" />
            ) : (
              <ChevronDownIcon className="w-3 h-3" />
            )}
          </button>
        </div>
        
        {showYearlyStats && (
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <div className="bg-green-50 rounded p-1.5 border border-green-200 text-center min-h-[40px] flex flex-col justify-center">
                <div className="text-xs text-gray-500">Gelir</div>
                <div className="font-bold text-green-600 text-xs break-words">{formatCurrency(yearlyRevenue)}</div>
              </div>
              <div className="bg-red-50 rounded p-1.5 border border-red-200 text-center min-h-[40px] flex flex-col justify-center">
                <div className="text-xs text-gray-500">Gider</div>
                <div className="font-bold text-red-600 text-xs break-words">{formatCurrency(yearlyExpenses)}</div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded p-1.5 border border-blue-200 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Net Kâr:</span>
                <span className={`font-medium break-words ${yearlyNetProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(yearlyNetProfit)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Kâr Payı (%30):</span>
                <span className="font-medium text-orange-600 break-words">{formatCurrency(yearlyProfitShare)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-1">
                <span className="text-gray-600">Kalan Tutar:</span>
                <span className={`font-bold break-words ${yearlyRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(yearlyRemaining)}
                </span>
              </div>
            </div>
            
            <div className="text-center text-xs text-gray-500 bg-gray-50 rounded p-1.5">
              Toplam {yearlyServices.length} tamamlanan servis
            </div>
          </div>
        )}
      </div>

      {/* Servis Listesi - Horizontal Scroll Table */}
      {showServicesList && (
        <div className="bg-white rounded-md shadow-sm p-1.5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-900">
              {months.find(m => m.value === selectedMonth)?.label} {selectedYear} Servisleri
            </h3>
            <span className="text-xs text-gray-500">Toplam: {filteredServices.length} servis</span>
          </div>
          
          {/* Search Filter */}
          <div className="mb-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <input
                type="text"
                placeholder="Akıllı arama: tarih, telefon, adres veya anahtar kelime..."
                className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs min-h-[28px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Horizontal Scroll Table */}
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Table Header */}
              <div className="grid grid-cols-8 gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg text-xs font-semibold text-gray-800 mb-2 shadow-sm border border-blue-100">
                <button
                  onClick={() => handleSort('date')}
                  className="hover:bg-white/60 p-2 rounded-md text-left transition-all duration-200 hover:shadow-sm"
                >
                  Tarih
                </button>
                <button
                  onClick={() => handleSort('phone')}
                  className="hover:bg-white/60 p-2 rounded-md text-left transition-all duration-200 hover:shadow-sm"
                >
                  Telefon
                </button>
                <button
                  onClick={() => handleSort('address')}
                  className="hover:bg-white/60 p-2 rounded-md text-left transition-all duration-200 hover:shadow-sm"
                >
                  Adres
                </button>
                <button
                  onClick={() => handleSort('revenue')}
                  className="hover:bg-white/60 p-2 rounded-md text-right transition-all duration-200 hover:shadow-sm"
                >
                  Gelir
                </button>
                <button
                  onClick={() => handleSort('expenses')}
                  className="hover:bg-white/60 p-2 rounded-md text-right transition-all duration-200 hover:shadow-sm"
                >
                  Gider
                </button>
                <button
                  onClick={() => handleSort('profit')}
                  className="hover:bg-white/60 p-2 rounded-md text-right transition-all duration-200 hover:shadow-sm"
                >
                  Net Kâr
                </button>
                <button
                  className="hover:bg-white/60 p-2 rounded-md text-right transition-all duration-200 hover:shadow-sm cursor-default"
                >
                  Kâr Payı
                </button>
                <button
                  onClick={() => handleSort('remaining')}
                  className="hover:bg-white/60 p-2 rounded-md text-right transition-all duration-200 hover:shadow-sm"
                >
                  Kalan
                </button>
              </div>
              
              {/* Table Body */}
              <div className="space-y-1">
                {filteredServices.map((service) => {
                  const cost = service.cost || service.feeCollected || 0;
                  const profit = cost - service.expenses;
                  const profitShare = profit * 0.3;
                  const remaining = profit - profitShare; // Kalan = Net Kâr - Kâr Payı
                  const serviceDate = service.createdAt ? new Date(service.createdAt) : new Date(service.date || '');
                  
                  return (
                    <div
                      key={service.id}
                      onClick={() => onViewService(service)}
                      className="grid grid-cols-8 gap-2 p-2 bg-gray-50 hover:bg-blue-50 rounded text-xs cursor-pointer transition-colors"
                    >
                      <div className="text-gray-700">
                        {serviceDate.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
                      </div>
                      <div className="text-blue-600 font-medium break-all">
                        {service.customerPhone || service.phoneNumber}
                      </div>
                      <div className="text-gray-700 break-words">
                        {service.address || service.description}
                      </div>
                      <div className="text-green-600 font-medium text-right">
                        {formatCurrency(cost)}
                      </div>
                      <div className="text-red-600 font-medium text-right">
                        {formatCurrency(service.expenses)}
                      </div>
                      <div className={`font-medium text-right ${profit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(profit)}
                      </div>
                      <div className="text-orange-600 font-medium text-right">
                        {formatCurrency(profitShare)}
                      </div>
                      <div className={`font-bold text-right ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(remaining)}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {filteredServices.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-xs">
                  {searchTerm || dateFilter ? 'Filtreye uygun servis bulunamadı' : 'Bu dönemde tamamlanan servis bulunmuyor'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}