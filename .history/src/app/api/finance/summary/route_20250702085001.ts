import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient();

    console.log('Fetching financial summary...');
    const { data, error } = await supabase
      .from('installment_rules')
      .select(`
        total_monthly_installments,
        annual_income,
        total_purchase_cost,
        total_profit_full_period,
        roi_full_period,
        roi_annual
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch summary', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.log('No data found');
      return NextResponse.json({
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_purchase_cost: 0,
        total_profit_full_period: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0,
      });
    }

    // حساب المجاميع
    const summary = data.reduce((acc, rule) => ({
      total_monthly_installments: acc.total_monthly_installments + (Number(rule.total_monthly_installments) || 0),
      total_annual_income: acc.total_annual_income + (Number(rule.annual_income) || 0),
      total_purchase_cost: acc.total_purchase_cost + (Number(rule.total_purchase_cost) || 0),
      total_profit_full_period: acc.total_profit_full_period + (Number(rule.total_profit_full_period) || 0),
      avg_roi_full_period: acc.avg_roi_full_period + (Number(rule.roi_full_period) || 0),
      avg_roi_annual: acc.avg_roi_annual + (Number(rule.roi_annual) || 0),
    }), {
      total_monthly_installments: 0,
      total_annual_income: 0,
      total_purchase_cost: 0,
      total_profit_full_period: 0,
      avg_roi_full_period: 0,
      avg_roi_annual: 0,
    });

    // حساب المتوسطات
    const count = data.length;
    if (count > 0) {
      summary.avg_roi_full_period = summary.avg_roi_full_period / count;
      summary.avg_roi_annual = summary.avg_roi_annual / count;
    }

    console.log('Calculated summary:', summary);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 