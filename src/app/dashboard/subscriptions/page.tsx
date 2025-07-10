'use client';

import { useEffect, useState } from 'react';

interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  approved_amount: number;
  created_at: string;
  updated_at: string;
  status: string | null;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/subscriptions')
      .then(res => res.json())
      .then(setSubscriptions)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleDeactivate = async (id: string) => {
    try {
      await fetch('/api/admin/actions/deactivate', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === id ? { ...sub, status: 'inactive' } : sub
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleActivate = async (id: string) => {
    try {
      await fetch('/api/admin/actions/activate', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === id ? { ...sub, status: 'active' } : sub
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpgrade = async (id: string) => {
    try {
      await fetch('/api/admin/actions/upgrade', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
      // يمكنك إعادة جلب الاشتراكات لو تحب هنا
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">📑 Subscriptions</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && subscriptions.length === 0 && (
        <p className="text-gray-400">No subscriptions found.</p>
      )}

      {!loading && subscriptions.length > 0 && (
        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2 border">User ID</th>
                <th className="px-4 py-2 border">Plan Type</th>
                <th className="px-4 py-2 border">Approved Amount</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Updated At</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-800">
                  <td className="px-4 py-2 border">{sub.user_id}</td>
                  <td className="px-4 py-2 border">{sub.plan_type}</td>
                  <td className="px-4 py-2 border">{sub.approved_amount.toLocaleString()} SAR</td>
                  <td className="px-4 py-2 border">{sub.created_at?.split('T')[0]}</td>
                  <td className="px-4 py-2 border">{sub.updated_at?.split('T')[0]}</td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        sub.status === 'active'
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {sub.status ? sub.status : 'inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2 border space-x-2">
                    {sub.status === 'active' ? (
                      <button
                        onClick={() => handleDeactivate(sub.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded"
                      >
                        إيقاف
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(sub.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded"
                      >
                        تفعيل
                      </button>
                    )}
                    <button
                      onClick={() => handleUpgrade(sub.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded"
                    >
                      ترقية
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
