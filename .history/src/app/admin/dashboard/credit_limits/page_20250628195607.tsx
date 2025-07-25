/**
 * @file /src/app/admin/dashboard/credit_limits/page.tsx
 * @description عرض الحدود الائتمانية المخصصة للمستخدمين أو التجار
 * @table credit_limits
 * @created 2025-06-26
 */

'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/services/supabase'
import type { Database } from '@/types/supabase'

type Row = Database['public']['Tables']['credit_limits']['Row']

export default function CreditLimitsPage() {
  const [data, setData] = useState<Row[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.from('credit_limits').select('*').then(({
      data,
      error
    }) => {
      if (error) {
        console.error('فشل في جلب البيانات:', error.message)
      } else {
        setData(data)
      }
    })
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Credit Limits</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
