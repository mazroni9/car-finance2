'use client';

import FinanceSummary from './components/FinanceSummary';
import React from 'react';

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

const priceCategories = [20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000];

const financeRules = priceCategories.map((price) => ({
  price_category: price,
  duration_months: 12,
  profit_target_percent: 0.3,
  base_profit: 0,
  down_payment_value: 10000,
  last_payment_value: 5000,
  quantity: 1,
  monthly_installment: 3750,
  monthly_income: 3750,
  annual_income: 45000
}));

export default function CarFinancePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* نموذج إدخال جديد */}
          <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap items-center gap-2 justify-between">
            <div className="flex flex-wrap items-center gap-2 w-full justify-end">
              <select className="border rounded px-2 py-1 min-w-[110px]">
                {[20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000].map((cat) => (
                  <option key={cat} value={cat}>{cat.toLocaleString()} ريال</option>
                ))}
              </select>
              <select className="border rounded px-2 py-1 min-w-[80px]">
                {[12, 18, 24, 30, 36].map((m) => (
                  <option key={m} value={m}>{m} شهر</option>
                ))}
              </select>
              <input type="number" min={1} defaultValue={1} className="border rounded px-2 py-1 w-16 text-center" placeholder="عدد السيارات" />
              <select className="border rounded px-2 py-1 min-w-[70px]">
                {[0.2, 0.3, 0.4, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75].map((v) => (
                  <option key={v} value={v}>{Math.round(v * 100)}%</option>
                ))}
              </select>
              <input type="text" value="30%" readOnly className="border rounded px-2 py-1 w-16 text-center bg-gray-100 font-bold" />
              <input type="number" min={0} defaultValue={1200} className="border rounded px-2 py-1 w-24 text-center" placeholder="رسوم سنوية إضافية" />
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded shadow ml-2">حفظ المعلومات</button>
              <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded shadow">حذف جميع البيانات</button>
            </div>
          </div>
          {/* ملخص مالي */}
          <FinanceSummary summary={summary} />

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
                  {financeRules.map((rule, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
