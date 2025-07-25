'use client';

import { supabase } from '@/lib/services/supabase'
import { BackButton } from '@/components/ui/back-button'

export default async function WalletsPage() {
  const { data, error } = await supabase
    .from('wallets')
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

      <h1 className="text-2xl font-bold mb-4">المحافظ المالية</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">رقم المحفظة</th>
              <th className="px-4 py-2">صاحب المحفظة</th>
              <th className="px-4 py-2">الرصيد</th>
              <th className="px-4 py-2">تاريخ الإنشاء</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((wallet) => (
              <tr key={wallet.id}>
                <td className="border px-4 py-2">{wallet.id}</td>
                <td className="border px-4 py-2">{wallet.user_id}</td>
                <td className="border px-4 py-2">{wallet.balance?.toLocaleString()} ريال</td>
                <td className="border px-4 py-2">
                  {new Date(wallet.created_at).toLocaleDateString('ar-SA')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}