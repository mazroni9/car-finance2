import { NextResponse } from 'next/server';
import supabase from '@/lib/services/supabase';
import { queryTable } from '@/lib/services/queries';
import { rateLimit } from '@/lib/rate-limit';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM financial_summaries ORDER BY created_at DESC LIMIT 1');
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'No financial summary found' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database Error:', error);
    return NextResponse.json(
      { 
        error: 'Database connection error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 