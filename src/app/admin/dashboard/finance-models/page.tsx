'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/services/supabase'
import type { Database } from '@/types/supabase'

type Row = Database['public']['Tables']['finance_models']['Row']

export default async function FinanceModelsPage() {
  const { data: models, error } = await supabase
    .from('finance_models')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching finance models:', error)
    return <div>Error loading finance models</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">تحليل نماذج التمويل</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">{JSON.stringify(models, null, 2)}</pre>
    </div>
  )
}
