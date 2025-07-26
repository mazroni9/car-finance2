'use client';

import { useEffect, useState } from 'react';

interface InstallmentRule {
  id: string;
  price_category: number;
  duration_months: number;
  profit_target_percent: number;
  down_payment_percent: number;
  last_payment_percent: number;
  quantity: number;
  monthly_installment: number;
  annual_income: number;
  total_purchase_cost: number;
  total_profit_full_period: number;
  roi_full_period: number;
  roi_annual: number;
}

export default function CarFinanceTable() {
  const [rules, setRules] = useState<InstallmentRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        console.log('Fetching rules...');
        const response = await fetch('/api/finance/rules');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received rules:', data);
        setRules(data);
      } catch (err) {
        console.error('Error fetching rules:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch rules');
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="text-lg">❌ خطأ في جلب البيانات</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  if (!rules.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد قواعد تمويل متاحة
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              الفئة السعرية
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              مدة التمويل
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              نسبة الربح
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              الدفعة الأولى
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              الدفعة الأخيرة
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              عدد السيارات
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              القسط الشهري
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              الدخل السنوي
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              تكلفة الشراء
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              الربح الكامل
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              ROI الكلي
            </th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              ROI السنوي
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {rules.map((rule) => (
            <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-4 py-3 text-right whitespace-nowrap">
                {rule.price_category?.toLocaleString('ar-SA')} ريال
              </td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {rule.duration_months} شهر
              </td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {(rule.profit_target_percent * 100).toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {(rule.down_payment_percent * 100).toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {(rule.last_payment_percent * 100).toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {rule.quantity}
              </td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {rule.monthly_installment?.toLocaleString('ar-SA')} ريال
              </td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {rule.annual_income?.toLocaleString('ar-SA')} ريال
              </td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {rule.total_purchase_cost?.toLocaleString('ar-SA')} ريال
              </td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {rule.total_profit_full_period?.toLocaleString('ar-SA')} ريال
              </td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {(rule.roi_full_period * 100).toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-center whitespace-nowrap">
                {(rule.roi_annual * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
