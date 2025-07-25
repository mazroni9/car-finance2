import React, { useEffect, useState } from "react";

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export default function LeasingMonthlySummaryCard() {
  const [monthlyTotals, setMonthlyTotals] = useState<{ [month: string]: number }>({});

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
      }
    }
  }, []);

  return (
    <div className="glass-card p-6 bg-gradient-to-br from-yellow-100 to-yellow-50 shadow-md hover:shadow-lg transition-shadow">
      <h2 className="text-2xl font-bold mb-6 text-black">ملخص الإيجار الشهري لكل شهر</h2>
      <table className="min-w-full w-full text-sm text-center border">
        <thead>
          <tr>
            <th className="border px-2 text-black font-bold">الشهر</th>
            <th className="border px-2 text-black font-bold">مجموع الإيجار الشهري (ريال)</th>
          </tr>
        </thead>
        <tbody>
          {MONTHS.map((month) => (
            <tr key={month}>
              <td className="border px-2 text-black font-bold">{month}</td>
              <td className="border px-2 text-black font-bold text-blue-800">
                {monthlyTotals[month]?.toLocaleString(undefined, { maximumFractionDigits: 2 }) || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 