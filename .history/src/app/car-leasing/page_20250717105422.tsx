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
  const down_payment_value = price_category * down_payment_percent;
  const last_payment_value = price_category * last_payment_percent;
  const total_sale_price = price_category * (1 + profit_target_percent);
  const financed_amount = price_category - down_payment_value - last_payment_value;
  const monthly_installment = financed_amount / duration_months;
  const profit_per_car = price_category * profit_target_percent;
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
    total_sale_price,
    financed_amount,
    monthly_installment,
    profit_per_car
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
  });
  const [rows, setRows] = useState<any[]>([]);

  // تحديث الحقول
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "quantity" ? Number(value) : Number(value)
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
              <label htmlFor="durationMonths" className="block text-sm font-medium text-gray-900">مدة التمويل (شهر)</label>
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
              <label htmlFor="downPaymentPercent" className="block text-sm font-medium text-gray-900">نسبة الدفعة الأولى</label>
              <select
                id="downPaymentPercent"
                name="downPaymentPercent"
                value={form.downPaymentPercent}
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
              <label htmlFor="lastPaymentPercent" className="block text-sm font-medium text-gray-900">نسبة الدفعة الأخيرة</label>
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
                value={`${profitTargetPercent * 100}%`}
                readOnly
                className="block w-full px-4 py-3 border rounded-lg bg-gray-100 text-center font-bold"
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
        {/* جدول النتائج */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-bold mb-4 text-black">جدول النتائج</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center border">
              <thead>
                <tr>
                  <th className="border px-2 text-black font-bold">id</th>
                  <th className="border px-2 text-black font-bold">الفئة السعرية</th>
                  <th className="border px-2 text-black font-bold">مدة التمويل</th>
                  <th className="border px-2 text-black font-bold">نسبة الربح</th>
                  <th className="border px-2 text-black font-bold">نسبة الدفعة الأولى</th>
                  <th className="border px-2 text-black font-bold">نسبة الدفعة الأخيرة</th>
                  <th className="border px-2 text-black font-bold">عدد السيارات</th>
                  <th className="border px-2 text-black font-bold">قيمة الدفعة الأولى</th>
                  <th className="border px-2 text-black font-bold">قيمة الدفعة الأخيرة</th>
                  <th className="border px-2 text-black font-bold">سعر البيع الإجمالي</th>
                  <th className="border px-2 text-black font-bold">المبلغ الممول</th>
                  <th className="border px-2 text-black font-bold">القسط الشهري</th>
                  <th className="border px-2 text-black font-bold">الربح لكل سيارة</th>
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
                    <td className="border px-2 text-black">{row.total_sale_price.toLocaleString()}</td>
                    <td className="border px-2 text-black">{row.financed_amount.toLocaleString()}</td>
                    <td className="border px-2 text-black">{row.monthly_installment.toLocaleString(undefined, {maximumFractionDigits: 2})}</td>
                    <td className="border px-2 text-black">{row.profit_per_car.toLocaleString()}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={13} className="text-gray-400 py-8">لا توجد بيانات بعد. أدخل البيانات أعلاه واضغط حفظ.</td>
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