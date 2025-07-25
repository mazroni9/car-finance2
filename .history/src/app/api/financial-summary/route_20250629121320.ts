import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';

interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  period: string;
}

export async function GET(): Promise<NextResponse<FinancialSummary>> {
  try {
    const [entries, expenses] = await Promise.all([
      supabase
        .from('financial_entries')
        .select('amount')
        .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      supabase
        .from('finance_expenses')
        .select('amount')
        .gt('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    if (entries.error) throw entries.error;
    if (expenses.error) throw expenses.error;

    const totalIncome = entries.data?.reduce((sum, entry) => sum + (entry.amount || 0), 0) || 0;
    const totalExpenses = expenses.data?.reduce((sum, expense) => sum + (expense.amount || 0), 0) || 0;

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      netIncome: totalIncome - totalExpenses,
      period: '30 days'
    });
  } catch (error) {
    console.error('Error fetching financial summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch financial summary' } as any,
      { status: 500 }
    );
  }
} 