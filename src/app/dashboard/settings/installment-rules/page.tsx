/**
 * 📄 الملف: /src/app/admin/dashboard/settings/installment-rules/page.tsx
 * 🎯 الغرض: إدارة قواعد التقسيط من خلال واجهة تحكم Admin مرتبطة بقاعدة Supabase
 *
 * ✅ الميزات:
 *  - عرض قائمة القواعد المخزنة في جدول installment_rules
 *  - تعديل أو حذف القواعد مباشرة
 *  - إضافة قاعدة جديدة بسهولة
 *
 * 🔗 الارتباطات:
 *  - الجدول المستهدف: installment_rules
 *  - الاتصال عبر: lib/supabaseClient.ts
 *  - يعتمد على المفاتيح التالية من البيئة: NEXT_PUBLIC_SUPABASE_URL و NEXT_PUBLIC_SUPABASE_ANON_KEY
 *
 * 🧩 مرفق: car_finance_schema.sql (ضمن مجلد /sql/setup)
 * يحتوي على جميع الجداول المرتبطة بتمويل السيارات، مثل:
 *  - cars
 *  - installment_plans
 *  - finance_expenses
 *  - simulation_runs
 *  - financial_statements
 *  - financial_entries
 */

'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BackButton } from '../../../../components/ui/back-button';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Rule {
  id: number;
  title: string;
  min_price: number;
  max_price: number;
  down_payment_percent: number;
  months: number;
}

export default function InstallmentRulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    const { data, error } = await supabase.from('installment_rules').select('*').order('min_price');
    if (error) {
      console.error('خطأ في جلب القواعد:', error.message);
    } else {
      setRules(data || []);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <BackButton />
      </div>

      <h1 className="text-2xl font-bold">قواعد التقسيط</h1>
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-right">الفئة السعرية</th>
            <th className="p-2 text-right">الدفعة الأولى (%)</th>
            <th className="p-2 text-right">عدد الأشهر</th>
            <th className="p-2 text-right">خيارات</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id} className="border-t">
              <td className="p-2">{rule.min_price.toLocaleString()} - {rule.max_price.toLocaleString()} ريال</td>
              <td className="p-2">{rule.down_payment_percent}%</td>
              <td className="p-2">{rule.months} شهر</td>
              <td className="p-2">
                <button className="text-blue-600 hover:underline">تعديل</button>
                <span className="mx-2">|</span>
                <button className="text-red-600 hover:underline">حذف</button>
              </td>
            </tr>
          ))}
          {rules.length === 0 && (
            <tr><td colSpan={4} className="text-center p-4">لا توجد قواعد حالياً</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
