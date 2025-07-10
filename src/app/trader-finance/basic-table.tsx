"use client";
import React from 'react';

interface Entry {
  financingRate: number;
  monthlySubscription: number;
}

interface Detail {
  id: number;
  capital: number;
  operationsMonthly: number;
  financingRate: number;
}

interface CalculatedRow extends Entry {
  subscribers: number;
  operations: number;
  capital: number;
  financedAmount: number;
}

export default function BasicTable({ entries, details }: { entries: Entry[]; details: Detail[] }) {

  // ✅ يحسب مجموع رأس المال لهذا المستوى
  const totalCapital = details.reduce(
    (sum, d) => sum + (Number(d.capital) || 0),
    0
  );

  // ✅ يحسب إجمالي العمليات
  const totalOperations = details.reduce(
    (sum, d) => sum + (Number(d.operationsMonthly) || 0),
    0
  );

  // ✅ يحسب المبلغ الممول من كل تاجر
  const totalFinancedAmount = details.reduce(
    (sum, d) =>
      sum + ((Number(d.capital) || 0) * (Number(d.financingRate) || 0) / 100),
    0
  );

  // ✅ يجمع كل مستوى التمويل
  const getRowForRate = (entry: Entry): CalculatedRow => {
    const matchingDetails = details.filter(
      (d) => Number(d.financingRate) === Number(entry.financingRate)
    );

    const subscribers = matchingDetails.length;

    const operations = matchingDetails.reduce(
      (sum, d) => sum + (Number(d.operationsMonthly) || 0), 0
    );

    const capital = matchingDetails.reduce(
      (sum, d) => sum + (Number(d.capital) || 0), 0
    );

    const financedAmount = matchingDetails.reduce(
      (sum, d) =>
        sum + ((Number(d.capital) || 0) * (Number(d.financingRate) || 0) / 100),
      0
    );

    return {
      ...entry,
      subscribers,
      operations,
      capital,
      financedAmount
    };
  };

  const results = entries.map(getRowForRate);
  const totalSubscribers = results.reduce((sum, r) => sum + (r.subscribers || 0), 0);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-center">
        نموذج التمويل وحساب النتائج
      </h2>

      <div className="overflow-x-auto mb-2">
        <table className="table-auto w-full border mb-3">
          <thead>
            <tr className="bg-blue-800">
              <th className="text-white p-2">نسبة التمويل (%)</th>
              <th className="text-white p-2">الاشتراك الشهري (ريال)</th>
              <th className="text-white p-2">عدد المشتركين</th>
              <th className="text-white p-2">عدد المعارض</th>
              <th className="text-white p-2">عدد العمليات الشهرية</th>
              <th className="text-white p-2">رأس المال للتاجر (ريال)</th>
              <th className="text-white p-2">المبلغ الممول (ريال)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <tr key={i}>
                <td className="border p-1 text-center">{r.financingRate}%</td>
                <td className="border p-1 text-center">{r.monthlySubscription}</td>
                <td className="border p-1 text-center">{r.subscribers}</td>
                <td className="border p-1 text-center">1</td>
                <td className="border p-1 text-center">{r.operations}</td>
                <td className="border p-1 text-center">{Math.round(r.capital).toLocaleString()}</td>
                <td className="border p-1 text-center">{Math.round(r.financedAmount).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center font-semibold">
        <div className="my-2 text-green-700">
          إجمالي رأس المال: {totalCapital.toLocaleString()} ريال
        </div>
        <div className="my-2 text-green-700">
          إجمالي عدد العمليات الشهرية: {totalOperations}
        </div>
        <div className="my-2 text-green-700">
          إجمالي المبلغ الممول: {totalFinancedAmount.toLocaleString()} ريال
        </div>
        <div className="my-2 text-green-700">
          إجمالي عدد المشتركين: {totalSubscribers}
        </div>
      </div>
    </div>
  );
}
