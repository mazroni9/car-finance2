'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';

interface DealerWallet {
  id: string;
  user_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface DealerTransaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'credit' | 'debit';
  description: string;
  created_at: string;
}

export default function DealerDashboard() {
  const [wallet, setWallet] = useState<DealerWallet | null>(null);
  const [transactions, setTransactions] = useState<DealerTransaction[]>([]);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    setIsLoading(true);
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.error('❌ لم يتم العثور على مستخدم مسجل دخول', error);
      setUserId(null);
      setIsLoading(false);
    } else {
      setUserId(user.id);
      fetchWallet();
      fetchTransactions();
    }
  }

  async function fetchWallet() {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching wallet:', error);
        setWallet(null);
      } else {
        setWallet(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setWallet(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchTransactions() {
    try {
      const { data, error } = await supabase
        .from('dealer_transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
      } else {
        setTransactions(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  async function handlePurchase() {
    const amount = parseFloat(purchaseAmount);
    if (!wallet || isNaN(amount) || amount <= 0) {
      setMessage('❌ مبلغ غير صالح');
      return;
    }

    if (amount > wallet.balance) {
      setMessage('❌ لا يوجد رصيد كافٍ للشراء.');
      return;
    }

    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        balance: wallet.balance - amount,
      })
      .eq('id', wallet.id);

    if (updateError) {
      console.error('Error updating wallet:', updateError);
      setMessage('❌ فشل في تنفيذ العملية.');
      return;
    }

    const { error: insertError } = await supabase
      .from('dealer_transactions')
      .insert([
        {
          wallet_id: wallet.id,
          amount,
          type: 'debit',
          description: `شراء بقيمة ${amount} ريال`,
        },
      ]);

    if (insertError) {
      console.error('Error inserting transaction:', insertError);
      setMessage('❌ فشل في تسجيل المعاملة.');
      return;
    }

    setMessage('✅ تمت عملية الشراء بنجاح!');
    setPurchaseAmount('');
    fetchWallet();
    fetchTransactions();
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">❌ يرجى تسجيل الدخول أولاً</p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mb-4 text-5xl">💼</div>
          <h2 className="text-xl font-bold mb-4">لم يتم العثور على محفظة</h2>
          <p className="text-gray-600 mb-6">
            البريد الإلكتروني: {userId}
          </p>
          <p className="text-gray-600 mb-6">
            يبدو أنه لا يوجد لديك محفظة مفعلة بعد. يرجى التواصل مع الإدارة لتفعيل محفظتك.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => {
                const adminContact = `/contact-admin?user=${encodeURIComponent(userId)}`;
                window.location.href = adminContact;
              }}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📞 تواصل مع الإدارة
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              🏠 العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">💰 رصيدك</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">رصيد شخصي</p>
            <p className="text-2xl font-bold text-blue-600">{wallet.balance.toLocaleString()} ريال</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">🛒 عملية شراء</h3>
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="أدخل مبلغ الشراء"
            value={purchaseAmount}
            onChange={(e) => setPurchaseAmount(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
          />
          <button 
            onClick={handlePurchase}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ✅ نفذ الشراء
          </button>
        </div>
        {message && (
          <p className={`mt-4 p-3 rounded-lg ${
            message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </p>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">📜 سجل المشتريات</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-right">التاريخ</th>
                <th className="px-4 py-2 text-right">المبلغ</th>
                <th className="px-4 py-2 text-right">النوع</th>
                <th className="px-4 py-2 text-right">الوصف</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(tx.created_at).toLocaleDateString('ar-SA')}</td>
                  <td className="px-4 py-2">{tx.amount.toLocaleString()} ريال</td>
                  <td className="px-4 py-2">{tx.type === 'credit' ? 'إيداع' : 'سحب'}</td>
                  <td className="px-4 py-2">{tx.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
