export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email: string;
          full_name: string;
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string;
          updated_at?: string;
        };
      };
      dealer_wallets: {
        Row: {
          id: string;
          dealer_id: string;
          balance: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          dealer_id: string;
          balance: number;
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          balance?: number;
          updated_at?: string;
        };
      };
      dealer_transactions: {
        Row: {
          id: string;
          wallet_id: string;
          amount: number;
          type: 'credit' | 'debit';
          description: string;
          created_at: string;
        };
        Insert: {
          wallet_id: string;
          amount: number;
          type: 'credit' | 'debit';
          description: string;
          id?: string;
          created_at?: string;
        };
        Update: {
          amount?: number;
          type?: 'credit' | 'debit';
          description?: string;
        };
      };
      transactions: {
        Row: {
          id: string;
          amount: number;
          description: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          amount: number;
          description: string;
          user_id: string;
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          amount?: number;
          description?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          description: string;
          file_url: string;
          file_type: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          description: string;
          file_url: string;
          file_type: string;
          user_id: string;
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          description?: string;
          file_url?: string;
          file_type?: string;
          updated_at?: string;
        };
      };
      cars: {
        Row: {
          id: number;
          make: string;
          model: string;
          year: number;
          price: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      financial_entries: {
        Row: {
          id: number;
          amount: number;
          type: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      // Add other tables as needed
      [key: string]: {
        Row: Record<string, any>;
      };
    };
    Views: {
      [key: string]: {
        Row: Record<string, unknown>;
      };
    };
    Functions: {
      [key: string]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
  };
} 