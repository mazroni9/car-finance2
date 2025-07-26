"use client";
import React from 'react';

export default function ResultsTable({ entries }) {
  const calculate = (entry) => {
    return {
      annualSubscription: entry.monthlySubscription * 12 * entry.subscribers,
      totalCapital: entry.capitalPerDealer * entry.dealers
    };
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3">نتائج الحساب</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-blue-800">
            <th className="text-white">نسبة التمويل</th>
            <th className="text-white">اشتراكات سنوية</th>
            <th className="text-white">رأس المال الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => {
            const r = calculate(entry);
            return (
              <tr key={i}>
                <td className="border p-1">{entry.financingRate}%</td>
                <td className="border p-1">{r.annualSubscription.toLocaleString()}</td>
                <td className="border p-1">{r.totalCapital.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
