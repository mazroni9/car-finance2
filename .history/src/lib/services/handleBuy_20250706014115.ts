import { supabase } from './supabaseClient';
import { updateWalletBalance } from './updateWalletBalance';

interface BuyParams {
  carId: string;
  userId: string;
  amount: number;
}

export async function handleBuy({ carId, userId, amount }: BuyParams) {
  const { data: wallet, error: walletError } = await supabase
    .from('wallets')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (walletError || !wallet) {
    throw new Error('لم يتم العثور على المحفظة');
  }

  if (wallet.balance < amount) {
    throw new Error('رصيد غير كافٍ');
  }

  // تحديث رصيد المحفظة
  await updateWalletBalance(userId, -amount);

  // إنشاء سجل المعاملة
  const { data: transaction, error: transactionError } = await supabase
    .from('transactions')
    .insert([
      {
        user_id: userId,
        car_id: carId,
        amount,
        type: 'buy',
      },
    ])
    .select()
    .single();

  if (transactionError) {
    throw new Error('فشل في تسجيل المعاملة');
  }

  return { success: true, transaction };
} 