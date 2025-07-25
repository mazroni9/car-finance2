import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase/supabaseClient';
import {
  getWalletById,
  decrementWalletBalance,
  incrementWalletBalance,
  createSettlement
} from '@/lib/services/walletService';
import type { Wallet, PurchaseCarRequest } from '@/types/finance';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // ✅ الخطوة 0 – قراءة البيانات من الطلب
    const body: PurchaseCarRequest = await req.json();
    const { buyerWalletId, showroomWalletId, platformWalletId, totalPrice } = body;

    // ✅ الخطوة 1 – التحقق من وجود المحافظ
    const buyerWallet: Wallet | null = await getWalletById(buyerWalletId);
    if (!buyerWallet) throw new Error("محفظة المشتري غير موجودة");

    const showroomWallet: Wallet | null = await getWalletById(showroomWalletId);
    if (!showroomWallet) throw new Error("محفظة المعرض غير موجودة");

    const platformWallet: Wallet | null = await getWalletById(platformWalletId);
    if (!platformWallet) throw new Error("محفظة المنصة غير موجودة");

    // ✅ الخطوة 2 – حساب المبالغ
    const showroomFee = 117;
    const trafficFee = 383;
    const platformCommission = Math.round(totalPrice * 0.05); // مؤقتًا 5%
    const showroomNetAmount = totalPrice - showroomFee - trafficFee - platformCommission;

    if (showroomNetAmount < 0) {
      throw new Error("المبلغ الصافي للمعرض سالب! تحقق من السعر أو العمولة.");
    }

    // ✅ الخطوة 3 – التحقق من رصيد المشتري
    if (buyerWallet.balance < totalPrice) {
      throw new Error("رصيد المشتري غير كافٍ لإتمام العملية");
    }

    // ✅ الخطوة 4 – بدء معاملة (Transaction)
    const supabase = supabaseClient();
    const { error: startError } = await supabase.rpc('start_transaction');
    if (startError) throw new Error("خطأ في بدء المعاملة: " + startError.message);

    // ✅ الخطوة 5 – خصم المبلغ من المشتري
    await decrementWalletBalance(buyerWalletId, totalPrice);

    // ✅ الخطوة 6 – إضافة المبالغ لمحفظة المعرض
    await incrementWalletBalance(showroomWalletId, showroomNetAmount);
    await incrementWalletBalance(showroomWalletId, showroomFee);
    await incrementWalletBalance(showroomWalletId, trafficFee);

    // ✅ الخطوة 7 – إضافة المبلغ لمحفظة المنصة
    await incrementWalletBalance(platformWalletId, platformCommission);

    // ✅ الخطوة 8 – إنشاء قيود التسوية (Settlements)
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

    // ✅ الخطوة 9 – إنهاء المعاملة بنجاح
    await supabase.rpc('commit_transaction');

    return NextResponse.json({ success: true, message: "تمت العملية بنجاح" });

  } catch (error: any) {
    console.error('خطأ أثناء معالجة الطلب:', error);

    // ✅ الخطوة 10 – محاولة إرجاع أي معاملة معلقة
    const supabase = supabaseClient();
    await supabase.rpc('rollback_transaction');

    return NextResponse.json({
      success: false,
      message: error?.message || "حدث خطأ غير متوقع"
    });
  }
}
