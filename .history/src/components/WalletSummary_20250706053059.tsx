'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';

interface Wallet {
  id: string;
  balance_personal: number;
  balance_approved: number;
  balance_limit: number;
  updated_at: string;
}

export default function WalletSummary() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWallet();
  }, []);

  async function fetchWallet() {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!error && data) {
      setWallet(data);
    } else {
      console.error('❌ خطأ في جلب بيانات المحفظة:', error);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center">
        ⏳ جاري تحميل المحفظة...
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="bg-white p-4 rounded-lg shadow text-center">
        ❌ لم يتم العثور على بيانات المحفظة.
      </div>
    );
  }

  const availableFunds = wallet.balance_personal + (wallet.balance_limit - wallet.balance_approved);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">💰 ملخص محفظتك</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg relative">
          <div className="absolute top-2 left-2">
            <span className="text-xl">💰</span>
          </div>
          <p className="text-sm text-gray-600">رصيد شخصي</p>
          <p className="text-2xl font-bold text-blue-600">{wallet.balance_personal.toLocaleString()} ريال</p>
        </div>
        <div className="p-4 bg-green-50 rounded-lg relative">
          <div className="absolute top-2 left-2">
            <span className="text-xl">💳</span>
          </div>
          <p className="text-sm text-gray-600">الممول المستخدم</p>
          <p className="text-2xl font-bold text-green-600">{wallet.balance_approved.toLocaleString()} ريال</p>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg relative">
          <div className="absolute top-2 left-2">
            <span className="text-xl">🎯</span>
          </div>
          <p className="text-sm text-gray-600">حد التمويل</p>
          <p className="text-2xl font-bold text-purple-600">{wallet.balance_limit.toLocaleString()} ريال</p>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg relative">
          <div className="absolute top-2 left-2">
            <span className="text-xl">⚡</span>
          </div>
          <p className="text-sm text-gray-600">القدرة الشرائية</p>
          <p className="text-2xl font-bold text-amber-600">{availableFunds.toLocaleString()} ريال</p>
        </div>
      </div>
    </div>
  );
}
