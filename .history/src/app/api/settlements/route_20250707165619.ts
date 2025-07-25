import { NextResponse } from 'next/server';
import { supabase } from '@/lib/services/supabase';
import { rateLimit } from '@/lib/rate-limit';
import type { Settlement, SettlementFilters, SettlementSummary } from '@/types/settlement';

// الحصول على جميع التسويات مع الفلاتر
export async function GET(request: Request) {
  try {
    const { success } = await rateLimit();
    if (!success) {
      return NextResponse.json(
        { error: 'عدد طلبات كثير جداً، حاول مرة أخرى بعد دقيقة' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filters: SettlementFilters = {
      status: searchParams.get('status') as any,
      type: searchParams.get('type') as any,
      date_from: searchParams.get('date_from') || undefined,
      date_to: searchParams.get('date_to') || undefined,
      min_amount: searchParams.get('min_amount') ? Number(searchParams.get('min_amount')) : undefined,
      max_amount: searchParams.get('max_amount') ? Number(searchParams.get('max_amount')) : undefined,
      wallet_id: searchParams.get('wallet_id') || undefined,
    };

    let query = supabase
      .from('settlements')
      .select(`
        *,
        car_showcase!inner(
          make,
          model,
          year,
          price
        )
      `)
      .order('created_at', { ascending: false });

    // تطبيق الفلاتر
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.date_from) {
      query = query.gte('created_at', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('created_at', filters.date_to);
    }
    if (filters.min_amount) {
      query = query.gte('amount', filters.min_amount);
    }
    if (filters.max_amount) {
      query = query.lte('amount', filters.max_amount);
    }
    if (filters.wallet_id) {
      query = query.or(`from_wallet.eq.${filters.wallet_id},to_wallet.eq.${filters.wallet_id}`);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching settlements:', error);
      return NextResponse.json(
        { error: 'فشل في جلب بيانات التسويات' },
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

// إنشاء تسوية جديدة
export async function POST(request: Request) {
  try {
    const { success } = await rateLimit();
    if (!success) {
      return NextResponse.json(
        { error: 'عدد طلبات كثير جداً، حاول مرة أخرى بعد دقيقة' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const settlement: Partial<Settlement> = {
      type: body.type,
      amount: body.amount,
      from_wallet: body.from_wallet,
      to_wallet: body.to_wallet,
      car_id: body.car_id,
      buyer_id: body.buyer_id,
      seller_id: body.seller_id,
      status: 'pending',
      description: body.description,
    };

    const { data, error } = await supabase
      .from('settlements')
      .insert(settlement)
      .select()
      .single();

    if (error) {
      console.error('Error creating settlement:', error);
      return NextResponse.json(
        { error: 'فشل في إنشاء التسوية' },
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