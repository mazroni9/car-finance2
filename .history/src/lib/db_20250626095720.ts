import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Type-safe query helpers for specific tables
export async function queryTable<T>(
  tableName: string,
  options: {
    columns?: string;
    filters?: Record<string, any>;
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
    joins?: Array<{
      table: string;
      on: string;
      type?: 'LEFT' | 'RIGHT' | 'INNER';
    }>;
  } = {}
) {
  try {
    let query = supabase.from(tableName).select(options.columns || '*');

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    if (options.orderBy) {
      query = query.order(options.orderBy.column, {
        ascending: options.orderBy.ascending ?? true
      });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    
    if (error) throw error;
    return data as T[];
  } catch (error) {
    console.error(`Database query error for table ${tableName}:`, error);
    throw error;
  }
}

interface CarData {
  make: string;
  model: string;
  year: number;
  price: number;
  [key: string]: any; // للحقول الإضافية الاختيارية
}

export const validateCarData = (data: any) => {
  const requiredFields = ['make', 'model', 'year', 'price'];
  const errors: string[] = [];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const calculateFinancials = (data: any, plan: any) => {
  const downPayment = data.priceCategory * (data.downPaymentRate / 100);
  const monthlyIncome = (data.priceCategory - downPayment) / plan.months;
  
  return {
    downPayment,
    monthlyIncome,
    annualIncome: monthlyIncome * 12,
    sellingPrice: data.priceCategory + (data.priceCategory * plan.profit_rate / 100)
  };
};

export default supabase; 