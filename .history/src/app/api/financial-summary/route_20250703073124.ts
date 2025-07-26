import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic'; // لمنع التخزين المؤقت
export const revalidate = 0; // تعطيل التخزين المؤقت نهائياً

export async function GET() {
  console.log('Starting financial summary API request...');
  
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient();

    console.log('Fetching data from installment_rules table...');
    const { data: rules, error } = await supabase
      .from('installment_rules')
      .select(`
        id,
        quantity,
        monthly_income,
        annual_income,
        possible_purchase_amount,
        profit_value,
        roi_full_period,
        roi_annual,
        annual_profit_before_costs,
        down_payment_value,
        last_payment_value,
        duration_months,
        total_profit_full_period,
        total_purchase_cost
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    console.log('Raw data from database:', rules);

    if (!rules || rules.length === 0) {
      console.log('No data found, returning defaults');
      return NextResponse.json({
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_purchase_cost: 0,
        total_profit_full_period: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0,
        total_annual_profit_before_costs: 0,
        total_down_payments: 0,
        total_last_payments_per_year: 0
      });
    }

    console.log('Processing', rules.length, 'records');
    
    // حساب الملخص المالي
    const summary = rules.reduce((acc, rule) => {
      try {
        const quantity = Number(rule.quantity) || 1;
        const monthlyIncome = Number(rule.monthly_income) || 0;
        const annualIncome = Number(rule.annual_income) || 0;
        const purchaseCost = Number(rule.possible_purchase_amount) || 0;
        const profitFullPeriod = Number(rule.total_profit_full_period) || 0;
        const roiFullPeriod = Number(rule.roi_full_period) || 0;
        const roiAnnual = Number(rule.roi_annual) || 0;
        const annualProfitBeforeCosts = Number(rule.annual_profit_before_costs) || 0;
        const downPaymentValue = Number(rule.down_payment_value) || 0;
        const lastPaymentValue = Number(rule.last_payment_value) || 0;
        const durationMonths = Number(rule.duration_months) || 12;

        // حساب عدد الدفعات الأخيرة في السنة الواحدة
        const lastPaymentsPerYear = (12 / durationMonths) * lastPaymentValue;

        console.log('Processing rule:', {
          quantity,
          monthlyIncome,
          annualIncome,
          purchaseCost,
          profitFullPeriod,
          roiFullPeriod,
          roiAnnual,
          annualProfitBeforeCosts,
          downPaymentValue,
          lastPaymentValue,
          lastPaymentsPerYear
        });

        return {
          total_monthly_installments: acc.total_monthly_installments + (monthlyIncome * quantity),
          total_annual_income: acc.total_annual_income + (annualIncome * quantity),
          total_purchase_cost: acc.total_purchase_cost + (purchaseCost * quantity),
          total_profit_full_period: acc.total_profit_full_period + (profitFullPeriod * quantity),
          total_annual_profit_before_costs: acc.total_annual_profit_before_costs + (annualProfitBeforeCosts * quantity),
          total_down_payments: acc.total_down_payments + (downPaymentValue * quantity),
          total_last_payments_per_year: acc.total_last_payments_per_year + (lastPaymentsPerYear * quantity),
          avg_roi_full_period: acc.avg_roi_full_period + roiFullPeriod,
          avg_roi_annual: acc.avg_roi_annual + roiAnnual,
        };
      } catch (err) {
        console.error('Error processing rule:', rule, err);
        return acc;
      }
    }, {
      total_monthly_installments: 0,
      total_annual_income: 0,
      total_purchase_cost: 0,
      total_profit_full_period: 0,
      total_annual_profit_before_costs: 0,
      total_down_payments: 0,
      total_last_payments_per_year: 0,
      avg_roi_full_period: 0,
      avg_roi_annual: 0,
    });

    const ruleCount = rules.length;
    summary.avg_roi_full_period = summary.avg_roi_full_period / ruleCount;
    summary.avg_roi_annual = summary.avg_roi_annual / ruleCount;

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
