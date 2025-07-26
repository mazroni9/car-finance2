import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic'; // لمنع التخزين المؤقت
export const revalidate = 0; // تعطيل التخزين المؤقت نهائياً

interface FinancialSummary {
  total_monthly_installments: number;
  total_annual_income: number;
  total_purchase_cost: number;
  total_profit_full_period: number;
  avg_roi_full_period: number;
  avg_roi_annual: number;
  total_down_payments: number;
  total_last_payments: number;
  total_annual_profit_before_costs: number;
}

export async function GET() {
  console.log('Starting financial summary API request...');
  
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient();

    console.log('Fetching summary data...');
    const { data: summary, error } = await supabase
      .rpc('get_financial_summary')
      .single() as { data: FinancialSummary | null, error: any };

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    if (!summary) {
      console.log('No data found, returning defaults');
      const defaultSummary: FinancialSummary = {
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_purchase_cost: 0,
        total_profit_full_period: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0,
        total_down_payments: 0,
        total_last_payments: 0,
        total_annual_profit_before_costs: 0
      };
      return NextResponse.json(defaultSummary);
    }

    // تحويل البيانات إلى الشكل المطلوب
    const formattedSummary: FinancialSummary = {
      total_monthly_installments: Number(summary.total_monthly_installments) || 0,
      total_annual_income: Number(summary.total_annual_income) || 0,
      total_purchase_cost: Number(summary.total_purchase_cost) || 0,
      total_profit_full_period: Number(summary.total_profit_full_period) || 0,
      avg_roi_full_period: Number(summary.avg_roi_full_period) || 0,
      avg_roi_annual: Number(summary.avg_roi_annual) || 0,
      total_down_payments: Number(summary.total_down_payments) || 0,
      total_last_payments: Number(summary.total_last_payments_per_year) || 0,
      total_annual_profit_before_costs: Number(summary.total_annual_profit_before_costs) || 0
    };

    console.log('Final summary:', formattedSummary);
    return NextResponse.json(formattedSummary);
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
