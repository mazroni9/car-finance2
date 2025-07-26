import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic'; // لمنع التخزين المؤقت
export const revalidate = 0; // تعطيل التخزين المؤقت نهائياً

export async function GET() {
  console.log('Starting financial summary API request...');
  
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient();

    console.log('Fetching summary data...');
    const { data: summary, error } = await supabase
      .rpc('get_financial_summary')
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    if (!summary) {
      console.log('No data found, returning defaults');
      return NextResponse.json({
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_purchase_cost: 0,
        total_profit_full_period: 0,
        total_annual_profit_before_costs: 0,
        total_down_payments: 0,
        total_last_payments_per_year: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0
      });
    }

    console.log('Final summary:', summary);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Unexpected error in financial summary API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { error } = await supabase
      .from('finance_models')
      .insert(body);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating finance model:', error);
    return NextResponse.json(
      { error: 'Failed to create finance model' },
      { status: 500 }
    );
  }
}
