import { supabase } from './supabaseClient';

export async function updateWalletBalance(userId: string, amount: number) {
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('balance')
    .eq('user_id', userId)
    .single();

  if (walletError || !wallet) {
    throw new Error('لم يتم العثور على المحفظة');
  }

  const newBalance = wallet.balance + amount;

  if (newBalance < 0) {
    throw new Error('رصيد غير كافٍ');
  }

  const { error: updateError } = await supabase
    .from('wallets')
    .update({ balance: newBalance })
    .eq('user_id', userId);

  if (updateError) {
    throw new Error('فشل في تحديث الرصيد');
  }

  return { success: true, balance: newBalance };
} 