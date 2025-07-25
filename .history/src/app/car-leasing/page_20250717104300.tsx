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

export default function CarLeasingPage() {
  // حالة النموذج
  const [form, setForm] = useState({
    priceCategory: PRICE_CATEGORIES[0],
    durationMonths: 12,
    quantity: 1,
    downPaymentPercent: 0.1,
    lastPaymentPercent: 0.2,
  });

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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-center mb-8">إضافة بيانات تمويل سيارة (نظام التأجير)</h1>
        {/* نموذج الإدخال */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="priceCategory" className="block text-sm font-medium text-gray-700">الفئة السعرية (ريال)</label>
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
              <label htmlFor="durationMonths" className="block text-sm font-medium text-gray-700">مدة التمويل (شهر)</label>
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
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">عدد السيارات</label>
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
              <label htmlFor="downPaymentPercent" className="block text-sm font-medium text-gray-700">نسبة الدفعة الأولى</label>
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
              <label htmlFor="lastPaymentPercent" className="block text-sm font-medium text-gray-700">نسبة الدفعة الأخيرة</label>
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
              <label className="block text-sm font-medium text-gray-700">نسبة الربح المستهدفة</label>
              <input
                type="text"
                value={`${profitTargetPercent * 100}%`}
                readOnly
                className="block w-full px-4 py-3 border rounded-lg bg-gray-100 text-center font-bold"
              />
            </div>
          </div>
        </div>
        {/* جدول النتائج (سيتم تطويره لاحقاً) */}
        <div className="bg-white rounded-lg shadow-lg p-4">
          <h2 className="text-lg font-bold mb-4">جدول النتائج (تجريبي)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-center border">
              <thead>
                <tr>
                  <th className="border px-2">id</th>
                  <th className="border px-2">price_category</th>
                  <th className="border px-2">duration_months</th>
                  <th className="border px-2">profit_target_percent</th>
                  <th className="border px-2">down_payment_percent</th>
                  <th className="border px-2">last_payment_percent</th>
                  <th className="border px-2">quantity</th>
                  {/* ... باقي الأعمدة لاحقاً */}
                </tr>
              </thead>
              <tbody>
                {/* سيتم توليد الصفوف لاحقاً */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 