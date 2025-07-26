'use client';

import { useEffect, useState } from 'react';

interface InstallmentRule {
  id: string;
  price_category: number;
  duration_months: number;
  profit_target_percent: number;
  down_payment_value: number;
  down_payment_percent: number;
  last_payment_value: number;
  last_payment_percent: number;
  quantity: number;
  monthly_installment: number;
  monthly_income: number;
  total_monthly_installments: number;
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

  // تنسيق الأرقام بدون كسور عشرية
  const formatNumber = (num: number) => {
    return Math.round(num).toLocaleString('en-US');
  };

  // تنسيق النسب المئوية بدون كسور عشرية
  const formatPercent = (num: number) => {
    return Math.round(num * 100) + '%';
  };

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
    <div className="overflow-x-auto w-full">
      <div className="min-w-[1500px]">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-800">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                الفئة السعرية
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                مدة التمويل
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                نسبة الربح
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                الدفعة الأولى
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                الدفعة الأخيرة
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                عدد السيارات
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                القسط الشهري
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                الدخل السنوي
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                تكلفة الشراء
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                الربح الكامل
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                ROI الكلي
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                ROI السنوي
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
            {rules.map((rule, index) => (
              <tr 
                key={rule.id} 
                className={`
                  ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} 
                  hover:bg-blue-100 transition-colors
                `}
              >
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <span className="text-blue-600 font-semibold">{formatNumber(rule.price_category)} SAR</span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {rule.duration_months} شهر
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="text-green-600 font-semibold">
                    {formatPercent(rule.profit_target_percent)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="text-purple-600 font-semibold">
                    {formatNumber(rule.price_category * rule.down_payment_percent)} SAR
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="text-purple-600 font-semibold">
                    {formatNumber(rule.price_category * rule.last_payment_percent)} SAR
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                    {rule.quantity}
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="text-blue-600 font-semibold">
                    {formatNumber(rule.monthly_installment)} SAR
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="text-green-600 font-semibold">
                    {formatNumber(rule.annual_income)} SAR
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="text-red-600 font-semibold">
                    {formatNumber(rule.total_purchase_cost)} SAR
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="text-green-600 font-semibold">
                    {formatNumber(rule.total_profit_full_period)} SAR
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="text-blue-600 font-semibold">
                    {formatPercent(rule.roi_full_period)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <span className="text-blue-600 font-semibold">
                    {formatPercent(rule.roi_annual)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
