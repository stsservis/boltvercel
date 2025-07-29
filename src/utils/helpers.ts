import { ServiceRecord, DashboardStats } from '../types';

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
  }).format(amount);
};

// Format date
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('tr-TR');
};

// Calculate profit
export const calculateProfit = (fee: number, expense: number): number => {
  return fee - expense;
};

// Calculate dashboard stats
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

// Generate a proper UUID
export const generateId = (): string => {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Export data as JSON file
export const exportData = (services: ServiceRecord[]) => {
  const data = JSON.stringify(services, null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `servis-kayitlari-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Import data from JSON file
export const importData = (file: File): Promise<ServiceRecord[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const services = JSON.parse(e.target?.result as string);
        resolve(services);
      } catch (error) {
        reject(new Error('Geçersiz yedek dosyası'));
      }
    };
    reader.onerror = () => reject(new Error('Dosya okunamadı'));
    reader.readAsText(file);
  });
};

// Save service order to localStorage
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

// Load service order from localStorage
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

// Apply saved order to services
export const applySavedOrder = (services: ServiceRecord[]): ServiceRecord[] => {
  const orderMap = loadServiceOrder();
  
  // If no saved order, return as is
  if (Object.keys(orderMap).length === 0) {
    return services;
  }
  
  // Sort services based on saved order
  return services.sort((a, b) => {
    const orderA = orderMap[a.id] ?? 999999;
    const orderB = orderMap[b.id] ?? 999999;
    return orderA - orderB;
  });
};