/**
 * صفحة تفاصيل التمويل - Installment Details Page
 * 
 * الموقع: /admin/dashboard/installments/[id]
 * 
 * وصف:
 *   تعرض تفاصيل التمويل المحدد حسب المعرف (id) المأخوذ من الرابط.
 *   تسحب البيانات من Supabase وتعرض كافة معلومات القسط:
 *     - بيانات السيارة المرتبطة
 *     - قيمة التمويل والدفعات
 *     - حالة السداد والفحص
 * 
 * ملاحظات:
 *   - تعتمد على المسار الديناميكي [id]
 *   - تظهر رسالة في حال عدم وجود بيانات
 * 
 * تاريخ الإنشاء: يونيو 2025
 * تم بواسطة: فريق DASM-e (بإشراف محمد الزهراني)
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '../../../../lib/services/supabase';
import { BackButton } from '../../../../components/ui/back-button';

interface Installment {
  id: string;
  car_name?: string;
  total_amount?: number;
  down_payment?: number;
  paid_amount?: number;
  status?: string;
  start_date?: string;
  test?: number;
}

export default function InstallmentDetailsPage() {
  const { id } = useParams();
  const [installment, setInstallment] = useState<Installment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('installments')
        .select('*')
        .eq('id', id)
        .single();

      if (!error && data) {
        setInstallment(data);
      }
      setLoading(false);
    };

    if (id) fetchData();
  }, [id]);

  if (loading) return <div className="p-6">جاري تحميل البيانات...</div>;
  if (!installment) return <div className="p-6 text-red-600">لم يتم العثور على البيانات.</div>;

  return (
    <div className="p-6 space-y-4">
      <div className="mb-6">
        <BackButton />
      </div>

      <h1 className="text-2xl font-bold">تفاصيل التقسيط رقم {installment.id}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>🚗 <strong>السيارة:</strong> {installment.car_name || '—'}</div>
        <div>💰 <strong>المبلغ الإجمالي:</strong> {installment.total_amount?.toLocaleString() || '—'} ريال</div>
        <div>📥 <strong>الدفعة الأولى:</strong> {installment.down_payment?.toLocaleString() || '—'} ريال</div>
        <div>📤 <strong>المبلغ المدفوع:</strong> {installment.paid_amount?.toLocaleString() || '—'} ريال</div>
        <div>📌 <strong>المتبقي:</strong> {installment.total_amount && installment.paid_amount ? (installment.total_amount - installment.paid_amount).toLocaleString() + ' ريال' : '—'}</div>
        <div>📅 <strong>تاريخ البدء:</strong> {installment.start_date ? new Date(installment.start_date).toLocaleDateString('ar-SA') : '—'}</div>
        <div>🔎 <strong>نتيجة الفحص:</strong> {installment.test !== undefined ? installment.test + '%' : '—'}</div>
        <div>📘 <strong>الحالة:</strong> {installment.status || '—'}</div>
      </div>
    </div>
  );
}
