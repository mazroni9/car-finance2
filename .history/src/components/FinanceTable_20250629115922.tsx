/**
 * جدول التقارير المالية - Finance Table
 * 
 * وصف:
 *   يعرض هذا الجدول تفاصيل التمويلات الشهرية أو الربعية حسب النوع المحدد.
 *   يحتوي على أعمدة: رقم التمويل، اسم السيارة، المبلغ، الدفعة الأولى، المتبقي، الحالة، تاريخ البدء، الفحص.
 * 
 * ملاحظات:
 *   - يتم تمرير البيانات من Supabase كمصفوفة Installment.
 *   - الزر "عرض" يوجه المستخدم لصفحة التفاصيل الفردية لكل تمويل.
 * 
 * موقع الملف:
 *   src/components/FinanceTable.tsx
 * 
 * تاريخ التحديث: يونيو 2025
 * تم بواسطة: فريق DASM-e (بإشراف محمد الزهراني)
 */

import React from 'react';
import Link from 'next/link';

interface Installment {
  id: string;
  car_name?: string;
  total_amount?: number;
  down_payment?: number;
  paid_amount?: number;
  status?: string;
  start_date?: string;
  test?: number; // الفحص
}

interface FinanceTableProps {
  data: {
    id: string
    amount: number
    date: string
    status: string
  }[]
}

export default function FinanceTable({ data }: FinanceTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Amount</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">${item.amount.toFixed(2)}</td>
              <td className="border px-4 py-2">{new Date(item.date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">
                <span className={`px-2 py-1 rounded ${
                  item.status === 'completed' ? 'bg-green-100 text-green-800' :
                  item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
