'use client';

import React from 'react';

export default function CarFinanceTable({ rows }: { rows: any[] }) {
  // ✅ المجاميع
  const totalMonthlyInstallmentsSum = rows.reduce((sum, item) => sum + (item.totalMonthlyIncome || 0), 0);
  const totalProfitSum = rows.reduce((sum, item) => sum + (item.totalProfit || 0), 0);
  const totalPurchaseCost = rows.reduce((sum, item) => sum + (item.price_category * item.quantity || 0), 0);

  // ✅ حساب الربح السنوي قبل خصم التكاليف
  const annualProfit = totalProfitSum / (rows.length > 0 ? rows[0].duration_months : 12) * 12;

  // ✅ الدخل السنوي
  const annualIncome = totalMonthlyInstallmentsSum * 12;

  // ✅ حساب ROI
  const roiTotal = totalPurchaseCost > 0 ? (totalProfitSum / totalPurchaseCost) * 100 : 0;
  const roiAnnual = totalPurchaseCost > 0 ? (annualProfit / totalPurchaseCost) * 100 : 0;

  // ✅ متوسط مدة التمويل
  const totalQuantity = rows.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const weightedDuration = rows.reduce((sum, item) => sum + (item.duration_months * item.quantity || 0), 0);
  const avgDuration = totalQuantity > 0 ? (weightedDuration / totalQuantity) : 0;

  // ✅ التدوير في 9 أشهر
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

                {/* ✅ الصفوف النهائية المعتمدة */}
                <tr className="bg-yellow-50 border-t font-bold">
                  <td colSpan={8}>إجمالي الأقساط الشهرية:</td>
                  <td className="border px-4 py-2" colSpan={2}>{totalMonthlyInstallmentsSum.toLocaleString()}</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={8}>إجمالي ربح عمليات التقسيط لكامل الفترة:</td>
                  <td className="border px-4 py-2" colSpan={2}>{totalProfitSum.toLocaleString()}</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={8}>إجمالي الربح السنوي قبل خصم التكاليف:</td>
                  <td className="border px-4 py-2" colSpan={2}>{annualProfit.toLocaleString()}</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={8}>إجمالي الدخل السنوي:</td>
                  <td className="border px-4 py-2" colSpan={2}>{annualIncome.toLocaleString()}</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={8}>إجمالي تكلفة شراء السيارات:</td>
                  <td className="border px-4 py-2" colSpan={2}>{totalPurchaseCost.toLocaleString()}</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={8}>العائد على الاستثمار (ROI) لكامل الفترة:</td>
                  <td className="border px-4 py-2" colSpan={2}>{roiTotal.toFixed(2)}%</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={8}>العائد على الاستثمار (ROI) السنوي:</td>
                  <td className="border px-4 py-2" colSpan={2}>{roiAnnual.toFixed(2)}%</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={8}>متوسط مدة التمويل:</td>
                  <td className="border px-4 py-2" colSpan={2}>{avgDuration.toFixed(1)} شهر</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={8}>عدد الدورات الممكنة في 9 أشهر:</td>
                  <td className="border px-4 py-2" colSpan={2}>{possibleCycles.toFixed(2)}</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={8}>إجمالي قيمة المشتريات الممكنة في 9 أشهر:</td>
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
