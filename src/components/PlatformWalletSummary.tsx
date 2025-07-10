'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';

export default function PlatformWalletSummary() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlatformBalance();
  }, []);

  async function fetchPlatformBalance() {
    setLoading(true);
    const { data, error } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', 'platform')
      .single();

    if (error) {
      console.error('Error fetching platform balance:', error);
      setBalance(null);
    } else {
      setBalance(data.balance);
    }
    setLoading(false);
  }

  if (loading) {
    return <p className="text-center py-4">جاري التحميل...</p>;
  }

  if (balance === null) {
    return <p className="text-center py-4 text-red-500">تعذر جلب رصيد المنصة</p>;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-900">💼 رصيد المنصة</h2>
      <p className="text-3xl font-extrabold text-green-700">
        {balance.toLocaleString('ar-SA')} ريال
      </p>
      <p className="text-gray-600 mt-2">إجمالي العمولات ورسوم نقل الملكية المحصلة من التجار.</p>
    </div>
  );
}
