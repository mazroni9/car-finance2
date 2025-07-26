import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // البيانات الافتراضية من localStorage (نفس البيانات المستخدمة في الصفحة)
    const defaultData = [
      {
        id: 'new_1',
        profit_percent: 30,
        duration_months: 12,
        price_category: 20000,
        car_count: 1,
        first_payment_percent: 0,
        first_payment: 2000,
        last_payment: 2000,
        profit_after: 6000,
        annual_profit: 6000,
        installment_sale_price: 26000,
        monthly_installment: 1750,
        monthly_income: 1750,
        purchase_capacity: 20000,
        annual_income: 21000,
        tracking_cost: 0,
        guarantor_cost: 0,
        inspection_cost: 0,
        salary_distribution: 0,
        rent_distribution: 0,
      },
      {
        id: 'new_2',
        profit_percent: 40,
        duration_months: 24,
        price_category: 25000,
        car_count: 3,
        first_payment_percent: 0,
        first_payment: 2500,
        last_payment: 2500,
        profit_after: 10000,
        annual_profit: 5000,
        installment_sale_price: 35000,
        monthly_installment: 1250,
        monthly_income: 3750,
        purchase_capacity: 75000,
        annual_income: 45000,
        tracking_cost: 0,
        guarantor_cost: 0,
        inspection_cost: 0,
        salary_distribution: 0,
        rent_distribution: 0,
      },
      {
        id: 'new_3',
        profit_percent: 50,
        duration_months: 36,
        price_category: 30000,
        car_count: 10,
        first_payment_percent: 0,
        first_payment: 3000,
        last_payment: 3000,
        profit_after: 15000,
        annual_profit: 5000,
        installment_sale_price: 45000,
        monthly_installment: 1000,
        monthly_income: 10000,
        purchase_capacity: 300000,
        annual_income: 120000,
        tracking_cost: 0,
        guarantor_cost: 0,
        inspection_cost: 0,
        salary_distribution: 0,
        rent_distribution: 0,
      }
    ];

    // حساب إجمالي عدد السيارات من البيانات المحلية
    const totalCarsCount = defaultData.reduce((sum, row) => sum + (row.car_count || 0), 0);

    const total_monthly_installments = defaultData.reduce(
      (sum, row) => sum + (row.monthly_income || 0),
      0
    );

    const total_annual_income = defaultData.reduce(
      (sum, row) => sum + (row.annual_income || 0),
      0
    );

    const total_purchase_cost = defaultData.reduce(
      (sum, row) => sum + (row.purchase_capacity || 0),
      0
    );

    const total_profit_full_period = defaultData.reduce(
      (sum, row) => sum + (row.profit_after || 0),
      0
    );

    const avg_roi_full_period = defaultData.reduce(
      (sum, row) => sum + (row.profit_percent || 0),
      0
    ) / defaultData.length;

    const avg_roi_annual = defaultData.reduce(
      (sum, row) => sum + (row.annual_profit || 0),
      0
    ) / defaultData.length;

    const total_annual_profit_before_costs = defaultData.reduce(
      (sum, row) => sum + (row.annual_profit || 0),
      0
    );

    const total_down_payment = defaultData.reduce(
      (sum, row) => sum + (row.first_payment || 0),
      0
    );

    const total_last_payment = defaultData.reduce(
      (sum, row) => sum + (row.last_payment || 0),
      0
    );

    // حساب إجمالي الدفعات الأخيرة لكل العقود
    const total_last_payment_all_contracts = defaultData.reduce(
      (sum, row) => sum + (row.last_payment || 0),
      0
    );

    // حساب إجمالي رسوم الخدمة (نفس قيمة الدفعة الأولى)
    const total_service_fees = total_down_payment;

return NextResponse.json({
  total_monthly_installments,
  total_annual_income,
  total_purchase_cost,
  total_profit_full_period,
  avg_roi_full_period: avg_roi_full_period / 100, // تحويل النسبة المئوية إلى عشري
  avg_roi_annual: avg_roi_annual / 100, // تحويل النسبة المئوية إلى عشري
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
