import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic'; // لمنع التخزين المؤقت
export const revalidate = 0; // تعطيل التخزين المؤقت نهائياً

export async function GET() {
  console.log('Starting financial summary API request...');
  
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient();

    console.log('Fetching data from installment_offers table...');
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
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: error.message },
        { status: 500 }
      );
    }

    console.log('Raw data from database:', offers);

    if (!offers || offers.length === 0) {
      console.log('No data found, returning defaults');
      return NextResponse.json({
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_purchase_cost: 0,
        total_profit_full_period: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0,
      });
    }

    console.log('Processing', offers.length, 'records');
    
    // حساب الملخص المالي
    const summary = offers.reduce((acc, offer) => {
      try {
        const monthlyPayment = Number(offer.monthly_payment) || 0;
        const carPrice = Number(offer.car_price) || 0;
        const totalProfit = Number(offer.total_profit) || 0;
        const term = Number(offer.selected_term) || 12;

        console.log('Processing offer:', {
          monthlyPayment,
          carPrice,
          totalProfit,
          term
        });

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
      } catch (err) {
        console.error('Error processing offer:', offer, err);
        return acc;
      }
    }, {
      total_monthly_installments: 0,
      total_annual_income: 0,
      total_purchase_cost: 0,
      total_profit_full_period: 0,
      avg_roi_full_period: 0,
      avg_roi_annual: 0,
    });

    const offerCount = offers.length;
    summary.avg_roi_full_period = summary.avg_roi_full_period / offerCount;
    summary.avg_roi_annual = summary.avg_roi_annual / offerCount;

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
