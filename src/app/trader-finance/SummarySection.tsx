"use client";
import React from 'react';

type SummarySectionProps = {
  allMonthlyDetails: any;
  entries: any;
};

type AnnualTotals = {
  [key: string]: number;
  totalOperations: number;
  totalCapital: number;
  transferFees: number;
  floorFees: number;
  subscriptions: number;
  netProfit: number;
  totalFinancedAmount: number;
};

export default function SummarySection({ allMonthlyDetails, entries }: SummarySectionProps) {
  const months = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // ✅ يحسب نتائج شهر واحد
  const calculateMonthlyResults = (details: any[], entries: any[]) => {
    const totalOperations = details.reduce(
      (sum, d) => sum + (Number(d.operationsMonthly) || 0), 0
    );

    const totalCapital = details.reduce(
      (sum, d) => sum + (Number(d.capital) || 0), 0
    );

    const transferFees = totalOperations * 117;
    const floorFees = totalOperations * 250;

    let subscriptions = 0;
    for (const entry of entries) {
      const count = details.filter(
        (d) => Number(d.financingRate) === Number(entry.financingRate)
      ).length;
      subscriptions += count * (entry.monthlySubscription || 0);
    }

    const netProfit = subscriptions + transferFees + floorFees;

    // ✅ حساب المبلغ الممول فعليًا
    const totalFinancedAmount = details.reduce(
      (sum, d) =>
        sum + ((Number(d.capital) || 0) * (Number(d.financingRate) || 0) / 100),
      0
    );

    return {
      totalOperations,
      totalCapital,
      transferFees,
      floorFees,
      subscriptions,
      netProfit,
      totalFinancedAmount
    };
  };

  // ✅ يحسب نتائج جميع الشهور
  const monthlyResults = months.map((month) => {
    const details = allMonthlyDetails[month] || [];
    return {
      month,
      ...calculateMonthlyResults(details, entries)
    };
  });

  // ✅ جمع سنوي
  const annualTotals: AnnualTotals = monthlyResults.reduce((acc, month) => {
    Object.keys(acc).forEach((key) => {
      acc[key] += month[key] || 0;
    });
    return acc;
  }, {
    totalOperations: 0,
    totalCapital: 0,
    transferFees: 0,
    floorFees: 0,
    subscriptions: 0,
    netProfit: 0,
    totalFinancedAmount: 0
  });

  return (
    <div className="mb-16">

      {/* ✅ النتائج الشهرية التفصيلية */}
      <h3 className="text-lg font-bold mb-2 text-green-600 flex items-center">
        🗓️ النتائج الشهرية التفصيلية
      </h3>
      <div className="overflow-x-auto mb-8">
        <table className="table-auto w-full border">
          <thead>
            <tr className="bg-green-800">
              <th className="text-white p-2">الشهر</th>
              <th className="text-white p-2">الاشتراكات</th>
              <th className="text-white p-2">رسوم نقل الملكية</th>
              <th className="text-white p-2">رسوم الأرضيات</th>
              <th className="text-white p-2">عدد العمليات</th>
              <th className="text-white p-2">رأس المال</th>
              <th className="text-white p-2">المبلغ الممول</th>
              <th className="text-white p-2">صافي الربح</th>
            </tr>
          </thead>
          <tbody>
            {monthlyResults.map((r) => (
              <tr key={r.month}>
                <td className="border p-1 text-center">{r.month}</td>
                <td className="border p-1 text-center">{r.subscriptions?.toLocaleString()} ريال</td>
                <td className="border p-1 text-center">{r.transferFees?.toLocaleString()} ريال</td>
                <td className="border p-1 text-center">{r.floorFees?.toLocaleString()} ريال</td>
                <td className="border p-1 text-center">{r.totalOperations}</td>
                <td className="border p-1 text-center">{r.totalCapital?.toLocaleString()} ريال</td>
                <td className="border p-1 text-center">{r.totalFinancedAmount?.toLocaleString()} ريال</td>
                <td className="border p-1 text-center text-green-700 font-bold">{r.netProfit?.toLocaleString()} ريال</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ النتائج السنوية المجمعة */}
      <h3 className="text-lg font-bold mb-2 text-green-600">📈 النتائج السنوية المجمعة</h3>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border">
          <tbody>
            <tr>
              <td className="border p-2">إجمالي الاشتراكات السنوية</td>
              <td className="border p-2">{annualTotals.subscriptions?.toLocaleString()} ريال</td>
            </tr>
            <tr>
              <td className="border p-2">رسوم نقل الملكية الإجمالية</td>
              <td className="border p-2">{annualTotals.transferFees?.toLocaleString()} ريال</td>
            </tr>
            <tr>
              <td className="border p-2">رسوم الأرضيات الإجمالية</td>
              <td className="border p-2">{annualTotals.floorFees?.toLocaleString()} ريال</td>
            </tr>
            <tr>
              <td className="border p-2">عدد العمليات الإجمالية</td>
              <td className="border p-2">{annualTotals.totalOperations}</td>
            </tr>
            <tr>
              <td className="border p-2">إجمالي رأس المال</td>
              <td className="border p-2">{annualTotals.totalCapital?.toLocaleString()} ريال</td>
            </tr>
            <tr>
              <td className="border p-2">إجمالي المبالغ الممولة</td>
              <td className="border p-2">{annualTotals.totalFinancedAmount?.toLocaleString()} ريال</td>
            </tr>
            <tr className="bg-green-50 font-bold text-green-800">
              <td className="border p-2">صافي الربح السنوي المقدر</td>
              <td className="border p-2">{annualTotals.netProfit?.toLocaleString()} ريال</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
