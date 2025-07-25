'use client';

import React, { useState, useEffect } from 'react';

interface CarFinanceFormProps {}

export default function CarFinanceForm({}: CarFinanceFormProps) {
  const [priceCategory, setPriceCategory] = useState<number>(20000);
  const [durationMonths, setDurationMonths] = useState<number>(12);
  const [quantity, setQuantity] = useState<number>(1);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(0.10);
  const [lastPaymentPercent, setLastPaymentPercent] = useState<number>(0.20);
  const [status, setStatus] = useState<string>('');
  const [autoSave, setAutoSave] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const saveData = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
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
        setStatus('✅ تم الحفظ بنجاح');
        setTimeout(() => setStatus(''), 2000);
      } else {
        const err = await res.json();
        setStatus(`❌ خطأ: ${err.error}`);
      }
    } catch (error) {
      console.error(error);
      setStatus('❌ حدث خطأ أثناء الحفظ');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (autoSave) {
      const timer = setTimeout(saveData, 1000);
      return () => clearTimeout(timer);
    }
  }, [priceCategory, durationMonths, quantity, downPaymentPercent, lastPaymentPercent, autoSave]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">📝 إضافة بيانات تمويل سيارة</h1>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-sm font-medium">حفظ تلقائي</span>
                <div className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${autoSave ? 'bg-green-400' : 'bg-gray-400'}`}>
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={autoSave}
                    onChange={(e) => setAutoSave(e.target.checked)}
                    aria-label="تفعيل الحفظ التلقائي"
                  />
                  <div className={`absolute left-1 top-1 w-4 h-4 transition duration-200 ease-linear transform bg-white rounded-full ${autoSave ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </label>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priceCategory" className="block text-sm font-medium text-gray-700 mb-2">الفئة السعرية (ريال)</label>
                <select
                  id="priceCategory"
                  value={priceCategory}
                  onChange={(e) => setPriceCategory(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="اختر الفئة السعرية"
                >
                  <option value={20000}>20,000</option>
                  <option value={25000}>25,000</option>
                  <option value={30000}>30,000</option>
                  <option value={40000}>40,000</option>
                  <option value={50000}>50,000</option>
                </select>
              </div>

              <div>
                <label htmlFor="durationMonths" className="block text-sm font-medium text-gray-700 mb-2">مدة التمويل (شهر)</label>
                <select
                  id="durationMonths"
                  value={durationMonths}
                  onChange={(e) => setDurationMonths(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="اختر مدة التمويل"
                >
                  <option value={12}>12 شهر</option>
                  <option value={18}>18 شهر</option>
                  <option value={24}>24 شهر</option>
                  <option value={36}>36 شهر</option>
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">عدد السيارات</label>
                <input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="أدخل عدد السيارات"
                  placeholder="أدخل عدد السيارات"
                />
              </div>

              <div>
                <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700 mb-2">نسبة الدفعة الأولى</label>
                <select
                  id="downPayment"
                  value={downPaymentPercent}
                  onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="اختر نسبة الدفعة الأولى"
                >
                  <option value={0.10}>10%</option>
                  <option value={0.15}>15%</option>
                  <option value={0.20}>20%</option>
                </select>
              </div>

              <div>
                <label htmlFor="lastPayment" className="block text-sm font-medium text-gray-700 mb-2">نسبة الدفعة الأخيرة</label>
                <select
                  id="lastPayment"
                  value={lastPaymentPercent}
                  onChange={(e) => setLastPaymentPercent(Number(e.target.value))}
                  className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label="اختر نسبة الدفعة الأخيرة"
                >
                  <option value={0.10}>10%</option>
                  <option value={0.15}>15%</option>
                  <option value={0.20}>20%</option>
                </select>
              </div>
            </div>

            <button
              onClick={saveData}
              disabled={isSaving}
              className={`w-full px-6 py-3 text-white font-medium rounded-lg transition-colors ${
                isSaving 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
              }`}
              aria-label="حفظ البيانات"
            >
              {isSaving ? '⏳ جارٍ الحفظ...' : '💾 حفظ في قاعدة البيانات'}
            </button>

            {status && (
              <div className={`p-4 rounded-lg text-center ${
                status.includes('✅') ? 'bg-green-50 text-green-800' :
                status.includes('❌') ? 'bg-red-50 text-red-800' :
                'bg-blue-50 text-blue-800'
              }`}
              role="alert"
              aria-live="polite"
              >
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
