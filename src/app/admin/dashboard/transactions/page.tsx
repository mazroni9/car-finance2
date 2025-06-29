/**
 * @file /src/app/admin/dashboard/transactions/page.tsx
 * @description عرض العمليات المالية مع اسم المستخدم المرتبط بمحفظة من/إلى عبر wallets → users
 * @table transactions
 * @created 2025-06-26
 */

'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/services/supabase'
import type { Database } from '@/types/supabase'

type TransactionWithDeepRelation = Database['public']['Tables']['transactions']['Row'] & {
  from_wallets?: {
    users?: { full_name?: string | null } | null
  } | null
  to_wallets?: {
    users?: { full_name?: string | null } | null
  } | null
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionWithDeepRelation[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('transactions')
      .select(`
        id, amount, type, created_at,
        from_wallet, to_wallet,
        from_wallets(users(full_name)),
        to_wallets(users(full_name))
      `)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error('فشل جلب البيانات:', error.message)
        } else {
          setTransactions(data || [])
        }
      })
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">العمليات المالية</h1>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">النوع</th>
            <th className="border px-2 py-1">المبلغ</th>
            <th className="border px-2 py-1">من (الاسم)</th>
            <th className="border px-2 py-1">إلى (الاسم)</th>
            <th className="border px-2 py-1">التاريخ</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td className="border px-2 py-1">{txn.type}</td>
              <td className="border px-2 py-1">{txn.amount?.toLocaleString()} ريال</td>
              <td className="border px-2 py-1">
                {txn.from_wallets?.users?.full_name || '—'}
              </td>
              <td className="border px-2 py-1">
                {txn.to_wallets?.users?.full_name || '—'}
              </td>
              <td className="border px-2 py-1">{new Date(txn.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
