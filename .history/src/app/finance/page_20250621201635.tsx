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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="glass-card p-6 bg-gradient-to-b from-blue-50 to-blue-100">
        <h1 className="text-3xl font-bold mb-2 text-center">حاسبة التمويل</h1>
        <p className="text-lg text-black text-center">حساب الأقساط والأرباح بشكل فوري</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-white shadow-md order-2 md:order-1">
          <h2 className="text-2xl font-bold mb-6 text-center">نتيجة الحساب</h2>
          {result ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-black">الدفعة الأولى ({(downPaymentRate * 100)}%)</span>
                <span className="text-black font-medium">{result.downPayment.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-black">الدفعة الأخيرة ({(lastPaymentRate * 100)}%)</span>
                <span className="text-black font-medium">{result.lastPayment.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-black">المبلغ المتبقي للتقسيط</span>
                <span className="text-black font-medium">{result.remainingAmount.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-black">القسط الشهري</span>
                <span className="text-black font-medium">{result.monthlyPayment.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-black">إجمالي المبلغ</span>
                <span className="text-black font-medium">{result.totalAmount.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-black">مبلغ الربح</span>
                <span className="text-black font-medium">{result.profitAmount.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-black">نسبة الربح</span>
                <span className="text-black font-medium">{result.profitRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-black">مدة التقسيط</span>
                <span className="text-black font-medium">{result.months} شهر</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-black py-8">
              أدخل البيانات واضغط على "احسب القسط" لعرض النتيجة
            </div>
          )}
        </Card>
        
        <Card className="p-6 w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 to-white shadow-md order-1 md:order-2">
          <h2 className="text-2xl font-bold mb-6 text-center">حاسبة التمويل</h2>
          <div className="space-y-4">
            <div className="text-center">
              <label className="block text-sm font-bold mb-2 text-black">سعر السيارة</label>
              <input
                type="number"
                className="input-field w-full text-center text-black font-medium bg-white border border-gray-200 rounded-lg shadow-sm"
                value={priceCategory || ''}
                onChange={(e) => setPriceCategory(Number(e.target.value))}
                placeholder="مثال: 50000"
              />
            </div>
            <div className="text-center">
              <label className="block text-sm font-bold mb-2 text-black">نسبة الدفعة الأولى</label>
              <select
                className="select-field w-full text-center text-black font-medium bg-white border border-gray-200 rounded-lg shadow-sm"
                value={downPaymentRate}
                onChange={(e) => setDownPaymentRate(Number(e.target.value))}
                aria-label="نسبة الدفعة الأولى"
                title="نسبة الدفعة الأولى"
              >
                <option value="0.1">10%</option>
                <option value="0.15">15%</option>
                <option value="0.2">20%</option>
              </select>
            </div>
            <div className="text-center">
              <label className="block text-sm font-bold mb-2 text-black">نسبة الدفعة الأخيرة</label>
              <select
                className="select-field w-full text-center text-black font-medium bg-white border border-gray-200 rounded-lg shadow-sm"
                value={lastPaymentRate}
                onChange={(e) => setLastPaymentRate(Number(e.target.value))}
                aria-label="نسبة الدفعة الأخيرة"
                title="نسبة الدفعة الأخيرة"
              >
                <option value="0.1">10%</option>
                <option value="0.15">15%</option>
                <option value="0.2">20%</option>
              </select>
            </div>
            <div className="text-center">
              <label className="block text-sm font-bold mb-2 text-black">مدة التقسيط</label>
              <select
                className="select-field w-full text-center text-black font-medium bg-white border border-gray-200 rounded-lg shadow-sm"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                aria-label="مدة التقسيط"
                title="مدة التقسيط"
              >
                <option value="12">12 شهر</option>
                <option value="24">24 شهر</option>
                <option value="36">36 شهر</option>
              </select>
            </div>
            <button
              className="button-primary w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? 'جاري الحساب...' : 'احسب القسط'}
            </button>
            {error && <div className="error-message text-center text-red-600">{error}</div>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default function FinancePage() {
  return <FinanceCalculator />;
} 