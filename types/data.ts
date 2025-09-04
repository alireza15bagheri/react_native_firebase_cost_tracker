// types/data.ts
export interface Period {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  userId: string;
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