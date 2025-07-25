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
import axios from 'axios'

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
      .select('id, description, file_url, file_type, uploaded_at, user_id, users(full_name)')

    if (error) {
      console.error('Error fetching documents:', error)
      return []
    }

    return data || []
  }

  const deleteDocument = async (doc: DocumentWithUser) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستند؟')) return
    setLoadingId(doc.id)

    try {
      const supabase = createClient()

      if (doc.file_type === 'image') {
        const publicId = extractCloudinaryPublicId(doc.file_url || '')
        await axios.post('/api/delete-cloudinary', { publicId })
      } else {
        const filename = doc.file_url?.split('/').pop()
        if (filename) await supabase.storage.from('documents').remove([filename])
      }

      await supabase.from('documents').delete().eq('id', doc.id)
      await fetchDocuments()
    } catch (err: any) {
      console.error('فشل الحذف:', err.message)
    } finally {
      setLoadingId(null)
    }
  }

  const extractCloudinaryPublicId = (url: string): string => {
    const parts = url.split('/')
    const publicIdWithExtension = parts.slice(-1)[0]
    return `documents/uploads/${publicIdWithExtension.split('.')[0]}`
  }

  return (
    <div className="p-4">
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
            <p className="font-medium mb-2">{doc.description || 'بدون وصف'}</p>
            <p className="text-sm text-gray-500 mb-1">النوع: {doc.file_type}</p>
            <p className="text-sm text-gray-500 mb-1">
              المستخدم: {doc.users?.full_name || doc.user_id}
            </p>
            {doc.file_url && (
              <a
                href={doc.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-blue-600 underline"
              >
                فتح الملف
              </a>
            )}
            <button
              onClick={() => deleteDocument(doc)}
              disabled={loadingId === doc.id}
              className="block mt-4 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
            >
              🗑 حذف
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
