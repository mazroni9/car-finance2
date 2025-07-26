import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FinancialSummary {
  total_monthly_installments: number | null;
  total_annual_income: number | null;
  total_down_payments: number | null;
  total_last_payments_per_year: number | null;
  total_annual_profit_before_costs: number | null;
  total_profit_full_period: number | null;
  avg_roi_full_period: number | null;
  avg_roi_annual: number | null;
}

export async function GET() {
  const { data, error } = await supabase
    .from('installment_rules')
    .select(`
      total_monthly_installments:sum(monthly_installment * quantity),
      total_annual_income:sum(monthly_installment * 12 * quantity),
      total_down_payments:sum(down_payment_value * quantity),
      total_last_payments_per_year:sum((12.0 / term_months) * last_payment_value * quantity),
      total_annual_profit_before_costs:sum(annual_profit_before_costs * quantity),
      total_profit_full_period:sum((monthly_installment * term_months + down_payment_value + last_payment_value) * quantity - (car_price * quantity)),
      avg_roi_full_period:avg((monthly_installment * term_months + down_payment_value + last_payment_value - car_price) / car_price),
      avg_roi_annual:avg((monthly_installment * 12 - car_price) / car_price)
    `)
    .single() as unknown as { data: FinancialSummary | null, error: any };

  if (error) {
    console.error('❌ Supabase Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // ✅ الترجمة إلى الأسماء التي تنتظرها الواجهة
  return NextResponse.json({
    total_monthly_installments: data?.total_monthly_installments || 0,
    total_annual_income: data?.total_annual_income || 0,
    total_down_payment: data?.total_down_payments || 0,
    total_last_payment: data?.total_last_payments_per_year || 0,
    total_annual_profit_before_costs: data?.total_annual_profit_before_costs || 0,
    total_profit_full_period: data?.total_profit_full_period || 0,
    avg_roi_full_period: data?.avg_roi_full_period || 0,
    avg_roi_annual: data?.avg_roi_annual || 0
  });
} 