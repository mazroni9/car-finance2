import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic'; // لمنع التخزين المؤقت

export async function GET() {
  const supabase = createClient();
  console.log('Fetching financial summary...');

  try {
    // جلب قواعد التقسيط
    const { data: installmentRules, error } = await supabase
      .from('installment_rules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching installment rules:', error);
      throw error;
    }

    console.log('Fetched installment rules:', installmentRules?.length || 0, 'records');

    // إذا لم نجد بيانات، نرجع بيانات افتراضية
    if (!installmentRules || installmentRules.length === 0) {
      console.log('No installment rules found, returning default values');
      return NextResponse.json({
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_purchase_cost: 0,
        total_profit_full_period: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0,
      });
    }

    // حساب الملخص المالي من قواعد التقسيط
    const summary = installmentRules.reduce((acc, rule) => {
      const monthlyInstallment = rule.monthly_payment || 0;
      const purchaseCost = rule.car_price || 0;
      const installmentPeriod = rule.installment_period || 0;
      const downPaymentPercentage = rule.down_payment_percentage || 0;
      const downPayment = purchaseCost * (downPaymentPercentage / 100);
      const financedAmount = purchaseCost - downPayment;
      const totalPayments = monthlyInstallment * installmentPeriod;
      const profit = totalPayments - financedAmount;
      const roi = financedAmount > 0 ? profit / financedAmount : 0;
      const annualRoi = roi / (installmentPeriod / 12);

      return {
        total_monthly_installments: acc.total_monthly_installments + monthlyInstallment,
        total_annual_income: acc.total_annual_income + (monthlyInstallment * 12),
        total_purchase_cost: acc.total_purchase_cost + purchaseCost,
        total_profit_full_period: acc.total_profit_full_period + profit,
        avg_roi_full_period: acc.avg_roi_full_period + roi,
        avg_roi_annual: acc.avg_roi_annual + annualRoi,
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
    const ruleCount = installmentRules.length;
    summary.avg_roi_full_period = summary.avg_roi_full_period / ruleCount;
    summary.avg_roi_annual = summary.avg_roi_annual / ruleCount;

    console.log('Calculated summary:', summary);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('Error calculating financial summary:', error);
    return NextResponse.json(
      { error: 'Failed to calculate financial summary' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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
