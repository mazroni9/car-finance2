'use client';

import { useEffect, useState } from 'react';

interface InstallmentRule {
  id: string;
  price_category: number;
  duration_months: number;
  profit_target_percent: number;
  down_payment_value: number;         // قيمة الدفعة الأولى
  down_payment_percent: number;       // نسبة الدفعة الأولى
  last_payment_value: number;         // قيمة الدفعة الأخيرة
  last_payment_percent: number;       // نسبة الدفعة الأخيرة
  quantity: number;
  monthly_installment: number;        // القسط الشهري
  monthly_income: number;             // الدخل الشهري
  total_monthly_installments: number; // إجمالي الأقساط الشهرية
  annual_income: number;              // الدخل السنوي
  possible_purchase_amount: number;   // مبلغ الشراء الممكن
  tracking_cost: number;              // تكلفة التتبع
  guarantee_contract_cost: number;    // تكلفة عقد الضمان
  inspection_cost: number;            // تكلفة الفحص الفني
  financed_amount: number;            // المبلغ الممول
  profit_per_car: number;             // الربح من كل سيارة
  total_monthly_profit: number;       // إجمالي الربح الشهري
  total_profit_full_period: number;   // إجمالي الربح لكامل المدة
  annual_profit_before_costs: number; // الربح السنوي قبل التكاليف
  total_purchase_cost: number;        // تكلفة الشراء
  roi_full_period: number;            // العائد على الاستثمار كامل المدة
  roi_annual: number;                 // العائد السنوي على الاستثمار
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
      <div className="min-w-[2200px]">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-800">
            <tr>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الفئة السعرية</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">مدة التمويل</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">نسبة الربح</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">قيمة الدفعة الأولى</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">نسبة الدفعة الأولى</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">قيمة الدفعة الأخيرة</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">نسبة الدفعة الأخيرة</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">عدد السيارات</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">القسط الشهري</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الدخل الشهري</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">إجمالي الأقساط الشهرية</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الدخل السنوي</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">مبلغ الشراء الممكن</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">تكلفة التتبع</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">عقد الضمان</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الفحص الفني</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">المبلغ الممول</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الربح من كل سيارة</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">إجمالي الربح الشهري</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">إجمالي الربح لكامل المدة</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الربح السنوي قبل التكاليف</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">تكلفة الشراء</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">ROI الكلي</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">ROI السنوي</th>
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
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.price_category)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{rule.duration_months} شهر</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatPercent(rule.profit_target_percent)}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.down_payment_value)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatPercent(rule.down_payment_percent)}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.last_payment_value)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatPercent(rule.last_payment_percent)}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{rule.quantity}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.monthly_installment)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.monthly_income)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.total_monthly_installments)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.annual_income)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.possible_purchase_amount)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.tracking_cost)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.guarantee_contract_cost)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.inspection_cost)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.financed_amount)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.profit_per_car)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.total_monthly_profit)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.total_profit_full_period)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.annual_profit_before_costs)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatNumber(rule.total_purchase_cost)} SAR</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatPercent(rule.roi_full_period)}</td>
                <td className="px-4 py-3 text-center whitespace-nowrap">{formatPercent(rule.roi_annual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
