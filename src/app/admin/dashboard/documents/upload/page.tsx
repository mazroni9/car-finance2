/**
 * @file /src/app/admin/dashboard/documents/upload/page.tsx
 * @description صفحة رفع مستندات تدعم Cloudinary و Supabase Storage حسب نوع الملف، مع رفع مباشر من المتصفح
 * @table documents
 * @created 2025-06-26
 */

'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/services/supabase'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function UploadDocumentPage() {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [isUploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setUploading(true)

      let fileUrl = ''
      let fileType = file.type.split('/')[0] // image / application / etc

      if (fileType === 'image') {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        const data = await response.json()
        fileUrl = data.url
      } else {
        const filename = `${Math.random().toString(36).substring(7)}_${file.name}`
        const { error: uploadError, data } = await supabase.storage
          .from('documents')
          .upload(filename, file)

        if (uploadError) throw uploadError
        
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filename)
        
        fileUrl = publicUrl
      }

      const { error } = await supabase
        .from('documents')
        .insert({
          description,
          file_url: fileUrl,
          file_type: fileType,
          user_id: 'admin'  // يمكن تغييره حسب النظام
        })

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Error uploading document')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">رفع مستند جديد</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />
      <input
        type="text"
        value={description}
        placeholder="وصف المستند"
        onChange={(e) => setDescription(e.target.value)}
        className="mb-4 w-full p-2 border rounded"
      />
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isUploading ? '...جارٍ الرفع' : 'رفع المستند'}
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  )
}
