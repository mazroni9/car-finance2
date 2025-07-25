import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic'; // لمنع التخزين المؤقت
export const revalidate = 0; // تعطيل التخزين المؤقت نهائياً

export async function GET() {
  const supabase = createClient();
  console.log('Fetching financial summary...');

  try {
    // جلب العروض الفعلية من جدول installment_offers
    const { data: offers, error } = await supabase
      .from('installment_offers')
      .select(`
        id,
        car_price,
        selected_term,
        applied_profit_rate,
        total_profit,
        final_price,
        monthly_payment
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching installment offers:', error);
      throw error;
    }

    console.log('Fetched installment offers:', offers?.length || 0, 'records');

    // إذا لم نجد بيانات، نرجع بيانات افتراضية
    if (!offers || offers.length === 0) {
      console.log('No offers found, returning default values');
      return NextResponse.json({
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_purchase_cost: 0,
        total_profit_full_period: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0,
      });
    }

    // حساب الملخص المالي من العروض
    const summary = offers.reduce((acc, offer) => {
      const monthlyPayment = Number(offer.monthly_payment) || 0;
      const carPrice = Number(offer.car_price) || 0;
      const totalProfit = Number(offer.total_profit) || 0;
      const term = Number(offer.selected_term) || 12;
      const roi = carPrice > 0 ? totalProfit / carPrice : 0;
      const annualRoi = roi / (term / 12);

      return {
        total_monthly_installments: acc.total_monthly_installments + monthlyPayment,
        total_annual_income: acc.total_annual_income + (monthlyPayment * 12),
        total_purchase_cost: acc.total_purchase_cost + carPrice,
        total_profit_full_period: acc.total_profit_full_period + totalProfit,
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
    const offerCount = offers.length;
    summary.avg_roi_full_period = summary.avg_roi_full_period / offerCount;
    summary.avg_roi_annual = summary.avg_roi_annual / offerCount;

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
