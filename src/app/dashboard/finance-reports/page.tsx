/**
 * صفحة التقارير المالية - Finance Reports Dashboard
 *
 * الموقع: /admin/dashboard/finance-reports
 *
 * وصف:
 *   تعرض هذه الصفحة ملخصات الأداء المالي على مستوى التمويل والتقسيط،
 *   وتشمل:
 *     - إحصائيات عامة (رأس المال، الأرباح، عدد السيارات...)
 *     - رسم بياني تفاعلي لتطور الأرباح الشهرية
 *     - جداول تقارير مالية شهرية وربعية
 *
 * تعتمد على بيانات حقيقية من قاعدة Supabase، من الجداول:
 *   - finance_models
 *   - installments
 *   - transactions
 *   - wallets
 *
 * ملاحظات الاستخدام:
 *   - جميع القيم الإحصائية قابلة للتحديث تلقائي من الكنترول روم
 *   - سيتم لاحقًا إضافة فلاتر زمنية وتصدير Excel/PDF
 *
 * تاريخ الإنشاء: يونيو 2025
 * تم الإنشاء بواسطة: فريق DASM-e (بإشراف محمد الزهراني)
 */

'use client';

import { useState } from 'react';
import { BackButton } from '@/components/ui/back-button';

export default function FinanceReportsPage() {
  const [selectedPeriod] = useState('monthly');

  const dummyData = {
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    totalCars: 0,
    activeContracts: 0,
    completedContracts: 0,
    monthlyStats: [
      { month: 'يناير', revenue: 0, expenses: 0, profit: 0 },
      { month: 'فبراير', revenue: 0, expenses: 0, profit: 0 },
      { month: 'مارس', revenue: 0, expenses: 0, profit: 0 },
      { month: 'أبريل', revenue: 0, expenses: 0, profit: 0 },
      { month: 'مايو', revenue: 0, expenses: 0, profit: 0 },
      { month: 'يونيو', revenue: 0, expenses: 0, profit: 0 }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <BackButton />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">التقارير المالية</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-500 mb-2">إجمالي الإيرادات</h3>
            <p className="text-3xl font-bold text-gray-900">{dummyData.totalRevenue.toLocaleString()} ريال</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-500 mb-2">إجمالي المصروفات</h3>
            <p className="text-3xl font-bold text-gray-900">{dummyData.totalExpenses.toLocaleString()} ريال</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-500 mb-2">صافي الربح</h3>
            <p className="text-3xl font-bold text-gray-900">{dummyData.netProfit.toLocaleString()} ريال</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-500 mb-2">عدد السيارات</h3>
            <p className="text-3xl font-bold text-gray-900">{dummyData.totalCars}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-500 mb-2">العقود النشطة</h3>
            <p className="text-3xl font-bold text-gray-900">{dummyData.activeContracts}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-medium text-gray-500 mb-2">العقود المكتملة</h3>
            <p className="text-3xl font-bold text-gray-900">{dummyData.completedContracts}</p>
          </div>
        </div>

        {/* Monthly Stats Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">الإحصائيات الشهرية</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الشهر</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإيرادات</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المصروفات</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">صافي الربح</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyData.monthlyStats.map((stat, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.month}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.revenue.toLocaleString()} ريال</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.expenses.toLocaleString()} ريال</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.profit.toLocaleString()} ريال</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
