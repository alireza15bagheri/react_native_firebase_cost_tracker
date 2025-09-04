// types/data.ts
export interface Period {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  userId: string;
  daily_limit?: number;
  notes?: string;
}

export interface Income {
  id: string;
  periodId: string;
  source: string;
  amount: number;
  userId: string;
}

export interface Budget {
  id: string;
  periodId: string;
  name: string; // Simplified from category object
  amount_allocated: number;
  status: 'paid' | 'not_paid';
  userId: string;
}

export interface DailyCost {
  id: string;
  periodId: string;
  userId: string;
  date: string; // YYYY-MM-DD
  spent: number;
}

export interface MiscellaneousCost {
  id: string;
  periodId: string;
  userId: string;
  title: string;
  amount: number;
}