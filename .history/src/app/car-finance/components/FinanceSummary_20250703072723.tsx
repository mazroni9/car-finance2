import React from 'react';

interface FinanceSummaryProps {
  summary?: {
    total_monthly_installments: number;
    total_annual_income: number;
    total_purchase_cost: number;
    total_profit_full_period: number;
    avg_roi_full_period: number;
    avg_roi_annual: number;
    total_annual_profit_before_costs: number;
    total_down_payments: number;
    total_last_payments_per_year: number;
  };
}

export default function FinanceSummary({ summary }: FinanceSummaryProps) {
  if (!summary) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          لا توجد بيانات متاحة
        </div>
      </div>
    );
  }

  const formatNumber = (num: number | undefined) =>
    typeof num === 'number' && !isNaN(num) ? Math.round(num).toLocaleString('en-US') : '-';

  const formatPercent = (num: number | undefined) =>
    typeof num === 'number' && !isNaN(num) ? `${Math.round(num * 100)}%` : '-';

  const summaryItems = [
    {
      label: 'إجمالي الأقساط الشهرية',
      value: `${formatNumber(summary.total_monthly_installments)} SAR`,
      color: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-700 dark:text-blue-300',
      icon: '💰'
    },
    {
      label: 'إجمالي الدفعات الأولى',
      value: `${formatNumber(summary.total_down_payments)} SAR`,
      color: 'bg-emerald-50 dark:bg-emerald-900/20',
      textColor: 'text-emerald-700 dark:text-emerald-300',
      icon: '💸'
    },
    {
      label: 'إجمالي الدفعات الأخيرة السنوية',
      value: `${formatNumber(summary.total_last_payments_per_year)} SAR`,
      color: 'bg-cyan-50 dark:bg-cyan-900/20',
      textColor: 'text-cyan-700 dark:text-cyan-300',
      icon: '💵'
    },
    {
      label: 'إجمالي الدخل السنوي',
      value: `${formatNumber(summary.total_annual_income)} SAR`,
      color: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-700 dark:text-green-300',
      icon: '📈'
    },
    {
      label: 'إجمالي تكلفة شراء السيارات',
      value: `${formatNumber(summary.total_purchase_cost)} SAR`,
      color: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-700 dark:text-purple-300',
      icon: '🚗'
    },
    {
      label: 'إجمالي الربح الكامل',
      value: `${formatNumber(summary.total_profit_full_period)} SAR`,
      color: 'bg-yellow-50 dark:bg-yellow-900/20',
      textColor: 'text-yellow-700 dark:text-yellow-300',
      icon: '💎'
    },
    {
      label: 'إجمالي الربح السنوي قبل التكاليف',
      value: `${formatNumber(summary.total_annual_profit_before_costs)} SAR`,
      color: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-700 dark:text-orange-300',
      icon: '💹'
    },
    {
      label: 'متوسط ROI كامل الفترة',
      value: formatPercent(summary.avg_roi_full_period),
      color: 'bg-pink-50 dark:bg-pink-900/20',
      textColor: 'text-pink-700 dark:text-pink-300',
      icon: '📊'
    },
    {
      label: 'متوسط ROI السنوي',
      value: formatPercent(summary.avg_roi_annual),
      color: 'bg-indigo-50 dark:bg-indigo-900/20',
      textColor: 'text-indigo-700 dark:text-indigo-300',
      icon: '📅'
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        الملخص المالي
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summaryItems.map((item, index) => (
          <div
            key={index}
            className={`${item.color} rounded-lg p-6 transition-all hover:shadow-lg`}
          >
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${item.textColor} mb-2`}>
                  {item.label}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
