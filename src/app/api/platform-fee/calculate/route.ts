import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// دالة لحساب عمولة المنصة حسب السعر
function calculatePlatformFee(salePrice: number): number {
  if (salePrice <= 50000) {
    return 300; // من 0 إلى 50,000 ريال
  } else if (salePrice <= 100000) {
    return 500; // من 50,001 إلى 100,000 ريال
  } else if (salePrice <= 150000) {
    return 1000; // من 100,001 إلى 150,000 ريال
  } else if (salePrice <= 200000) {
    return 1500; // من 150,001 إلى 200,000 ريال
  } else {
    // بعد 200,000 ريال، كل 100,000 ريال إضافية = 1000 ريال عمولة
    let extra = Math.floor((salePrice - 200000) / 100000) + 1;
    let fee = 1500 + (extra * 1000);
    // الحد الأقصى للعمولة 10,000 ريال إذا تجاوز المليون
    return Math.min(fee, 10000);
  }
}

export async function POST(request: Request) {
  try {
    const { salePrice } = await request.json();
    if (!salePrice) {
      return NextResponse.json({ error: 'salePrice is required' }, { status: 400 });
    }

    // حساب العمولة مباشرة
    const platformFee = calculatePlatformFee(salePrice);

    return NextResponse.json({
      success: true,
      platformFee: platformFee
    });
  } catch (err) {
    return NextResponse.json({ error: 'فشل في حساب عمولة المنصة' }, { status: 500 });
  }
} 