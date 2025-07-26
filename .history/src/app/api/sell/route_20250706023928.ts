import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabaseClient';
import { handleSell } from '@/lib/services/handleSell';

export async function POST(request: Request) {
  try {
    const { carId, userId, amount } = await request.json();

    const result = await handleSell({ carId, userId, amount });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in sell route:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة عملية البيع' },
      { status: 500 }
    );
  }
} 