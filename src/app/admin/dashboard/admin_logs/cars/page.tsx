/**
 * @file /src/app/admin/dashboard/cars/page.tsx
 * @description عرض قائمة السيارات المخزنة في قاعدة البيانات
 * @table cars
 * @created 2025-06-26
 */

'use client'

import React, { useEffect, useState } from 'react'
import supabase from '@/lib/services/supabase'
import type { Database } from '@/types/supabase'

type Car = Database['public']['Tables']['cars']['Row']

export default function CarsPage() {
  const [cars, setCars] = useState<Car[]>([])

  useEffect(() => {
    supabase.from('car_showcase').select('*').then(({
      data,
      error
    }) => {
      if (error) console.error('Error:', error)
      else setCars(data || [])
    })
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cars</h1>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {JSON.stringify(cars, null, 2)}
      </pre>
    </div>
  )
}
