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

const summary = {
  total_monthly_installments: 3750,
  total_annual_income: 45000,
  total_down_payment: 10000,
  total_last_payment: 5000,
  total_annual_profit_before_costs: 15000,
  total_profit_full_period: 15000,
  total_purchase_cost: 50000,
  avg_roi_full_period: 30,
  avg_roi_annual: 30
};

export default function CarFinancePage() {
  const [financeData, setFinanceData] = useState<FinanceData[]>(() => {
    // تجاهل البيانات المحفوظة مسبقاً وابدأ ببيانات جديدة
    return [
      {
        id: 'new_1',
        profit_percent: 30,
        duration_months: 12,
        price_category: 20000,
        car_count: 1,
        first_payment_percent: 10,
        first_payment: 2000,
        last_payment: 2000, // تصحيح: 10% من 20000 = 2000
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
        first_payment_percent: 10,
        first_payment: 2500,
        last_payment: 2500, // تصحيح: 10% من 25000 = 2500
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
              <button
                onClick={handleClearAll}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-colors"
              >
                🗑️ حذف جميع البيانات
              </button>
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
