'use client';

import { useState } from 'react';

export default function FinanceCalculator() {
  const [carPrice, setCarPrice] = useState('');
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [lastPaymentPercent, setLastPaymentPercent] = useState(20);
  const [months, setMonths] = useState(24);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-blue-600 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">حاسبة التمويل</h1>
            <h2 className="text-xl text-blue-100 mb-2">Car Finance Calculator</h2>
            <p className="text-blue-100">لا تقلق بشأن التفاصيل، سنقوم بكل شيء من أجلك</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">بيانات التمويل</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    سعر السيارة
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={carPrice}
                      onChange={(e) => setCarPrice(e.target.value)}
                      placeholder="مثال: 50000"
                      className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      dir="rtl"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      ريال
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نسبة الدفعة الأولى
                  </label>
                  <select
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    dir="rtl"
                  >
                    <option value={10}>10%</option>
                    <option value={15}>15%</option>
                    <option value={20}>20%</option>
                    <option value={25}>25%</option>
                    <option value={30}>30%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    نسبة الدفعة الأخيرة
                  </label>
                  <select
                    value={lastPaymentPercent}
                    onChange={(e) => setLastPaymentPercent(Number(e.target.value))}
                    className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    dir="rtl"
                  >
                    <option value={10}>10%</option>
                    <option value={15}>15%</option>
                    <option value={20}>20%</option>
                    <option value={25}>25%</option>
                    <option value={30}>30%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    مدة التمويل (بالشهور)
                  </label>
                  <select
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                    className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    dir="rtl"
                  >
                    <option value={12}>12 شهر</option>
                    <option value={24}>24 شهر</option>
                    <option value={36}>36 شهر</option>
                    <option value={48}>48 شهر</option>
                  </select>
                </div>

                <button
                  onClick={() => {/* احسب القسط */}}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  احسب القسط
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">نتيجة الحساب</h3>
              {carPrice ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">الدفعة الأولى</div>
                    <div className="text-lg font-semibold">{(Number(carPrice) * (downPaymentPercent / 100)).toLocaleString()} ريال</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">القسط الشهري</div>
                    <div className="text-lg font-semibold">{((Number(carPrice) - (Number(carPrice) * (downPaymentPercent / 100)) - (Number(carPrice) * (lastPaymentPercent / 100))) / months).toLocaleString()} ريال</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">الدفعة الأخيرة</div>
                    <div className="text-lg font-semibold">{(Number(carPrice) * (lastPaymentPercent / 100)).toLocaleString()} ريال</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">إجمالي المبلغ</div>
                    <div className="text-lg font-semibold">{Number(carPrice).toLocaleString()} ريال</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  أدخل البيانات واضغط على "احسب القسط" لعرض النتيجة
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
