/**
 * 📄 الملف: /src/app/admin/dashboard/page.tsx
 * 🎯 الغرض: عرض لوحة تحكم إدارية حقيقية تعرض بيانات مباشرة من Supabase
 * 
 * ✅ يعرض:
 *  - عدد المستخدمين من جدول users
 *  - مجموع أرصدة المحافظ من جدول wallets
 *  - إجمالي طلبات التمويل من جدول funding_requests
 *  - أحدث 5 عمليات مالية من جدول transactions
 * 
 * 🔗 الارتباطات:
 *  - يعتمد على lib/supabaseClient.ts للاتصال بقاعدة البيانات
 *  - يستخدم متغيرات البيئة: NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [totalWalletBalance, setTotalWalletBalance] = useState(0);
  const [totalFundingRequested, setTotalFundingRequested] = useState(0);
  const [latestTransactions, setLatestTransactions] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { data: users } = await supabase.from('users').select('id');
      const { data: wallets } = await supabase.from('wallets').select('balance');
      const { data: funding } = await supabase.from('funding_requests').select('amount_requested');
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setUserCount(users?.length || 0);
      setTotalWalletBalance(wallets?.reduce((acc, w) => acc + (w.balance || 0), 0) || 0);
      setTotalFundingRequested(funding?.reduce((acc, f) => acc + (f.amount_requested || 0), 0) || 0);
      setLatestTransactions(transactions || []);
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold">لوحة تحكم الإدارة</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="عدد المستخدمين" value={userCount} color="blue" />
        <StatCard title="إجمالي رصيد المحافظ" value={`${totalWalletBalance.toLocaleString()} ريال`} color="green" />
        <StatCard title="إجمالي طلبات التمويل" value={`${totalFundingRequested.toLocaleString()} ريال`} color="purple" />
      </div>

      <div className="glass-card p-6 mt-6 bg-white shadow">
        <h2 className="text-xl font-bold mb-4">أحدث 5 عمليات مالية</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-right">
              <th>نوع العملية</th>
              <th>المبلغ</th>
              <th>التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {latestTransactions.map((tx, idx) => (
              <tr key={idx} className="border-t">
                <td>{tx.type}</td>
                <td>{tx.amount} ريال</td>
                <td>{new Date(tx.created_at).toLocaleString('ar-EG')}</td>
              </tr>
            ))}
            {latestTransactions.length === 0 && (
              <tr><td colSpan={3} className="text-center py-4">لا توجد عمليات</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: any; color: string }) {
  return (
    <div className={`glass-card p-6 bg-gradient-to-br from-${color}-50 to-white shadow-md`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-2xl font-extrabold text-black">{value}</div>
    </div>
  );
}
