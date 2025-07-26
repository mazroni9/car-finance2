'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

interface TransactionRow {
  id: string;
  showroom_name: string;
  type: string;
  amount: number;
  description: string;
  created_at: string;
}

export default function FinancialTransactionsPage() {
  const [data, setData] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('financial_transactions_report')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setData(data as TransactionRow[]);

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto text-right">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 text-black">
        📜 تقرير الحركات المالية
      </h1>

      {loading ? (
        <p className="text-gray-500">...جاري التحميل</p>
      ) : (
        <div className="overflow-x-auto rounded shadow">
          <table className="min-w-full bg-white text-sm border">
            <thead className="bg-gray-100">
              <tr className="text-right">
                <th className="px-4 py-2 border text-black">🏠 المعرض</th>
                <th className="px-4 py-2 border text-black">✨ النوع</th>
                <th className="px-4 py-2 border text-black">💰 المبلغ</th>
                <th className="px-4 py-2 border text-black">📜 الوصف</th>
                <th className="px-4 py-2 border text-black">📅 التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-black">{tx.showroom_name}</td>
                  <td className="px-4 py-2 border text-black">{tx.type}</td>
                  <td className="px-4 py-2 border text-black">
                    {tx.amount.toLocaleString('ar-SA')} ريال
                  </td>
                  <td className="px-4 py-2 border text-black">{tx.description}</td>
                  <td className="px-4 py-2 border text-black">
                    {new Date(tx.created_at).toLocaleString('ar-SA', {
                      dateStyle: 'short',
                      timeStyle: 'short',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
