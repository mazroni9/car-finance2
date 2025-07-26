'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/services/supabase';
import CarFinanceTable from '@/components/CarFinanceTable';

export default function CarFinanceList() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: installmentRules, error: fetchError } = await supabase
          .from('installment_rules')
          .select('*')
          .order('price_category', { ascending: true });

        if (fetchError) throw fetchError;
        setData(installmentRules || []);
      } catch (err: any) {
        console.error('Supabase fetch error:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          ⏳ جاري تحميل البيانات...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
          ❌ خطأ في جلب البيانات
        </h1>
        <p className="text-center text-gray-700">{error.message}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          📋 قائمة بيانات التمويل
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300">
          لا توجد بيانات محفوظة حتى الآن.
        </p>
      </div>
    );
  }

  // ✅ حساب المجاميع من القيم الجاهزة في الجدول
  const totalMonthlySum = data.reduce((sum, item) => sum + (item.total_monthly_income || 0), 0);
  const totalProfitSum = data.reduce((sum, item) => sum + (item.total_profit || 0), 0);
  const totalCarsCount = data.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
        📋 قائمة بيانات التمويل
      </h1>

      <div className="overflow-x-auto border rounded-lg shadow mb-6">
        <table className="min-w-full table-fixed bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-800 border-b">
            <tr className="text-gray-900 dark:text-gray-100 text-center text-sm">
              <th className="px-3 py-2 border">الفئة السعرية</th>
              <th className="px-3 py-2 border">مدة التمويل</th>
              <th className="px-3 py-2 border">عدد السيارات</th>
              <th className="px-3 py-2 border">دفعة أولى (ريال)</th>
              <th className="px-3 py-2 border">دفعة أخيرة (ريال)</th>
              <th className="px-3 py-2 border">مبلغ التمويل (ريال)</th>
              <th className="px-3 py-2 border">الربح للسيارة (ريال)</th>
              <th className="px-3 py-2 border">سعر البيع (ريال)</th>
              <th className="px-3 py-2 border">القسط الشهري (ريال)</th>
              <th className="px-3 py-2 border">إجمالي الأقساط الشهرية (ريال)</th>
              <th className="px-3 py-2 border">إجمالي الربح (ريال)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id || index} className="text-center border-b hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
                <td className="px-3 py-2 border">{item.price_category?.toLocaleString('ar-SA')}</td>
                <td className="px-3 py-2 border">{item.duration_months}</td>
                <td className="px-3 py-2 border">{item.quantity}</td>
                <td className="px-3 py-2 border">{item.down_payment_value?.toLocaleString('ar-SA')}</td>
                <td className="px-3 py-2 border">{item.last_payment_value?.toLocaleString('ar-SA')}</td>
                <td className="px-3 py-2 border">{item.financed_amount?.toLocaleString('ar-SA')}</td>
                <td className="px-3 py-2 border">{item.profit_per_car?.toLocaleString('ar-SA')}</td>
                <td className="px-3 py-2 border">{item.sale_price?.toLocaleString('ar-SA')}</td>
                <td className="px-3 py-2 border">{item.monthly_installment?.toLocaleString('ar-SA')}</td>
                <td className="px-3 py-2 border">{item.total_monthly_income?.toLocaleString('ar-SA')}</td>
                <td className="px-3 py-2 border">{item.total_profit?.toLocaleString('ar-SA')}</td>
              </tr>
            ))}

            {/* ✅ صفوف المجاميع */}
            <tr className="font-bold text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800">
              <td className="px-4 py-2 border text-end" colSpan={8}>إجمالي عدد السيارات المشتراة:</td>
              <td className="px-4 py-2 border text-center" colSpan={3}>{totalCarsCount.toLocaleString('ar-SA')}</td>
            </tr>

            <tr className="font-bold text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800">
              <td className="px-4 py-2 border text-end" colSpan={8}>إجمالي الأقساط الشهرية:</td>
              <td className="px-4 py-2 border text-center" colSpan={3}>{totalMonthlySum.toLocaleString('ar-SA')}</td>
            </tr>

            <tr className="font-bold text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-800">
              <td className="px-4 py-2 border text-end" colSpan={8}>إجمالي الربح لجميع العمليات:</td>
              <td className="px-4 py-2 border text-center" colSpan={3}>{totalProfitSum.toLocaleString('ar-SA')}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
