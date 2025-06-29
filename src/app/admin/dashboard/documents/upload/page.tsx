/**
 * @file /src/app/admin/dashboard/documents/upload/page.tsx
 * @description صفحة رفع مستندات تدعم Cloudinary و Supabase Storage حسب نوع الملف، مع رفع مباشر من المتصفح
 * @table documents
 * @created 2025-06-26
 */

'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/services/supabase'
import axios from 'axios'

export default function UploadDocumentPage() {
  const [file, setFile] = useState<File | null>(null)
  const [description, setDescription] = useState('')
  const [isUploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpload = async () => {
    if (!file) return alert('اختر ملفًا أولاً')
    setUploading(true)

    const supabase = createClient()
    let fileUrl = ''
    let fileType = file.type.split('/')[0] // image / application / etc

    try {
      if (fileType === 'image') {
        // رفع إلى Cloudinary
        const formData = new FormData()
        formData.append('file', file)
        formData.append('upload_preset', 'default-preset')  // غير هذا حسب إعدادك
        const res = await axios.post('https://api.cloudinary.com/v1_1/dzbaenadw/auto/upload', formData)
        fileUrl = res.data.secure_url
      } else {
        // رفع إلى Supabase Storage
        const fileName = `${Date.now()}_${file.name}`
        const { data, error } = await supabase.storage.from('documents').upload(fileName, file)
        if (error) throw error
        const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)
        fileUrl = urlData.publicUrl
      }

      // تخزين في جدول documents
      const { error: insertError } = await supabase.from('documents').insert({
        description,
        file_url: fileUrl,
        file_type: fileType,
        uploaded_at: new Date().toISOString(),
        user_id: 'admin'  // يمكن تغييره حسب النظام
      })
      if (insertError) throw insertError

      setMessage('✅ تم رفع الملف بنجاح')
      setFile(null)
      setDescription('')
    } catch (err: any) {
      console.error(err)
      setMessage(`❌ خطأ: ${err.message || 'فشل غير معروف'}`)
    }

    setUploading(false)
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
