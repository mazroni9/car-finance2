import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select(`
        id,
        user_id,
        plan_type,
        approved_amount,
        status,
        start_date,
        end_date,
        created_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
