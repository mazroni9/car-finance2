const { createClient } = require('@supabase/supabase-js');

// متغيرات البيئة
const supabaseUrl = 'https://uhdopxhxmrxwystnbmmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVoZG9weGh4bXJ4d3lzdG5ibW1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTM1OTcsImV4cCI6MjA2NTk4OTU5N30.zOHoKktnz2qTpejeXKdJMhIpoy66uJ8FiD3WvmMDa5s';

console.log('🔍 بدء اختبار الاتصال بقاعدة البيانات...');
console.log('🔍 URL:', supabaseUrl);
console.log('🔍 Key موجود:', !!supabaseKey);

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔍 جاري اختبار الاتصال...');
    
    // اختبار جلب البيانات من جدول car_showcase
    const { data, error } = await supabase
      .from('car_showcase')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ خطأ في الاتصال:', error.message);
      return;
    }
    
    console.log('✅ الاتصال ناجح!');
    console.log('✅ عدد السيارات الموجودة:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('✅ مثال على سيارة:', {
        id: data[0].id,
        make: data[0].make,
        model: data[0].model,
        price: data[0].price
      });
    }
    
  } catch (error) {
    console.error('❌ خطأ غير متوقع:', error.message);
  }
}

testConnection(); 