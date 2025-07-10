'use client';

import React, { useEffect, useState } from 'react';

export default function DashboardHome() {
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalWallets: 0,
    totalSubscriptions: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    // مثال على جلب بيانات من API – استبدل هذا بطلب حقيقي
    async function fetchData() {
      // 🔁 هنا استبدل بالنداء الفعلي لقاعدة البيانات أو API
      const result = {
        totalUsers: 20,
        totalWallets: 20,
        totalSubscriptions: 20,
        totalRevenue: 50000,
      };
      setSummary(result);
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">📊 Dashboard Summary</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card title="Total Users" value={summary.totalUsers} color="bg-blue-500" />
        <Card title="Total Wallets" value={summary.totalWallets} color="bg-green-500" />
        <Card title="Total Subscriptions" value={summary.totalSubscriptions} color="bg-purple-500" />
        <Card title="Total Revenue" value={`SAR ${summary.totalRevenue}`} color="bg-yellow-500" />
      </div>
    </div>
  );
}

function Card({ title, value, color }: { title: string, value: string | number, color: string }) {
  return (
    <div className={`rounded-lg shadow-md p-6 ${color}`}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-3xl mt-2 font-bold">{value}</p>
    </div>
  );
}
