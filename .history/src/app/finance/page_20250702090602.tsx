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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg p-8 text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">حاسبة التمويل</h1>
          <h2 className="text-2xl font-bold text-blue-100 mb-2">Car Finance Calculator</h2>
          <p className="text-blue-100 text-lg">
            Don&apos;t worry about the details, we&apos;ll handle everything for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white rounded-2xl shadow-lg overflow-hidden h-fit">
            <div className="bg-blue-600 p-4">
              <h2 className="text-2xl font-bold text-white text-center">بيانات التمويل</h2>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2 text-right">سعر السيارة</label>
                <input
                  type="number"
                  className="w-full p-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg text-right text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all placeholder-gray-400"
                  value={priceCategory || ''}
                  onChange={(e) => setPriceCategory(Number(e.target.value))}
                  placeholder="مثال: 50000"
                />
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2 text-right">نسبة الدفعة الأولى</label>
                <select
                  className="w-full p-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg text-right text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                  value={downPaymentRate}
                  onChange={(e) => setDownPaymentRate(Number(e.target.value))}
                  style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                           backgroundPosition: "left 0.75rem center",
                           backgroundSize: "1.5em 1.5em",
                           backgroundRepeat: "no-repeat" }}
                >
                  <option value="0.1">10%</option>
                  <option value="0.15">15%</option>
                  <option value="0.2">20%</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2 text-right">نسبة الدفعة الأخيرة</label>
                <select
                  className="w-full p-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg text-right text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                  value={lastPaymentRate}
                  onChange={(e) => setLastPaymentRate(Number(e.target.value))}
                  style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                           backgroundPosition: "left 0.75rem center",
                           backgroundSize: "1.5em 1.5em",
                           backgroundRepeat: "no-repeat" }}
                >
                  <option value="0.1">10%</option>
                  <option value="0.15">15%</option>
                  <option value="0.2">20%</option>
                </select>
              </div>
              <div>
                <label className="block text-lg font-bold text-gray-700 mb-2 text-right">مدة التقسيط</label>
                <select
                  className="w-full p-3 bg-white text-gray-900 border-2 border-gray-200 rounded-lg text-right text-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  style={{ backgroundImage: "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E\")",
                           backgroundPosition: "left 0.75rem center",
                           backgroundSize: "1.5em 1.5em",
                           backgroundRepeat: "no-repeat" }}
                >
                  <option value="12">12 شهر</option>
                  <option value="24">24 شهر</option>
                  <option value="36">36 شهر</option>
                </select>
              </div>
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold p-4 rounded-lg transition-colors"
                onClick={handleCalculate}
                disabled={loading}
              >
                {loading ? 'جاري الحساب...' : 'احسب القسط'}
              </button>
              {error && (
                <div className="bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-lg text-right">
                  {error}
                </div>
              )}
            </div>
          </Card>

          <Card className="bg-white rounded-2xl shadow-lg overflow-hidden h-fit">
            <div className="bg-blue-600 p-4">
              <h2 className="text-2xl font-bold text-white text-center">نتيجة الحساب</h2>
            </div>
            <div className="p-6">
              {result ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-600">الدفعة الأولى ({(downPaymentRate * 100)}%)</span>
                      <span className="text-lg font-bold text-gray-900">{result.downPayment.toLocaleString()} ريال</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-600">الدفعة الأخيرة ({(lastPaymentRate * 100)}%)</span>
                      <span className="text-lg font-bold text-gray-900">{result.lastPayment.toLocaleString()} ريال</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-600">المبلغ المتبقي للتقسيط</span>
                      <span className="text-lg font-bold text-gray-900">{result.remainingAmount.toLocaleString()} ريال</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">القسط الشهري</span>
                      <span className="text-lg font-bold text-blue-900">{result.monthlyPayment.toLocaleString()} ريال</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-600">إجمالي المبلغ</span>
                      <span className="text-lg font-bold text-gray-900">{result.totalAmount.toLocaleString()} ريال</span>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-green-600">مبلغ الربح</span>
                      <span className="text-lg font-bold text-green-900">{result.profitAmount.toLocaleString()} ريال</span>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-blue-600">نسبة الربح</span>
                      <span className="text-lg font-bold text-blue-900">{result.profitRate}%</span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-600">مدة التقسيط</span>
                      <span className="text-lg font-bold text-gray-900">{result.months} شهر</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  أدخل البيانات واضغط على &quot;احسب القسط&quot; لعرض النتيجة
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function FinancePage() {
  return <FinanceCalculator />;
}
