'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';

const FinanceCalculator = () => {
  const [priceCategory, setPriceCategory] = useState(0);
  const [downPaymentRate, setDownPaymentRate] = useState(0.1);
  const [lastPaymentRate, setLastPaymentRate] = useState(0.1);
  const [months, setMonths] = useState(12);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="space-y-6">
      <div className="glass-card p-6">
        <h1 className="text-3xl font-bold mb-4">حاسبة التمويل</h1>
        <p className="text-lg opacity-90">حساب الأقساط والأرباح بشكل فوري</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">حاسبة التمويل</h2>
          <div className="space-y-4">
            <div>
              <label className="form-label">سعر السيارة</label>
              <input
                type="number"
                className="input-field"
                value={priceCategory || ''}
                onChange={(e) => setPriceCategory(Number(e.target.value))}
                placeholder="مثال: 50000"
              />
            </div>
            <div>
              <label className="form-label" id="down-payment-rate">نسبة الدفعة الأولى</label>
              <select
                className="select-field"
                value={downPaymentRate}
                onChange={(e) => setDownPaymentRate(Number(e.target.value))}
                aria-labelledby="down-payment-rate"
              >
                <option value="0.1">10%</option>
                <option value="0.15">15%</option>
                <option value="0.2">20%</option>
              </select>
            </div>
            <div>
              <label className="form-label" id="last-payment-rate">نسبة الدفعة الأخيرة</label>
              <select
                className="select-field"
                value={lastPaymentRate}
                onChange={(e) => setLastPaymentRate(Number(e.target.value))}
                aria-labelledby="last-payment-rate"
              >
                <option value="0.1">10%</option>
                <option value="0.15">15%</option>
                <option value="0.2">20%</option>
              </select>
            </div>
            <div>
              <label className="form-label" id="installment-months">مدة التقسيط</label>
              <select
                className="select-field"
                value={months}
                onChange={(e) => setMonths(Number(e.target.value))}
                aria-labelledby="installment-months"
              >
                <option value="12">12 شهر</option>
                <option value="24">24 شهر</option>
                <option value="36">36 شهر</option>
              </select>
            </div>
            <button
              className="button-primary w-full"
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? 'جاري الحساب...' : 'احسب القسط'}
            </button>
            {error && <div className="error-message">{error}</div>}
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">نتيجة الحساب</h2>
          {result ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="form-label">الدفعة الأولى ({(downPaymentRate * 100)}%)</span>
                <span className="form-value">{result.downPayment.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="form-label">الدفعة الأخيرة ({(lastPaymentRate * 100)}%)</span>
                <span className="form-value">{result.lastPayment.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="form-label">المبلغ المتبقي للتقسيط</span>
                <span className="form-value">{result.remainingAmount.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="form-label">القسط الشهري</span>
                <span className="form-value">{result.monthlyPayment.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="form-label">إجمالي المبلغ</span>
                <span className="form-value">{result.totalAmount.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="form-label">مبلغ الربح</span>
                <span className="form-value">{result.profitAmount.toLocaleString()} ريال</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="form-label">نسبة الربح</span>
                <span className="form-value">{result.profitRate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="form-label">مدة التقسيط</span>
                <span className="form-value">{result.months} شهر</span>
              </div>
            </div>
          ) : (
            <div className="text-center text-[var(--text-secondary)] py-8">
              أدخل البيانات واضغط على "احسب القسط" لعرض النتيجة
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