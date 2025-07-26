'use client';

import { useEffect, useState } from 'react';
import { TransactionList } from '@/components/TransactionList';
import type { Transaction } from '@/types/transaction';

export default function DealerTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('/api/dealer/transactions');
        if (!response.ok) throw new Error('فشل في جلب المعاملات');
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">سجل المعاملات</h1>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">لا توجد معاملات</p>
        </div>
      ) : (
        <TransactionList transactions={transactions} />
      )}
    </div>
  );
} 