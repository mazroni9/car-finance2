'use client';

import { useEffect, useState } from 'react';

type Wallet = {
  id: string;
  balance: number;
  status: string;
};

export default function WalletSummary() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/wallet/balance');
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || 'فشل في جلب بيانات المحفظة');
        }

        setWallet(json.wallet);
      } catch (err: unknown) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'خطأ غير متوقع';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  return (
    <div>
      {loading && <p>جاري التحميل...</p>}
      {error && <p className="text-red">{error}</p>}
      {wallet && (
        <div>
          <p>💰 الرصيد الحالي: {wallet.balance} ريال</p>
          <p>📌 الحالة: {wallet.status}</p>
          <p>🆔 المعرف: {wallet.id}</p>
        </div>
      )}
    </div>
  );
}
