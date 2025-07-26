import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabaseClient';
import { handleBuy } from '@/lib/services/handleBuy';

export async function POST(request: Request) {
  try {
    const { carId, userId, amount } = await request.json();

    const result = await handleBuy({ carId, userId, amount });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in buy route:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء معالجة عملية الشراء' },
      { status: 500 }
    );
  }
} 