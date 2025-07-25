'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';

interface CalculationResult {
  downPayment: number;
  lastPayment: number;
  remainingAmount: number;
  monthlyPayment: number;
  totalAmount: number;
  profitAmount: number;
  profitRate: number;
  months: number;
}

const FinanceCalculator = () => {
  const [priceCategory, setPriceCategory] = useState(0);
  const [downPaymentRate, setDownPaymentRate] = useState(0.1);
  const [lastPaymentRate, setLastPaymentRate] = useState(0.1);
  const [months, setMonths] = useState(12);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/finance/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceCategory,
          downPaymentRate,
          lastPaymentRate,
          months,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'حدث خطأ في الحساب');
      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="glass-card p-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl">
        <h1 className="text-4xl font-bold mb-3 text-center text-white">حاسبة التمويل</h1>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2 text-blue-100">Car Finance Calculator</h2>
          <p className="text-blue-200 text-lg">
            Don&apos;t worry about the details, we&apos;ll handle everything for you
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 w-full bg-white shadow-xl rounded-2xl border-2 border-blue-100">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">بيانات التمويل</h2>
          <div className="space-y-6">
            <div className="text-center">
              <label className="block text-lg font-bold mb-3 text-gray-800">سعر السيارة</label>
              <input
                type="number"
                className="input-field w-full text-center text-xl font-semibold py-3 px-4 bg-gray-50 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                value={priceCategory || ''}
                onChange={(e) => setPriceCategory(Number(e.target.value))}
                placeholder="مثال: 50000"
              />
            </div>
            <div className="text-center">
              <label className="block text-lg font-bold mb-3 text-gray-800">نسبة الدفعة الأولى</label>
              <select
                className="select-field w-full text-center text-xl font-semibold py-3 px-4 bg-gray-50 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                value={downPaymentRate}
                onChange={(e) => setDownPaymentRate(Number(e.target.value))}
              >
                <option value="0.1">10%</option>
                <option value="0.15">15%</option>
                <option value="0.2">20%</option>
              </select>
            </div>
            <div className="text-center">
              <label className="block text-lg font-bold mb-3 text-gray-800">نسبة الدفعة الأخيرة</label>
              <select
                className="select-field w-full text-center text-xl font-semibold py-3 px-4 bg-gray-50 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                value={lastPaymentRate}
                onChange={(e) => setLastPaymentRate(Number(e.target.value))}
              >
                <option value="0.1">10%</option>
                <option value="0.15">15%</option>
                <option value="0.2">20%</option>
              </select>
            </div>
            <div className="text-center">
              <label className="block text-lg font-bold mb-3 text-gray-800">مدة التقسيط</label>
              <select
                className="select-field w-full text-center text-xl font-semibold py-3 px-4 bg-gray-50 border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-200 transition-all"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
              >
                <option value="12">12 شهر</option>
                <option value="24">24 شهر</option>
                <option value="36">36 شهر</option>
              </select>
            </div>
            <button
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? 'جاري الحساب...' : 'احسب القسط'}
            </button>
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 text-lg font-semibold rounded-xl text-center">
                {error}
              </div>
            )}
          </div>
        </Card>

        <Card className="p-8 w-full bg-white shadow-xl rounded-2xl border-2 border-blue-100">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">نتيجة الحساب</h2>
          {result ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                <span className="text-lg font-bold text-blue-900">الدفعة الأولى ({(downPaymentRate * 100)}%)</span>
                <span className="text-xl font-bold text-blue-700">{result.downPayment.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl">
                <span className="text-lg font-bold text-blue-900">الدفعة الأخيرة ({(lastPaymentRate * 100)}%)</span>
                <span className="text-xl font-bold text-blue-700">{result.lastPayment.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl">
                <span className="text-lg font-bold text-green-900">المبلغ المتبقي للتقسيط</span>
                <span className="text-xl font-bold text-green-700">{result.remainingAmount.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-xl">
                <span className="text-lg font-bold text-purple-900">القسط الشهري</span>
                <span className="text-xl font-bold text-purple-700">{result.monthlyPayment.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-xl">
                <span className="text-lg font-bold text-yellow-900">إجمالي المبلغ</span>
                <span className="text-xl font-bold text-yellow-700">{result.totalAmount.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl">
                <span className="text-lg font-bold text-red-900">مبلغ الربح</span>
                <span className="text-xl font-bold text-red-700">{result.profitAmount.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-indigo-50 rounded-xl">
                <span className="text-lg font-bold text-indigo-900">نسبة الربح</span>
                <span className="text-xl font-bold text-indigo-700">{result.profitRate}%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-lg font-bold text-gray-900">مدة التقسيط</span>
                <span className="text-xl font-bold text-gray-700">{result.months} شهر</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-lg text-gray-600 bg-gray-50 rounded-xl">
              أدخل البيانات واضغط على &quot;احسب القسط&quot; لعرض النتيجة
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default function FinancePage() {
  return <FinanceCalculator />;
}
