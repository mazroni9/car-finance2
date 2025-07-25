'use client';

import { useState } from 'react';

export default function WalletBalancePage() {
  const [showroomId, setShowroomId] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [operation, setOperation] = useState<'increment' | 'decrement'>('increment');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const res = await fetch('/api/wallet/balance', {
        method: operation === 'increment' ? 'POST' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showroomId, amount }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'حدث خطأ');

      setMessage('✅ تمت العملية بنجاح!');
      setAmount(0);
      setShowroomId('');
    } catch (err: any) {
      setMessage(`❌ خطأ: ${err.message}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">🪙 تعديل رصيد المحفظة</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">📌 معرف المعرض</label>
          <input
            type="text"
            value={showroomId}
            onChange={(e) => setShowroomId(e.target.value)}
            required
            className="w-full border rounded p-2"
            placeholder="معرف المعرض"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">💰 المبلغ (ريال)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            required
            className="w-full border rounded p-2"
            min={0}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">🔄 نوع العملية</label>
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value as 'increment' | 'decrement')}
            className="w-full border rounded p-2"
          >
            <option value="increment">➕ إضافة</option>
            <option value="decrement">➖ خصم</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          ✅ تنفيذ العملية
        </button>
      </form>

      {message && (
        <div className="mt-4 p-2 text-center rounded border">
          {message}
        </div>
      )}
    </div>
  );
}
