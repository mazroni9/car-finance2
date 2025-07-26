import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { checkRateLimit } from '@/lib/rate-limit';

// الحصول على جميع المحافظ
export async function GET(request: Request) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const isAllowed = await checkRateLimit(clientIP);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'عدد طلبات كثير جداً، حاول مرة أخرى بعد دقيقة' },
        { status: 429 }
      );
    }

    const { data, error } = await supabase
      .from('wallets')
      .select(`
        *,
        users!inner(
          username,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching wallets:', error);
      return NextResponse.json(
        { error: 'فشل في جلب بيانات المحافظ' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
}

// إنشاء محفظة جديدة
export async function POST(request: Request) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    const isAllowed = await checkRateLimit(clientIP);
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'عدد طلبات كثير جداً، حاول مرة أخرى بعد دقيقة' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const wallet = {
      user_id: body.user_id,
      balance: body.balance || 0,
      currency: body.currency || 'SAR',
      status: body.status || 'active',
      type: body.type,
    };

    const { data, error } = await supabase
      .from('wallets')
      .insert(wallet)
      .select()
      .single();

    if (error) {
      console.error('Error creating wallet:', error);
      return NextResponse.json(
        { error: 'فشل في إنشاء المحفظة' },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'حدث خطأ غير متوقع' },
      { status: 500 }
    );
  }
} 