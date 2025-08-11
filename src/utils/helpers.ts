import { ServiceRecord, DashboardStats } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR');
};

export const calculateProfit = (fee: number, expense: number): number => {
  return fee - expense;
};

export const calculateDashboardStats = (
  services: ServiceRecord[]
): DashboardStats => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyServices = services.filter(service => {
    const serviceDate = service.createdAt ? new Date(service.createdAt) : new Date(service.date || '');
    return serviceDate.getMonth() === currentMonth && 
           serviceDate.getFullYear() === currentYear;
  });

  const yearlyServices = services.filter(service => {
    const serviceDate = service.createdAt ? new Date(service.createdAt) : new Date(service.date || '');
    return serviceDate.getFullYear() === currentYear;
  });

  const totalServices = services.length;
  const totalRevenue = services.reduce((sum, service) => sum + (service.cost || service.feeCollected || 0), 0);
  const totalExpenses = services.reduce((sum, service) => sum + service.expenses, 0);
  const profit = totalRevenue - totalExpenses;

  const monthlyRevenue = monthlyServices.reduce((sum, service) => sum + (service.cost || service.feeCollected || 0), 0);
  const monthlyExpenses = monthlyServices.reduce((sum, service) => sum + service.expenses, 0);
  const monthlyProfit = monthlyRevenue - monthlyExpenses;

  const yearlyRevenue = yearlyServices.reduce((sum, service) => sum + (service.cost || service.feeCollected || 0), 0);
  const yearlyExpenses = yearlyServices.reduce((sum, service) => sum + service.expenses, 0);
  const yearlyProfit = yearlyRevenue - yearlyExpenses;

  return {
    totalServices,
    totalRevenue,
    totalExpenses,
    profit,
    monthlyStats: {
      revenue: monthlyRevenue,
      expenses: monthlyExpenses,
      profit: monthlyProfit,
    },
    yearlyStats: {
      revenue: yearlyRevenue,
      expenses: yearlyExpenses,
      profit: yearlyProfit,
    },
  };
};

export const generateId = (): string => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

export const saveServiceOrder = (services: ServiceRecord[]) => {
  try {
    const orderData = services.map((service, index) => ({
      id: service.id,
      order: index
    }));
    localStorage.setItem('serviceOrder', JSON.stringify(orderData));
  } catch (error) {
    console.error('Failed to save service order:', error);
  }
};

export const loadServiceOrder = (): { [key: string]: number } => {
  try {
    const orderData = localStorage.getItem('serviceOrder');
    if (orderData) {
      const parsed = JSON.parse(orderData);
      const orderMap: { [key: string]: number } = {};
      parsed.forEach((item: { id: string; order: number }) => {
        orderMap[item.id] = item.order;
      });
      return orderMap;
    }
  } catch (error) {
    console.error('Failed to load service order:', error);
  }
  return {};
};

export const applySavedOrder = (services: ServiceRecord[]): ServiceRecord[] => {
  const orderMap = loadServiceOrder();
  
  if (Object.keys(orderMap).length === 0) {
    return services;
  }
  
  return services.sort((a, b) => {
    const orderA = orderMap[a.id] ?? 999999;
    const orderB = orderMap[b.id] ?? 999999;
    return orderA - orderB;
  });
};

export const formatPhoneNumberDisplay = (phoneNumber: string): string => {
  if (!phoneNumber) return '';
  
  // Remove all non-digit characters
  let cleaned = phoneNumber.replace(/\D/g, '');
  
  // Handle +90 prefix - replace with 0
  if (cleaned.startsWith('90') && cleaned.length >= 12) {
    cleaned = '0' + cleaned.substring(2);
  }
  
  // Ensure it starts with 0 for Turkish numbers
  if (!cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }
  
  // Format as 05XX XXX XX XX
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `${cleaned.substring(0, 4)} ${cleaned.substring(4, 7)} ${cleaned.substring(7, 9)} ${cleaned.substring(9, 11)}`;
  }
  
  // If not standard Turkish mobile format, return as is but with basic spacing
  if (cleaned.length >= 10) {
    return cleaned.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
  }
  
  return cleaned;
};