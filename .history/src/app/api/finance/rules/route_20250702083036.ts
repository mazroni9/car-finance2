import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  console.log('Fetching finance rules...');
  
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('installment_rules')
      .select('*')
      .order('price_category', { ascending: true });

    if (error) {
      console.error('Error fetching finance rules:', error);
      return NextResponse.json(
        { error: 'Failed to fetch finance rules', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in finance rules API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 