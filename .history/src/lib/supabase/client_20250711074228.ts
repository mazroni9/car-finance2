import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// طباعة تشخيصية للتأكد من تحميل المتغيرات
console.log('🔍 Supabase URL:', supabaseUrl ? '✅ موجود' : '❌ مفقود');
console.log('🔍 Supabase Key:', supabaseAnonKey ? '✅ موجود' : '❌ مفقود');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
