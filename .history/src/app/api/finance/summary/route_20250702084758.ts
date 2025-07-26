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
      .rpc('get_financial_summary');

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

    const summary = {
      total_monthly_installments: Number(data[0].total_monthly_installments) || 0,
      total_annual_income: Number(data[0].total_annual_income) || 0,
      total_purchase_cost: Number(data[0].total_purchase_cost) || 0,
      total_profit_full_period: Number(data[0].total_profit_full_period) || 0,
      avg_roi_full_period: Number(data[0].avg_roi_full_period) || 0,
      avg_roi_annual: Number(data[0].avg_roi_annual) || 0,
    };

    console.log('Fetched summary:', summary);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 