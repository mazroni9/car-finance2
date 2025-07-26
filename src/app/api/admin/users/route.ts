import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ✅ املأ من .env.local في مشروعك
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    // ✅ جلب بيانات المستخدمين
    const { data, error } = await supabase
      .from('users') // ✅ تأكد من اسم الجدول في قاعدة البيانات
      .select('id, email, role, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
