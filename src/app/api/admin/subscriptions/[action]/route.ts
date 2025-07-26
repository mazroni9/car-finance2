import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// هذه هي الدالة الرئيسية التي يتفرع لها الطلبات
export async function POST(req: NextRequest, { params }: { params: { action: string } }) {
  const action = params.action;

  if (action === 'deactivate') {
    return handleDeactivate(req);
  }

  if (action === 'reactivate') {
    return handleReactivate(req);
  }

  if (action === 'upgrade') {
    return handleUpgrade(req);
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

// ----------------------------------------------------------
// تحت هنا 👇 تكتب الدوال الثلاث كاملة

async function handleDeactivate(req: NextRequest) {
  const { id } = await req.json();

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'inactive', end_date: new Date() })
    .eq('id', id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Subscription deactivated successfully' });
}

async function handleReactivate(req: NextRequest) {
  const { id, user_id } = await req.json();

  const { data: existing, error: checkError } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user_id)
    .eq('status', 'active');

  if (checkError) {
    console.error(checkError);
    return NextResponse.json({ error: checkError.message }, { status: 500 });
  }

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: 'User already has an active subscription' }, { status: 400 });
  }

  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'active', start_date: new Date() })
    .eq('id', id);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Subscription reactivated successfully' });
}

async function handleUpgrade(req: NextRequest) {
  const { user_id, plan, approved_amount } = await req.json();

  const { error: deactivateError } = await supabase
    .from('subscriptions')
    .update({ status: 'inactive', end_date: new Date() })
    .eq('user_id', user_id)
    .eq('status', 'active');

  if (deactivateError) {
    console.error(deactivateError);
    return NextResponse.json({ error: deactivateError.message }, { status: 500 });
  }

  const { error: insertError } = await supabase
    .from('subscriptions')
    .insert({
      user_id,
      plan_type: plan,
      approved_amount,
      start_date: new Date(),
      status: 'active'
    });

  if (insertError) {
    console.error(insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Subscription upgraded successfully' });
}
