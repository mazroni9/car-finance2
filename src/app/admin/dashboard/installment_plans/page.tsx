/**
 * @file /src/app/admin/dashboard/installment_plans/page.tsx
 * @description عرض الخطط التمويلية المتاحة للمستخدمين
 * @table installment_plans
 * @created 2025-06-26
 */

'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/services/supabase'
import type { Database } from '@/types/supabase'

type Row = Database['public']['Tables']['installment_plans']['Row']

export default function InstallmentPlansPage() {
  const [data, setData] = useState<Row[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.from('installment_plans').select('*').then(({
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
      <h1 className="text-xl font-bold mb-4">Installment Plans</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
