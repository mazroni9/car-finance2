import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase/supabaseClient';
import {
  getWalletById,
  decrementWalletBalance,
  incrementWalletBalance,
  createSettlement
} from '@/lib/services/walletService';
import type { Wallet, PurchaseCarRequest } from '@/types/finance';

// ✅ معرف محفظة المنصة الثابت
const platformWalletId = '16dcb112-1222-4e51-9869-6ec0624eea8e';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // ✅ 0 – قراءة البيانات من الطلب
    const body: PurchaseCarRequest = await req.json();
    const { buyerWalletId, showroomWalletId, totalPrice } = body;

    // ✅ 1 – التحقق من وجود المحافظ
    const buyerWallet: Wallet | null = await getWalletById(buyerWalletId);
    if (!buyerWallet) throw new Error("محفظة المشتري غير موجودة");

    const showroomWallet: Wallet | null = await getWalletById(showroomWalletId);
    if (!showroomWallet) throw new Error("محفظة المعرض غير موجودة");

    const platformWallet: Wallet | null = await getWalletById(platformWalletId);
    if (!platformWallet) throw new Error("محفظة المنصة غير موجودة");

    // ✅ 2 – حساب المبالغ
    const showroomFee = 117;
    const trafficFee = 383;
    const platformCommission = Math.round(totalPrice * 0.05);
    const showroomNetAmount = totalPrice - showroomFee - trafficFee - platformCommission;

    if (showroomNetAmount < 0) {
      throw new Error("المبلغ الصافي للمعرض سالب! تحقق من السعر أو العمولة.");
    }

    // ✅ 3 – التحقق من رصيد المشتري
    if (buyerWallet.balance < totalPrice) {
      throw new Error("رصيد المشتري غير كافٍ لإتمام العملية");
    }

    // ✅ 4 – بدء معاملة (Transaction)
    const supabase = supabaseClient();
    const { error: startError } = await supabase.rpc('start_transaction');
    if (startError) throw new Error("خطأ في بدء المعاملة: " + startError.message);

    // ✅ 5 – خصم المبلغ من المشتري
    await decrementWalletBalance(buyerWalletId, totalPrice);

    // ✅ 6 – إضافة المبالغ لمحفظة المعرض
    await incrementWalletBalance(showroomWalletId, showroomNetAmount);
    await incrementWalletBalance(showroomWalletId, showroomFee);
    await incrementWalletBalance(showroomWalletId, trafficFee);

    // ✅ 7 – إضافة المبلغ لمحفظة المنصة
    await incrementWalletBalance(platformWalletId, platformCommission);

    // ✅ 8 – إنشاء قيود التسوية (Settlements)
    await createSettlement({
      type: 'car_sale',
      from: buyerWalletId,
      to: showroomWalletId,
      amount: showroomNetAmount
    });

    await createSettlement({
      type: 'showroom_fee',
      from: buyerWalletId,
      to: showroomWalletId,
      amount: showroomFee
    });

    await createSettlement({
      type: 'traffic_fee',
      from: buyerWalletId,
      to: showroomWalletId,
      amount: trafficFee
    });

    await createSettlement({
      type: 'platform_fee',
      from: buyerWalletId,
      to: platformWalletId,
      amount: platformCommission
    });

    // ✅ 9 – إنهاء المعاملة بنجاح
    await supabase.rpc('commit_transaction');

    return NextResponse.json({ success: true, message: "تمت العملية بنجاح" });

  } catch (error: any) {
    console.error('خطأ أثناء معالجة الطلب:', error);

    // ✅ 10 – محاولة إرجاع أي معاملة معلقة
    const supabase = supabaseClient();
    await supabase.rpc('rollback_transaction');

    return NextResponse.json({
      success: false,
      message: error?.message || "حدث خطأ غير متوقع"
    });
  }
}
