import React from "react";

const MONTHS = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

export default function MonthlySummaryTable({ rows, selectedMonth }: { rows: any[], selectedMonth: string }) {
  // توزيع الصفوف على الأشهر بالتساوي مؤقتًا
  const idx = MONTHS.indexOf(selectedMonth);
  const monthRows = rows.filter((_, i) => i % 12 === idx);
  // التجميع
  const priceCategory = monthRows.reduce((sum, r) => sum + r.price_category, 0);
  const quantity = monthRows.reduce((sum, r) => sum + r.quantity, 0);
  const adminFees = monthRows.reduce((sum, r) => sum + r.down_payment_value, 0);
  const lastPayments = monthRows.reduce((sum, r) => sum + r.last_payment_value, 0);
  const insurance = monthRows.reduce((sum, r) => sum + r.insurance_value, 0);
  const extraAnnual = monthRows.reduce((sum, r) => sum + r.extra_annual_fee, 0);
  const baseProfit = monthRows.reduce((sum, r) => sum + ((r.price_category - r.last_payment_value) * r.profit_target_percent), 0);
  const monthlyRent = monthRows.reduce((sum, r) => sum + r.monthly_rent, 0);

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
          <tr>
            <td className="border px-2 text-black">{priceCategory.toLocaleString()}</td>
            <td className="border px-2 text-black">{quantity}</td>
            <td className="border px-2 text-black">{adminFees.toLocaleString()}</td>
            <td className="border px-2 text-black">{lastPayments.toLocaleString()}</td>
            <td className="border px-2 text-black">{insurance.toLocaleString()}</td>
            <td className="border px-2 text-black">{extraAnnual.toLocaleString()}</td>
            <td className="border px-2 text-black">{baseProfit.toLocaleString()}</td>
            <td className="border px-2 text-black">{monthlyRent.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
} 