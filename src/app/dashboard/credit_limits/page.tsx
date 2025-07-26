/**
 * @file /src/app/admin/dashboard/credit_limits/page.tsx
 * @description عرض الحدود الائتمانية المخصصة للمستخدمين أو التجار
 * @table credit_limits
 * @created 2025-06-26
 */

'use client'

import React from 'react'
import { useSupabaseQuery } from '@/lib/hooks/useSupabase'
import type { Database } from '../../../../types/supabase'

type CreditLimit = Database['public']['Tables']['credit_limits']['Row']

export default function CreditLimitsPage() {
  const { data: creditLimits, error, loading } = useSupabaseQuery<CreditLimit>('credit_limits')

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Credit Limits</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {JSON.stringify(creditLimits, null, 2)}
      </pre>
    </div>
  )
}
