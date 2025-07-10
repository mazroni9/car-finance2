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
}

export default function ShowroomWalletsSidebar() {
  const [wallets, setWallets] = useState<ShowroomWallet[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (error) throw error;
      setWallets(data || []);
    } catch (err) {
      console.error('Error fetching showroom wallets:', err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-sm text-gray-400 text-center py-2">
        جاري التحميل...
      </div>
    );
  }

  if (wallets.length === 0) {
    return (
      <div className="text-sm text-gray-400 text-center py-2">
        لا توجد محافظ معارض
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-400 mb-2">محافظ المعارض</h3>
      {wallets.map((wallet) => (
        <div
          key={wallet.id}
          className="bg-gray-800 rounded p-2 text-sm"
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-medium text-white">{wallet.name}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-xs ${
              wallet.status === 'active' ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
            }`}>
              {wallet.status === 'active' ? 'نشط' : 'معلق'}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>
              <span className="text-gray-400">رصيد شخصي:</span>
              <span className="text-blue-400 ml-1">{wallet.balance.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-gray-400">مستخدم:</span>
              <span className="text-green-400 ml-1">{wallet.balance_approved.toLocaleString()}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400">حد التمويل:</span>
              <span className="text-purple-400 ml-1">{wallet.balance_limit.toLocaleString()}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 