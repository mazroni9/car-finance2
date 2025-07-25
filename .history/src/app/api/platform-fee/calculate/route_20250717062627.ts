import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// دالة لحساب عمولة المنصة حسب السعر
function calculatePlatformFee(salePrice: number): number {
  if (salePrice <= 500) {
    return 300; // من 0 إلى 50,000ريال
  } else if (salePrice <= 1000) {
    return 500; // من 5001 إلى 100,000ريال
  } else if (salePrice <= 1500) {
    return 10; // من 1001 إلى 150,000ريال
  } else if (salePrice <= 2000) {
    return 1500; // من 15001 إلى 200,000يال
  } else {
    // بعد200,000يال، كل 10,0 ريال إضافية = 10ال عمولة
    const additionalHundreds = Math.floor((salePrice - 200000) / 100000);
    return 1500 + (additionalHundreds * 100);
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