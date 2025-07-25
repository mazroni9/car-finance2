'use client';

import React, { useState, useEffect } from 'react';
import FinanceSummary from './components/FinanceSummary';
import ProfessionalFinanceTable from './components/ProfessionalFinanceTable';
import ExcelUploader from './components/ExcelUploader';
import ManualDataEntry from './components/ManualDataEntry';

interface FinanceData {
  id: string;
  profit_percent: number;
  duration_months: number;
  price_category: number;
  car_count: number;
  first_payment_percent: number;
  first_payment: number;
  last_payment: number;
  profit_after: number;
  installment_sale_price: number;
  monthly_installment: number;
  monthly_income: number;
  purchase_capacity: number;
  annual_income: number;
  tracking_cost: number;
  guarantor_cost: number;
  inspection_cost: number;
  salary_distribution: number;
  rent_distribution: number;
}



export default function CarFinancePage() {
  // دالة لحساب رسوم الخدمة التصاعدية
  const calculateServiceFee = (priceCategory: number): number => {
    const basePrice = 20000;
    const baseFee = 2000;
    const incrementPerCategory = 300;
    const maxFee = 3500; // الحد الأقصى لرسوم الخدمة
    const maxPriceCategory = 45000; // الفئة السعرية التي تتوقف عندها الزيادة
    
    if (priceCategory <= basePrice) {
      return baseFee;
    }
    
    // حساب عدد الفئات التي تجاوزناها
    const categoryDifference = priceCategory - basePrice;
    const categorySteps = Math.floor(categoryDifference / 5000); // كل 5000 ريال = فئة جديدة
    
    const calculatedFee = baseFee + (categorySteps * incrementPerCategory);
    
    // إذا تجاوزت الفئة السعرية 45,000 ريال، استخدم الحد الأقصى
    if (priceCategory >= maxPriceCategory) {
      return maxFee;
    }
    
    return calculatedFee;
  };

  const [financeData, setFinanceData] = useState<FinanceData[]>(() => {
    // تجاهل البيانات المحفوظة مسبقاً وابدأ ببيانات جديدة
    return [
      {
        id: 'new_1',
        profit_percent: 30,
        duration_months: 12,
        price_category: 20000,
        car_count: 1,
        first_payment_percent: 0,
        first_payment: calculateServiceFee(20000), // رسوم خدمة محسوبة تلقائياً
        last_payment: 2000, // 10% من 20000 = 2000
        profit_after: 6000, // 20000 × 30%
        installment_sale_price: 26000,
        monthly_installment: 1750,
        monthly_income: 1750,
        purchase_capacity: 20000,
        annual_income: 21000,
        tracking_cost: 0,
        guarantor_cost: 0,
        inspection_cost: 0,
        salary_distribution: 0,
        rent_distribution: 0,
      },
      {
        id: 'new_2',
        profit_percent: 40,
        duration_months: 18,
        price_category: 25000,
        car_count: 1,
        first_payment_percent: 0,
        first_payment: calculateServiceFee(25000), // رسوم خدمة محسوبة تلقائياً
        last_payment: 2500, // 10% من 25000 = 2500
        profit_after: 10000, // 25000 × 40%
        installment_sale_price: 35000,
        monthly_installment: 1611,
        monthly_income: 1611,
        purchase_capacity: 25000,
        annual_income: 19332,
        tracking_cost: 0,
        guarantor_cost: 0,
        inspection_cost: 0,
        salary_distribution: 0,
        rent_distribution: 0,
      }
    ];
  });

  // حفظ تلقائي في LocalStorage عند كل تغيير
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('financeData', JSON.stringify(financeData));
    }
  }, [financeData]);

  const handleDataChange = (newData: FinanceData[]) => {
    setFinanceData(newData);
  };

  const handleDataImport = (importedData: FinanceData[]) => {
    setFinanceData(importedData);
  };

  const handleAddData = (newData: FinanceData) => {
    setFinanceData(prev => [...prev, newData]);
  };

  const handleClearAll = () => {
    if (confirm('هل أنت متأكد من حذف جميع البيانات؟')) {
      setFinanceData([]);
      // مسح البيانات من LocalStorage أيضاً
      if (typeof window !== 'undefined') {
        localStorage.removeItem('financeData');
      }
    }
  };

  const handleResetData = () => {
    if (confirm('هل تريد إعادة تعيين البيانات إلى القيم الافتراضية؟')) {
      // مسح البيانات القديمة
      if (typeof window !== 'undefined') {
        localStorage.removeItem('financeData');
      }
      // إعادة تحميل الصفحة
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* ملخص مالي */}
          <FinanceSummary summary={summary} />

          {/* أزرار التحكم */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">إدارة بيانات التمويل</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleResetData}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-colors"
                >
                  🔄 إعادة تعيين البيانات
                </button>
                <button
                  onClick={handleClearAll}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-colors"
                >
                  🗑️ حذف جميع البيانات
                </button>
              </div>
            </div>
          </div>

          {/* رفع ملف Excel */}
          <ExcelUploader onDataImport={handleDataImport} data={financeData} />

          {/* نموذج الإدخال اليدوي */}
          <ManualDataEntry onAddData={handleAddData} />

          {/* جدول البيانات الاحترافي */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              جدول قواعد التمويل الاحترافي
            </h2>
            
            {financeData.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">لا توجد بيانات</h3>
                <p className="text-gray-500">
                  ارفع ملف Excel أو أدخل بيانات جديدة لتبدأ
                </p>
              </div>
            ) : (
              <ProfessionalFinanceTable 
                data={financeData} 
                onDataChange={handleDataChange} 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
