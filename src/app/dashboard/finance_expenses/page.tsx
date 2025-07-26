/**
 * @file /src/app/admin/dashboard/finance_expenses/page.tsx
 * @description عرض تفاصيل المصروفات التشغيلية والمالية
 * @table finance_expenses
 * @created 2025-06-26
 */

'use client';

import { supabase } from '../../../../lib/services/supabase'
import { BackButton } from '../../../../components/ui/back-button'

export default async function FinanceExpensesPage() {
  const { data: expenses, error } = await supabase
    .from('finance_expenses')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching finance expenses:', error)
    return <div>Error loading finance expenses</div>
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <BackButton />
      </div>

      <h1 className="text-2xl font-bold mb-4">المصروفات المالية</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="px-4 py-2">رقم العملية</th>
              <th className="px-4 py-2">المبلغ</th>
              <th className="px-4 py-2">الوصف</th>
              <th className="px-4 py-2">التاريخ</th>
            </tr>
          </thead>
          <tbody>
            {expenses?.map((expense) => (
              <tr key={expense.id}>
                <td className="border px-4 py-2">{expense.id}</td>
                <td className="border px-4 py-2">{expense.amount}</td>
                <td className="border px-4 py-2">{expense.description}</td>
                <td className="border px-4 py-2">
                  {new Date(expense.created_at).toLocaleDateString('ar-SA')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
