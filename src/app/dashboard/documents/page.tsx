/**
 * @file /src/app/admin/dashboard/documents/page.tsx
 * @description عرض المستندات المرفوعة مع اسم المستخدم المرتبط بها من جدول users
 * @table documents
 * @created 2025-06-26
 */

'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/services/supabase'
import type { Database } from '@/types/supabase'
import Link from 'next/link'
import { BackButton } from '@/components/ui/back-button'

type DocumentWithUser = Database['public']['Tables']['documents']['Row'] & {
  users: { full_name: string | null } | null
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentWithUser[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      return
    }

    setDocs(data || [])
  }

  const handleDelete = async (doc: DocumentWithUser) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستند؟')) return
    
    setLoadingId(doc.id)
    try {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', doc.id)

      if (error) throw error

      await fetchDocuments()
    } catch (error) {
      console.error('Error deleting document:', error)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <BackButton />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">المستندات المرفوعة</h1>
        <Link
          href="/admin/dashboard/documents/upload"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ➕ رفع مستند جديد
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {docs.map((doc) => (
          <div key={doc.id} className="border rounded p-4 shadow bg-white">
            <h3 className="font-bold">{doc.description || 'بدون وصف'}</h3>
            <p className="text-sm text-gray-500 mb-1">النوع: {doc.file_type}</p>
            <p className="text-sm text-gray-500 mb-1">
              المستخدم: {doc.users?.full_name || doc.user_id}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(doc.created_at).toLocaleDateString()}
            </p>
            {doc.file_url && (
              <div className="mt-2 flex gap-2">
                <a
                  href={doc.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  فتح الملف
                </a>
                <button
                  onClick={() => handleDelete(doc)}
                  disabled={loadingId === doc.id}
                  className="text-red-600 hover:underline"
                >
                  {loadingId === doc.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
