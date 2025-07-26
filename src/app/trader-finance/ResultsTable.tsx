"use client";
import React from 'react';

type Entry = {
  financingRate: number;
  monthlySubscription: number;
  subscribers?: number;
  dealers?: number;
  annualOperations?: number;
  capitalPerDealer?: number;
};

type ResultsTableProps = {
  entries: Entry[];
};

export default function ResultsTable({ entries }: ResultsTableProps) {
  // ثابتات النظام
  const TRANSFER_FEE_PER_OPERATION = 117;
  const FLOOR_FEE_PER_OPERATION = 250;

  const calculateRow = (entry: Entry) => {
    const monthlySubscription = Number(entry.monthlySubscription) || 0;
    const subscribers = Number(entry.subscribers) || 0;
    const dealers = Number(entry.dealers) || 0;
    const annualOperations = Number(entry.annualOperations) || 0;
    const capitalPerDealer = Number(entry.capitalPerDealer) || 0;
    const financingRate = Number(entry.financingRate) || 0;

    // الحسابات
    const annualSubscriptions = monthlySubscription * 12 * subscribers;
    const annualTransferFees = TRANSFER_FEE_PER_OPERATION * subscribers * (annualOperations / 12);
    const annualFloorFees = FLOOR_FEE_PER_OPERATION * subscribers * (annualOperations / 12);
    const totalCapital = capitalPerDealer * dealers;
    const coveragePerDealer = capitalPerDealer * (financingRate / 100);
    const totalCoverage = coveragePerDealer * dealers;

    return {
      ...entry,
      annualSubscriptions,
      annualTransferFees,
      annualFloorFees,
      totalCapital,
      coveragePerDealer,
      totalCoverage
    };
  };

  type ResultRow = Entry & {
    annualSubscriptions: number;
    annualTransferFees: number;
    annualFloorFees: number;
    totalCapital: number;
    coveragePerDealer: number;
    totalCoverage: number;
  };

  const results: ResultRow[] = entries.map(calculateRow);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-3 text-center">نتائج الحساب</h2>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border mb-3">
          <thead>
            <tr className="bg-blue-800">
              <th className="text-white p-2">نسبة التمويل (%)</th>
              <th className="text-white p-2">اشتراكات سنوية (ريال)</th>
              <th className="text-white p-2">رسوم نقل الملكية (ريال)</th>
              <th className="text-white p-2">رسوم الأرضية (ريال)</th>
              <th className="text-white p-2">عمولة المنصة (ريال)</th>
              <th className="text-white p-2">رأس المال الإجمالي (ريال)</th>
              <th className="text-white p-2">قيمة التغطية للتاجر (ريال)</th>
              <th className="text-white p-2">إجمالي التغطية (ريال)</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r: ResultRow, i: number) => (
              <tr key={i}>
                <td className="border p-1 text-center">{r.financingRate}%</td>
                <td className="border p-1 text-center">{Math.round(r.annualSubscriptions).toLocaleString()}</td>
                <td className="border p-1 text-center">{Math.round(r.annualTransferFees).toLocaleString()}</td>
                <td className="border p-1 text-center">{Math.round(r.annualFloorFees).toLocaleString()}</td>
                <td className="border p-1 text-center text-green-700 font-bold">0</td>
                <td className="border p-1 text-center">{Math.round(r.totalCapital).toLocaleString()}</td>
                <td className="border p-1 text-center">{Math.round(r.coveragePerDealer).toLocaleString()}</td>
                <td className="border p-1 text-center">{Math.round(r.totalCoverage).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
