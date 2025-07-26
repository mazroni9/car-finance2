import { PLATFORM_WALLET_ID } from '@/config/constants';
import { getWalletById, getWalletByUserId } from '@/lib/services/walletService';
import { supabaseClient } from '@/lib/supabase/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const supabase = supabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ success: false, message: 'Not authenticated' }, { status: 401 });
  }

  let wallet;

  if (user.role === 'admin') {
    wallet = await getWalletById(PLATFORM_WALLET_ID);
  } else {
    wallet = await getWalletByUserId(user.id);
  }

  if (!wallet) {
    return NextResponse.json({ success: false, message: 'Wallet not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, wallet });
}

export async function POST(req: NextRequest) {
  const supabase = supabaseClient();
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
  const supabase = supabaseClient();
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
