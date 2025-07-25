import { NextResponse } from 'next/server';
import supabase from '@/lib/services/supabase';

// حساب العمولة
function calculatePlatformFee(salePrice: number): number {
  return salePrice * 0.05; // 5% commission
}

const PLATFORM_ACCOUNT_UUID = '00000000-0000-0000-0000-000000000000'; // Platform account UUID

export async function POST(request: Request) {
  try {
    const { salePrice, sellerId } = await request.json();
    
    if (!salePrice || !sellerId) {
      return NextResponse.json(
        { error: 'Missing required fields: salePrice, sellerId' },
        { status: 400 }
      );
    }

    // حساب العمولة
    const commission = calculatePlatformFee(salePrice);

    // 1️⃣ سجل الخصم من حساب البائع
    await supabase.from('showroom_transactions').insert([{
      showroom_id: sellerId,
      type: 'platform_commission',
      amount: -commission,
      description: `عمولة المنصة من بيع سيارة بسعر ${salePrice}`
    }]);

    // 2️⃣ خصم من رصيد البائع
    await supabase.rpc('decrement_wallet_balance', {
      showroom_id_input: sellerId,
      decrement_amount: commission
    });

    // 3️⃣ سجل الإضافة في حساب المنصة
    await supabase.from('showroom_transactions').insert([{
      showroom_id: PLATFORM_ACCOUNT_UUID,
      type: 'platform_commission',
      amount: commission,
      description: `عمولة مستلمة من بيع سيارة بسعر ${salePrice}`
    }]);

    // 4️⃣ إضافة في رصيد المنصة
    await supabase.rpc('increment_wallet_balance', {
      showroom_id_input: PLATFORM_ACCOUNT_UUID,
      increment_amount: commission
    });

    return NextResponse.json({ 
      success: true, 
      commission,
      message: 'تم تسجيل البيع بنجاح' 
    });

  } catch (error) {
    console.error('Error recording sale:', error);
    return NextResponse.json(
      { error: 'فشل في تسجيل البيع' },
      { status: 500 }
    );
  }
}
