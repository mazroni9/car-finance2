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
  annual_profit?: number;
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
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('financeData');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // إذا كان هناك خطأ في البيانات المحفوظة، استخدم الافتراضي
        }
      }
    }
    // إذا لم توجد بيانات محفوظة، استخدم الافتراضي
    return [
      {
        id: 'new_1',
        profit_percent: 30,
        duration_months: 12,
        price_category: 20000,
        car_count: 1,
        first_payment_percent: 0,
        first_payment: calculateServiceFee(20000),
        last_payment: 2000,
        profit_after: 6000,
        annual_profit: 6000,
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
        first_payment: calculateServiceFee(25000),
        last_payment: 2500,
        profit_after: 10000,
        annual_profit: 6667,
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

  // حساب المجاميع من البيانات الفعلية
  const calculateSummary = (data: FinanceData[]) => {
    if (data.length === 0) {
      return {
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_down_payment: 0,
        total_last_payment: 0,
        total_last_payment_all_contracts: 0,
        total_service_fees: 0,
        total_annual_profit_before_costs: 0,
        total_profit_full_period: 0,
        total_purchase_cost: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0
      };
    }

    // حساب إجمالي تكلفة الشراء السنوية من أعمدة "كم نقدر نشتري"
    const total_purchase_cost = data.reduce((sum, item) => sum + (item.purchase_capacity || 0), 0);
    
    // حساب باقي المجاميع
    const total_monthly_installments = data.reduce((sum, item) => sum + (item.monthly_income || 0), 0);
    
    // حساب إجمالي الدخل السنوي من عمود "الدخل السنوي" في الجداول
    const total_annual_income = data.reduce((sum, item) => sum + (item.annual_income || 0), 0);
    
    const total_down_payment = data.reduce((sum, item) => sum + (item.first_payment || 0), 0);
    // إجمالي الدفعات الأخيرة السنوية (فقط العقود السنوية)
    const total_last_payment = data.reduce(
      (sum, item) =>
        item.duration_months === 12
          ? sum + (item.last_payment || 0) * (item.car_count || 1)
          : sum,
      0
    );

    // إجمالي الدفعات الأخيرة لكل العقود (جميع المدد)
    const total_last_payment_all_contracts = data.reduce(
      (sum, item) => sum + (item.last_payment || 0) * (item.car_count || 1),
      0
    );
    
    // حساب إجمالي رسوم الخدمة
    const total_service_fees = data.reduce(
      (sum, item) => sum + (item.first_payment || 0) * (item.car_count || 1),
      0
    );
    
    // حساب إجمالي الربح السنوي من عمود "الربح السنوي" في الجداول + رسوم الخدمة
    const total_annual_profit_before_costs = financeData.reduce(
      (sum, item) =>
        sum + ((item.annual_profit || 0) + (item.first_payment || 0)) * (item.car_count || 1),
      0
    );
    
    // حساب إجمالي الربح الكامل (يشمل رسوم الخدمة)
    const total_profit_full_period = financeData.reduce(
      (sum, item) => sum + (((item.profit_after || 0) + (item.first_payment || 0)) * (item.car_count || 1)),
      0
    );
    
    // حساب متوسط ROI (يشمل رسوم الخدمة)
    const avg_roi_full_period = total_purchase_cost > 0 ? (total_profit_full_period / total_purchase_cost) : 0;
    const avg_roi_annual = total_purchase_cost > 0
      ? ((total_annual_profit_before_costs + total_service_fees) / total_purchase_cost)
      : 0;

    return {
      total_monthly_installments,
      total_annual_income,
      total_down_payment,
      total_last_payment,
      total_last_payment_all_contracts,
      total_service_fees,
      total_annual_profit_before_costs,
      total_profit_full_period,
      total_purchase_cost,
      avg_roi_full_period,
      avg_roi_annual
    };
  };

  const summary = calculateSummary(financeData);

  // حالة النموذج ودواله
  const [form, setForm] = useState({
    price_category: 20000,
    duration_months: 12,
    car_count: 1,
    profit_percent: 30,
    last_payment_percent: 0.1,
    last_payment: 2000,
  });
  const profitPercentByDuration: Record<number, number> = {
    12: 30,
    18: 40,
    24: 45,
    30: 50,
    36: 55,
    42: 60,
  };
  const lastPaymentPercents = [0.1, 0.15, 0.2, 0.25, 0.3];
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newForm = { ...form, [name]: name === 'car_count' || name === 'price_category' || name === 'duration_months' ? Number(value) : value };
    if (name === 'duration_months') {
      newForm.profit_percent = profitPercentByDuration[Number(value)] || 30;
    }
    if (name === 'price_category' || name === 'last_payment_percent') {
      const percent = name === 'last_payment_percent' ? Number(value) : newForm.last_payment_percent;
      newForm.last_payment = Math.round(newForm.price_category * percent);
      if (name === 'last_payment_percent') newForm.last_payment_percent = percent;
    }
    setForm(newForm);
  };
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newData: FinanceData = {
      id: Math.random().toString(36).slice(2, 8),
      profit_percent: form.profit_percent,
      duration_months: form.duration_months,
      price_category: form.price_category,
      car_count: form.car_count,
      first_payment_percent: 0,
      first_payment: calculateServiceFee(form.price_category),
      last_payment: form.last_payment,
      profit_after: 0,
      annual_profit: 0,
      installment_sale_price: 0,
      monthly_installment: 0,
      monthly_income: 0,
      purchase_capacity: 0,
      annual_income: 0,
      tracking_cost: 0,
      guarantor_cost: 0,
      inspection_cost: 0,
      salary_distribution: 0,
      rent_distribution: 0,
    };
    setFinanceData([newData, ...financeData]);
    setForm({ ...form, car_count: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* ملخص مالي */}
          <FinanceSummary summary={summary} />



          {/* نموذج الإدخال اليدوي */}
          <ManualDataEntry onAddData={handleAddData} />

          {/* اجمع نموذج الإدخال مع أزرار الاستيراد والتصدير في بطاقة واحدة */}
          <div className="glass-card p-4 mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 bg-gradient-to-br from-blue-50 to-blue-100 shadow-md">
            <form onSubmit={handleFormSubmit} className="flex flex-wrap gap-2 items-end">
              <select name="price_category" value={form.price_category} onChange={handleFormChange} className="px-2 py-1 border rounded text-sm min-w-[110px]" title="فئة السعر">
                {[20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000].map((cat) => (
                  <option key={cat} value={cat}>{cat.toLocaleString()} ريال</option>
                ))}
              </select>
              <select name="duration_months" value={form.duration_months} onChange={handleFormChange} className="px-2 py-1 border rounded text-sm min-w-[90px]" title="مدة التمويل بالأشهر">
                {[12, 18, 24, 30, 36, 42].map((m) => (
                  <option key={m} value={m}>{m} شهر</option>
                ))}
              </select>
              <input name="car_count" type="number" min={1} value={form.car_count} onChange={handleFormChange} className="px-2 py-1 border rounded text-sm w-16" placeholder="عدد السيارات" title="عدد السيارات" />
              <select name="last_payment_percent" value={form.last_payment_percent} onChange={handleFormChange} className="px-2 py-1 border rounded text-sm w-20" title="نسبة الدفعة الأخيرة">
                {lastPaymentPercents.map((p) => (
                  <option key={p} value={p}>{Math.round(p * 100)}%</option>
                ))}
              </select>
              <input name="last_payment" type="text" value={form.last_payment.toLocaleString()} readOnly className="px-2 py-1 border rounded bg-gray-100 text-center font-bold text-sm w-20" tabIndex={-1} title="قيمة الدفعة الأخيرة" />
              <input name="profit_percent" type="text" value={form.profit_percent + '%'} readOnly className="px-2 py-1 border rounded bg-gray-100 text-center font-bold text-sm w-16" tabIndex={-1} title="نسبة الربح" />
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-lg shadow-md transition-colors text-xs">حفظ المعلومات</button>
            </form>
          </div>

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
