import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient();

    console.log('Fetching financial summary...');
    const { data, error } = await supabase
      .rpc('get_financial_summary');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch summary', details: error.message },
        { status: 500 }
      );
    }

    if (!data) {
      console.log('No data found');
      return NextResponse.json({
        total_annual_profit_before_costs: 0
      });
    }

    console.log('Received summary:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 