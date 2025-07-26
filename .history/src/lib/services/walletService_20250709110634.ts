import { supabase } from './supabase';

/**
 * ✅ جلب محفظة بحسب معرفها
 */
export async function getWalletById(walletId: string) {
  const { data, error } = await supabase
    .from('wallets')         // ✨ تأكد هنا من الاسم الصحيح
    .select('*')
    .eq('id', walletId)
    .single();

  if (error) {
    console.error('❌ Error fetching wallet:', error.message);
    throw new Error('فشل في جلب بيانات المحفظة');
  }

  return data;
}

/**
 * ✅ خصم مبلغ من الرصيد
 */
export async function decrementWalletBalance(walletId: string, amount: number) {
  const { error } = await supabase
    .rpc('decrement_wallet_balance', {
      wallet_id_input: walletId,
      amount_input: amount
    });

  if (error) {
    console.error('❌ Error decrementing balance:', error.message);
    throw new Error('فشل في خصم المبلغ من المحفظة');
  }
}

/**
 * ✅ زيادة الرصيد
 */
export async function incrementWalletBalance(walletId: string, amount: number) {
  const { error } = await supabase
    .rpc('increment_wallet_balance', {
      wallet_id_input: walletId,
      amount_input: amount
    });

  if (error) {
    console.error('❌ Error incrementing balance:', error.message);
    throw new Error('فشل في إضافة المبلغ للمحفظة');
  }
}
