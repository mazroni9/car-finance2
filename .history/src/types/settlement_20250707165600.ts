export interface Settlement {
  id: string;
  type: 'car_sale' | 'commission' | 'transfer_fee' | 'refund' | 'platform_fee' | 'showroom_fee';
  amount: number;
  from_wallet: string;
  to_wallet: string;
  car_id?: string;
  car_details?: {
    make: string;
    model: string;
    year: number;
    price: number;
  };
  buyer_id?: string;
  seller_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description: string;
  created_at: string;
  completed_at?: string;
  failed_reason?: string;
  transaction_hash?: string;
}

export interface SettlementSummary {
  total_settlements: number;
  total_amount: number;
  pending_amount: number;
  completed_amount: number;
  failed_amount: number;
  today_settlements: number;
  today_amount: number;
  monthly_settlements: number;
  monthly_amount: number;
}

export interface SettlementFilters {
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  type?: 'car_sale' | 'commission' | 'transfer_fee' | 'refund' | 'platform_fee' | 'showroom_fee';
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
  wallet_id?: string;
}

export interface SettlementStats {
  by_type: {
    car_sale: { count: number; amount: number };
    commission: { count: number; amount: number };
    transfer_fee: { count: number; amount: number };
    refund: { count: number; amount: number };
    platform_fee: { count: number; amount: number };
    showroom_fee: { count: number; amount: number };
  };
  by_status: {
    pending: { count: number; amount: number };
    completed: { count: number; amount: number };
    failed: { count: number; amount: number };
    cancelled: { count: number; amount: number };
  };
  by_date: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
} 