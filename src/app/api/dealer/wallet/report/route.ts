import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const dealerId = searchParams.get('dealerId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!dealerId) {
      return NextResponse.json(
        { error: 'Dealer ID is required' },
        { status: 400 }
      );
    }

    // Get wallet
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

    // Build transactions query
    let query = supabase
      .from('dealer_transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false });

    // Add date filters if provided
    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    // Get transactions
    const { data: transactions, error: transactionsError } = await query;

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      return NextResponse.json(
        { error: 'Failed to fetch transactions' },
        { status: 500 }
      );
    }

    // Calculate summary
    const summary = transactions.reduce((acc, transaction) => {
      if (transaction.type === 'credit') {
        acc.total_credits += transaction.amount;
      } else {
        acc.total_debits += transaction.amount;
      }
      return acc;
    }, { total_credits: 0, total_debits: 0 });

    return NextResponse.json({
      wallet,
      transactions,
      summary: {
        ...summary,
        current_balance: wallet.balance,
        transaction_count: transactions.length
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 