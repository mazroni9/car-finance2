'use client';

import { useState } from 'react';

export default function CarFinanceForm() {
  const [priceCategory, setPriceCategory] = useState(20000);
  const [durationMonths, setDurationMonths] = useState(12);
  const [quantity, setQuantity] = useState(1);
  const [downPaymentPercent, setDownPaymentPercent] = useState(0.10);
  const [lastPaymentPercent, setLastPaymentPercent] = useState(0.20);
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('جارٍ الحفظ...');

    try {
      const res = await fetch('/api/installment/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          price_category: priceCategory,
          duration_months: durationMonths,
          quantity,
          down_payment_percent: downPaymentPercent,
          last_payment_percent: lastPaymentPercent
        })
      });

      if (res.ok) {
        setStatus('✅ تم الحفظ بنجاح.');
      } else {
        const err = await res.json();
        setStatus(`❌ خطأ: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ حدث خطأ أثناء الحفظ.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow border border-gray-200">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        📝 إضافة بيانات تمويل سيارة
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold text-gray-800">الفئة السعرية (ريال):</label>
          <select
            value={priceCategory}
            onChange={(e) => setPriceCategory(Number(e.target.value))}
            className="border border-gray-300 p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={20000}>20,000</option>
            <option value={25000}>25,000</option>
            <option value={30000}>30,000</option>
            <option value={40000}>40,000</option>
            <option value={50000}>50,000</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-800">مدة التمويل (شهر):</label>
          <select
            value={durationMonths}
            onChange={(e) => setDurationMonths(Number(e.target.value))}
            className="border border-gray-300 p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={12}>12 شهر</option>
            <option value={18}>18 شهر</option>
            <option value={24}>24 شهر</option>
            <option value={30}>30 شهر</option>
            <option value={36}>36 شهر</option>
            <option value={42}>42 شهر</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-800">عدد السيارات:</label>
          <input
            type="number"
            value={quantity}
            min={1}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="border border-gray-300 p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-800">نسبة الدفعة الأولى (مثلاً 0.10):</label>
          <input
            type="number"
            step="0.01"
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
            className="border border-gray-300 p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-800">نسبة الدفعة الأخيرة (مثلاً 0.20):</label>
          <input
            type="number"
            step="0.01"
            value={lastPaymentPercent}
            onChange={(e) => setLastPaymentPercent(Number(e.target.value))}
            className="border border-gray-300 p-2 w-full rounded bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-full"
        >
          💾 حفظ في قاعدة البيانات
        </button>
      </form>

      {status && <p className="mt-4 text-center font-medium text-gray-800">{status}</p>}
    </div>
  );
}
