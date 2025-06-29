
'use client';
import { useState } from 'react';

export default function InstallmentCalculatorPage() {
  const [carPrice, setCarPrice] = useState(30000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(10);
  const [finalPaymentPercent, setFinalPaymentPercent] = useState(20);
  const [termMonths, setTermMonths] = useState(27);
  const [profitRate, setProfitRate] = useState(50);
  const [result, setResult] = useState<null | {
    down: number; final: number; financed: number; profit: number; total: number; monthly: number;
  }>(null);

  const calculate = () => {
    const down = carPrice * (downPaymentPercent / 100);
    const final = carPrice * (finalPaymentPercent / 100);
    const financed = carPrice - down - final;
    const profit = (financed * profitRate * termMonths) / 12 / 100;
    const total = financed + profit;
    const monthly = total / termMonths;
    setResult({ down, final, financed, profit, total, monthly });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-2xl border">
      <h1 className="text-2xl font-bold mb-4">حاسبة التقسيط</h1>
      <div className="grid gap-4">
        <label>سعر السيارة
          <input type="number" className="w-full p-2 border rounded" value={carPrice} onChange={e => setCarPrice(+e.target.value)} />
        </label>
        <label>نسبة الدفعة الأولى (%)
          <input type="number" className="w-full p-2 border rounded" value={downPaymentPercent} onChange={e => setDownPaymentPercent(+e.target.value)} />
        </label>
        <label>نسبة الدفعة الأخيرة (%)
          <input type="number" className="w-full p-2 border rounded" value={finalPaymentPercent} onChange={e => setFinalPaymentPercent(+e.target.value)} />
        </label>
        <label>مدة التقسيط (شهر)
          <input type="number" className="w-full p-2 border rounded" value={termMonths} onChange={e => setTermMonths(+e.target.value)} />
        </label>
        <label>نسبة الربح السنوي (%)
          <input type="number" className="w-full p-2 border rounded" value={profitRate} onChange={e => setProfitRate(+e.target.value)} />
        </label>
        <button className="bg-blue-600 text-white py-2 px-4 rounded" onClick={calculate}>احسب</button>
      </div>

      {result && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">النتائج:</h2>
          <p>الدفعة الأولى: {result.down.toFixed(2)} ريال</p>
          <p>الدفعة الأخيرة: {result.final.toFixed(2)} ريال</p>
          <p>المبلغ الممول: {result.financed.toFixed(2)} ريال</p>
          <p>إجمالي الربح: {result.profit.toFixed(2)} ريال</p>
          <p>السعر النهائي بعد الربح: {result.total.toFixed(2)} ريال</p>
          <p>القسط الشهري: {result.monthly.toFixed(2)} ريال</p>
        </div>
      )}
    </div>
  );
}
