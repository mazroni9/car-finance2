import { supabase } from './supabaseClient';

export async function fetchWallet(userId: string) {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error('فشل في جلب معلومات المحفظة');
  }

  return data;
} 