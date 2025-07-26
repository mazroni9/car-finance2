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
  data: Installment[];
  type: 'monthly' | 'quarterly';
}

export default function FinanceTable({ data, type }: FinanceTableProps) {
  return (
    <div className="overflow-x-auto border rounded-xl">
      <table className="min-w-full text-sm text-right">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="p-3">رقم التمويل</th>
            <th className="p-3">اسم السيارة</th>
            <th className="p-3">المبلغ الإجمالي</th>
            <th className="p-3">الدفعة الأولى</th>
            <th className="p-3">المتبقي</th>
            <th className="p-3">الحالة</th>
            <th className="p-3">تاريخ البدء</th>
            <th className="p-3">الفحص</th>
            <th className="p-3">تفاصيل</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center p-4">
                لا توجد بيانات حالياً.
              </td>
            </tr>
          )}
          {data.map((item) => (
            <tr key={item.id} className="border-b">
              <td className="p-3 font-mono text-xs">{item.id}</td>
              <td className="p-3">{item.car_name || '—'}</td>
              <td className="p-3">{item.total_amount?.toLocaleString() || '—'} ريال</td>
              <td className="p-3">{item.down_payment?.toLocaleString() || '—'} ريال</td>
              <td className="p-3">
                {item.total_amount && item.paid_amount
                  ? (item.total_amount - item.paid_amount).toLocaleString()
                  : '—'} ريال
              </td>
              <td className="p-3">{item.status || '—'}</td>
              <td className="p-3">
                {item.start_date
                  ? new Date(item.start_date).toLocaleDateString('ar-SA')
                  : '—'}
              </td>
              <td className="p-3">{item.test !== undefined ? item.test + '٪' : '—'}</td>
              <td className="p-3">
                <Link
                  href={`/admin/dashboard/installments/${item.id}`}
                  className="text-blue-600 hover:underline"
                >
                  عرض
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
