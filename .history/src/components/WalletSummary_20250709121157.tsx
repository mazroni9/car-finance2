'use client';

import { useEffect, useState } from 'react';

export default function WalletSummary() {
  const [wallet, setWallet] = useState(null);
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
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'خطأ غير متوقع');
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
