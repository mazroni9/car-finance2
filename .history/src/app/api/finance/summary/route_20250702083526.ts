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
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch rules', details: error.message },
        { status: 500 }
      );
    }

    if (!rules || rules.length === 0) {
      console.log('No rules found');
      return NextResponse.json({
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_purchase_cost: 0,
        total_profit_full_period: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0,
      });
    }

    console.log(`Found ${rules.length} rules, calculating summary...`);

    // حساب الملخص المالي
    const summary = rules.reduce((acc, rule) => {
      const quantity = Number(rule.quantity) || 1;
      const monthlyIncome = Number(rule.monthly_income) || 0;
      const annualIncome = Number(rule.annual_income) || 0;
      const purchaseCost = Number(rule.possible_purchase_amount) || 0;
      const profitValue = Number(rule.profit_value) || 0;
      const roiFullPeriod = Number(rule.roi_full_period) || 0;
      const roiAnnual = Number(rule.roi_annual) || 0;

      return {
        total_monthly_installments: acc.total_monthly_installments + (monthlyIncome * quantity),
        total_annual_income: acc.total_annual_income + (annualIncome * quantity),
        total_purchase_cost: acc.total_purchase_cost + (purchaseCost * quantity),
        total_profit_full_period: acc.total_profit_full_period + (profitValue * quantity),
        avg_roi_full_period: acc.avg_roi_full_period + (roiFullPeriod * quantity),
        avg_roi_annual: acc.avg_roi_annual + (roiAnnual * quantity),
      };
    }, {
      total_monthly_installments: 0,
      total_annual_income: 0,
      total_purchase_cost: 0,
      total_profit_full_period: 0,
      avg_roi_full_period: 0,
      avg_roi_annual: 0,
    });

    // حساب المتوسطات
    const totalQuantity = rules.reduce((sum, rule) => sum + (Number(rule.quantity) || 1), 0);
    summary.avg_roi_full_period = summary.avg_roi_full_period / totalQuantity;
    summary.avg_roi_annual = summary.avg_roi_annual / totalQuantity;

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