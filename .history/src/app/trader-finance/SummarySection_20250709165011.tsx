"use client";
import React from 'react';

export default function SummarySection({ entries }) {
  const totalAnnualSubscriptions = entries.reduce(
    (acc, e) => acc + e.monthlySubscription * 12 * e.subscribers,
    0
  );

  // مؤقت: يمكنك حساب باقي القيم بنفس الطريقة
  const totalCapital = entries.reduce(
    (acc, e) => acc + e.capitalPerDealer * e.dealers,
    0
  );

  return (
    <div className="bg-gray-50 p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-2">الملخص السنوي</h2>
      <ul className="space-y-2">
        <li>إجمالي الاشتراكات السنوية: {totalAnnualSubscriptions.toLocaleString()}</li>
        <li>إجمالي رأس المال: {totalCapital.toLocaleString()}</li>
        <li>صافي الربح (تقديري): ...</li>
        <li>ROI (تقديري): ...%</li>
      </ul>
    </div>
  );
}
