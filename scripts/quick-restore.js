console.log('🚀 سكريبت استرجاع البيانات السريع');
console.log('=====================================');
console.log('');
console.log('📋 الخطوات:');
console.log('1. افتح التطبيق على http://localhost:3001/car-finance');
console.log('2. اضغط F12 لفتح Developer Tools');
console.log('3. انسخ الكود التالي والصقه في Console:');
console.log('');
console.log('🔧 كود الاسترجاع:');
console.log('=====================================');

const restoreCode = `
localStorage.setItem("financeData", JSON.stringify([
  {
    "id": "enhanced_1",
    "profit_percent": 35,
    "duration_months": 12,
    "price_category": 25000,
    "car_count": 5,
    "first_payment_percent": 0.1,
    "first_payment": 2500,
    "last_payment": 2500,
    "profit_after": 8750,
    "annual_profit": 8750,
    "installment_sale_price": 33750,
    "monthly_installment": 2604,
    "monthly_income": 13020,
    "purchase_capacity": 125000,
    "annual_income": 156240,
    "tracking_cost": 200,
    "guarantor_cost": 500,
    "inspection_cost": 300,
    "salary_distribution": 0.6,
    "rent_distribution": 0.4
  },
  {
    "id": "enhanced_2",
    "profit_percent": 45,
    "duration_months": 24,
    "price_category": 35000,
    "car_count": 8,
    "first_payment_percent": 0.15,
    "first_payment": 5250,
    "last_payment": 5250,
    "profit_after": 15750,
    "annual_profit": 7875,
    "installment_sale_price": 50750,
    "monthly_installment": 1896,
    "monthly_income": 15168,
    "purchase_capacity": 280000,
    "annual_income": 182016,
    "tracking_cost": 250,
    "guarantor_cost": 600,
    "inspection_cost": 400,
    "salary_distribution": 0.7,
    "rent_distribution": 0.3
  },
  {
    "id": "enhanced_3",
    "profit_percent": 55,
    "duration_months": 36,
    "price_category": 45000,
    "car_count": 12,
    "first_payment_percent": 0.2,
    "first_payment": 9000,
    "last_payment": 9000,
    "profit_after": 24750,
    "annual_profit": 8250,
    "installment_sale_price": 69750,
    "monthly_installment": 1688,
    "monthly_income": 20256,
    "purchase_capacity": 540000,
    "annual_income": 243072,
    "tracking_cost": 300,
    "guarantor_cost": 700,
    "inspection_cost": 500,
    "salary_distribution": 0.8,
    "rent_distribution": 0.2
  },
  {
    "id": "enhanced_4",
    "profit_percent": 40,
    "duration_months": 18,
    "price_category": 30000,
    "car_count": 6,
    "first_payment_percent": 0.12,
    "first_payment": 3600,
    "last_payment": 3600,
    "profit_after": 12000,
    "annual_profit": 8000,
    "installment_sale_price": 42000,
    "monthly_installment": 2133,
    "monthly_income": 12798,
    "purchase_capacity": 180000,
    "annual_income": 153576,
    "tracking_cost": 220,
    "guarantor_cost": 550,
    "inspection_cost": 350,
    "salary_distribution": 0.65,
    "rent_distribution": 0.35
  },
  {
    "id": "enhanced_5",
    "profit_percent": 50,
    "duration_months": 30,
    "price_category": 40000,
    "car_count": 10,
    "first_payment_percent": 0.18,
    "first_payment": 7200,
    "last_payment": 7200,
    "profit_after": 20000,
    "annual_profit": 8000,
    "installment_sale_price": 60000,
    "monthly_installment": 1760,
    "monthly_income": 17600,
    "purchase_capacity": 400000,
    "annual_income": 211200,
    "tracking_cost": 280,
    "guarantor_cost": 650,
    "inspection_cost": 450,
    "salary_distribution": 0.75,
    "rent_distribution": 0.25
  }
]));
window.location.reload();
`;

console.log(restoreCode);
console.log('=====================================');
console.log('');
console.log('✅ بعد تنفيذ الكود:');
console.log('- سيتم حفظ البيانات في localStorage');
console.log('- ستظهر بطاقة عدد السيارات بـ 41 سيارة');
console.log('- ستظهر جميع البيانات المحسنة في الجداول');
console.log('');
console.log('🎯 النتائج المتوقعة:');
console.log('- إجمالي عدد السيارات: 41');
console.log('- إجمالي الدخل السنوي: 946,104 ريال');
console.log('- إجمالي الأقساط الشهرية: 78,842 ريال'); 