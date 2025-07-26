import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabaseClient';
import { fetchWallet } from '@/lib/services/fetchWallet';

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

    const wallet = await fetchWallet(userId);
    return NextResponse.json(wallet);
  } catch (error) {
    console.error('Error in wallet route:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء جلب معلومات المحفظة' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId, amount, type } = await request.json();

    if (!userId || !amount || !type) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('wallets')
      .update({ balance: amount })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in wallet route:', error);
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تحديث المحفظة' },
      { status: 500 }
    );
  }
} 