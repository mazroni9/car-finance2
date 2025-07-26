/**
 * سكريبت تطبيق الإسكيم الموحد
 * هذا السكريبت يطبق الإسكيم الموحد على قاعدة البيانات
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// قراءة متغيرات البيئة
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ متغيرات البيئة غير موجودة');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'موجود' : 'غير موجود');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'موجود' : 'غير موجود');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyUnifiedSchema() {
  try {
    console.log('🚀 بدء تطبيق الإسكيم الموحد...');
    
    // قراءة ملف الإسكيم الموحد
    const schemaPath = path.join(__dirname, '../sql/unified_schema.sql');
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('📖 تم قراءة ملف الإسكيم الموحد');
    
    // تقسيم الإسكيم إلى أوامر منفصلة
    const statements = schemaContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📊 عدد الأوامر المطلوب تنفيذها: ${statements.length}`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      try {
        console.log(`⏳ تنفيذ الأمر ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`❌ خطأ في الأمر ${i + 1}:`, error);
          errorCount++;
        } else {
          console.log(`✅ تم تنفيذ الأمر ${i + 1} بنجاح`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ خطأ في تنفيذ الأمر ${i + 1}:`, err);
        errorCount++;
      }
    }
    
    console.log('\n📊 ملخص النتائج:');
    console.log(`✅ الأوامر الناجحة: ${successCount}`);
    console.log(`❌ الأوامر الفاشلة: ${errorCount}`);
    console.log(`📊 إجمالي الأوامر: ${statements.length}`);
    
    if (errorCount === 0) {
      console.log('🎉 تم تطبيق الإسكيم الموحد بنجاح!');
    } else {
      console.log('⚠️ تم تطبيق الإسكيم مع بعض الأخطاء');
    }
    
    // التحقق من وجود البيانات
    await verifyData();
    
  } catch (error) {
    console.error('❌ خطأ في تطبيق الإسكيم:', error);
    process.exit(1);
  }
}

async function verifyData() {
  try {
    console.log('\n🔍 التحقق من البيانات...');
    
    // التحقق من جدول السيارات
    const { data: cars, error: carsError } = await supabase
      .from('car_showcase')
      .select('count')
      .limit(1);
    
    if (carsError) {
      console.error('❌ خطأ في التحقق من جدول السيارات:', carsError);
    } else {
      console.log('✅ جدول السيارات يعمل بشكل صحيح');
    }
    
    // جلب عدد السيارات
    const { count: carsCount, error: countError } = await supabase
      .from('car_showcase')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ خطأ في عد السيارات:', countError);
    } else {
      console.log(`📊 عدد السيارات في الجدول: ${carsCount}`);
    }
    
  } catch (error) {
    console.error('❌ خطأ في التحقق من البيانات:', error);
  }
}

// تشغيل السكريبت
if (require.main === module) {
  applyUnifiedSchema()
    .then(() => {
      console.log('✅ تم الانتهاء من السكريبت');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ خطأ في السكريبت:', error);
      process.exit(1);
    });
}

module.exports = { applyUnifiedSchema }; 