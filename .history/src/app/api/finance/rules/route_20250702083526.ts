import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    console.log('Creating Supabase client...');
    const supabase = createClient();

    console.log('Fetching installment rules...');
    const { data, error } = await supabase
      .from('installment_rules')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch rules', details: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.log('No rules found');
      return NextResponse.json([]);
    }

    console.log(`Found ${data.length} rules`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 