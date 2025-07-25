import { createClient } from '@supabase/supabase-js';
import CarFinanceTable from '@/components/CarFinanceTable';

export default async function CarFinancePage() {
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
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">❌ خطأ في جلب البيانات</h1>
        <p>{error.message}</p>
      </div>
    );
  }

  return <CarFinanceTable data={data ?? []} />;
}
