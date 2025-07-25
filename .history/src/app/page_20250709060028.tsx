'use client';

import { useEffect, useState } from 'react';

type Wallet = {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  status: 'active' | 'suspended' | 'closed';
  type: 'personal' | 'business' | 'showroom' | 'platform' | 'system';
  created_at: string;
  updated_at: string;
};

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/wallets')
      .then(res => res.json())
      .then(data => setWallets(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>جاري التحميل...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">جميع محافظ المستخدمين</h1>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th>المعرف</th>
            <th>المستخدم</th>
            <th>الرصيد</th>
            <th>العملة</th>
            <th>الحالة</th>
            <th>النوع</th>
            <th>تاريخ الإنشاء</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map(wallet => (
            <tr key={wallet.id}>
              <td>{wallet.id}</td>
              <td>{wallet.user_id}</td>
              <td>{wallet.balance}</td>
              <td>{wallet.currency}</td>
              <td>{wallet.status}</td>
              <td>{wallet.type}</td>
              <td>{new Date(wallet.created_at).toLocaleString('ar-EG')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
