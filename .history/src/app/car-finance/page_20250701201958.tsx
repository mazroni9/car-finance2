'use client';

import { createClient } from '@supabase/supabase-js';
import CarFinanceTable from './components/CarFinanceTable';
import { InstallmentRule } from './types';

export const dynamic = "force-dynamic";

export default async function CarFinanceListPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

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

  // ✅ تجميع البيانات المتكررة
  const grouped = new Map<string, InstallmentRule>();
  data?.forEach((item: InstallmentRule) => {
    const key = `${item.price_category}|${item.duration_months}|${item.down_payment_percent}|${item.last_payment_percent}`;
    if (!grouped.has(key)) {
      grouped.set(key, { ...item });
    } else {
      const existing = grouped.get(key);
      if (existing) {
        existing.quantity += item.quantity;
      }
    }
  });

  // ✅ حساب الأعمدة المشتقة مرة واحدة
  const rows = Array.from(grouped.values()).map(item => {
    const downPaymentValue = item.price_category * item.down_payment_percent;
    const lastPaymentValue = item.price_category * item.last_payment_percent;

    const financedAmount = item.price_category - downPaymentValue - lastPaymentValue;
    const profitPerCar = financedAmount * item.profit_target_percent;
    const salePrice = financedAmount + profitPerCar;

    const monthlyInstallment = salePrice / item.duration_months;
    const totalMonthlyIncome = monthlyInstallment * item.quantity;
    const totalProfit = profitPerCar * item.quantity;

    return {
      ...item,
      downPaymentValue,
      lastPaymentValue,
      financedAmount,
      profitPerCar,
      salePrice,
      monthlyInstallment,
      totalMonthlyIncome,
      totalProfit
    };
  });

  return <CarFinanceTable rows={rows} />;
}
