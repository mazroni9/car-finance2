import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient();

    console.log('Fetching installment rules...');
    const { data: rules, error } = await supabase
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
        roi_annual,
        created_at
      `)
      .order('price_category', { ascending: true })
      .order('duration_months', { ascending: true });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch rules', details: error.message },
        { status: 500 }
      );
    }

    if (!rules || rules.length === 0) {
      console.log('No rules found');
      return NextResponse.json([]);
    }

    console.log(`Found ${rules.length} rules`);
    return NextResponse.json(rules);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 