import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Environment variables missing:', {
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
      });
      return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
    }

    // جلب البيانات من جدول installment_rules
    const { data: installmentRules, error: rulesError } = await supabase
      .from('installment_rules')
      .select('*');

    if (rulesError) {
      console.error('Supabase error:', rulesError);
      return NextResponse.json({ error: 'Failed to fetch installment rules', details: rulesError.message }, { status: 500 });
    }

    // جلب البيانات من جدول financing_requests
    const { data: financingRequests, error: requestsError } = await supabase
      .from('financing_requests')
      .select('*');

    if (requestsError) {
      console.error('Supabase error:', requestsError);
      return NextResponse.json({ error: 'Failed to fetch financing requests', details: requestsError.message }, { status: 500 });
    }

    // جلب البيانات من جدول car_showcase لحساب تكلفة الشراء
    const { data: cars, error: carsError } = await supabase
      .from('car_showcase')
      .select('price');

    if (carsError) {
      console.error('Supabase error:', carsError);
      return NextResponse.json({ error: 'Failed to fetch cars data', details: carsError.message }, { status: 500 });
    }

    // حساب الملخص المالي
    const total_monthly_installments = financingRequests?.reduce(
      (sum, request) => sum + (request.monthly_payment || 0),
      0
    ) || 0;

    const total_annual_income = total_monthly_installments * 12;

    const total_purchase_cost = cars?.reduce(
      (sum, car) => sum + (car.price || 0),
      0
    ) || 0;

    const total_down_payment = financingRequests?.reduce(
      (sum, request) => sum + (request.down_payment || 0),
      0
    ) || 0;

    const total_last_payment = financingRequests?.reduce(
      (sum, request) => sum + (request.final_payment || 0),
      0
    ) || 0;

    // حساب الربح (مثال بسيط)
    const total_profit_full_period = total_annual_income - total_purchase_cost;
    const avg_roi_full_period = total_purchase_cost > 0 ? (total_profit_full_period / total_purchase_cost) : 0;
    const avg_roi_annual = avg_roi_full_period / 12;
    const total_annual_profit_before_costs = total_profit_full_period;

    return NextResponse.json({
      total_monthly_installments,
      total_annual_income,
      total_purchase_cost,
      total_profit_full_period,
      avg_roi_full_period,
      avg_roi_annual,
      total_annual_profit_before_costs,
      total_down_payment,
      total_last_payment
    });

  } catch (e) {
    console.error('Server error:', e);
    return NextResponse.json({ error: 'Internal Server Error', details: e instanceof Error ? e.message : e }, { status: 500 });
  }
}
