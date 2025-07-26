import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabaseClient';
import { fetchTransactions } from '@/lib/services/fetchTransactions';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    const transactions = await fetchTransactions(userId);
    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error in transactions route:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب المعاملات' },
      { status: 500 }
    );
  }
} 