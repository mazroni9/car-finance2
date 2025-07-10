import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get('dealerId');

    if (!dealerId) {
      return NextResponse.json(
        { error: 'Dealer ID is required' },
        { status: 400 }
      );
    }

    // Get wallet details
    const { data: wallet, error: walletError } = await supabase
      .from('dealer_wallets')
      .select('*')
      .eq('dealer_id', dealerId)
      .single();

    if (walletError) {
      console.error('Error fetching wallet:', walletError);
      return NextResponse.json(
        { error: 'Failed to fetch wallet details' },
        { status: 500 }
      );
    }

    // Get recent transactions
    const { data: transactions, error: transactionsError } = await supabase
      .from('dealer_transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      wallet,
      recent_transactions: transactions
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { dealerId, amount, type, description } = body;

    if (!dealerId || !amount || !type || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create wallet
    let { data: wallet, error: walletError } = await supabase
      .from('dealer_wallets')
      .select('*')
      .eq('dealer_id', dealerId)
      .single();

    if (!wallet) {
      const { data: newWallet, error: createError } = await supabase
        .from('dealer_wallets')
        .insert([{ dealer_id: dealerId, balance: 0 }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating wallet:', createError);
        return NextResponse.json(
          { error: 'Failed to create wallet' },
          { status: 500 }
        );
      }

      wallet = newWallet;
    }

    // Create transaction
    const { error: transactionError } = await supabase
      .from('dealer_transactions')
      .insert([{
        wallet_id: wallet.id,
        amount,
        type,
        description
      }]);

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return NextResponse.json(
        { error: 'Failed to create transaction' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Transaction created successfully'
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 