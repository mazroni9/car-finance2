"use client";
import React, { useState } from "react";

// الفئات السعرية الثابتة (من جدول الإكسل)
const PRICE_CATEGORIES = [
  20000, 25000, 30000, 35000, 40000, 45000, 50000, 60000
];

// منطق نسبة الربح حسب عدد الشهور
const getProfitPercent = (months: number) => {
  switch (months) {
    case 12:
      return 0.3;
    case 18:
      return 0.4;
    case 24:
      return 0.5;
    case 30:
      return 0.55;
    case 36:
      return 0.6;
    default:
      return 0.3;
  }
};

function calculateRow(form: any) {
  const price_category = form.priceCategory;
  const duration_months = form.durationMonths;
  const profit_target_percent = getProfitPercent(duration_months);
  const down_payment_percent = form.downPaymentPercent;
  const last_payment_percent = form.lastPaymentPercent;
  const quantity = form.quantity;
  const insurance_percent = form.insurancePercent;
  const extra_annual_fee = form.extraAnnualFee;

  const down_payment_value = price_category * down_payment_percent;
  const last_payment_value = price_category * last_payment_percent;
  const profit_theoretical = price_category * profit_target_percent;
  const insurance_value = price_category * insurance_percent;
  const total_annual_fees = insurance_value + extra_annual_fee;
  const total_sale_price = price_category + insurance_value + extra_annual_fee + profit_theoretical;
  const profit_value = total_sale_price - price_category - last_payment_value;
  const financed_amount = (price_category - last_payment_value) * profit_target_percent;
  const monthly_rent = (total_sale_price - last_payment_value) / duration_months;

  return {
    id: Math.random().toString(36).slice(2, 8),
    price_category,
    duration_months,
    profit_target_percent,
    down_payment_percent,
    last_payment_percent,
    quantity,
    down_payment_value,
    last_payment_value,
    insurance_percent,
    insurance_value,
    extra_annual_fee,
    profit_value,
    total_annual_fees,
    total_sale_price,
    financed_amount,
    monthly_rent
  };
}

