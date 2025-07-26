'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';

interface ShowroomWallet {
  id: string;
  name: string;
  balance: number;
  balance_limit: number;
  balance_approved: number;
  status: string;
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
        .select('*')
        .eq('type', 'showroom')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

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
      <h1 className="text-2xl font-bold mb-6 text-white">💰 محافظ المعارض</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <div key={wallet.id} className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-white">{wallet.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${
                wallet.status === 'active' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
              }`}>
                {wallet.status === 'active' ? 'نشط' : 'معلق'}
              </span>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-sm">الرصيد الشخصي</p>
                <p className="text-xl font-bold text-blue-400">{wallet.balance.toLocaleString()} ريال</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">التمويل المستخدم</p>
                <p className="text-xl font-bold text-green-400">{wallet.balance_approved.toLocaleString()} ريال</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm">حد التمويل</p>
                <p className="text-xl font-bold text-purple-400">{wallet.balance_limit.toLocaleString()} ريال</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-500">
                تاريخ التسجيل: {new Date(wallet.created_at).toLocaleDateString('ar-SA')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 