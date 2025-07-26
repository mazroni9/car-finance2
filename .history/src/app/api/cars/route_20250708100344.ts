import { NextResponse } from 'next/server';
import supabase from '@/lib/services/supabase';
import { queryTable } from '@/lib/services/queries';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500
});

// الحصول على جميع السيارات أو سيارة واحدة حسب id
export async function GET(request) {
  try {
    // التحقق من حد الطلبات
    try {
      await limiter.check(10, 'CARS_API');
    } catch {
      return NextResponse.json(
        { error: 'عدد طلبات كثير جداً، حاول مرة أخرى بعد دقيقة' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // جلب سيارة واحدة فقط
      const cars = await queryTable('car_showcase', {
        filters: { id },
        limit: 1
      });
      if (!cars || cars.length === 0) {
        return NextResponse.json(null, { status: 404 });
      }
      return NextResponse.json(cars[0]);
    }

    // جلب جميع السيارات
    const cars = await queryTable('car_showcase', {
      orderBy: {
        column: 'created_at',
        ascending: false
      }
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}

// إضافة سيارة جديدة
export async function POST(request: Request) {
  try {
    // التحقق من حد الطلبات
    try {
      await limiter.check(5, 'CARS_API_POST');
    } catch {
      return NextResponse.json(
        { error: 'عدد طلبات كثير جداً، حاول مرة أخرى بعد دقيقة' },
        { status: 429 }
      );
    }

    const data = await request.json();
    
    // التحقق من صحة البيانات الأساسية
    if (!data.make || !data.model || !data.price) {
      return NextResponse.json(
        { error: 'بيانات غير صحيحة: يجب توفير الشركة المصنعة والموديل والسعر' },
        { status: 400 }
      );
    }

    // إضافة السيارة
    const { data: newCar, error: insertError } = await supabase
      .from('car_showcase')
      .insert({
        make: data.make || 'غير محدد',
        model: data.model || 'غير محدد',
        year: data.year || new Date().getFullYear(),
        price: data.price || 0,
        color: data.color || 'غير محدد',
        mileage: data.mileage || 0,
        fuel_type: data.fuelType || 'بنزين',
        transmission: data.transmission || 'أوتوماتيك',
        status: 'available',
        seller_id: data.sellerId || null
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { error: 'فشل في إضافة السيارة', details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(newCar);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'خطأ في معالجة الطلب',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
} 