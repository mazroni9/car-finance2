'use client';

import FinanceSummary from './components/FinanceSummary';
import React, { useState } from 'react';

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

const priceCategories = [20000, 30000, 40000, 50000, 60000];
const durations = [12, 18, 24, 30, 36];
const renewPercents = [0.2, 0.3, 0.4, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75];

export default function CarFinancePage() {
  const [financeRules, setFinanceRules] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('financeRules');
      if (stored) return JSON.parse(stored);
    }
    return [];
  });
  const [form, setForm] = useState({
    price_category: 20000,
    duration_months: 12,
    quantity: 1,
    last_payment_percent: 0.3,
    profit_target_percent: 0.3,
    extra_annual_fee: 1200
  });

  // حفظ تلقائي في LocalStorage عند كل تغيير
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('financeRules', JSON.stringify(financeRules));
    }
  }, [financeRules]);

  const profitPercentByDuration: Record<number, number> = {
    12: 0.3,
    18: 0.4,
    24: 0.5,
    30: 0.55,
    36: 0.6
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'duration_months') {
      const duration = Number(value);
      setForm((prev) => ({
        ...prev,
        duration_months: duration,
        profit_target_percent: profitPercentByDuration[duration] || 0.3
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: name === 'quantity' || name === 'duration_months' || name === 'price_category' ? Number(value) : value
      }));
    }
  };

  const handleSave = () => {
    setFinanceRules((prev) => [
      ...prev,
      {
        price_category: form.price_category,
        duration_months: form.duration_months,
        profit_target_percent: Number(form.profit_target_percent),
        base_profit: 0,
        down_payment_value: 10000, // ثابتة كمثال
        last_payment_value: 5000, // ثابتة كمثال
        quantity: form.quantity,
        monthly_installment: 3750, // ثابتة كمثال
        monthly_income: 3750, // ثابتة كمثال
        annual_income: 45000 // ثابتة كمثال
      }
    ]);
  };

  const handleClear = () => {
    setFinanceRules([]);
  };

  // جدول ثابت للفئات السعرية ولكل فئة جميع مدد التمويل (مع استثناءات)
  const staticFinanceRules = priceCategories.flatMap((cat) => {
    let allowedDurations = [12, 18, 24, 30, 36];
    if (cat === 20000) allowedDurations = [12, 18, 24];
    else if (cat === 30000) allowedDurations = [18, 24, 30]; // تم حذف 12 شهر من الفئة 30 ألف
    else if (cat >= 40000) allowedDurations = [24, 30, 36];
    return allowedDurations.map((duration) => ({
      price_category: cat,
      duration_months: duration,
      profit_target_percent: profitPercentByDuration[duration] || 0.3,
      base_profit: 0,
      down_payment_value: 10000,
      last_payment_value: 5000,
      quantity: 1,
      monthly_installment: 3750,
      monthly_income: 3750,
      annual_income: 45000
    }));
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* ملخص مالي */}
          <FinanceSummary summary={summary} />

          {/* نموذج إدخال جديد */}
          <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap items-center gap-2 w-full justify-end">
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium mb-1">الفئة السعرية</label>
                <select name="price_category" value={form.price_category} onChange={handleChange} className="border rounded px-2 py-1 min-w-[110px]" title="اختر الفئة السعرية">
                  {priceCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat.toLocaleString()} ريال</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium mb-1">مدة الإيجار</label>
                <select name="duration_months" value={form.duration_months} onChange={handleChange} className="border rounded px-2 py-1 min-w-[80px]" title="اختر مدة الإيجار">
                  {durations.map((m) => (
                    <option key={m} value={m}>{m} شهر</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium mb-1">عدد السيارات</label>
                <input name="quantity" type="number" min={1} value={form.quantity} onChange={handleChange} className="border rounded px-2 py-1 w-16 text-center" placeholder="عدد السيارات" title="عدد السيارات" />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium mb-1">نسبة التمويل</label>
                <input name="profit_target_percent" type="text" value={`${Math.round(Number(form.profit_target_percent) * 100)}%`} readOnly className="border rounded px-2 py-1 w-16 text-center bg-gray-100 font-bold" title="نسبة التمويل" />
              </div>
              <div className="flex flex-col items-center">
                <label className="text-xs font-medium mb-1">نسبة تمديد الإيجار</label>
                <select name="last_payment_percent" value={form.last_payment_percent} onChange={handleChange} className="border rounded px-2 py-1 min-w-[70px]" title="نسبة تمديد الإيجار">
                  {renewPercents.map((v) => (
                    <option key={v} value={v}>{Math.round(Number(v) * 100)}%</option>
                  ))}
                </select>
              </div>
              {/* تم حذف حقل الرسوم السنوية الإضافية */}
              <button type="button" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded shadow ml-2">حفظ المعلومات</button>
              <button type="button" onClick={handleClear} className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded shadow">حذف جميع البيانات</button>
            </div>
          </div>

          {/* جدول التمويل */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              جدول قواعد التمويل
            </h2>
            <div className="overflow-x-auto w-full">
              <table className="w-full divide-y divide-gray-200 text-gray-900">
                <thead className="bg-blue-700">
                  <tr>
                    <th className="px-4 py-4 text-right text-sm font-bold text-white uppercase tracking-wider">الفئة السعرية</th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">مدة التمويل</th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">نسبة الربح</th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">الربح الأساسي</th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">الدفعة الأولى</th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">الدفعة الأخيرة</th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">عدد السيارات</th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">القسط الشهري</th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">الدخل الشهري</th>
                    <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">الدخل السنوي</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {staticFinanceRules.map((rule, index, arr) => {
                    const isFirstOfCategory =
                      index === 0 || rule.price_category !== arr[index - 1].price_category;
                    return (
                      <React.Fragment key={index}>
                        {isFirstOfCategory && index !== 0 && (
                          <tr>
                            <td colSpan={10} className="bg-blue-200 h-2 p-0" style={{ border: 'none' }}></td>
                          </tr>
                        )}
                        <tr className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">{rule.price_category.toLocaleString()} SAR</td>
                          <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{rule.duration_months} شهر</td>
                          <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{(rule.profit_target_percent * 100).toFixed(1)}%</td>
                          <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{rule.base_profit} SAR</td>
                          <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{rule.down_payment_value.toLocaleString()} SAR</td>
                          <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{rule.last_payment_value.toLocaleString()} SAR</td>
                          <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{rule.quantity}</td>
                          <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{rule.monthly_installment.toLocaleString()} SAR</td>
                          <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{rule.monthly_income.toLocaleString()} SAR</td>
                          <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{rule.annual_income.toLocaleString()} SAR</td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
