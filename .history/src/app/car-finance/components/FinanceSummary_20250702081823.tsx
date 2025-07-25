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
  if (!summary) {
    return (
      <div className="text-center py-8 text-gray-500 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        جاري التحميل أو لا توجد بيانات متاحة.
      </div>
    );
  }

  // دالة تنسيق أرقام مع fallback
  const formatNumber = (num: number | undefined) =>
    typeof num === 'number' && !isNaN(num) ? num.toLocaleString('ar-SA') : '-';

  const formatPercent = (num: number | undefined) =>
    typeof num === 'number' && !isNaN(num) ? `${(num * 100).toFixed(2)}%` : '-';

  const summaryItems = [
    {
      label: 'إجمالي الأقساط الشهرية',
      value: `${formatNumber(summary.total_monthly_installments)} ريال`,
      color: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'إجمالي الدخل السنوي',
      value: `${formatNumber(summary.total_annual_income)} ريال`,
      color: 'bg-green-100 dark:bg-green-900',
    },
    {
      label: 'إجمالي تكلفة شراء السيارات',
      value: `${formatNumber(summary.total_purchase_cost)} ريال`,
      color: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      label: 'إجمالي الربح الكامل',
      value: `${formatNumber(summary.total_profit_full_period)} ريال`,
      color: 'bg-yellow-100 dark:bg-yellow-900',
    },
    {
      label: 'متوسط ROI كامل الفترة',
      value: formatPercent(summary.avg_roi_full_period),
      color: 'bg-pink-100 dark:bg-pink-900',
    },
    {
      label: 'متوسط ROI السنوي',
      value: formatPercent(summary.avg_roi_annual),
      color: 'bg-indigo-100 dark:bg-indigo-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {summaryItems.map((item, index) => (
        <div
          key={index}
          className={`${item.color} rounded-lg shadow-md p-6 transition-all hover:shadow-lg`}
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            {item.label}
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
