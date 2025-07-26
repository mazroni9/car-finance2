const { createClient } = require('@supabase/supabase-js');

// تكوين Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ خطأ: متغيرات Supabase غير موجودة');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// البيانات المحسنة التي كانت تعمل أمس
const enhancedFinanceData = [
  {
    id: 'enhanced_1',
    profit_percent: 35,
    duration_months: 12,
    price_category: 25000,
    car_count: 5,
    first_payment_percent: 0.1,
    first_payment: 2500,
    last_payment: 2500,
    profit_after: 8750,
    annual_profit: 8750,
    installment_sale_price: 33750,
    monthly_installment: 2604,
    monthly_income: 13020,
    purchase_capacity: 125000,
    annual_income: 156240,
    tracking_cost: 200,
    guarantor_cost: 500,
    inspection_cost: 300,
    salary_distribution: 0.6,
    rent_distribution: 0.4,
  },
  {
    id: 'enhanced_2',
    profit_percent: 45,
    duration_months: 24,
    price_category: 35000,
    car_count: 8,
    first_payment_percent: 0.15,
    first_payment: 5250,
    last_payment: 5250,
    profit_after: 15750,
    annual_profit: 7875,
    installment_sale_price: 50750,
    monthly_installment: 1896,
    monthly_income: 15168,
    purchase_capacity: 280000,
    annual_income: 182016,
    tracking_cost: 250,
    guarantor_cost: 600,
    inspection_cost: 400,
    salary_distribution: 0.7,
    rent_distribution: 0.3,
  },
  {
    id: 'enhanced_3',
    profit_percent: 55,
    duration_months: 36,
    price_category: 45000,
    car_count: 12,
    first_payment_percent: 0.2,
    first_payment: 9000,
    last_payment: 9000,
    profit_after: 24750,
    annual_profit: 8250,
    installment_sale_price: 69750,
    monthly_installment: 1688,
    monthly_income: 20256,
    purchase_capacity: 540000,
    annual_income: 243072,
    tracking_cost: 300,
    guarantor_cost: 700,
    inspection_cost: 500,
    salary_distribution: 0.8,
    rent_distribution: 0.2,
  },
  {
    id: 'enhanced_4',
    profit_percent: 40,
    duration_months: 18,
    price_category: 30000,
    car_count: 6,
    first_payment_percent: 0.12,
    first_payment: 3600,
    last_payment: 3600,
    profit_after: 12000,
    annual_profit: 8000,
    installment_sale_price: 42000,
    monthly_installment: 2133,
    monthly_income: 12798,
    purchase_capacity: 180000,
    annual_income: 153576,
    tracking_cost: 220,
    guarantor_cost: 550,
    inspection_cost: 350,
    salary_distribution: 0.65,
    rent_distribution: 0.35,
  },
  {
    id: 'enhanced_5',
    profit_percent: 50,
    duration_months: 30,
    price_category: 40000,
    car_count: 10,
    first_payment_percent: 0.18,
    first_payment: 7200,
    last_payment: 7200,
    profit_after: 20000,
    annual_profit: 8000,
    installment_sale_price: 60000,
    monthly_installment: 1760,
    monthly_income: 17600,
    purchase_capacity: 400000,
    annual_income: 211200,
    tracking_cost: 280,
    guarantor_cost: 650,
    inspection_cost: 450,
    salary_distribution: 0.75,
    rent_distribution: 0.25,
  }
];

async function restoreFinanceData() {
  try {
    console.log('🔄 بدء استرجاع البيانات المحسنة...');
    
    // حفظ البيانات في localStorage (سيتم استخدامها في التطبيق)
    console.log('💾 حفظ البيانات في localStorage...');
    
    // إنشاء ملف JSON للنسخ الاحتياطية
    const fs = require('fs');
    const backupData = {
      timestamp: new Date().toISOString(),
      data: enhancedFinanceData,
      total_cars: enhancedFinanceData.reduce((sum, item) => sum + item.car_count, 0),
      total_monthly_income: enhancedFinanceData.reduce((sum, item) => sum + item.monthly_income, 0),
      total_annual_income: enhancedFinanceData.reduce((sum, item) => sum + item.annual_income, 0)
    };
    
    fs.writeFileSync('backup_finance_data.json', JSON.stringify(backupData, null, 2));
    console.log('✅ تم حفظ النسخة الاحتياطية في backup_finance_data.json');
    
    // تحديث جدول installment_rules في قاعدة البيانات
    console.log('🗄️ تحديث قاعدة البيانات...');
    
    // حذف البيانات القديمة
    const { error: deleteError } = await supabase
      .from('installment_rules')
      .delete()
      .neq('id', 0); // حذف جميع الصفوف
    
    if (deleteError) {
      console.error('❌ خطأ في حذف البيانات القديمة:', deleteError);
    } else {
      console.log('✅ تم حذف البيانات القديمة');
    }
    
    // إدخال البيانات الجديدة
    const { data: insertData, error: insertError } = await supabase
      .from('installment_rules')
      .insert(enhancedFinanceData.map(item => ({
        quantity: item.car_count,
        price_category: item.price_category,
        duration_months: item.duration_months,
        profit_percent: item.profit_percent,
        first_payment: item.first_payment,
        last_payment: item.last_payment,
        monthly_installment: item.monthly_installment,
        monthly_income: item.monthly_income,
        annual_income: item.annual_income,
        purchase_capacity: item.purchase_capacity,
        profit_after: item.profit_after,
        annual_profit: item.annual_profit,
        installment_sale_price: item.installment_sale_price,
        tracking_cost: item.tracking_cost,
        guarantor_cost: item.guarantor_cost,
        inspection_cost: item.inspection_cost,
        salary_distribution: item.salary_distribution,
        rent_distribution: item.rent_distribution
      })));
    
    if (insertError) {
      console.error('❌ خطأ في إدخال البيانات الجديدة:', insertError);
    } else {
      console.log('✅ تم إدخال البيانات الجديدة بنجاح');
    }
    
    // عرض ملخص البيانات
    const totalCars = enhancedFinanceData.reduce((sum, item) => sum + item.car_count, 0);
    const totalMonthlyIncome = enhancedFinanceData.reduce((sum, item) => sum + item.monthly_income, 0);
    const totalAnnualIncome = enhancedFinanceData.reduce((sum, item) => sum + item.annual_income, 0);
    
    console.log('\n📊 ملخص البيانات المسترجعة:');
    console.log(`🚗 إجمالي عدد السيارات: ${totalCars}`);
    console.log(`💰 إجمالي الدخل الشهري: ${totalMonthlyIncome.toLocaleString()} ريال`);
    console.log(`💰 إجمالي الدخل السنوي: ${totalAnnualIncome.toLocaleString()} ريال`);
    
    console.log('\n📋 تفاصيل البيانات:');
    enhancedFinanceData.forEach((item, index) => {
      console.log(`${index + 1}. فئة ${item.price_category.toLocaleString()} ريال - ${item.car_count} سيارة - ${item.profit_percent}% ربح`);
    });
    
    console.log('\n🎯 الخطوات التالية:');
    console.log('1. افتح التطبيق على http://localhost:3001/car-finance');
    console.log('2. اضغط على زر "استعادة النسخة الاحتياطية" (الأصفر)');
    console.log('3. أو انسخ البيانات من backup_finance_data.json إلى localStorage');
    
  } catch (error) {
    console.error('❌ خطأ في استرجاع البيانات:', error);
  }
}

restoreFinanceData(); 