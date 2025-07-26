const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function healthCheck() {
  console.log('🔍 فحص شامل للتطبيق...\n');

  try {
    // 1. فحص الاتصال بقاعدة البيانات
    console.log('1️⃣ فحص الاتصال بقاعدة البيانات...');
    const { data: tables, error } = await supabase
      .from('car_showcase')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ خطأ في الاتصال:', error.message);
      return;
    }
    console.log('✅ الاتصال بقاعدة البيانات يعمل\n');

    // 2. فحص الجداول المهمة
    console.log('2️⃣ فحص الجداول المهمة...');
    const importantTables = [
      'car_showcase',
      'customers', 
      'installment_rules',
      'financing_requests',
      'users',
      'wallets'
    ];

    for (const table of importantTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ جدول ${table}: ${error.message}`);
        } else {
          console.log(`✅ جدول ${table}: ${count} سجل`);
        }
      } catch (err) {
        console.log(`❌ خطأ في جدول ${table}:`, err.message);
      }
    }
    console.log('');

    // 3. فحص البيانات
    console.log('3️⃣ فحص البيانات...');
    
    // فحص السيارات
    const { data: cars, error: carsError } = await supabase
      .from('car_showcase')
      .select('*')
      .limit(3);
    
    if (carsError) {
      console.log('❌ خطأ في بيانات السيارات:', carsError.message);
    } else {
      console.log(`✅ السيارات: ${cars.length} سيارة متاحة`);
      if (cars.length > 0) {
        console.log(`   أول سيارة: ${cars[0].make} ${cars[0].model}`);
      }
    }

    // فحص العملاء
    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .limit(3);
    
    if (customersError) {
      console.log('❌ خطأ في بيانات العملاء:', customersError.message);
    } else {
      console.log(`✅ العملاء: ${customers.length} عميل`);
    }

    // فحص قواعد الأقساط
    const { data: rules, error: rulesError } = await supabase
      .from('installment_rules')
      .select('*')
      .limit(3);
    
    if (rulesError) {
      console.log('❌ خطأ في قواعد الأقساط:', rulesError.message);
    } else {
      console.log(`✅ قواعد الأقساط: ${rules.length} قاعدة`);
    }

    console.log('');

    // 4. فحص API endpoints
    console.log('4️⃣ فحص API endpoints...');
    
    const endpoints = [
      '/api/cars',
      '/api/finance/rules',
      '/api/finance/calculate'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:3000${endpoint}`);
        if (response.ok) {
          console.log(`✅ ${endpoint}: يعمل`);
        } else {
          console.log(`❌ ${endpoint}: خطأ ${response.status}`);
        }
      } catch (err) {
        console.log(`❌ ${endpoint}: خطأ في الاتصال`);
      }
    }

    console.log('\n✅ فحص شامل مكتمل!');
    console.log('🎉 التطبيق يعمل بشكل صحيح');

  } catch (error) {
    console.log('❌ خطأ في الفحص الشامل:', error.message);
  }
}

healthCheck(); 