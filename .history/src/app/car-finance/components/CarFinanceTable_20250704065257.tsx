'use client';

import { useEffect, useState } from 'react';

interface InstallmentRule {
  id: string;
  price_category: number;
  duration_months: number;
  profit_target_percent: number;
  down_payment_value: number;         // قيمة الدفعة الأولى
  last_payment_value: number;         // قيمة الدفعة الأخيرة
  quantity: number;
  monthly_installment: number;        // القسط الشهري
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
  roi_full_period: number;            // العائد على الاستثمار كامل المدة
  roi_annual: number;                 // العائد السنوي على الاستثمار
}

export default function CarFinanceTable() {
  const [rules, setRules] = useState<InstallmentRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatNumber = (num: number) => Math.round(num).toLocaleString('en-US');
  const formatPercent = (num: number) => Math.round(num * 100) + '%';

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch('/api/finance/rules');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setRules(data);
      } catch (err) {
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
      <div className="min-w-[2000px]">
        <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-800">
            <tr>
              <th className="px-4 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">الفئة السعرية</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">مدة التمويل</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">نسبة الربح</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الدفعة الأولى</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الدفعة الأخيرة</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">عدد السيارات</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">القسط الشهري</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الدخل الشهري</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">إجمالي الأقساط الشهرية</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الدخل السنوي</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">المبلغ الممول</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الربح لكل سيارة</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">إجمالي الربح الشهري</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">إجمالي الربح لكامل المدة</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">الربح السنوي قبل التكاليف</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">مبلغ الشراء الممكن</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">تكلفة التتبع</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">تكلفة عقد الضمان</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">تكلفة الفحص الفني</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">تكلفة الشراء</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">ROI الكلي</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">ROI السنوي</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700">
            {rules.map((rule, index) => (
              <tr key={rule.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}>
                <td className="px-4 py-3 text-right whitespace-nowrap"><span className="text-blue-600 font-semibold">{formatNumber(rule.price_category)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">{rule.duration_months} شهر</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-green-600 font-semibold">{formatPercent(rule.profit_target_percent)}</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-purple-600 font-semibold">{formatNumber(rule.down_payment_value)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-purple-600 font-semibold">{formatNumber(rule.last_payment_value)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">{rule.quantity}</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-blue-600 font-semibold">{formatNumber(rule.monthly_installment)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-green-600 font-semibold">{formatNumber(rule.monthly_income)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-green-600 font-semibold">{formatNumber(rule.total_monthly_installments)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-green-600 font-semibold">{formatNumber(rule.annual_income)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-blue-600 font-semibold">{formatNumber(rule.financed_amount)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-green-600 font-semibold">{formatNumber(rule.profit_per_car)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-green-600 font-semibold">{formatNumber(rule.total_monthly_profit)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-green-600 font-semibold">{formatNumber(rule.total_profit_full_period)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-green-600 font-semibold">{formatNumber(rule.annual_profit_before_costs)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-green-600 font-semibold">{formatNumber(rule.possible_purchase_amount)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-red-600 font-semibold">{formatNumber(rule.tracking_cost)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-red-600 font-semibold">{formatNumber(rule.guarantee_contract_cost)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-red-600 font-semibold">{formatNumber(rule.inspection_cost)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-red-600 font-semibold">{formatNumber(rule.total_purchase_cost)} SAR</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-blue-600 font-semibold">{formatPercent(rule.roi_full_period)}</span></td>
                <td className="px-4 py-3 text-center whitespace-nowrap"><span className="text-blue-600 font-semibold">{formatPercent(rule.roi_annual)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
