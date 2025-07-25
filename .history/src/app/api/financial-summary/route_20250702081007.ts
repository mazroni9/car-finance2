import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = createClient();

    // قم بجلب البيانات من قاعدة البيانات
    const { data, error } = await supabase
      .from('financial_summary')
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    // إذا لم نجد بيانات، نرجع بيانات افتراضية للتجربة
    if (!data) {
      return NextResponse.json({
        total_monthly_installments: 0,
        total_annual_income: 0,
        total_purchase_cost: 0,
        total_profit_full_period: 0,
        avg_roi_full_period: 0,
        avg_roi_annual: 0,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial summary' },
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
