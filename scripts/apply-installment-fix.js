const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// إعداد Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function applyInstallmentFix() {
  try {
    console.log('🔧 بدء إصلاح جدول installment_rules...');
    
    // قراءة ملف SQL
    const sqlFile = path.join(__dirname, '../sql/fix_installment_rules_complete.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('📄 تم قراءة ملف SQL');
    console.log('📊 محتوى الملف:', sqlContent.substring(0, 200) + '...');
    
    // تنفيذ SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ خطأ في تنفيذ SQL:', error);
      return;
    }
    
    console.log('✅ تم إصلاح الجدول بنجاح!');
    console.log('📊 يمكنك الآن:');
    console.log('   1. استخدام النموذج في /admin/car-finance-entry');
    console.log('   2. عرض البيانات في /car-finance');
    console.log('   3. التحقق من API route /api/finance/rules');
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  }
}

// تشغيل السكريبت
applyInstallmentFix(); 