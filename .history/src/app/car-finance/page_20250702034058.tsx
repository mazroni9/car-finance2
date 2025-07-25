'use client';

import { createClient } from '@supabase/supabase-js';
import CarFinanceTable from './components/CarFinanceTable';
import FinanceSummary from './components/FinanceSummary';
import { InstallmentRule, FinanceSummaryResult } from './types';

export const dynamic = "force-dynamic";

export default async function CarFinanceListPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // ✅ جلب كل صفوف الجدول مباشرة
  const { data: rows, error } = await supabase
    .from('installment_rules')
    .select(`
      id,
      price_category,
      duration_months,
      profit_target_percent,
      down_payment_percent,
      last_payment_percent,
      quantity,
      monthly_installment,
      annual_income,
      total_purchase_cost,
      total_profit_full_period,
      roi_full_period,
      roi_annual
    `)
    .order('price_category', { ascending: true });

  if (error) {
    console.error('Supabase fetch error:', error);
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
          ❌ خطأ في جلب البيانات
        </h1>
        <p className="text-center text-gray-700">{error.message}</p>
      </div>
    );
  }

  // ✅ جلب الملخص من الـ RPC
  const { data: summary, error: summaryError } = await supabase
    .rpc('finance_summary_function')
    .single();

  if (summaryError) {
    console.error('Supabase summary RPC error:', summaryError);
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 حسابات تمويل السيارات</h1>
      <CarFinanceTable rows={rows as InstallmentRule[]} />
      {summary && <FinanceSummary summary={summary as FinanceSummaryResult} />}
    </div>
  );
}
