export interface ServiceRecord {
  id: string;
  phoneNumber: string;
  date: string;
  feeCollected: number;
  expenses: number;
  quotedPrice: number;
  description: string;
  partsChanged: string;
  missingParts: string;
  status: 'ongoing' | 'completed' | 'workshop';
  color?: string;
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