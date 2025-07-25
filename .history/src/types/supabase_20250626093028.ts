export interface Database {
  public: {
    Tables: {
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
  };
} 