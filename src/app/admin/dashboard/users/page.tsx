'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/services/supabase'
import type { Database } from '@/types/supabase'
import Link from 'next/link'
import axios from 'axios'

type DocumentWithUser = Database['public']['Tables']['documents']['Row'] & {
  users: { full_name: string | null } | null
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<DocumentWithUser[]>([])

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('documents')
      .select('id, description, file_url, file_type, uploaded_at, user_id, users(full_name)')
      .order('uploaded_at', { ascending: false })

    if (error) console.error('فشل تحميل المستندات:', error.message)
    else setDocs(data || [])
  }

  // ... زر الحذف يبقى كما هو

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
          </div>
        ))}
      </div>
    </div>
  )
}
