'use client';

import React, { useEffect, useState } from 'react';

interface AdminReportRow {
  user_id: string;
  email: string;
  role: string;
  plan_type: string;
  wallet_balance: number;
  approved_amount: number;
}

export default function AdminReportPage() {
  const [data, setData] = useState<AdminReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/admin/admin-report');
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        const json = await res.json();
        setData(json);
      } catch (err: any) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">🗂️ Admin Report</h1>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto border border-gray-700 rounded-lg">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="px-4 py-2 border border-gray-700">User ID</th>
                <th className="px-4 py-2 border border-gray-700">Email</th>
                <th className="px-4 py-2 border border-gray-700">Role</th>
                <th className="px-4 py-2 border border-gray-700">Plan Type</th>
                <th className="px-4 py-2 border border-gray-700">Wallet Balance</th>
                <th className="px-4 py-2 border border-gray-700">Approved Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.user_id} className="hover:bg-gray-800">
                  <td className="px-4 py-2 border border-gray-700">{row.user_id}</td>
                  <td className="px-4 py-2 border border-gray-700">{row.email || '-'}</td>
                  <td className="px-4 py-2 border border-gray-700">{row.role || '-'}</td>
                  <td className="px-4 py-2 border border-gray-700">{row.plan_type || '-'}</td>
                  <td className="px-4 py-2 border border-gray-700">
                    {typeof row.wallet_balance === 'number' ? `${row.wallet_balance.toLocaleString()} SAR` : '0 SAR'}
                  </td>
                  <td className="px-4 py-2 border border-gray-700">
                    {typeof row.approved_amount === 'number' ? `${row.approved_amount.toLocaleString()} SAR` : '0 SAR'}
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
