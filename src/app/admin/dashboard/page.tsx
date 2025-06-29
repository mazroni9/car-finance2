/**
 * 📄 الملف: /src/app/admin/dashboard/page.tsx
 * 🎯 الغرض: عرض لوحة تحكم إدارية حقيقية تعرض بيانات مباشرة من Supabase
 * 
 * ✅ يعرض:
 *  - عدد المستخدمين من جدول users
 *  - مجموع أرصدة المحافظ من جدول wallets
 *  - إجمالي طلبات التمويل من جدول funding_requests
 *  - أحدث 5 عمليات مالية من جدول transactions
 * 
 * 🔗 الارتباطات:
 *  - يعتمد على lib/supabaseClient.ts للاتصال بقاعدة البيانات
 *  - يستخدم متغيرات البيئة: NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY
 */

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/services/supabase'
import type { Database } from '@/types/supabase'

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Transaction = Database['public']['Tables']['transactions']['Row']

interface DashboardStats {
  totalUsers: number
  totalTransactions: number
  totalRevenue: number
  recentTransactions: Transaction[]
}

async function fetchDashboardStats(): Promise<DashboardStats> {
  const [users, transactions] = await Promise.all([
    supabase.from('users').select('count'),
    supabase.from('transactions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
  ])

  if (users.error) throw users.error
  if (transactions.error) throw transactions.error

  const totalRevenue = transactions.data.reduce((sum, tx) => sum + (tx.amount || 0), 0)

  return {
    totalUsers: users.count || 0,
    totalTransactions: transactions.data.length,
    totalRevenue,
    recentTransactions: transactions.data
  }
}

export default async function DashboardPage() {
  const stats = await fetchDashboardStats()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Users</h2>
          <p className="text-3xl">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Transactions</h2>
          <p className="text-3xl">{stats.totalTransactions}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold">Total Revenue</h2>
          <p className="text-3xl">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentTransactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="border px-4 py-2">{tx.id}</td>
                  <td className="border px-4 py-2">{tx.description}</td>
                  <td className="border px-4 py-2">${tx.amount.toFixed(2)}</td>
                  <td className="border px-4 py-2">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, color }: { title: string; value: any; color: string }) {
  return (
    <div className={`glass-card p-6 bg-gradient-to-br from-${color}-50 to-white shadow-md`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="text-2xl font-extrabold text-black">{value}</div>
    </div>
  );
}
