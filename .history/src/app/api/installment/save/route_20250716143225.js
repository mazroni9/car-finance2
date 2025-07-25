import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function getProfitPercent(months) {
  switch (months) {
    case 12: return 0.30;
    case 18: return 0.40;
    case 24: return 0.50;
    case 30: return 0.55;
    case 36: return 0.60;
    case 42: return 0.65;
    default: return 0.30;
  }
}

export async function POST(request) {
  const body = await request.json();
  const {
    price_category,
    duration_months,
    quantity = 1,
    down_payment_percent,
    last_payment_percent
  } = body;

  // تحقق من النسب
  if (
    down_payment_percent < 0 || down_payment_percent > 1 ||
    last_payment_percent < 0 || last_payment_percent > 1
  ) {
    return Response.json({ error: '❌ النسب يجب أن تكون بين 0 و 1' }, { status: 400 });
  }

  // حساب القيم المطلوبة
  const profit_target_percent = getProfitPercent(duration_months);
  const down_payment_value = price_category * down_payment_percent;
  const last_payment_value = price_category * last_payment_percent;
  const total_sale_price = price_category * (1 + profit_target_percent);
  const remaining_amount = total_sale_price - down_payment_value - last_payment_value;
  const monthly_installment = remaining_amount / duration_months;
  const possible_purchase_amount = price_category * quantity;
  const tracking_cost = quantity * 25;
  const guarantee_contract_cost = quantity * 50;
  const inspection_cost = quantity * 300;
  const profit_per_car = total_sale_price - price_category;

  // تجهيز البيانات للإدخال (جميع الأعمدة المطلوبة)
  const insertData = {
    price_category,
    duration_months,
    profit_target_percent,
    down_payment_percent,
    last_payment_percent,
    down_payment_value,
    last_payment_value,
    total_sale_price,
    remaining_amount,
    quantity,
    monthly_installment,
    possible_purchase_amount,
    tracking_cost,
    guarantee_contract_cost,
    inspection_cost,
    profit_per_car
  };

  // طباعة القيم في اللوغ
  console.log('✅ البيانات المرسلة إلى Supabase:', insertData);

  const { data, error } = await supabase
    .from('installment_rules')
    .insert([insertData]);

  if (error) {
    console.error('❌ Supabase Insert Error:', error);
    return Response.json({ error: error.details || error.message }, { status: 500 });
  }

  return Response.json({ data });
}
