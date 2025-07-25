import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // التحقق من متغيرات البيئة
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !serviceRoleKey) {
      return Response.json({ 
        error: '❌ متغيرات البيئة مفقودة',
        supabaseUrl: !!supabaseUrl,
        serviceRoleKey: !!serviceRoleKey
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // اختبار الاتصال
    const { data, error } = await supabase
      .from('installment_rules')
      .select('count')
      .limit(1);

    if (error) {
      return Response.json({ 
        error: '❌ خطأ في الاتصال بقاعدة البيانات',
        details: error.message
      }, { status: 500 });
    }

    return Response.json({ 
      success: true,
      message: '✅ الاتصال بقاعدة البيانات يعمل بشكل صحيح',
      data: data
    });

  } catch (error) {
    return Response.json({ 
      error: '❌ خطأ في الخادم',
      details: error.message
    }, { status: 500 });
  }
} 