'use client';

import { useState, useEffect } from 'react';

export default function CarFinanceForm() {
  const [priceCategory, setPriceCategory] = useState(20000);
  const [durationMonths, setDurationMonths] = useState(12);
  const [quantity, setQuantity] = useState(1);
  const [downPaymentPercent, setDownPaymentPercent] = useState(0.10);
  const [lastPaymentPercent, setLastPaymentPercent] = useState(0.20);
  const [status, setStatus] = useState('');
  const [autoSave, setAutoSave] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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

  // دالة مؤقتة للحفظ
  const debouncedSave = () => {
    if (autoSave) {
      const timer = setTimeout(() => {
        saveData();
      }, 1000);
      return () => clearTimeout(timer);
    }
  };

  // تفعيل الحفظ التلقائي عند تغيير أي قيمة
  useEffect(() => {
    debouncedSave();
  }, [priceCategory, durationMonths, quantity, downPaymentPercent, lastPaymentPercent, autoSave]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveData();
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-2xl font-bold text-center">
            📝 إضافة بيانات تمويل سيارة
          </h1>
        </div>
        
        <div className="p-6">
          <div className="flex justify-end mb-4">
            <label className="flex items-center space-x-2 space-x-reverse cursor-pointer">
              <span className="text-gray-700">حفظ تلقائي</span>
              <div className={`relative inline-block w-12 h-6 transition-all duration-200 ease-in-out rounded-full ${autoSave ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                <div className={`absolute w-4 h-4 transition-all duration-200 ease-in-out transform bg-white rounded-full top-1 ${autoSave ? 'right-1' : 'right-7'}`}></div>
              </div>
            </label>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 font-semibold text-gray-800">الفئة السعرية (ريال):</label>
              <select
                value={priceCategory}
                onChange={(e) => setPriceCategory(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-right text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none bg-white"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                  backgroundPosition: "left 0.75rem center",
                  backgroundSize: "1.5em 1.5em",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <option value={20000}>20,000</option>
                <option value={25000}>25,000</option>
                <option value={30000}>30,000</option>
                <option value={40000}>40,000</option>
                <option value={50000}>50,000</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-800">مدة التمويل (شهر):</label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-right text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none bg-white"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                  backgroundPosition: "left 0.75rem center",
                  backgroundSize: "1.5em 1.5em",
                  backgroundRepeat: "no-repeat"
                }}
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
              <label className="block mb-2 font-semibold text-gray-800">عدد السيارات:</label>
              <input
                type="number"
                value={quantity}
                min={1}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-right text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-800">نسبة الدفعة الأولى:</label>
              <select
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-right text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none bg-white"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                  backgroundPosition: "left 0.75rem center",
                  backgroundSize: "1.5em 1.5em",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <option value={0.10}>10%</option>
                <option value={0.15}>15%</option>
                <option value={0.20}>20%</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 font-semibold text-gray-800">نسبة الدفعة الأخيرة:</label>
              <select
                value={lastPaymentPercent}
                onChange={(e) => setLastPaymentPercent(Number(e.target.value))}
                className="w-full p-3 border-2 border-gray-200 rounded-lg text-right text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none bg-white"
                style={{
                  backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                  backgroundPosition: "left 0.75rem center",
                  backgroundSize: "1.5em 1.5em",
                  backgroundRepeat: "no-repeat"
                }}
              >
                <option value={0.10}>10%</option>
                <option value={0.15}>15%</option>
                <option value={0.20}>20%</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold p-4 rounded-lg transition-colors ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSaving ? '⏳ جارٍ الحفظ...' : '💾 حفظ في قاعدة البيانات'}
            </button>
          </form>

          {status && (
            <div className={`mt-4 p-4 rounded-lg text-center font-medium ${
              status.includes('✅') ? 'bg-green-50 text-green-700' : 
              status.includes('❌') ? 'bg-red-50 text-red-700' : 
              'bg-blue-50 text-blue-700'
            }`}>
              {status}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
