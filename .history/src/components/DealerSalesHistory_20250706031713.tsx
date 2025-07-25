'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';

interface Transaction {
  id: string;
  car_id: string;
  amount: number;
  type: 'buy' | 'sell';
  commission: number;
  ownership_transfer_fee: number;
  profit: number;
  payment_split: {
    personal: number;
    approved: number;
  };
  created_at: string;
}

export default function DealerSalesHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  async function fetchTransactions() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTransactions(data);
    } else {
      console.error('❌ خطأ في جلب المعاملات:', error);
    }

    setLoading(false);
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">📜 سجل عمليات البيع والشراء</h2>

      {loading && <p>⏳ جاري التحميل...</p>}

      {!loading && transactions.length === 0 && (
        <p className="text-gray-500">لا توجد عمليات مسجلة بعد.</p>
      )}

      {!loading && transactions.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-right">التاريخ</th>
                <th className="px-4 py-2 text-right">النوع</th>
                <th className="px-4 py-2 text-right">المبلغ</th>
                <th className="px-4 py-2 text-right">عمولة المنصة</th>
                <th className="px-4 py-2 text-right">رسوم النقل</th>
                <th className="px-4 py-2 text-right">الربح المقدر</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(tx.created_at).toLocaleDateString('ar-SA')}</td>
                  <td className="px-4 py-2">{tx.type === 'buy' ? 'شراء' : 'بيع'}</td>
                  <td className="px-4 py-2">{tx.amount.toLocaleString()} ريال</td>
                  <td className="px-4 py-2">{tx.commission.toLocaleString()} ريال</td>
                  <td className="px-4 py-2">{tx.ownership_transfer_fee.toLocaleString()} ريال</td>
                  <td className="px-4 py-2">{tx.profit.toLocaleString()} ريال</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
