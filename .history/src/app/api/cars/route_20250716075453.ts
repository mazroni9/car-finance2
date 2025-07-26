import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    console.log('🔍 جاري جلب السيارات من قاعدة البيانات...');

    const { data, error } = await supabase
      .from('car_showcase')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ خطأ في جلب السيارات:', error);
      return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
    }

    console.log('✅ تم جلب السيارات بنجاح:', data?.length, 'سيارة');
    
    // طباعة تفاصيل أول سيارة للتحقق من البيانات
    if (data && data.length > 0) {
      console.log('📋 تفاصيل أول سيارة:', {
        id: data[0].id,
        make: data[0].make,
        model: data[0].model,
        price: data[0].price,
        image_url: data[0].image_url,
        image_url_type: typeof data[0].image_url,
        image_url_length: Array.isArray(data[0].image_url) ? data[0].image_url.length : 'N/A'
      });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('❌ خطأ عام في API السيارات:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 