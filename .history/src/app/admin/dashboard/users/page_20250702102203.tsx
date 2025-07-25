'use client';

import { supabase } from '@/lib/services/supabase'
import { BackButton } from '@/components/ui/back-button'

export default async function UsersPage() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching data:', error)
    return <div>Error loading data</div>
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <BackButton />
      </div>

      <h1 className="text-2xl font-bold mb-4">إدارة المستخدمين</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">رقم المستخدم</th>
              <th className="px-4 py-2">اسم المستخدم</th>
              <th className="px-4 py-2">الصلاحية</th>
              <th className="px-4 py-2">تاريخ التسجيل</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((user) => (
              <tr key={user.id}>
                <td className="border px-4 py-2">{user.id}</td>
                <td className="border px-4 py-2">{user.username}</td>
                <td className="border px-4 py-2">{user.role}</td>
                <td className="border px-4 py-2">
                  {new Date(user.created_at).toLocaleDateString('ar-SA')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}