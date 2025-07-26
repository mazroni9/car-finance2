import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();

    // جلب جميع نماذج التمويل
    const { data: financeModels, error } = await supabase
      .from('finance_models')
      .select('*');

    if (error) {
      throw error;
    }

    // إذا لم نجد بيانات، نرجع بيانات افتراضية
    if (!financeModels || financeModels.length === 0) {
      return NextResponse.json({
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_purchase_cost: 0,
        total_profit_full_period: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0,
      });
    }

    // حساب الملخص المالي
    const summary = financeModels.reduce((acc, model) => {
      const monthlyInstallment = model.monthly_installment || 0;
      const purchaseCost = model.car_price || 0;
      const totalPayments = monthlyInstallment * (model.installment_period || 0);
      const profit = totalPayments - purchaseCost;
      const roi = purchaseCost > 0 ? profit / purchaseCost : 0;
      const annualRoi = roi / (model.installment_period || 12) * 12;

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
    const modelCount = financeModels.length;
    summary.avg_roi_full_period = summary.avg_roi_full_period / modelCount;
    summary.avg_roi_annual = summary.avg_roi_annual / modelCount;

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
