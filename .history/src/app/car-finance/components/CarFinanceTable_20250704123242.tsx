'use client';

import { useEffect, useState } from 'react';

/**
 * تعريف واجهة القاعدة المالية
 */
interface InstallmentRule {
  id: string;
  price_category: number;
  duration_months: number;
  profit_target_percent: number;
  down_payment_value: number;
  last_payment_value: number;
  quantity: number;
  monthly_installment: number;
  monthly_income: number;
  annual_income: number;
  possible_purchase_amount: number;
  tracking_cost: number;
  guarantee_contract_cost: number;
  inspection_cost: number;
  profit_per_car: number;
  annual_profit: number;
  total_profit_full_period: number;
  roi_full_period: number;
  roi_annual: number;
}

/**
 * مكون الجدول الرئيسي
 */
export default function CarFinanceTable() {
  const [rules, setRules] = useState<InstallmentRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تنسيق الأرقام
  const formatNumber = (num: number) => Math.round(num).toLocaleString('en-US');
  const formatPercent = (num: number) => Math.round(num * 100) / 100 + '%';

  // جلب البيانات
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

  // حالة التحميل
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p className="text-lg">❌ خطأ في جلب البيانات</p>
        <p className="text-sm mt-2">{error}</p>
      </div>
    );
  }

  // حالة عدم وجود بيانات
  if (!rules.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        لا توجد قواعد تمويل متاحة
      </div>
    );
  }

  // الجدول الرئيسي
  return (
    <div className="overflow-x-auto w-full">
      <div className="min-w-[2000px]">
        <table className="w-full divide-y divide-gray-200 text-gray-900">
          <thead className="bg-blue-700">
            <tr>
              <th className="px-4 py-4 text-right text-sm font-bold text-white uppercase tracking-wider">الفئة السعرية</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">مدة التمويل</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">نسبة الربح</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">الدفعة الأولى</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">الدفعة الأخيرة</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">عدد السيارات</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">القسط الشهري</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">الدخل الشهري</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">الدخل السنوي</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">مبلغ الشراء الممكن</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">إجمالي الربح لكامل المدة</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">الربح لكل سيارة</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">الربح السنوي</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">تكلفة التتبع</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">تكلفة عقد الضمان</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">تكلفة الفحص الفني</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">ROI الكلي</th>
              <th className="px-4 py-4 text-center text-sm font-bold text-white uppercase tracking-wider">ROI السنوي</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rules.map((rule, index) => (
              <tr key={rule.id} className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                <td className="px-4 py-4 text-right whitespace-nowrap text-sm font-medium">{formatNumber(rule.price_category)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{rule.duration_months} شهر</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatPercent(rule.profit_target_percent)}</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.down_payment_value)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.last_payment_value)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{rule.quantity}</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.monthly_installment)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.monthly_income)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.annual_income)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.possible_purchase_amount)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.total_profit_full_period)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.profit_per_car)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.annual_profit)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.tracking_cost)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.guarantee_contract_cost)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatNumber(rule.inspection_cost)} SAR</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatPercent(rule.roi_full_period)}</td>
                <td className="px-4 py-4 text-center whitespace-nowrap text-sm font-medium">{formatPercent(rule.roi_annual)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
