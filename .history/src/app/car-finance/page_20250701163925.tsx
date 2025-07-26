import { createClient } from '@supabase/supabase-js';
import CarFinanceTable from './CarFinanceTable';

interface InstallmentRule {
  id: number;
  price_category: number;
  duration_months: number;
  down_payment_percent: number;
  last_payment_percent: number;
  quantity: number;
  profit_value: number;
  monthly_income: number;
  profit_target_percent: number;
}

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CarFinanceListPage() {
  const { data, error } = await supabase
    .from('installment_rules')
    .select('*')
    .order('price_category', { ascending: true });

  if (error) {
    console.error('Supabase fetch error:', error);
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-red-600">
          ❌ خطأ في جلب البيانات
        </h1>
        <p className="text-center text-gray-700">{error.message}</p>
      </div>
    );
  }

  // ✅ تجميع البيانات وحساب الأعمدة
  const grouped = new Map<string, InstallmentRule>();
  data?.forEach((item: InstallmentRule) => {
    const key = `${item.price_category}|${item.duration_months}|${item.down_payment_percent}|${item.last_payment_percent}`;
    if (!grouped.has(key)) {
      grouped.set(key, { ...item });
    } else {
      const existing = grouped.get(key);
      if (existing) {
        existing.quantity += item.quantity;
        existing.profit_value += item.profit_value;
        existing.monthly_income += item.monthly_income;
      }
    }
  });

  const rows = Array.from(grouped.values());

  return <CarFinanceTable rows={rows} />;
}
