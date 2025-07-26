/**
 * @file /src/app/admin/dashboard/admin_logs/cars/linked-cars/page.tsx
 * @description عرض نتائج عمليات ربط السيارات
 * @created 2024-03-20
 */

'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'

interface LinkCarsResponse {
  success: boolean
  details: {
    before: {
      unlinkedCars: number
      message: string
    }
    after: {
      linkedCars: number
      message: string
    }
    changes: {
      count: number
      message: string
    }
    lastTransaction: {
      id: string
      showroom_id: string
      type: string
      amount: number
      description: string
      external: boolean
      created_at: string
    }
  }
  message: string
}

export default function LinkedCarsPage() {
  const [linkingResults, setLinkingResults] = useState<LinkCarsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchLinkingResults()
  }, [])

  const fetchLinkingResults = async () => {
    try {
      const response = await fetch('/api/admin/link-cars')
      const data = await response.json()
      setLinkingResults(data)
      setLoading(false)
    } catch (err) {
      setError('حدث خطأ أثناء جلب النتائج')
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-4">جاري التحميل...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  if (!linkingResults) {
    return <div className="p-4">لا توجد نتائج</div>
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold mb-6">نتائج ربط السيارات</h1>
      
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">حالة العملية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium mb-2">قبل الربط:</h3>
            <p>{linkingResults.details.before.message}</p>
            <p className="text-sm text-gray-600">عدد السيارات: {linkingResults.details.before.unlinkedCars}</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">بعد الربط:</h3>
            <p>{linkingResults.details.after.message}</p>
            <p className="text-sm text-gray-600">عدد السيارات: {linkingResults.details.after.linkedCars}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">التغييرات</h2>
        <p>{linkingResults.details.changes.message}</p>
        <p className="text-sm text-gray-600">عدد التغييرات: {linkingResults.details.changes.count}</p>
      </Card>

      {linkingResults.details.lastTransaction && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">آخر معاملة</h2>
          <div className="space-y-2">
            <p><span className="font-medium">رقم المعاملة:</span> {linkingResults.details.lastTransaction.id}</p>
            <p><span className="font-medium">معرف المعرض:</span> {linkingResults.details.lastTransaction.showroom_id}</p>
            <p><span className="font-medium">النوع:</span> {linkingResults.details.lastTransaction.type}</p>
            <p><span className="font-medium">المبلغ:</span> {linkingResults.details.lastTransaction.amount}</p>
            <p><span className="font-medium">الوصف:</span> {linkingResults.details.lastTransaction.description}</p>
            <p><span className="font-medium">تاريخ الإنشاء:</span> {new Date(linkingResults.details.lastTransaction.created_at).toLocaleString('ar-SA')}</p>
          </div>
        </Card>
      )}

      {!linkingResults.success && (
        <div className="text-red-500 mt-4">
          حدث خطأ: {linkingResults.message}
        </div>
      )}
    </div>
  )
} 