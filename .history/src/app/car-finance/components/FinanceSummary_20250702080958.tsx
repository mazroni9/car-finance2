import React from 'react';

interface FinanceSummaryProps {
  summary?: {
    total_monthly_installments: number;
    total_annual_income: number;
    total_purchase_cost: number;
    total_profit_full_period: number;
    avg_roi_full_period: number;
    avg_roi_annual: number;
  };
}

export default function FinanceSummary({ summary }: FinanceSummaryProps) {
  // تحقق ذكي: إذا ما جاء الـ summary أو ما جاء أي عمود مهم
  if (!summary || Object.keys(summary).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        جاري التحميل أو لا توجد بيانات متاحة.
      </div>
    );
  }

  // دالة تنسيق أرقام مع fallback
  const formatNumber = (num: number | undefined) =>
    typeof num === 'number' && !isNaN(num) ? num.toLocaleString() : '-';

  const formatPercent = (num: number | undefined) =>
    typeof num === 'number' && !isNaN(num) ? (num * 100).toFixed(2) + '%' : '-';

  return (
    <div className="overflow-x-auto rounded-lg shadow-md mt-6 border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              الوصف
            </th>
            <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              القيمة
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          <tr>
            <td className="px-6 py-4">إجمالي الأقساط الشهرية</td>
            <td className="px-6 py-4 font-semibold">
              {formatNumber(summary.total_monthly_installments)} ريال
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4">إجمالي الدخل السنوي</td>
            <td className="px-6 py-4 font-semibold">
              {formatNumber(summary.total_annual_income)} ريال
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4">إجمالي تكلفة شراء السيارات</td>
            <td className="px-6 py-4 font-semibold">
              {formatNumber(summary.total_purchase_cost)} ريال
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4">إجمالي الربح الكامل</td>
            <td className="px-6 py-4 font-semibold">
              {formatNumber(summary.total_profit_full_period)} ريال
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4">متوسط ROI كامل الفترة</td>
            <td className="px-6 py-4 font-semibold">
              {formatPercent(summary.avg_roi_full_period)}
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4">متوسط ROI السنوي</td>
            <td className="px-6 py-4 font-semibold">
              {formatPercent(summary.avg_roi_annual)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
