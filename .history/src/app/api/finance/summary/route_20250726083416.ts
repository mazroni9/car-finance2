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
    
    // جلب بيانات installment_rules من قاعدة البيانات
    const { data, error } = await supabase
      .from('installment_rules')
      .select(`
        monthly_installment,
        quantity,
        annual_income,
        total_purchase_cost,
        total_profit_full_period,
        roi_full_period,
        roi_annual,
        annual_profit_before_costs,
        down_payment_value,
        last_payment_value
      `);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to fetch data from DB', details: error.message }, { status: 500 });
    }
    if (!data || !Array.isArray(data)) {
      console.error('No data returned from Supabase');
      return NextResponse.json({ error: 'No data returned from DB' }, { status: 500 });
    }

    // حساب إجمالي عدد السيارات من قاعدة البيانات
    const totalCarsCount = data.reduce((sum, row) => sum + (row.quantity || 0), 0);

    const total_monthly_installments = data.reduce(
      (sum, row) => sum + (row.monthly_installment || 0) * (row.quantity || 0),
      0
    );

    const total_annual_income = data.reduce(
      (sum, row) => sum + (row.annual_income || 0),
      0
    );

    const total_purchase_cost = data.reduce(
      (sum, row) => sum + (row.total_purchase_cost || 0),
      0
    );

    const total_profit_full_period = data.reduce(
      (sum, row) => sum + (row.total_profit_full_period || 0),
      0
    );

    const avg_roi_full_period = data.reduce(
      (sum, row) => sum + (row.roi_full_period || 0),
      0
    ) / data.length;

    const avg_roi_annual = data.reduce(
      (sum, row) => sum + (row.roi_annual || 0),
      0
    ) / data.length;

    const total_annual_profit_before_costs = data.reduce(
      (sum, row) => sum + (row.annual_profit_before_costs || 0),
      0
    );

    const total_down_payment = data.reduce(
      (sum, row) => sum + (row.down_payment_value || 0) * (row.quantity || 0),
      0
    );

    const total_last_payment = data.reduce(
      (sum, row) => sum + (row.last_payment_value || 0) * (row.quantity || 0),
      0
    );

    // حساب إجمالي الدفعات الأخيرة لكل العقود
    const total_last_payment_all_contracts = data.reduce(
      (sum, row) => sum + (row.last_payment_value || 0) * (row.quantity || 0),
      0
    );

    // حساب إجمالي رسوم الخدمة (نفس قيمة الدفعة الأولى)
    const total_service_fees = total_down_payment;

return NextResponse.json({
  total_monthly_installments,
  total_annual_income,
  total_purchase_cost,
  total_profit_full_period,
  avg_roi_full_period,
  avg_roi_annual,
  total_annual_profit_before_costs,
  total_down_payment,
  total_last_payment,
  total_last_payment_all_contracts,
  total_service_fees,
  leased_cars_count: totalCarsCount
});

  } catch (e) {
    console.error('Server error:', e);
    return NextResponse.json({ error: 'Internal Server Error', details: e instanceof Error ? e.message : e }, { status: 500 });
  }
}
