/**
 * @file /src/app/admin/dashboard/admin_logs/page.tsx
 * @description عرض سجلات التعديلات التي قام بها المشرفون
 * @table admin_logs
 * @created 2025-06-26
 */

'use client'

import React, { useEffect, useState } from 'react'
import supabase from '../../../../lib/services/supabase'
import type { Database } from '../../../../types/supabase'

type Row = Database['public']['Tables']['admin_logs']['Row']

export default function AdminLogs() {
  const [logs, setLogs] = useState<Row[]>([])

  useEffect(() => {
    supabase.from('admin_logs').select('*').then(({
      data,
      error
    }) => {
      if (error) console.error('Error:', error)
      else setLogs(data || [])
    })
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Logs</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(logs, null, 2)}</pre>
    </div>
  )
}
