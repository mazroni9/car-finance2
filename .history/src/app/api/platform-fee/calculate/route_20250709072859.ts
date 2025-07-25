import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const { salePrice, feeType = 'car_sale' } = await request.json();
    if (!salePrice) {
      return NextResponse.json({ error: 'salePrice is required' }, { status: 400 });
    }

    // جلب نوع العمولة من جدول العمولات
    const { data: feeRow, error } = await supabase
      .from('platform_fees')
      .select('*')
      .eq('type', feeType)
      .single();

    if (error || !feeRow) {
      return NextResponse.json({ error: 'نوع العمولة غير موجود في قاعدة البيانات' }, { status: 404 });
    }

    let feeValue = 0;
    if (feeRow.is_percentage) {
      feeValue = Math.round((salePrice * feeRow.value) / 100);
    } else {
      feeValue = feeRow.value;
    }

    return NextResponse.json({
      success: true,
      feeType: feeRow.type,
      feeValue,
      isPercentage: feeRow.is_percentage,
      rawValue: feeRow.value,
      details: feeRow
    });
  } catch (err) {
    return NextResponse.json({ error: 'فشل في حساب عمولة المنصة' }, { status: 500 });
  }
} 