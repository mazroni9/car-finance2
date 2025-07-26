import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const MAZBROTHERS_UUID = '2bf61df6-da52-45f1-88c4-05316e51df04';
const PLATFORM_WALLET_UUID = '16dcb112-1222-4e51-9869-6ec0624eea8e';
const SHOWROOM_FEE = 117;
const TRAFFIC_FEE = 383;

export async function POST(request: Request) {
  const trx = supabase; // Supabase لا يدعم معاملات حقيقية عبر JS SDK، سنحاكيها بالترتيب مع التحقق في كل خطوة
  try {
    const { salePrice, buyerId } = await request.json();
    if (!salePrice || !buyerId) {
      return NextResponse.json({ error: 'Missing required fields: salePrice, buyerId' }, { status: 400 });
    }

    // 1. تحقق من وجود المحافظ
    // محفظة المشتري
    const { data: buyerWallet, error: buyerWalletError } = await trx
      .from('wallets')
      .select('*')
      .eq('user_id', buyerId)
      .eq('type', 'personal')
      .eq('status', 'active')
      .single();
    if (buyerWalletError || !buyerWallet) {
      return NextResponse.json({ error: 'محفظة المشتري غير موجودة' }, { status: 400 });
    }
    // محفظة المعرض
    const { data: showroomWallet, error: showroomWalletError } = await trx
      .from('wallets')
      .select('*')
      .eq('user_id', MAZBROTHERS_UUID)
      .eq('type', 'showroom')
      .eq('status', 'active')
      .single();
    if (showroomWalletError || !showroomWallet) {
      return NextResponse.json({ error: 'محفظة المعرض غير موجودة' }, { status: 400 });
    }
    // محفظة المنصة
    const { data: platformWallet, error: platformWalletError } = await trx
      .from('wallets')
      .select('*')
      .eq('id', PLATFORM_WALLET_UUID)
      .eq('type', 'platform')
      .eq('status', 'active')
      .single();
    if (platformWalletError || !platformWallet) {
      return NextResponse.json({ error: 'محفظة المنصة غير موجودة' }, { status: 400 });
    }

    // 2. حساب المبالغ
    // عمولة المنصة: مؤقتًا 5% (يمكنك تعديلها لجلبها من جدول العمولات)
    const platformFee = Math.round(salePrice * 0.05);
    const netToShowroom = salePrice - (SHOWROOM_FEE + TRAFFIC_FEE + platformFee);

    // 3. تحقق من رصيد المشتري
    if (buyerWallet.balance < salePrice) {
      return NextResponse.json({ error: 'رصيد المشتري غير كافٍ' }, { status: 400 });
    }

    // 4. خصم المبلغ من المشتري
    const { error: decBuyerErr } = await trx.rpc('decrement_wallet_balance', {
      p_user_id: buyerWallet.user_id,
      p_amount: salePrice
    });
    if (decBuyerErr) {
      return NextResponse.json({ error: 'فشل في خصم المبلغ من المشتري' }, { status: 500 });
    }

    // 5. توزيع المبالغ
    // أضف للمعرض: صافي + عمولة + المرور
    const { error: incShowroomNetErr } = await trx.rpc('increment_wallet_balance', {
      p_user_id: showroomWallet.user_id,
      p_amount: netToShowroom
    });
    if (incShowroomNetErr) {
      return NextResponse.json({ error: 'فشل في إضافة صافي المبلغ للمعرض' }, { status: 500 });
    }
    const { error: incShowroomFeeErr } = await trx.rpc('increment_wallet_balance', {
      p_user_id: showroomWallet.user_id,
      p_amount: SHOWROOM_FEE
    });
    if (incShowroomFeeErr) {
      return NextResponse.json({ error: 'فشل في إضافة عمولة المعرض' }, { status: 500 });
    }
    const { error: incTrafficFeeErr } = await trx.rpc('increment_wallet_balance', {
      p_user_id: showroomWallet.user_id,
      p_amount: TRAFFIC_FEE
    });
    if (incTrafficFeeErr) {
      return NextResponse.json({ error: 'فشل في إضافة رسوم المرور' }, { status: 500 });
    }
    // أضف للمنصة: عمولة المنصة
    const { error: incPlatformFeeErr } = await trx.rpc('increment_wallet_balance', {
      p_user_id: platformWallet.user_id,
      p_amount: platformFee
    });
    if (incPlatformFeeErr) {
      return NextResponse.json({ error: 'فشل في إضافة عمولة المنصة' }, { status: 500 });
    }

    // 6. تسجيل قيود التسوية
    const settlements = [
      {
        type: 'car_sale',
        amount: netToShowroom,
        from_wallet: buyerWallet.id,
        to_wallet: showroomWallet.id,
        status: 'completed',
        description: 'صافي بيع السيارة'
      },
      {
        type: 'showroom_fee',
        amount: SHOWROOM_FEE,
        from_wallet: buyerWallet.id,
        to_wallet: showroomWallet.id,
        status: 'completed',
        description: 'عمولة المعرض'
      },
      {
        type: 'traffic_fee',
        amount: TRAFFIC_FEE,
        from_wallet: buyerWallet.id,
        to_wallet: showroomWallet.id,
        status: 'completed',
        description: 'رسوم المرور'
      },
      {
        type: 'platform_fee',
        amount: platformFee,
        from_wallet: buyerWallet.id,
        to_wallet: platformWallet.id,
        status: 'completed',
        description: 'عمولة المنصة'
      }
    ];
    for (const settlement of settlements) {
      const { error: settlementErr } = await trx.from('settlements').insert([settlement]);
      if (settlementErr) {
        return NextResponse.json({ error: 'فشل في تسجيل التسوية: ' + settlement.type }, { status: 500 });
      }
    }

    // 7. الرد النهائي
    return NextResponse.json({
      success: true,
      message: 'تمت عملية الشراء والتسويات بنجاح',
      details: {
        netToShowroom,
        showroomFee: SHOWROOM_FEE,
        trafficFee: TRAFFIC_FEE,
        platformFee
      }
    });
  } catch (error) {
    console.error('Error in car purchase settlement:', error);
    return NextResponse.json({ error: 'فشل في تنفيذ العملية' }, { status: 500 });
  }
}
