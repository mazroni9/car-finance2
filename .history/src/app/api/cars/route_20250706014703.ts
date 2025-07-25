import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabaseClient';
import { fetchCars } from '@/lib/services/fetchCars';
import { createCar } from '@/lib/services/createCar';
import { validateCarData, calculateFinancials } from '@/lib/utils/finance';
import { queryTable } from '@/lib/services/queries';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
});

// الحصول على جميع السيارات
export async function GET() {
  try {
    const cars = await fetchCars();
    return NextResponse.json(cars);
  } catch (error) {
    console.error('Error in cars route:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب السيارات' },
      { status: 500 }
    );
  }
}

// إضافة سيارة جديدة
export async function POST(request: Request) {
  try {
    const carData = await request.json();
    const car = await createCar(carData);
    return NextResponse.json(car);
  } catch (error) {
    console.error('Error in cars route:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء إضافة السيارة' },
      { status: 500 }
    );
  }
} 