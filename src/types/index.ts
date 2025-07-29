export interface ServiceRecord {
  id: string;
  customerPhone: string;
  address: string;
  color?: string;
  cost: number;
  expenses: number;
  status: 'ongoing' | 'completed' | 'workshop';
  createdAt: string;
  updatedAt: string;
  order?: number;
  date?: string;
  phoneNumber?: string;
  feeCollected?: number;
  quotedPrice?: number;
  description?: string;
  partsChanged?: string;
  missingParts?: string;
}

export interface DashboardStats {
  totalServices: number;
  totalRevenue: number;
  totalExpenses: number;
  profit: number;
  monthlyStats: {
    revenue: number;
    expenses: number;
    profit: number;
  };
  yearlyStats: {
    revenue: number;
    expenses: number;
    profit: number;
  };
}