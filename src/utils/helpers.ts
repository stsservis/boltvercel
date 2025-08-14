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
  
  // Format Turkish mobile numbers with spaces: 05XX XXX XX XX
  if (phoneNumber.length === 11 && phoneNumber.startsWith('05')) {
    return phoneNumber.substring(0, 4) + ' ' + 
           phoneNumber.substring(4, 7) + ' ' + 
           phoneNumber.substring(7, 9) + ' ' + 
           phoneNumber.substring(9, 11);
  }
  
  // For any other format, return as is
  return phoneNumber;
};

export const formatPhoneNumberInRawText = (rawInput: string): string => {
  if (!rawInput) return '';
  
  // Try to find phone number patterns in the text
  const phonePatterns = [
    /(\+90\s*\d{3}\s*\d{3}\s*\d{2}\s*\d{2})/g,  // +90 534 682 22 82
    /(\+90\d{10})/g,                              // +905346822282
    /(90\d{10})/g,                                // 905346822282
    /(0\d{10})/g,                                 // 05346822282
    /(\d{11})/g                                   // 15346822282 (fallback)
  ];
  
  let result = rawInput;
  
  for (const pattern of phonePatterns) {
    const match = rawInput.match(pattern);
    if (match) {
      const foundNumber = match[0];
      const cleanedNumber = formatPhoneNumberForStorage(foundNumber);
      const formattedNumber = formatPhoneNumberDisplay(cleanedNumber);
      
      // Replace the found number with the formatted version
      result = rawInput.replace(foundNumber, formattedNumber);
      break;
    }
  }
  
  return result;
};

export const formatPhoneNumberForStorage = (input: string): string => {
  if (!input) return '';
  
  // Remove all non-digit characters
  let cleaned = input.replace(/\D/g, '');
  
  // Handle +90 prefix - replace with 0
  if (cleaned.startsWith('90') && cleaned.length >= 12) {
    cleaned = '0' + cleaned.substring(2);
  }
  
  // Ensure it starts with 0 for Turkish numbers
  if (!cleaned.startsWith('0') && cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }
  
  return cleaned;
};

export const extractPhoneFromText = (text: string): string => {
  if (!text) return '';
  
  // Try to find phone number patterns in the text
  const phonePatterns = [
    /(\+90\s*\d{3}\s*\d{3}\s*\d{2}\s*\d{2})/g,  // +90 534 682 22 82
    /(\+90\d{10})/g,                              // +905346822282
    /(90\d{10})/g,                                // 905346822282
    /(0\d{10})/g,                                 // 05346822282
    /(\d{11})/g                                   // 15346822282 (fallback)
  ];
  
  for (const pattern of phonePatterns) {
    const match = text.match(pattern);
    if (match) {
      return formatPhoneNumberForStorage(match[0]);
    }
  }
  
  // If no pattern matches, try to extract any 10-11 digit sequence
  const digits = text.replace(/\D/g, '');
  if (digits.length >= 10) {
    return formatPhoneNumberForStorage(digits);
  }
  
  return text; // Return original if no phone number detected
};