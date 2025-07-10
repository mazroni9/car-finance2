import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { salePrice } = await request.json();
    if (!salePrice) {
      return NextResponse.json({ error: 'salePrice is required' }, { status: 400 });
    }

    // جلب العمولة من جدول commission_tiers بناءً على سعر السيارة
    const { data: tier, error } = await supabase
      .from('commission_tiers')
      .select('platform_fee')
      .lte('min_price', salePrice)
      .gte('max_price', salePrice)
      .single();

    if (error || !tier) {
      return NextResponse.json({ error: 'لم يتم العثور على عمولة مناسبة لهذا السعر' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      platformFee: tier.platform_fee
    });
  } catch (err) {
    return NextResponse.json({ error: 'فشل في حساب عمولة المنصة' }, { status: 500 });
  }
} 