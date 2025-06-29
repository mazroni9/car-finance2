'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/services/supabase'
import type { Database } from '@/types/supabase'

type Row = Database['public']['Tables']['finance_models']['Row']

export default function FinanceModelsPage() {
  const [data, setData] = useState<Row[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.from('finance_models').select('*').then(({ data, error }) => {
      if (error) {
        console.error('خطأ في جلب البيانات:', error.message)
      } else {
        setData(data)
      }
    })
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">تحليل نماذج التمويل</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
