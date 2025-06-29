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