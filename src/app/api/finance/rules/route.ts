import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      console.error('Missing NEXT_PUBLIC_SUPABASE_URL');
      return NextResponse.json({ error: 'Missing Supabase URL' }, { status: 500 });
    }
    const supabase = createClient();
    const { data: rules, error } = await supabase
      .from('installment_rules')
      .select(`
        id,
        price_category,
        duration_months,
        profit_target_percent,
        down_payment_value,
        down_payment_percent,
        last_payment_value,
        last_payment_percent,
        quantity,
        monthly_installment,
        monthly_income,
        total_monthly_installments,
        annual_income,
        possible_purchase_amount,
        tracking_cost,
        guarantee_contract_cost,
        inspection_cost,
        financed_amount,
        profit_per_car,
        total_monthly_profit,
        total_profit_full_period,
        annual_profit_before_costs,
        total_purchase_cost,
        roi_full_period,
        roi_annual,
        created_at
      `)
      .order('price_category', { ascending: true })
      .order('duration_months', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch rules', details: error.message }, { status: 500 });
    }
    if (!rules || !Array.isArray(rules)) {
      console.error('No rules returned from Supabase');
      return NextResponse.json({ error: 'No rules returned from DB' }, { status: 500 });
    }
    if (rules.length === 0) {
      console.log('No rules found');
      return NextResponse.json([]);
    }
    return NextResponse.json(rules);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : error }, { status: 500 });
  }
} 