import React from "react";

const PRICE_CATEGORIES = [
  20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000
];

function getAdminFee(priceCategory: number) {
  const base = 20000;
  const baseFee = 2000;
  if (priceCategory < base) return baseFee;
  return baseFee + Math.round((priceCategory - base) / 5000) * 250;
}

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export default function MonthlySummaryTable({ rows, selectedMonth }: { rows: any[], selectedMonth: string }): JSX.Element {
  const idx = MONTHS.indexOf(selectedMonth);
  const monthRows = rows.filter(r => r.month === selectedMonth);

  const summaryByCategory = PRICE_CATEGORIES.map((cat) => {
    const catRows = monthRows.filter(r => r.price_category === cat);
    const quantity = catRows.reduce((sum, r) => sum + r.quantity, 0);
    return {
      priceCategory: cat,
      quantity,
      adminFees: catRows.length > 0 ? getAdminFee(cat) * quantity : 0,
      lastPayments: catRows.reduce((sum, r) => sum + r.last_payment_value, 0),
      insurance: 2000 * quantity,
      extraAnnual: catRows.reduce((sum, r) => sum + r.extra_annual_fee, 0),
      baseProfit: catRows.reduce((sum, r) => sum + 6000, 0), // ربح ثابت 6000 ريال لكل سيارة
      monthlyRent: catRows.reduce((sum, r) => sum + r.monthly_rent, 0)
    };
  });

  return (
    <div className="overflow-x-auto w-full mb-4">
      <h2 className="text-lg font-bold mb-2 text-black text-center">الملخص الشهري - {selectedMonth}</h2>
      <table className="min-w-full w-full text-sm text-center border">
        <thead>
          <tr>
            <th className="border px-2 text-black font-bold">الفئة السعرية</th>
            <th className="border px-2 text-black font-bold">عدد السيارات</th>
            <th className="border px-2 text-black font-bold">تكلفة الشراء</th>
            <th className="border px-2 text-black font-bold">مجموع الرسوم الإدارية</th>
            <th className="border px-2 text-black font-bold">مجموع الدفعة الأخيرة</th>
            <th className="border px-2 text-black font-bold">مجموع التأمين السنوي</th>
            <th className="border px-2 text-black font-bold">مجموع الرسوم السنوية الإضافية</th>
            <th className="border px-2 text-black font-bold">مجموع الربح الأساسي</th>
            <th className="border px-2 text-black font-bold">العائد على الاستثمار (ROI)</th>
            <th className="border px-2 text-black font-bold">مجموع الإيجار الشهري</th>
          </tr>
        </thead>
        <tbody>
          {summaryByCategory.map((row) => (
            <tr key={row.priceCategory}>
              <td className="border px-2 text-black font-bold">{row.priceCategory.toLocaleString()}</td>
              <td className="border px-2 text-black">{row.quantity}</td>
              <td className="border px-2 text-black font-bold text-blue-800">{(row.priceCategory * row.quantity).toLocaleString()}</td>
              <td className="border px-2 text-black">{row.adminFees.toLocaleString()}</td>
              <td className="border px-2 text-black">{row.lastPayments.toLocaleString()}</td>
              <td className="border px-2 text-black">{row.insurance.toLocaleString()}</td>
              <td className="border px-2 text-black">{row.extraAnnual.toLocaleString()}</td>
              <td className="border px-2 text-black">{row.baseProfit.toLocaleString()}</td>
              <td className="border px-2 text-black font-bold text-green-800">
                {((row.baseProfit / (row.priceCategory * row.quantity)) * 100).toFixed(2)}%
              </td>
              <td className="border px-2 text-black">{row.monthlyRent.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
            </tr>
          ))}
          {/* صف المجاميع */}
          <tr className="bg-green-200 font-bold">
            <td className="border px-2 text-black font-bold">المجموع</td>
            <td className="border px-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.quantity, 0)}
            </td>
            <td className="border px-2 text-black font-bold text-blue-800">
              {summaryByCategory.reduce((sum, row) => sum + (row.priceCategory * row.quantity), 0).toLocaleString()}
            </td>
            <td className="border px-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.adminFees, 0).toLocaleString()}
            </td>
            <td className="border px-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.lastPayments, 0).toLocaleString()}
            </td>
            <td className="border px-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.insurance, 0).toLocaleString()}
            </td>
            <td className="border px-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.extraAnnual, 0).toLocaleString()}
            </td>
            <td className="border px-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.baseProfit, 0).toLocaleString()}
            </td>
            <td className="border px-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.monthlyRent, 0).toLocaleString(undefined, {maximumFractionDigits: 2})}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
} 