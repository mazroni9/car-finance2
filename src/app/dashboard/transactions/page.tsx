'use client';

import { supabase } from '@/lib/services/supabase'
import { BackButton } from '@/components/ui/back-button'

export default async function TransactionsPage() {
  const { data, error } = await supabase
    .from('transactions')
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

      <h1 className="text-2xl font-bold mb-4">العمليات المالية</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">رقم العملية</th>
              <th className="px-4 py-2">نوع العملية</th>
              <th className="px-4 py-2">المبلغ</th>
              <th className="px-4 py-2">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((transaction) => (
              <tr key={transaction.id}>
                <td className="border px-4 py-2">{transaction.id}</td>
                <td className="border px-4 py-2">{transaction.type}</td>
                <td className="border px-4 py-2">{transaction.amount?.toLocaleString()} ريال</td>
                <td className="border px-4 py-2">
                  {new Date(transaction.created_at).toLocaleDateString('ar-SA')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}