export interface Transaction {
  id: string;
  user_id: string;
  car_id?: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
  car?: {
    make: string;
    model: string;
    year: number;
  };
} 