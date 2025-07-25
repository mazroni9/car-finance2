"use client";
import React from 'react';

type Entry = {
  financingRate: number;
  monthlySubscription: number;
};

type Detail = {
  id: number;
  capital: number;
  operationsMonthly: number;
  financingRate: number;
};

type BasicTableProps = {
  entries: Entry[];
  details: Detail[];
};

export default function BasicTable({ entries, details }: BasicTableProps) {
  // حساب عدد المشتركين لكل نسبة تمويل
  const getSubscribers = (rate: number) =>
    details.filter((d) => Number(d.financingRate) === Number(rate)).length;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-center text-blue-300">جدول الاشتراكات الأساسية</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border mb-3">
          <thead>
            <tr className="bg-blue-700">
              <th className="text-white p-2">نسبة التمويل (%)</th>
              <th className="text-white p-2">قيمة الاشتراك الشهري (ريال)</th>
              <th className="text-white p-2">عدد المشتركين</th>
              <th className="text-white p-2">إجمالي الاشتراكات (ريال)</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const subscribers = getSubscribers(entry.financingRate);
              return (
                <tr key={entry.financingRate}>
                  <td className="border p-1 text-center font-bold text-blue-800">{entry.financingRate}%</td>
                  <td className="border p-1 text-center">{entry.monthlySubscription.toLocaleString()}</td>
                  <td className="border p-1 text-center text-green-700 font-bold">{subscribers}</td>
                  <td className="border p-1 text-center text-green-700 font-bold">
                    {(subscribers * entry.monthlySubscription).toLocaleString()} ريال
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
