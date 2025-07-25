'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';

interface ShowroomWallet {
  id: string;
  name: string;
  balance: number;
  ground_fees: number;
  registration_fee: number;
  transactions_count: number;
  created_at: string;
}

export default function ShowroomWalletsPage() {
  const [wallets, setWallets] = useState<ShowroomWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchShowroomWallets();
  }, []);

  async function fetchShowroomWallets() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wallets')
        .select(`
          id,
          name,
          balance,
          ground_fees,
          registration_fee,
          transactions_count,
          created_at
        `)
        .eq('type', 'showroom')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWallets(data || []);
    } catch (err: any) {
      console.error('Error fetching showroom wallets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">❌ حدث خطأ: {error}</p>
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">لا توجد محافظ معارض مسجلة</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-white">🏪 محافظ المعارض</h1>
      
      <div className="overflow-x-auto">
        <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-700">
              <th className="px-6 py-3 text-right text-white">اسم المعرض</th>
              <th className="px-6 py-3 text-right text-white">الرصيد</th>
              <th className="px-6 py-3 text-right text-white">إجمالي الأرضية</th>
              <th className="px-6 py-3 text-right text-white">رسوم التسجيل</th>
              <th className="px-6 py-3 text-right text-white">عدد العمليات</th>
              <th className="px-6 py-3 text-right text-white">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {wallets.map((wallet) => (
              <tr key={wallet.id} className="hover:bg-gray-700">
                <td className="px-6 py-4 text-white">{wallet.name}</td>
                <td className="px-6 py-4 text-blue-400">{wallet.balance?.toLocaleString()} ريال</td>
                <td className="px-6 py-4 text-green-400">{wallet.ground_fees?.toLocaleString()} ريال</td>
                <td className="px-6 py-4 text-purple-400">{wallet.registration_fee?.toLocaleString()} ريال</td>
                <td className="px-6 py-4 text-gray-300">{wallet.transactions_count}</td>
                <td className="px-6 py-4">
                  <button 
                    onClick={() => window.location.href = `/dashboard/showroom-wallets/${wallet.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    عرض التفاصيل
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 