'use client';

import React from 'react';

export default function CarFinanceTable({ rows }: { rows: any[] }) {
  // ✅ حساب المجاميع الرئيسية
  const totalMonthlyInstallmentsSum = rows.reduce((sum, item) => sum + (item.totalMonthlyIncome || 0), 0);
  const totalProfitSum = rows.reduce((sum, item) => sum + (item.totalProfit || 0), 0);
  const totalPurchaseCost = rows.reduce((sum, item) => sum + (item.price_category * item.quantity || 0), 0);

  // ✅ حساب متوسط مدة التمويل
  const totalQuantity = rows.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const weightedDuration = rows.reduce((sum, item) => sum + (item.duration_months * item.quantity || 0), 0);
  const avgDuration = totalQuantity > 0 ? (weightedDuration / totalQuantity) : 0;

  // ✅ حساب التدوير
  const investmentMonths = 9;
  const possibleCycles = avgDuration > 0 ? (investmentMonths / avgDuration) : 0;
  const totalReinvestedAmount = possibleCycles * totalPurchaseCost;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📋 قائمة بيانات التمويل</h1>

      {rows.length === 0 ? (
        <p className="text-center text-gray-600">لا توجد بيانات محفوظة حتى الآن.</p>
      ) : (
        <>
          <div className="overflow-x-auto border rounded-lg shadow mb-6">
            <table className="min-w-full bg-white border text-center">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-4 py-2 border">الفئة السعرية (ريال)</th>
                  <th className="px-4 py-2 border">مدة التمويل (شهر)</th>
                  <th className="px-4 py-2 border">عدد السيارات</th>
                  <th className="px-4 py-2 border">دفعة أولى (ريال)</th>
                  <th className="px-4 py-2 border">دفعة أخيرة (ريال)</th>
                  <th className="px-4 py-2 border">سعر البيع بالتقسيط (ريال)</th>
                  <th className="px-4 py-2 border">القسط الشهري (ريال)</th>
                  <th className="px-4 py-2 border">إجمالي الأقساط الشهرية (ريال)</th>
                  <th className="px-4 py-2 border">الربح (للسيارة) (ريال)</th>
                  <th className="px-4 py-2 border">إجمالي الربح (ريال)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2 border">{item.price_category?.toLocaleString()}</td>
                    <td className="px-4 py-2 border">{item.duration_months}</td>
                    <td className="px-4 py-2 border">{item.quantity}</td>
                    <td className="px-4 py-2 border">{item.downPaymentValue?.toLocaleString()}</td>
                    <td className="px-4 py-2 border">{item.lastPaymentValue?.toLocaleString()}</td>
                    <td className="px-4 py-2 border">{item.salePrice?.toLocaleString()}</td>
                    <td className="px-4 py-2 border">{item.monthlyInstallment?.toFixed(0)}</td>
                    <td className="px-4 py-2 border">{item.totalMonthlyIncome?.toFixed(0)}</td>
                    <td className="px-4 py-2 border">{item.profitPerCar?.toLocaleString()}</td>
                    <td className="px-4 py-2 border">{item.totalProfit?.toLocaleString()}</td>
                  </tr>
                ))}

                {/* ✅ المجاميع الأساسية */}
                <tr className="bg-yellow-50 border-t font-bold">
                  <td colSpan={7}>إجمالي الأقساط الشهرية:</td>
                  <td className="border px-4 py-2">{totalMonthlyInstallmentsSum.toLocaleString()}</td>
                  <td className="border px-4 py-2" colSpan={2}>{totalProfitSum.toLocaleString()}</td>
                </tr>

                <tr className="font-bold bg-gray-50">
                  <td colSpan={8}>إجمالي تكلفة شراء السيارات:</td>
                  <td className="border px-4 py-2" colSpan={2}>{totalPurchaseCost.toLocaleString()}</td>
                </tr>

                {/* ✅ الإضافات الخاصة بالتدوير */}
                <tr className="border-t font-bold bg-gray-50">
                  <td colSpan={8}>متوسط مدة التمويل (شهر):</td>
                  <td className="border px-4 py-2" colSpan={2}>{avgDuration.toFixed(1)}</td>
                </tr>
                <tr className="border-t font-bold bg-gray-50">
                  <td colSpan={8}>عدد الدورات الممكنة في 9 أشهر:</td>
                  <td className="border px-4 py-2" colSpan={2}>{possibleCycles.toFixed(2)}</td>
                </tr>
                <tr className="border-t font-bold bg-gray-50">
                  <td colSpan={8}>إجمالي قيمة المشتريات الممكنة (ريال):</td>
                  <td className="border px-4 py-2" colSpan={2}>{totalReinvestedAmount.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
