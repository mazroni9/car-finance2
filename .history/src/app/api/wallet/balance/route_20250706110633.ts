import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { showroomId, amount } = await req.json();

  if (!showroomId || !amount || amount <= 0) {
    return NextResponse.json({ error: 'بيانات غير مكتملة أو مبلغ غير صحيح.' }, { status: 400 });
  }

  // Call RPC لزيادة الرصيد
  const { error } = await supabase.rpc('increment_wallet_balance', {
    p_showroom_id: showroomId,
    p_amount: amount,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, message: '✅ تم إضافة الرصيد بنجاح.' });
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  const { showroomId, amount } = await req.json();

  if (!showroomId || !amount || amount <= 0) {
    return NextResponse.json({ error: 'بيانات غير مكتملة أو مبلغ غير صحيح.' }, { status: 400 });
  }

  // Call RPC لخصم الرصيد
  const { error } = await supabase.rpc('decrement_wallet_balance', {
    p_showroom_id: showroomId,
    p_amount: amount,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, message: '✅ تم خصم الرصيد بنجاح.' });
}
