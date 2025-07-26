import { supabase } from './supabaseClient';

export async function fetchTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      cars (
        make,
        model,
        year
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error('فشل في جلب المعاملات');
  }

  return data;
} 