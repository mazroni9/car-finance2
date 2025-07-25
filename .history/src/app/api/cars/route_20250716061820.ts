import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// الحصول على جميع السيارات أو سيارة واحدة حسب id
export async function GET(request: Request) {
  const supabase = createClient();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    console.log('🔍 API Cars - جاري جلب البيانات...');

    if (id) {
      // جلب سيارة واحدة فقط
      const { data, error } = await supabase
        .from('car_showcase')
        .select('*')
        .eq('id', id)
        .single();

      console.log('📊 سيارة واحدة:', data);
      console.log('❌ خطأ سيارة واحدة:', error);

      if (error || !data) {
        console.error('❌ لم يتم العثور على السيارة:', error);
        return NextResponse.json(null, { status: 404 });
      }
      return NextResponse.json(data);
    }

    // جلب جميع السيارات
    const { data, error } = await supabase
      .from('car_showcase')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('📊 جميع السيارات:', data);
    console.log('❌ خطأ جميع السيارات:', error);

    if (error) {
      console.error('❌ خطأ في قاعدة البيانات:', error);
      return NextResponse.json(
        { error: 'خطأ في قاعدة البيانات', details: error.message },
        { status: 500 }
      );
    }

    console.log('✅ تم جلب السيارات بنجاح، العدد:', data?.length || 0);
    return NextResponse.json(data || []);
  } catch (error) {
    console.error('❌ خطأ غير متوقع:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع', details: error instanceof Error ? error.message : 'خطأ غير معروف' },
      { status: 500 }
    );
  }
}

// إضافة سيارة جديدة
export async function POST(request: Request) {
  const supabase = createClient();
  try {
    const data = await request.json();
    
    console.log('🔍 API Cars POST - البيانات المرسلة:', data);
    
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
        seller_id: data.sellerId || null,
        image_url: data.image_url || null,
        images: data.images || null,
        description: data.description || null
      })
      .select()
      .single();

    console.log('📊 سيارة جديدة:', newCar);
    console.log('❌ خطأ إضافة سيارة:', insertError);

    if (insertError) {
      console.error('❌ فشل في إضافة السيارة:', insertError);
      return NextResponse.json(
        { error: 'فشل في إضافة السيارة', details: insertError.message },
        { status: 500 }
      );
    }

    console.log('✅ تم إضافة السيارة بنجاح');
    return NextResponse.json(newCar);
  } catch (error) {
    console.error('❌ خطأ في معالجة الطلب:', error);
    return NextResponse.json(
      { 
        error: 'خطأ في معالجة الطلب',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
} 