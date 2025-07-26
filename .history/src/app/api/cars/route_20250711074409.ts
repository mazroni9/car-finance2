import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

// الحصول على جميع السيارات أو سيارة واحدة حسب id
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // جلب سيارة واحدة فقط
      const { data, error } = await supabase
        .from('car_showcase')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return NextResponse.json(null, { status: 404 });
      }
      return NextResponse.json(data);
    }

    // جلب جميع السيارات
    const { data, error } = await supabase
      .from('car_showcase')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'خطأ في قاعدة البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json(data || []);
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