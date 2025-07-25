'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/server';

export default function CarFinanceTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/finance/rules');
        if (!response.ok) {
          throw new Error('Failed to fetch rules');
        }
        const data = await response.json();
        setRows(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <p className="mt-2 text-gray-600">جارٍ التحميل...</p>
    </div>
  );
  
  if (error) return (
    <div className="text-center py-8 text-red-500">
      <p>❌ خطأ في جلب البيانات</p>
      <p className="text-sm mt-2">{error}</p>
    </div>
  );

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-4 py-3 text-right">الفئة السعرية</th>
            <th className="px-4 py-3 text-center">مدة التمويل</th>
            <th className="px-4 py-3 text-center">نسبة الربح</th>
            <th className="px-4 py-3 text-center">الدفعة الأولى</th>
            <th className="px-4 py-3 text-center">الدفعة الأخيرة</th>
            <th className="px-4 py-3 text-center">عدد السيارات</th>
            <th className="px-4 py-3 text-center">القسط الشهري</th>
            <th className="px-4 py-3 text-center">الدخل السنوي</th>
            <th className="px-4 py-3 text-center">تكلفة الشراء</th>
            <th className="px-4 py-3 text-center">الربح الكامل</th>
            <th className="px-4 py-3 text-center">ROI الكلي</th>
            <th className="px-4 py-3 text-center">ROI السنوي</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {rows.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-4 py-3 text-right">{item.price_category?.toLocaleString('ar-SA')} ريال</td>
              <td className="px-4 py-3 text-center">{item.duration_months} شهر</td>
              <td className="px-4 py-3 text-center">{(item.profit_target_percent * 100).toFixed(2)}%</td>
              <td className="px-4 py-3 text-center">{(item.down_payment_percent * 100).toFixed(2)}%</td>
              <td className="px-4 py-3 text-center">{(item.last_payment_percent * 100).toFixed(2)}%</td>
              <td className="px-4 py-3 text-center">{item.quantity}</td>
              <td className="px-4 py-3 text-center">{item.monthly_installment?.toLocaleString('ar-SA')} ريال</td>
              <td className="px-4 py-3 text-center">{item.annual_income?.toLocaleString('ar-SA')} ريال</td>
              <td className="px-4 py-3 text-center">{item.total_purchase_cost?.toLocaleString('ar-SA')} ريال</td>
              <td className="px-4 py-3 text-center">{item.total_profit_full_period?.toLocaleString('ar-SA')} ريال</td>
              <td className="px-4 py-3 text-center">{(item.roi_full_period * 100).toFixed(2)}%</td>
              <td className="px-4 py-3 text-center">{(item.roi_annual * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
