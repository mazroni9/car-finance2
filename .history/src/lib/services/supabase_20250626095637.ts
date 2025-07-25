// src/types/supabase.ts

import { createClient } from '@supabase/supabase-js';
import { Database } from '../../types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export { createClient };
export default supabase;

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string
          make: string
          model: string
          year: number
          price: number
          image_url: string
          color: string
          mileage: number
          fuel_type: string
          transmission: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Row, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Row>
      }

      installment_plans: {
        Row: {
          id: string
          months: number
          profit_rate: number
          monthly_payment: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Row, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Row>
      }

      financial_summaries: {
        Row: {
          id: string
          total_annual_cost: number
          total_annual_income: number
          salary_expense: number
          rent_expense: number
          inspection_expense: number
          warranty_expense: number
          tracking_expense: number
          operating_expense: number
          net_profit: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Row, 'id' | 'created_at' | 'updated_at'> & Partial<Pick<Row, 'id' | 'created_at' | 'updated_at'>>
        Update: Partial<Row>
      }

      // أضف بقية الجداول مثل transactions, wallets لاحقًا حسب حاجتك
    }

    Views: {}
    Functions: {}
    Enums: {}
  }
}
