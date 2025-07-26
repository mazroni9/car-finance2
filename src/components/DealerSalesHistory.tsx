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
  net_amount: number;
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
      // حساب المبلغ الصافي لكل معاملة
      const processedData = data.map(tx => ({
        ...tx,
        net_amount: tx.amount - tx.commission - tx.ownership_transfer_fee
      }));
      setTransactions(processedData);
    } else {
      console.error('❌ خطأ في جلب المعاملات:', error);
    }

    setLoading(false);
  }

  return (
    <div className="overflow-x-auto">
      {loading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">جاري تحميل السجل...</p>
        </div>
      )}

      {!loading && transactions.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد عمليات مسجلة بعد.</p>
        </div>
      )}

      {!loading && transactions.length > 0 && (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-right border-b">التاريخ</th>
              <th className="px-4 py-3 text-right border-b">النوع</th>
              <th className="px-4 py-3 text-right border-b">المبلغ</th>
              <th className="px-4 py-3 text-right border-b">الربح</th>
              <th className="px-4 py-3 text-right border-b">العمولة</th>
              <th className="px-4 py-3 text-right border-b">رسوم النقل</th>
              <th className="px-4 py-3 text-right border-b">المبلغ الصافي</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">{new Date(tx.created_at).toLocaleDateString('ar-SA')}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    tx.type === 'buy' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {tx.type === 'buy' ? 'شراء' : 'بيع'}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold">{tx.amount.toLocaleString()} ريال</td>
                <td className={`px-4 py-3 font-semibold ${tx.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {tx.profit.toLocaleString()} ريال
                </td>
                <td className="px-4 py-3 text-gray-600">{tx.commission.toLocaleString()} ريال</td>
                <td className="px-4 py-3 text-gray-600">{tx.ownership_transfer_fee.toLocaleString()} ريال</td>
                <td className="px-4 py-3 font-semibold">{tx.net_amount.toLocaleString()} ريال</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
