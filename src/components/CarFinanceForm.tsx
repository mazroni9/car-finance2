'use client';

import React, { useState } from 'react';

export default function CarFinanceForm() {
  const [priceCategory, setPriceCategory] = useState(20000);
  const [durationMonths, setDurationMonths] = useState(12);
  const [quantity, setQuantity] = useState(1);
  const [downPaymentPercent, setDownPaymentPercent] = useState(0.10);
  const [lastPaymentPercent, setLastPaymentPercent] = useState(0.20);
  const [profitTargetPercent, setProfitTargetPercent] = useState(30);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            إضافة بيانات تمويل سيارة
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label htmlFor="priceCategory" className="block text-sm font-medium text-gray-700">
                الفئة السعرية (ريال)
              </label>
              <select
                id="priceCategory"
                value={priceCategory}
                onChange={(e) => setPriceCategory(Number(e.target.value))}
                className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                dir="rtl"
              >
                <option value={20000}>20,000 ريال</option>
                <option value={25000}>25,000 ريال</option>
                <option value={30000}>30,000 ريال</option>
                <option value={40000}>40,000 ريال</option>
                <option value={50000}>50,000 ريال</option>
                <option value={60000}>60,000 ريال</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="durationMonths" className="block text-sm font-medium text-gray-700">
                مدة التمويل (شهر)
              </label>
              <select
                id="durationMonths"
                value={durationMonths}
                onChange={(e) => setDurationMonths(Number(e.target.value))}
                className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                dir="rtl"
              >
                <option value={12}>12 شهر</option>
                <option value={18}>18 شهر</option>
                <option value={24}>24 شهر</option>
                <option value={36}>36 شهر</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                عدد السيارات
              </label>
              <input
                id="quantity"
                type="number"
                min={1}
                max={100}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="أدخل عدد السيارات"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="downPayment" className="block text-sm font-medium text-gray-700">
                نسبة الدفعة الأولى
              </label>
              <select
                id="downPayment"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                dir="rtl"
              >
                <option value={0.10}>10%</option>
                <option value={0.15}>15%</option>
                <option value={0.20}>20%</option>
                <option value={0.25}>25%</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="lastPayment" className="block text-sm font-medium text-gray-700">
                نسبة الدفعة الأخيرة
              </label>
              <select
                id="lastPayment"
                value={lastPaymentPercent}
                onChange={(e) => setLastPaymentPercent(Number(e.target.value))}
                className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                dir="rtl"
              >
                <option value={0.10}>10%</option>
                <option value={0.15}>15%</option>
                <option value={0.20}>20%</option>
                <option value={0.25}>25%</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="profitTarget" className="block text-sm font-medium text-gray-700">
                نسبة الربح المستهدفة
              </label>
              <select
                id="profitTarget"
                value={profitTargetPercent}
                onChange={(e) => setProfitTargetPercent(Number(e.target.value))}
                className="block w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                dir="rtl"
              >
                <option value={20}>20%</option>
                <option value={25}>25%</option>
                <option value={30}>30%</option>
                <option value={35}>35%</option>
                <option value={40}>40%</option>
                <option value={50}>50%</option>
              </select>
            </div>
          </div>

          <div className="mt-8">
            <button className="w-full px-6 py-3 text-white font-medium rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
              حفظ في قاعدة البيانات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 