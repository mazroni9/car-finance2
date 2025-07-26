"use client";
import React from 'react';

export default function BasicTable({ entries, details }) {
  const numberOfStores = 1;

  const calculateRow = (entry) => {
    const relatedDetails = details.filter(
      (d) => Number(d.financingRate) === Number(entry.financingRate)
    );

    const totalSubscribers = relatedDetails.length;
    const totalOperations = relatedDetails.reduce(
      (sum, d) => sum + (Number(d.operationsMonthly) || 0), 0
    );
    const totalCapital = relatedDetails.reduce(
      (sum, d) => sum + (Number(d.capital) || 0), 0
    );

    return {
      ...entry,
      totalSubscribers,
      totalOperations,
      totalCapital,
      numberOfStores
    };
  };

  const results = entries.map(calculateRow);
  const grandTotalCapital = results.reduce((sum, r) => sum + (r.totalCapital || 0), 0);
  const grandTotalOperations = results.reduce((sum, r) => sum + (r.totalOperations || 0), 0);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-center">نموذج التمويل وحساب النتائج</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border mb-3">
          <thead>
            <tr className="bg-blue-800">
              <th className="text-white p-2">نسبة التمويل (%)</th>
              <th className="text-white p-2">الاشتراك الشهري (ريال)</th>
              <th className="text-white p-2">عدد المشتركين</th>
              <th className="text-white p-2">عدد المعارض</th>
              <th className="text-white p-2">عدد العمليات الشهرية</th>
              <th className="text-white p-2">رأس المال للتاجر (ريال)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i} className={i === results.length - 1 ? 'bg-black text-white' : ''}>
                <td className="border p-1 text-center">{r.financingRate}%</td>
                <td className="border p-1 text-center">{r.monthlySubscription}</td>
                <td className="border p-1 text-center">{r.totalSubscribers}</td>
                <td className="border p-1 text-center">{r.numberOfStores}</td>
                <td className="border p-1 text-center">{r.totalOperations}</td>
                <td className="border p-1 text-center">{Math.round(r.totalCapital).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ السطرين الإضافيين تحت الجدول */}
      <div className="text-right font-bold text-lg mt-2 text-blue-800 space-y-1">
        <div>إجمالي رأس المال: {grandTotalCapital.toLocaleString()} ريال</div>
        <div>إجمالي عدد العمليات الشهرية: {grandTotalOperations.toLocaleString()}</div>
      </div>
      {/* صف صافي الربح الشهري */}
      <div className="bg-black text-white text-center font-bold py-2 mt-2 rounded">
        صافي الربح الشهري
      </div>
    </div>
  );
}
