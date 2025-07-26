'use client';

import { useEffect, useState } from 'react';

interface Wallet {
  user_id: string;
  balance: number;
  currency: string;
  status: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export default function WalletsPage() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/wallets')
      .then(res => res.json())
      .then(setWallets)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">💰 Wallets</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && wallets.length === 0 && (
        <p className="text-gray-400">No wallets found.</p>
      )}

      {!loading && wallets.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Balance</th>
                <th className="px-4 py-2 border">Currency</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((wallet) => (
                <tr key={wallet.user_id} className="hover:bg-gray-800">
                  <td className="px-4 py-2 border">{wallet.user_id}</td>
                  <td className="px-4 py-2 border">{wallet.balance.toLocaleString()} {wallet.currency}</td>
                  <td className="px-4 py-2 border">{wallet.currency}</td>
                  <td className="px-4 py-2 border">{wallet.status}</td>
                  <td className="px-4 py-2 border">{wallet.type}</td>
                  <td className="px-4 py-2 border">{wallet.created_at?.split('T')[0]}</td>
                  <td className="px-4 py-2 border">{wallet.updated_at?.split('T')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
