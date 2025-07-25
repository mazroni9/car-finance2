import { NextResponse } from 'next/server';
import { queryTable } from '@/lib/db';
import { Database } from '@/types/supabase';

type FinanceEntry = Database['public']['Tables']['financial_entries']['Row'];

export async function GET() {
  try {
    const financeData = await queryTable<FinanceEntry>('financial_entries', {
      orderBy: { column: 'created_at', ascending: false }
    });

    return NextResponse.json({ success: true, data: financeData });
  } catch (error) {
    console.error('Error fetching finance data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'حدث خطأ غير متوقع في السيرفر',
        details: error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
