/**
 * @file /src/app/admin/dashboard/wallets/page.tsx
 * @description عرض أرصدة المحافظ المالية للمستخدمين
 * @table wallets
 * @created 2025-06-26
 */

'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/services/supabase'
import type { Database } from '@/types/supabase'

type Row = Database['public']['Tables']['wallets']['Row']

export default function WalletsPage() {
  const [data, setData] = useState<Row[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.from('wallets').select('*').then(({
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
      <h1 className="text-xl font-bold mb-4">Wallets</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
