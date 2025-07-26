/**
 * @file /src/app/showroom-mazbrothers/linked-cars/page.tsx
 * @description عرض تفاصيل ربط السيارات - نسخة المعرض
 */

'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Table } from '@/components/ui/table'

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

interface ShowroomData {
  id: string
  name: string
  linkedCars: number
  totalTransactions: number
}

export default function ShowroomLinkedCarsPage() {
  const [linkingResults, setLinkingResults] = useState<LinkCarsResponse | null>(null)
  const [showrooms, setShowrooms] = useState<ShowroomData[]>([])
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
      // TODO: Fetch showrooms data
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
      <h1 className="text-2xl font-bold mb-6">تقرير ربط السيارات - معرض mazbrothers</h1>
      {/* إحصائيات عامة */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">الإحصائيات العامة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">قبل الربط</h3>
            <p>{linkingResults.details.before.message}</p>
            <p className="text-sm text-gray-600 mt-2">
              عدد السيارات: {linkingResults.details.before.unlinkedCars}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">بعد الربط</h3>
            <p>{linkingResults.details.after.message}</p>
            <p className="text-sm text-gray-600 mt-2">
              عدد السيارات: {linkingResults.details.after.linkedCars}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">التغييرات</h3>
            <p>{linkingResults.details.changes.message}</p>
            <p className="text-sm text-gray-600 mt-2">
              عدد التغييرات: {linkingResults.details.changes.count}
            </p>
          </div>
        </div>
      </Card>

      {/* تفاصيل المعارض */}
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">تفاصيل المعارض</h2>
        <div className="overflow-x-auto">
          <Table>
            <thead>
              <tr>
                <th>اسم المعرض</th>
                <th>عدد السيارات المرتبطة</th>
                <th>عدد المعاملات</th>
                <th>آخر تحديث</th>
                <th>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {showrooms.map(showroom => (
                <tr key={showroom.id}>
                  <td>{showroom.name}</td>
                  <td>{showroom.linkedCars}</td>
                  <td>{showroom.totalTransactions}</td>
                  <td>{new Date().toLocaleDateString('ar-SA')}</td>
                  <td>
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      نشط
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* آخر المعاملات */}
      {linkingResults.details.lastTransaction && (
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">آخر معاملة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <p className="font-medium">رقم المعاملة</p>
              <p className="text-gray-600">{linkingResults.details.lastTransaction.id}</p>
            </div>
            <div>
              <p className="font-medium">معرف المعرض</p>
              <p className="text-gray-600">{linkingResults.details.lastTransaction.showroom_id}</p>
            </div>
            <div>
              <p className="font-medium">النوع</p>
              <p className="text-gray-600">{linkingResults.details.lastTransaction.type}</p>
            </div>
            <div>
              <p className="font-medium">المبلغ</p>
              <p className="text-gray-600">{linkingResults.details.lastTransaction.amount}</p>
            </div>
            <div>
              <p className="font-medium">الوصف</p>
              <p className="text-gray-600">{linkingResults.details.lastTransaction.description}</p>
            </div>
            <div>
              <p className="font-medium">تاريخ الإنشاء</p>
              <p className="text-gray-600">
                {new Date(linkingResults.details.lastTransaction.created_at).toLocaleString('ar-SA')}
              </p>
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