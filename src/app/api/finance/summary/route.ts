import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
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
      return NextResponse.json({ error: 'Failed to fetch data from DB' }, { status: 500 });
    }

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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
