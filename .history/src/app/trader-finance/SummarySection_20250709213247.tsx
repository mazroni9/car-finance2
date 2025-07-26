"use client";
import React from 'react';

const calculateMonthlyResults = (details, entries) => {
  const totalOperations = details.reduce(
    (sum, d) => sum + (Number(d.operationsMonthly) || 0),
    0
  );

  const totalCapital = details.reduce(
    (sum, d) => sum + (Number(d.capital) || 0),
    0
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

  return {
    totalOperations,
    totalCapital,
    transferFees,
    floorFees,
    subscriptions,
    netProfit
  };
};

export default function SummarySection({ allMonthlyDetails, entries }) {
  const monthNames = [
    'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
    'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
  ];

  // ✅ جمع نتائج كل شهر في مصفوفة
  const monthlyResults = monthNames.map((month) => ({
    month,
    ...calculateMonthlyResults(allMonthlyDetails[month] || [], entries)
  }));

  // ✅ حساب الإجماليات السنوية
  const yearlyTotals = monthlyResults.reduce(
    (acc, item) => {
      acc.subscriptions += item.subscriptions;
      acc.transferFees += item.transferFees;
      acc.floorFees += item.floorFees;
      acc.totalOperations += item.totalOperations;
      acc.totalCapital += item.totalCapital;
      acc.netProfit += item.netProfit;
      return acc;
    },
    {
      subscriptions: 0,
      transferFees: 0,
      floorFees: 0,
      totalOperations: 0,
      totalCapital: 0,
      netProfit: 0
    }
  );

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-center mb-2 text-green-700">
        🗓️ النتائج الشهرية التفصيلية
      </h2>

      <div className="overflow-x-auto mb-6">
        <table className="table-auto w-full border mb-3">
          <thead>
            <tr className="bg-green-800">
              <th className="text-white p-2">الشهر</th>
              <th className="text-white p-2">الاشتراكات</th>
              <th className="text-white p-2">رسوم نقل الملكية</th>
              <th className="text-white p-2">رسوم الأرضيات</th>
              <th className="text-white p-2">عدد العمليات</th>
              <th className="text-white p-2">رأس المال</th>
              <th className="text-white p-2">صافي الربح</th>
            </tr>
          </thead>
          <tbody>
            {monthlyResults.map((res, i) => (
              <tr key={i}>
                <td className="border p-1 text-center">{res.month}</td>
                <td className="border p-1 text-center">{res.subscriptions.toLocaleString()} ريال</td>
                <td className="border p-1 text-center">{res.transferFees.toLocaleString()} ريال</td>
                <td className="border p-1 text-center">{res.floorFees.toLocaleString()} ريال</td>
                <td className="border p-1 text-center">{res.totalOperations}</td>
                <td className="border p-1 text-center">{res.totalCapital.toLocaleString()} ريال</td>
                <td className="border p-1 text-center font-bold text-green-700">{res.netProfit.toLocaleString()} ريال</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-xl font-bold text-center mb-2 text-green-700">
        📌 النتائج السنوية المجمعة
      </h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border mb-3">
          <tbody>
            <tr>
              <td className="border p-2">إجمالي الاشتراكات السنوية</td>
              <td className="border p-2 text-center">{yearlyTotals.subscriptions.toLocaleString()} ريال</td>
            </tr>
            <tr>
              <td className="border p-2">رسوم نقل الملكية الإجمالية</td>
              <td className="border p-2 text-center">{yearlyTotals.transferFees.toLocaleString()} ريال</td>
            </tr>
            <tr>
              <td className="border p-2">رسوم الأرضيات الإجمالية</td>
              <td className="border p-2 text-center">{yearlyTotals.floorFees.toLocaleString()} ريال</td>
            </tr>
            <tr>
              <td className="border p-2">عدد العمليات الإجمالية</td>
              <td className="border p-2 text-center">{yearlyTotals.totalOperations}</td>
            </tr>
            <tr>
              <td className="border p-2">مجموع رأس المال الإجمالي</td>
              <td className="border p-2 text-center">{yearlyTotals.totalCapital.toLocaleString()} ريال</td>
            </tr>
            <tr className="bg-black font-bold">
              <td className="border p-2 text-white">✅ صافي الربح السنوي المقدر</td>
              <td className="border p-2 text-center text-white">{yearlyTotals.netProfit.toLocaleString()} ريال</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
