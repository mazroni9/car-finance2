// src/app/dashboard/financial-transactions/page.tsx

import { createClient } from '@/lib/supabase/server';

interface Transaction {
  transaction_id: string;
  created_at: string;
  showroom_name: string | null;
  type: string;
  amount: number;
  description: string;
}

export default async function FinancialTransactionsPage() {
  const supabase = createClient();

  // جلب البيانات من View
  const { data: transactions, error } = await supabase
    .from('financial_transactions_report')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error(error);
    return <div className="p-6">❌ خطأ في تحميل البيانات.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📜 تقرير الحركات المالية</h1>

      <div className="overflow-auto border rounded shadow">
        <table className="min-w-full text-sm text-right">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border-b">📅 التاريخ</th>
              <th className="px-4 py-2 border-b">🏠 المعرض</th>
              <th className="px-4 py-2 border-b">📌 النوع</th>
              <th className="px-4 py-2 border-b">💰 المبلغ</th>
              <th className="px-4 py-2 border-b">📝 الوصف</th>
            </tr>
          </thead>
          <tbody>
            {transactions?.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-4">لا توجد بيانات بعد.</td>
              </tr>
            )}
            {transactions?.map((tx: Transaction) => (
              <tr key={tx.transaction_id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{new Date(tx.created_at).toLocaleString()}</td>
                <td className="px-4 py-2 border-b">{tx.showroom_name || 'غير معروف'}</td>
                <td className="px-4 py-2 border-b">{tx.type}</td>
                <td className="px-4 py-2 border-b">{tx.amount} ريال</td>
                <td className="px-4 py-2 border-b">{tx.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
