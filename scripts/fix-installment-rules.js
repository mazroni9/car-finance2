const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// إعداد Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fixInstallmentRulesTable() {
  try {
    console.log('🔧 بدء إصلاح جدول installment_rules...');
    
    // قراءة ملف SQL
    const sqlFile = path.join(__dirname, '../sql/fix_installment_rules_table.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('📄 تم قراءة ملف SQL');
    
    // تنفيذ SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });
    
    if (error) {
      console.error('❌ خطأ في تنفيذ SQL:', error);
      return;
    }
    
    console.log('✅ تم إصلاح الجدول بنجاح!');
    console.log('📊 يمكنك الآن استخدام النموذج لحفظ بيانات التمويل');
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  }
}

// تشغيل السكريبت
fixInstallmentRulesTable(); 