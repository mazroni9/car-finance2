'use client';

import React, { useEffect, useState } from "react";

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export default function LeasingMonthlySummaryCard() {
  const [monthlyTotals, setMonthlyTotals] = useState<{ [month: string]: number }>({});
  const [cumulativeTotals, setCumulativeTotals] = useState<{ [month: string]: number }>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedRows = localStorage.getItem('carLeasingRows');
      if (savedRows) {
        const rows = JSON.parse(savedRows);
        const totals: { [month: string]: number } = {};
        for (const month of MONTHS) {
          totals[month] = rows
            .filter((row: any) => row.month === month)
            .reduce((sum: number, row: any) => sum + (row.monthly_rent || 0), 0);
        }
        setMonthlyTotals(totals);
        // حساب التراكمي
        const cumulative: { [month: string]: number } = {};
        let runningTotal = 0;
        for (const month of MONTHS) {
          runningTotal += totals[month] || 0;
          cumulative[month] = runningTotal;
        }
        setCumulativeTotals(cumulative);
      }
    }
  }, []);

  return (
    <div className="glass-card p-6 bg-gradient-to-br from-yellow-100 to-yellow-50 shadow-md hover:shadow-lg transition-shadow w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-black">ملخص الإيجار الشهري لكل شهر</h2>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between py-2 px-3 rounded bg-yellow-200 font-bold text-black">
          <span className="w-24">الشهر</span>
          <span className="w-32 text-center">الإيجار الشهري</span>
          <span className="w-40 text-center">الإجمالي التراكمي</span>
        </div>
        {MONTHS.map((month) => (
          <div key={month} className="flex items-center justify-between py-2 px-3 rounded bg-white/70 hover:bg-yellow-100 transition-colors">
            <span className="font-bold text-black w-24">{month}</span>
            <span className="font-bold text-blue-800 text-lg w-32 text-center">
              {monthlyTotals[month]?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || 0}
              <span className="text-gray-500 text-sm mx-1">ريال</span>
            </span>
            <span className="font-bold text-green-800 text-lg w-40 text-center">
              {cumulativeTotals[month]?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || 0}
              <span className="text-gray-500 text-sm mx-1">ريال</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
} 