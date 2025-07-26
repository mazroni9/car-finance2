'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FinanceCalculator() {
  const [carPrice, setCarPrice] = useState('');
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [lastPaymentPercent, setLastPaymentPercent] = useState(20);
  const [months, setMonths] = useState(24);
  const [interestRate, setInterestRate] = useState(5); // Annual interest rate

  // Calculate proper monthly installment with compound interest
  const calculateMonthlyPayment = () => {
    if (!carPrice) return 0;
    
    const principal = Number(carPrice);
    const downPayment = principal * (downPaymentPercent / 100);
    const lastPayment = principal * (lastPaymentPercent / 100);
    const financedAmount = principal - downPayment - lastPayment;
    
    if (financedAmount <= 0) return 0;
    
    const monthlyRate = interestRate / 100 / 12;
    if (monthlyRate === 0) return financedAmount / months;
    
    // PMT formula for compound interest
    const monthlyPayment = financedAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
      (Math.pow(1 + monthlyRate, months) - 1);
    
    return monthlyPayment;
  };

  const calculateTotalAmount = () => {
    if (!carPrice) return 0;
    
    const principal = Number(carPrice);
    const downPayment = principal * (downPaymentPercent / 100);
    const lastPayment = principal * (lastPaymentPercent / 100);
    const monthlyPayment = calculateMonthlyPayment();
    
    return downPayment + (monthlyPayment * months) + lastPayment;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Buttons */}
        <div className="flex justify-end gap-4 mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>العودة للرئيسية</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
            </svg>
          </Link>
        </div>

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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    معدل الفائدة السنوي (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dir="rtl"
                  />
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
                    <div className="text-lg font-semibold">{calculateMonthlyPayment().toLocaleString()} ريال</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">الدفعة الأخيرة</div>
                    <div className="text-lg font-semibold">{(Number(carPrice) * (lastPaymentPercent / 100)).toLocaleString()} ريال</div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">إجمالي المبلغ المدفوع</div>
                    <div className="text-lg font-semibold">{calculateTotalAmount().toLocaleString()} ريال</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-sm text-blue-600">تكلفة التمويل الإضافية</div>
                    <div className="text-lg font-semibold text-blue-800">{(calculateTotalAmount() - Number(carPrice)).toLocaleString()} ريال</div>
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
