import { supabase } from '@/lib/supabase/supabase';

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

/**
 * ✅ جلب محفظة بحسب معرف المستخدم
 */
export async function getWalletByUserId(userId: string) {
  const { data, error } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('❌ Error fetching wallet by user id:', error.message);
    throw new Error('فشل في جلب بيانات محفظة المستخدم');
  }

  return data;
}

/**
 * ✅ إنشاء قيود التسوية
 */
export async function createSettlement(settlementData: {
  type: string;
  from: string;
  to: string;
  amount: number;
}) {
  const { data, error } = await supabase
    .from('settlements')
    .insert({
      type: settlementData.type,
      from_wallet_id: settlementData.from,
      to_wallet_id: settlementData.to,
      amount: settlementData.amount,
      status: 'completed',
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating settlement:', error.message);
    throw new Error('فشل في إنشاء قيود التسوية');
  }

  return data;
}
