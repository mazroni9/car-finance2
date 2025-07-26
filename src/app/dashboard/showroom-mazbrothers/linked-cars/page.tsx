/**
 * @file /src/app/dashboard/showroom-mazbrothers/linked-cars/page.tsx
 * @description عرض تفاصيل ربط السيارات - نسخة المعرض
 */

'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '../../../../components/ui/card'
import { Table } from '../../../../components/ui/table'

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

export default function ShowroomLinkedCarsPage() {
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
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">تقرير ربط السيارات - معرض مازبراذرز</h1>
      
      {/* إحصائيات المعرض */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">إحصائيات المعرض</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">السيارات قبل الربط</h3>
            <p className="text-2xl font-bold text-blue-600">
              {linkingResults.details.before.unlinkedCars}
            </p>
            <p className="text-sm text-gray-600 mt-2">{linkingResults.details.before.message}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">السيارات بعد الربط</h3>
            <p className="text-2xl font-bold text-green-600">
              {linkingResults.details.after.linkedCars}
            </p>
            <p className="text-sm text-gray-600 mt-2">{linkingResults.details.after.message}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">التغييرات</h3>
            <p className="text-2xl font-bold text-purple-600">
              {linkingResults.details.changes.count}
            </p>
            <p className="text-sm text-gray-600 mt-2">{linkingResults.details.changes.message}</p>
          </div>
        </div>
      </Card>

      {/* آخر معاملة */}
      {linkingResults.details.lastTransaction && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">آخر معاملة</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="font-medium">رقم المعاملة</p>
                <p className="text-gray-600">{linkingResults.details.lastTransaction.id}</p>
              </div>
              <div>
                <p className="font-medium">المبلغ</p>
                <p className="text-xl font-bold text-green-600">
                  {linkingResults.details.lastTransaction.amount} ريال
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">النوع</p>
                <p className="text-gray-600">{linkingResults.details.lastTransaction.type}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium">تاريخ الإنشاء</p>
                <p className="text-gray-600">
                  {new Date(linkingResults.details.lastTransaction.created_at).toLocaleString('ar-SA')}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                <p className="font-medium">الوصف</p>
                <p className="text-gray-600">{linkingResults.details.lastTransaction.description}</p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* رسائل الخطأ */}
      {!linkingResults.success && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mt-4">
          حدث خطأ: {linkingResults.message}
        </div>
      )}
    </div>
  )
} 