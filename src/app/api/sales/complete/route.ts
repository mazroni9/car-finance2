// src/app/api/sales/complete/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();

  try {
    // ✅ 1️⃣ اقرأ البيانات القادمة من الطلب
    const { salePrice, sellerShowroomId } = await req.json();

    if (!salePrice || !sellerShowroomId) {
      return NextResponse.json(
        { error: '❌ Missing salePrice or sellerShowroomId' },
        { status: 400 }
      );
    }

    // ✅ 2️⃣ حساب العمولة
    const commission = calculatePlatformFee(salePrice);

    if (!commission) {
      return NextResponse.json(
        { error: '❌ Sale price is out of range for commission tiers' },
        { status: 400 }
      );
    }

    // ✅ 3️⃣ معرف حساب المنصة من .env
    const platformShowroomId = process.env.NEXT_PUBLIC_PLATFORM_SHOWROOM_ID;
    if (!platformShowroomId) {
      return NextResponse.json(
        { error: '❌ Platform Showroom ID not configured in environment' },
        { status: 500 }
      );
    }

    // ✅ 4️⃣ سجل المعاملتين في showroom_transactions
    const { error: insertError } = await supabase
      .from('showroom_transactions')
      .insert([
        {
          showroom_id: sellerShowroomId,
          type: 'platform_commission',
          amount: -commission,
          description: `خصم عمولة المنصة من بيع سيارة بسعر ${salePrice}`,
          external: false,
        },
        {
          showroom_id: platformShowroomId,
          type: 'platform_commission',
          amount: commission,
          description: `استلام عمولة المنصة من بيع سيارة بسعر ${salePrice}`,
          external: false,
        },
      ]);

    if (insertError) {
      console.error(insertError);
      return NextResponse.json(
        { error: '❌ Failed to insert transactions' },
        { status: 500 }
      );
    }

    // ✅ 5️⃣ تحديث محفظة البائع (خصم)
    const { error: debitError } = await supabase.rpc('decrement_wallet_balance', {
      p_showroom_id: sellerShowroomId,
      p_amount: commission,
    });

    if (debitError) {
      console.error(debitError);
      return NextResponse.json(
        { error: '❌ Failed to debit seller wallet' },
        { status: 500 }
      );
    }

    // ✅ 6️⃣ تحديث محفظة المنصة (إضافة)
    const { error: creditError } = await supabase.rpc('increment_wallet_balance', {
      p_showroom_id: platformShowroomId,
      p_amount: commission,
    });

    if (creditError) {
      console.error(creditError);
      return NextResponse.json(
        { error: '❌ Failed to credit platform wallet' },
        { status: 500 }
      );
    }

    // ✅ 7️⃣ نجاح العملية
    return NextResponse.json({
      message: '✅ Sale completed and commission processed successfully',
      commission,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: '❌ Internal Server Error' },
      { status: 500 }
    );
  }
}

// ✅ ✅ دالة لحساب العمولة حسب جدولك
function calculatePlatformFee(price: number): number | null {
  if (price <= 30000) return 250;
  if (price <= 60000) return 500;
  if (price <= 80000) return 750;
  if (price <= 100000) return 1000;
  if (price > 100000) return 2000; // مثال عمولة ثابتة للغالي
  return null;
}
