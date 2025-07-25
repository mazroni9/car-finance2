import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = createClient();

    // استعلام SQL للتجميع
    const { data, error } = await supabase
      .from('installment_rules')
      .select(`
        sum_down_payment_value:down_payment_value,
        sum_last_payment_value:last_payment_value,
        sum_monthly_installment:monthly_installment,
        sum_quantity:quantity,
        sum_annual_profit_before_costs:annual_profit_before_costs
      `);

    if (error) {
      console.error('Database error:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return Response.json({
        total_down_payment: 0,
        total_last_payment: 0,
        total_monthly_installments: 0,
        total_annual_profit_before_costs: 0,
        total_annual_income: 0,
        total_profit_full_period: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0
      });
    }

    // احسب الإجماليات المطلوبة
    const total_down_payment = data.reduce((a, r) => a + (r.sum_down_payment_value || 0), 0);
    const total_last_payment = data.reduce((a, r) => a + (r.sum_last_payment_value || 0), 0);
    const total_monthly_installments = data.reduce((a, r) => a + ((r.sum_monthly_installment || 0) * (r.sum_quantity || 1)), 0);
    const total_annual_profit_before_costs = data.reduce((a, r) => a + (r.sum_annual_profit_before_costs || 0), 0);

    // حساب القيم الإضافية
    const total_annual_income = total_monthly_installments * 12;
    const total_profit_full_period = total_annual_income + total_down_payment + total_last_payment;
    
    // حساب معدلات العائد
    const total_cost = data.reduce((a, r) => a + ((r.sum_monthly_installment || 0) * (r.sum_quantity || 1)), 0);
    const avg_roi_full_period = total_cost > 0 ? (total_profit_full_period / total_cost) : 0;
    const avg_roi_annual = total_cost > 0 ? (total_annual_income / total_cost) : 0;

    const totals = {
      total_down_payment,
      total_last_payment,
      total_monthly_installments,
      total_annual_profit_before_costs,
      total_annual_income,
      total_profit_full_period,
      avg_roi_full_period,
      avg_roi_annual
    };

    return Response.json(totals);
  } catch (error) {
    console.error('Unexpected error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 