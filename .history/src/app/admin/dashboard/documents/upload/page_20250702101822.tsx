/**
 * @file /src/app/admin/dashboard/documents/upload/page.tsx
 * @description صفحة رفع مستندات تدعم Cloudinary و Supabase Storage حسب نوع الملف، مع رفع مباشر من المتصفح
 * @table documents
 * @created 2025-06-26
 */

'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/services/supabase'
import { useRouter } from 'next/navigation'
import { BackButton } from '@/components/ui/back-button'

export default function UploadDocumentPage() {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [isUploading, setUploading] = useState(false)
  const router = useRouter()

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    try {
      setUploading(true)
      const fileType = file.type.split('/')[0] // image / application / etc
      let fileUrl = ''

      if (fileType === 'image') {
        const formData = new FormData()
        formData.append('file', file)
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })
        
        const { url } = await response.json()
        fileUrl = url
      } else {
        const filename = `${Math.random().toString(36).substring(7)}_${file.name}`
        const { error: uploadError } = await supabase.storage
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
          user_id: 'system'
        })

      if (error) throw error

      router.push('/admin/dashboard/documents')
    } catch (error) {
      console.error('Error uploading document:', error)
      alert('Error uploading document')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <BackButton />
      </div>

      <h1 className="text-2xl font-bold mb-4">رفع مستند جديد</h1>
      <form onSubmit={handleUpload} className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">الوصف</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">الملف</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full"
            required
          />
        </div>
        <button
          type="submit"
          disabled={isUploading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isUploading ? 'جاري الرفع...' : 'رفع المستند'}
        </button>
      </form>
    </div>
  )
}
