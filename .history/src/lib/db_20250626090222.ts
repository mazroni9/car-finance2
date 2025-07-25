import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

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