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
      monthlyRent: catRows.reduce((sum, r) => sum + r.monthly_rent, 0),
      extendedLease: catRows.reduce((sum, r) => sum + r.extended_lease_total, 0)
    };
  });

  return (
    <div className="overflow-x-auto w-full my-4 max-w-5xl mx-auto">
      <h2 className="text-lg font-bold mb-2 text-black text-center">الملخص الشهري - {selectedMonth}</h2>
      <table className="min-w-full w-full text-sm text-center border border-gray-200 rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-yellow-100 text-black font-bold">
            <th className="border border-gray-200 px-2 py-2">الفئة السعرية</th>
            <th className="border border-gray-200 px-2 py-2">عدد السيارات</th>
            <th className="border border-gray-200 px-2 py-2">تكلفة الشراء</th>
            <th className="border border-gray-200 px-2 py-2">العائد على الاستثمار (ROI)</th>
            <th className="border border-gray-200 px-2 py-2">مجموع الرسوم الإدارية</th>
            <th className="border border-gray-200 px-2 py-2">مجموع الدفعة الأخيرة</th>
            <th className="border border-gray-200 px-2 py-2">مجموع الربح الأساسي</th>
            <th className="border border-gray-200 px-2 py-2">مجموع الإيجار الشهري</th>
            <th className="border border-gray-200 px-2 py-2">ROI المحتمل عند استكمال العقد</th>
          </tr>
        </thead>
        <tbody>
          {summaryByCategory.map((row) => (
            <tr key={row.priceCategory} className="hover:bg-gray-50 transition-colors">
              <td className="border border-gray-200 px-2 py-2 font-bold text-black">{row.priceCategory.toLocaleString()}</td>
              <td className="border border-gray-200 px-2 py-2 text-black">{row.quantity}</td>
              <td className="border border-gray-200 px-2 py-2 font-bold text-blue-800">{(row.priceCategory * row.quantity).toLocaleString()}</td>
              <td className="border border-gray-200 px-2 py-2 font-bold text-blue-800">
                {row.quantity > 0 ? Math.round(((row.monthlyRent * 12 + row.adminFees) / (row.priceCategory * row.quantity)) * 100) : 0}%
              </td>
              <td className="border border-gray-200 px-2 py-2 text-black">{row.adminFees.toLocaleString()}</td>
              <td className="border border-gray-200 px-2 py-2 text-black">{row.lastPayments.toLocaleString()}</td>
              <td className="border border-gray-200 px-2 py-2 text-black">{row.baseProfit.toLocaleString()}</td>
              <td className="border border-gray-200 px-2 py-2 text-black">{row.monthlyRent.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
              <td className="border border-gray-200 px-2 py-2 font-bold text-green-800">
                {row.quantity > 0 ? Math.round(((row.monthlyRent * 12 + row.extendedLease) / (row.priceCategory * row.quantity)) * 100) : 0}%
              </td>
            </tr>
          ))}
          {/* صف المجاميع */}
          <tr className="bg-green-100 font-bold">
            <td className="border border-gray-200 px-2 py-2 text-black font-bold">المجموع</td>
            <td className="border border-gray-200 px-2 py-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.quantity, 0)}
            </td>
            <td className="border border-gray-200 px-2 py-2 text-blue-800 font-bold">
              {summaryByCategory.reduce((sum, row) => sum + (row.priceCategory * row.quantity), 0).toLocaleString()}
            </td>
            <td className="border border-gray-200 px-2 py-2 text-blue-800 font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.quantity, 0) > 0 ? Math.round(((summaryByCategory.reduce((sum, row) => sum + row.monthlyRent * 12, 0) + 
                 summaryByCategory.reduce((sum, row) => sum + row.adminFees, 0)) / 
                 summaryByCategory.reduce((sum, row) => sum + (row.priceCategory * row.quantity), 0)) * 100) : 0}%
            </td>
            <td className="border border-gray-200 px-2 py-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.adminFees, 0).toLocaleString()}
            </td>
            <td className="border border-gray-200 px-2 py-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.lastPayments, 0).toLocaleString()}
            </td>
            <td className="border border-gray-200 px-2 py-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.baseProfit, 0).toLocaleString()}
            </td>
            <td className="border border-gray-200 px-2 py-2 text-black font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.monthlyRent, 0).toLocaleString(undefined, {maximumFractionDigits: 2})}
            </td>
            <td className="border border-gray-200 px-2 py-2 text-green-800 font-bold">
              {summaryByCategory.reduce((sum, row) => sum + row.quantity, 0) > 0 ? Math.round(((summaryByCategory.reduce((sum, row) => sum + row.monthlyRent * 12, 0) + 
                 summaryByCategory.reduce((sum, row) => sum + row.extendedLease, 0)) / 
                 summaryByCategory.reduce((sum, row) => sum + (row.priceCategory * row.quantity), 0)) * 100) : 0}%
            </td>
          </tr>
          {/* صف وصف معادلة العائد على الاستثمار */}
          <tr className="bg-gray-50">
            <td className="border px-2 text-black text-sm" colSpan={9}>
              <div className="text-center py-2">
                <strong>معادلة العائد على الاستثمار (ROI):</strong> 
                <span className="text-blue-600 font-mono">((الإيجار السنوي المعتمد + الرسوم الإدارية) ÷ تكلفة الشراء) × 100</span>
                <br />
                <strong>معادلة ROI المحتمل عند استكمال العقد:</strong> 
                <span className="text-green-600 font-mono">((الإيجار السنوي المعتمد + الإيجار الممتد) ÷ تكلفة الشراء) × 100</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
} 