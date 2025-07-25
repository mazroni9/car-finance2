'use client';

import { useEffect, useState } from 'react';
import { WalletSummary } from '@/components/WalletSummary';
import { TransactionList } from '@/components/TransactionList';
import type { Wallet } from '@/types/wallet';
import type { Transaction } from '@/types/transaction';

export default function DashboardPage() {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [walletRes, transactionsRes] = await Promise.all([
          fetch('/api/wallet'),
          fetch('/api/transactions')
        ]);

        if (!walletRes.ok || !transactionsRes.ok) {
          throw new Error('فشل في جلب البيانات');
        }

        const [walletData, transactionsData] = await Promise.all([
          walletRes.json(),
          transactionsRes.json()
        ]);

        setWallet(walletData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">لوحة التحكم</h1>
      
      <div className="grid grid-cols-1 gap-8">
        {wallet && (
          <div>
            <h2 className="text-2xl font-bold mb-4">ملخص المحفظة</h2>
            <WalletSummary
              balance={wallet.balance}
              transactions={transactions}
            />
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-4">آخر المعاملات</h2>
          <TransactionList 
            transactions={transactions.slice(0, 5)} 
          />
        </div>
      </div>
    </div>
  );
}
