import React from "react";

const PRICE_CATEGORIES = [
  20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000
];

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export default function MonthlySummaryTable({ rows, selectedMonth }: { rows: any[], selectedMonth: string }) {
  const idx = MONTHS.indexOf(selectedMonth);
  const monthRows = rows.filter((_, i) => i % 12 === idx);

  // لكل فئة سعرية، اجمع القيم الخاصة بها فقط
  const summaryByCategory = PRICE_CATEGORIES.map((cat) => {
    const catRows = monthRows.filter(r => r.price_category === cat);
    return {
      priceCategory: cat,
      quantity: catRows.reduce((sum, r) => sum + r.quantity, 0),
      adminFees: catRows.reduce((sum, r) => sum + r.down_payment_value, 0),
      lastPayments: catRows.reduce((sum, r) => sum + r.last_payment_value, 0),
      insurance: catRows.reduce((sum, r) => sum + r.insurance_value, 0),
      extraAnnual: catRows.reduce((sum, r) => sum + r.extra_annual_fee, 0),
      baseProfit: catRows.reduce((sum, r) => sum + ((r.price_category - r.last_payment_value) * r.profit_target_percent), 0),
      monthlyRent: catRows.reduce((sum, r) => sum + r.monthly_rent, 0)
    };
  });

  return (
    <div className="overflow-x-auto w-full mb-4">
      <h2 className="text-lg font-bold mb-2 text-black text-center">الملخص الشهري</h2>
      <table className="min-w-full w-full text-sm text-center border">
        <thead>
          <tr>
            <th className="border px-2 text-black font-bold">الفئة السعرية</th>
            <th className="border px-2 text-black font-bold">عدد السيارات</th>
            <th className="border px-2 text-black font-bold">مجموع الرسوم الإدارية</th>
            <th className="border px-2 text-black font-bold">مجموع الدفعة الأخيرة</th>
            <th className="border px-2 text-black font-bold">مجموع التأمين السنوي</th>
            <th className="border px-2 text-black font-bold">مجموع الرسوم السنوية الإضافية</th>
            <th className="border px-2 text-black font-bold">مجموع الربح الأساسي</th>
            <th className="border px-2 text-black font-bold">مجموع الإيجار الشهري</th>
          </tr>
        </thead>
        <tbody>
          {summaryByCategory.map((row) => (
            <tr key={row.priceCategory}>
              <td className="border px-2 text-black font-bold">{row.priceCategory.toLocaleString()}</td>
              <td className="border px-2 text-black">{row.quantity}</td>
              <td className="border px-2 text-black">{row.adminFees.toLocaleString()}</td>
              <td className="border px-2 text-black">{row.lastPayments.toLocaleString()}</td>
              <td className="border px-2 text-black">{row.insurance.toLocaleString()}</td>
              <td className="border px-2 text-black">{row.extraAnnual.toLocaleString()}</td>
              <td className="border px-2 text-black">{row.baseProfit.toLocaleString()}</td>
              <td className="border px-2 text-black">{row.monthlyRent.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 