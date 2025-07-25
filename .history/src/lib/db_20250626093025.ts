import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

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
  tableName: keyof Database['public']['Tables'],
  options: {
    columns?: string;
    filters?: Record<string, any>;
    limit?: number;
    orderBy?: { column: string; ascending?: boolean };
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

export const executeQuery = async (query: string, values: any[] = []) => {
  try {
    const { data, error } = await supabase.rpc('execute_query', { query_text: query, params: values });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
};

export const validateCarData = (data: any) => {
  const requiredFields = ['make', 'model', 'year', 'price'];
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  return true;
};

export const calculateFinancials = (price: number, downPayment: number, months: number) => {
  const loanAmount = price - downPayment;
  const monthlyRate = 0.05 / 12; // 5% annual rate
  const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  
  return {
    loanAmount,
    monthlyPayment,
    totalPayment: monthlyPayment * months
  };
};

export default supabase; 