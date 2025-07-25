export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  status: 'active' | 'suspended' | 'closed';
  type: 'personal' | 'business' | 'showroom' | 'platform' | 'system';
  created_at: string;
  updated_at: string;
  user?: {
    username: string;
    email: string;
  };
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

export interface WalletSummary {
  total_wallets: number;
  total_balance: number;
  active_wallets: number;
  suspended_wallets: number;
  by_type: {
    personal: { count: number; balance: number };
    business: { count: number; balance: number };
    showroom: { count: number; balance: number };
    platform: { count: number; balance: number };
    system: { count: number; balance: number };
  };
} 