export default function CarLeasingPage() {
  // حالة النموذج
  const [form, setForm] = useState({
    priceCategory: PRICE_CATEGORIES[0],
    durationMonths: 12,
    quantity: 1,
    downPaymentPercent: 0.1,
    lastPaymentPercent: 0.2,
    insurancePercent: 0.1,
    extraAnnualFee: 1200,
  });
  const [rows, setRows] = useState<any[]>([]);

  // تحديث الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" || name === "extraAnnualFee" ? Number(value) : Number(value)
    }));
  };

  // حساب نسبة الربح تلقائياً
  const profitTargetPercent = getProfitPercent(form.durationMonths);

  const handleSave = () => {
    setRows((prev) => [...prev, calculateRow(form)]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8 text-black">إضافة بيانات تمويل سيارة (نظام التأجير)</h1>
        {/* نموذج الإدخال */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="priceCategory" className="block text-sm font-medium text-gray-900">الفئة السعرية (ريال)</label>
              <select
                id="priceCategory"
                name="priceCategory"
                value={form.priceCategory}
                onChange={handleChange}
                className="block w-full px-4 py-3 border rounded-lg"
                dir="rtl"
              >
                {PRICE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat.toLocaleString()} ريال</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="durationMonths" className="block text-sm font-medium text-gray-900">مدة الإيجار (شهر)</label>
              <select
                id="durationMonths"
                name="durationMonths"
                value={form.durationMonths}
                onChange={handleChange}
                className="block w-full px-4 py-3 border rounded-lg"
                dir="rtl"
              >
                {[12, 18, 24, 30, 36].map((m) => (
                  <option key={m} value={m}>{m} شهر</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-900">عدد السيارات</label>
              <input
                id="quantity"
                name="quantity"
                type="number"
                min={1}
                max={100}
                value={form.quantity}
                onChange={handleChange}
                className="block w-full px-4 py-3 border rounded-lg"
                placeholder="أدخل عدد السيارات"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="downPaymentPercent" className="block text-sm font-medium text-gray-900">نسبة الرسوم الإدارية</label>
              <select
                id="downPaymentPercent"
                name="downPaymentPercent"
                value={form.downPaymentPercent}
                onChange={handleChange}
                className="block w-full px-4 py-3 border rounded-lg"
                dir="rtl"
              >
                {Array.from({length: 11}, (_, i) => 0.05 + i * 0.01).map((v) => (
                  <option key={v} value={v}>{(v * 100).toFixed(0)}%</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="lastPaymentPercent" className="block text-sm font-medium text-gray-900">نسبة تمديد الإيجار</label>
              <select
                id="lastPaymentPercent"
                name="lastPaymentPercent"
                value={form.lastPaymentPercent}
                onChange={handleChange}
                className="block w-full px-4 py-3 border rounded-lg"
                dir="rtl"
              >
                {[0.1, 0.15, 0.2, 0.25].map((v) => (
                  <option key={v} value={v}>{v * 100}%</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">نسبة الربح المستهدفة</label>
              <input
                type="text"
                value={`${(profitTargetPercent * 100).toFixed(0)}%`}
                readOnly
                className="block w-full px-4 py-3 border rounded-lg bg-gray-100 text-center font-bold"
                tabIndex={-1}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="insurancePercent" className="block text-sm font-medium text-gray-900">نسبة التأمين السنوي</label>
              <select
                id="insurancePercent"
                name="insurancePercent"
                value={form.insurancePercent}
                onChange={handleChange}
                className="block w-full px-4 py-3 border rounded-lg"
                dir="rtl"
              >
                {Array.from({length: 8}, (_, i) => 0.03 + i * 0.01).map((v) => (
                  <option key={v} value={v}>{(v * 100).toFixed(0)}%</option>
                ))}
              </select>
              {/* حقل قيمة التأمين السنوي */}
              <label className="block text-xs font-medium text-gray-600 mt-1">قيمة التأمين السنوي (ريال)</label>
              <input
                type="text"
                value={(form.priceCategory * form.insurancePercent).toLocaleString() + ' ريال'}
                readOnly
                tabIndex={-1}
                className="block w-full px-4 py-2 border rounded-lg bg-gray-100 text-center font-bold"
                title="قيمة التأمين السنوي المحسوبة تلقائياً بناءً على الفئة السعرية والنسبة"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="extraAnnualFee" className="block text-sm font-medium text-gray-900">رسوم سنوية إضافية (ريال)</label>
              <input
                id="extraAnnualFee"
                name="extraAnnualFee"
                type="number"
                min={0}
                value={form.extraAnnualFee}
                onChange={handleChange}
                className="block w-full px-4 py-3 border rounded-lg"
                placeholder="أدخل الرسوم السنوية"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-lg shadow-md transition-colors"
            >
              حفظ المعلومات
            </button>
          </div>
        </div>
      </div>
      {/* عناوين الأشهر */}
      <div className="flex justify-center gap-2 mb-4">
        {[
          'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
          'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ].map((month, idx) => (
          <button
            key={month}
            type="button"
            className="px-4 py-2 rounded border border-blue-700 text-blue-700 bg-white hover:bg-blue-50 focus:bg-blue-700 focus:text-white transition-colors font-bold"
            style={{ minWidth: 70 }}
          >
            {month}
          </button>
        ))}
      </div>
      {/* جدول التجميع الشهري */}
      <div className="overflow-x-auto w-full mb-4">
        <table className="min-w-full w-full text-sm text-center border">
          <thead>
            <tr>
              <th className="border px-2 text-black font-bold">الشهر</th>
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
            {[
              'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
              'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
            ].map((month, idx) => {
              // توزيع الصفوف على الأشهر بالتساوي مؤقتًا
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
                <tr key={month}>
                  <td className="border px-2 text-black font-bold">{month}</td>
                  <td className="border px-2 text-black">{priceCategory.toLocaleString()}</td>
                  <td className="border px-2 text-black">{quantity}</td>
                  <td className="border px-2 text-black">{adminFees.toLocaleString()}</td>
                  <td className="border px-2 text-black">{lastPayments.toLocaleString()}</td>
                  <td className="border px-2 text-black">{insurance.toLocaleString()}</td>
                  <td className="border px-2 text-black">{extraAnnual.toLocaleString()}</td>
                  <td className="border px-2 text-black">{baseProfit.toLocaleString()}</td>
                  <td className="border px-2 text-black">{monthlyRent.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* جدول النتائج بعرض كامل */}
      <div className="w-full mt-8">
        <div className="bg-white rounded-lg shadow-lg p-4 w-full">
          <h2 className="text-lg font-bold mb-4 text-black">جدول النتائج</h2>
          <div className="overflow-x-auto w-full">
            <table className="min-w-full w-full text-sm text-center border">
              <thead>
                <tr>
                  <th className="border px-2 text-black font-bold">id</th>
                  <th className="border px-2 text-black font-bold">الفئة السعرية</th>
                  <th className="border px-2 text-black font-bold">مدة الإيجار</th>
                  <th className="border px-2 text-black font-bold">نسبة الربح</th>
                  <th className="border px-2 text-black font-bold">نسبة الرسوم الإدارية</th>
                  <th className="border px-2 text-black font-bold">نسبة تمديد الإيجار</th>
                  <th className="border px-2 text-black font-bold">عدد السيارات</th>
                  <th className="border px-2 text-black font-bold">قيمة الرسوم الإدارية</th>
                  <th className="border px-2 text-black font-bold">قيمة الدفعة الأخيرة</th>
                  <th className="border px-2 text-black font-bold">نسبة التأمين السنوي</th>
                  <th className="border px-2 text-black font-bold">قيمة التأمين السنوي</th>
                  <th className="border px-2 text-black font-bold">الرسوم السنوية الإضافية</th>
                  <th className="border px-2 text-black font-bold">الربح الأساسي</th>
                  <th className="border px-2 text-black font-bold">سعر البيع الإجمالي</th>
                  <th className="border px-2 text-black font-bold">الإيجار الشهري</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className={
                      (idx % 2 === 0 ? "bg-white" : "bg-gray-50") +
                      " hover:bg-blue-50 transition-colors"
                    }
                  >
                    <td className="border px-2 text-black">{row.id}</td>
                    <td className="border px-2 text-black">{row.price_category.toLocaleString()}</td>
                    <td className="border px-2 text-black">{row.duration_months}</td>
                    <td className="border px-2 text-black">{(row.profit_target_percent * 100).toFixed(0)}%</td>
                    <td className="border px-2 text-black">{(row.down_payment_percent * 100).toFixed(0)}%</td>
                    <td className="border px-2 text-black">{(row.last_payment_percent * 100).toFixed(0)}%</td>
                    <td className="border px-2 text-black">{row.quantity}</td>
                    <td className="border px-2 text-black">{row.down_payment_value.toLocaleString()}</td>
                    <td className="border px-2 text-black">{row.last_payment_value.toLocaleString()}</td>
                    <td className="border px-2 text-black">{(row.insurance_percent * 100).toFixed(0)}%</td>
                    <td className="border px-2 text-black">{row.insurance_value.toLocaleString()}</td>
                    <td className="border px-2 text-black">{row.extra_annual_fee.toLocaleString()}</td>
                    <td className="border px-2 text-black">{((row.price_category - row.last_payment_value) * row.profit_target_percent).toLocaleString()}</td>
                    <td className="border px-2 text-black">{row.total_sale_price.toLocaleString()}</td>
                    <td className="border px-2 text-black">{row.monthly_rent.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={15} className="text-gray-400 py-8">لا توجد بيانات بعد. أدخل البيانات أعلاه واضغط حفظ.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 